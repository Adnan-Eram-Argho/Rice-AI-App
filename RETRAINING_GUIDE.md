# 🌾 Rice AI Doctor - Retraining & Expansion Guide (V4.2 - WITH ENHANCED IQA, TTA & CONTRAST STRETCHING)

## ⚙️ Core Architecture Rule
**NEVER modify React/Vite code to add crops or diseases.**  
All changes happen in:
1. `public/config/crops_config.json` (Crop registry)
2. `public/models/metadata_*.json` (Model specs & class mapping)
3. `public/data/diseases_*.json` (Symptoms & treatments)
4. New `.onnx` files in `public/models/`

---

## 🆕 V4.2 Features Overview

### Center-Region Image Quality Assessment (IQA)
The frontend validates image quality **before** sending to the model, using only the **center 60%** of the image:
- **Center Brightness Check**: Rejects if center region avg brightness < 25 (too dark) or > 240 (overexposed)
- **Center Blur Detection**: Rejects if center region brightness variance < 150 (no texture/detail), **with smart leaf detection**
- **🆕 Smart Leaf Detection**: Before rejecting for low variance, samples center pixels and checks if they're green-dominant (G > R+20 and G > B+10). If most pixels are green, assumes it's a healthy uniform leaf rather than blurry image. This prevents false rejections of perfectly good photos of healthy rice leaves with consistent green color.
- **No standalone green pixel ratio check** — leaf presence is primarily handled by the Background class, but green detection helps IQA make better blur decisions
- **Why center-only?** Leaves placed on সাদা কাগজ (white paper) or কালো ব্যাকগ্রাউন্ড (black surface) no longer falsely rejected
- **User Feedback**: Displays bilingual error messages guiding users to retake better photos

### 🆕 Per-Channel Contrast Stretching
Before creating tensors for inference, each R/G/B channel is independently stretched to [0, 255]:
- Disease spots (brown/gray lesions) equally visible on white paper, black surface, or field background
- Only stretches if channel dynamic range > 30 (preserves solid-color regions)
- Applied to ALL TTA variations before inference

### 🆕 4-Variation Weighted TTA
Improves prediction robustness by running **4 sequential inferences**:
1. Original image (contrast-stretched)
2. Horizontally flipped (contrast-stretched)
3. Vertically flipped (contrast-stretched)
4. **Center Crop 75%** (contrast-stretched) — strips edge backgrounds

Results use **weighted averaging**: Original=1, HFlip=1, VFlip=1, **CenterCrop=1.5** (cleanest signal).

**Performance Impact**: Inference time increases from ~120ms to ~480-530ms on low-end devices (4 sequential inferences, each contrast-stretched).

**⚠️ Critical Implementation Detail**: TTA runs **sequentially** (not in parallel) to avoid WebAssembly race conditions that cause NaN outputs. Each inference completes before the next begins, ensuring memory stability on low-end devices.

---

## 🔄 Scenario A: Improve Existing Rice Model (Add More Images)
*Use when you collect 100+ new field photos for Blast, Brown_Spot, Leaf_Scald, Healthy, or Background.*

### Current Configuration (V4.2 - Production with Enhanced IQA, TTA & Contrast Stretching)
- **Base Model**: EfficientNet-B0 with CBAM Attention Block (Functional API, no custom objects)
- **Preprocessing**: RAW 0-255 pixel values (NO /255.0 division) - **CRITICAL**
- **Loss Function**: **Focal Loss (gamma=2.0, alpha=class_weights)** - Better than sparse_categorical_crossentropy
- **Current Production Model**: `rice_model_v4_int8.onnx` (~3.2 MB, Static INT8) - **OPTIMIZED FOR MOBILE**
- **Alternative**: `rice_model_v4.onnx` (~17 MB, FP32) - Available for maximum precision testing
- **Test Accuracy**: 94.06%
- **🆕 Image Quality Validation**: Center-region (60%) brightness & blur checks — tolerates white/black backgrounds
- **🆕 Per-Channel Contrast Stretching**: R/G/B channels independently normalized for background-agnostic inference
- **🆕 Test-Time Augmentation**: 4 sequential weighted inferences (original + H-flip + V-flip + center crop 75%)

### Steps to Retrain

1. **Merge new images** into your dataset folders:
   ```
   rice_project_dataset_v1/
   ├── Background/          # 🆕 Out-of-distribution images
   ├── Blast/
   ├── Brown_Spot/
   ├── Healthy/
   └── Leaf_Scald/
   ```

2. **Rerun Phase 2 Training** in Colab (EfficientNet-B0 + CBAM transfer learning)
   - Use the same architecture: `EfficientNetB0(input_shape=(224,224,3), include_top=False, weights='imagenet')` + CBAM block
   - Folder structure auto-reads class names & counts
   - Exports new `class_indices.json`
   - **Important**: Maintain RAW 0-255 preprocessing (no normalization)
   - **Loss**: Use **Focal Loss (gamma=2.0, alpha=class_weights)** for better hard-example mining
   - **CBAM Block**: Use Functional API definition (no subclassing)
   - **Data Pipeline**: Apply MD5 deduplication before training
   - **Split**: Stratified 80/10/10 (train/val/test)
   - **⚠️ Keras 3 Compatibility**: Ensure Lambda layers have explicit `output_shape` parameter

3. **Rerun Phase 3 Export**:
   - **FP32 Export** (for validation/testing):
     ```python
     # DO NOT use tf.keras.models.load_model() - it will crash on Lambda layers
     model = build_model_safe(num_classes=5, trainable_base=False)
     model.load_weights(P2_CKPT)
     
     tf2onnx.convert.from_keras(model, input_signature=[...], opset=16)
     # Output: rice_model_v5.onnx (~17 MB) — For testing
     ```
   - **Static INT8 Quantization** (for production):
     ```python
     # Requires calibration dataset representative of real-world data
     quantize_static(
         model_input=fp32_path, 
         model_output=int8_path, 
         calibration_data_reader=calibration_reader,
         weight_type=QuantType.QInt8,
         activation_type=QuantType.QUInt8,
         per_channel=True,
         extra_options={'ActivationSymmetry': False}  # Important for Swish activation
     )
     # Output: rice_model_v5_int8.onnx (~3-4 MB) — Weights + Activations quantized
     ```

4. **Update files in React project:**
   - Copy new models to `public/models/`:
     - `rice_model_v5_int8.onnx` (INT8, production - recommended)
     - `rice_model_v5.onnx` (FP32, optional backup for testing)
   - Create `public/models/metadata_rice_v5.json` with updated fields:
     ```json
     {
       "crop_id": "rice",
       "model_version": "v5",
       "model_filename": "rice_model_v5_int8.onnx",
       "input_name": "input",
       "input_shape": [1, 224, 224, 3],
       "output_name": "rice_output",
       "input_format": "NHWC",
       "normalization": "raw_0_255",
       "confidence_threshold": 0.75,
       "classes": {
         "0": "Blast",
         "1": "Brown_Spot",
         "2": "Healthy",
         "3": "Leaf_Scald",
         "4": "Background"
       },
       "quantization": "Static_INT8",
       "model_size_mb": 3.2,
       "base_model": "EfficientNet-B0 + CBAM",
       "loss_function": "Focal_Loss(gamma=2.0, alpha=class_weights)",
       "preprocessing_note": "Resize 224x224, RAW 0-255 values (NO division), NHWC format. EfficientNet has internal norm layer.",
       "val_accuracy": 0.94,
       "test_accuracy": 0.94
     }
     ```
   - Update `public/config/crops_config.json`:
     ```json
     {
       "default_crop": "rice",
       "crops": {
         "rice": {
           "name_bn": "ধান",
           "name_en": "Rice",
           "current_metadata_file": "metadata_rice_v5.json",  // ← Changed from v4
           "diseases_data_file": "diseases_rice_v1.json",
           "fallback_warning_bn": "নিশ্চিত নয়, কৃষি কর্মকর্তার পরামর্শ নিন",
           "fallback_warning_en": "Uncertain result. Please consult an agriculture officer."
         }
       }
     }
     ```

5. **Deploy:** 
   ```bash
   npm run build
   git add .
   git commit -m "Update to rice model v5 with improved accuracy"
   git push
   # Vercel auto-redeploys
   ```

✅ **PWA Cache:** Workbox automatically fetches the new model on next visit. Old `v4` cache is purged due to `cleanupOutdatedCaches: true`.

---

## 🌿 Scenario B: Add NEW Disease to Rice (e.g., Bacterial Leaf Blight)
*Use when you want to detect a 6th rice disease.*

1. **Create folder:** `dataset/rice/Bacterial_Leaf_Blight/`
2. **Add ≥200 images** to the new folder (more is better for training stability)
3. **Rerun Phase 2 Training**
   - Code auto-detects 6 classes
   - Exports `class_indices.json` with `{"Blast": 0, "Brown_Spot": 1, "Healthy": 2, "Leaf_Scald": 3, "Background": 4, "Bacterial_Leaf_Blight": 5}` *(⚠️ Verify alphabetical order)*
   - Train with same EfficientNet-B0 + CBAM architecture
   - **Loss**: **Focal Loss (gamma=2.0, alpha=class_weights)** for better hard-example mining
4. **Rerun Phase 3 Export** → Get `rice_model_v5_int8.onnx` (INT8, production) and optionally `rice_model_v5.onnx` (FP32)
5. **Update configs:**
   ```json
   // public/models/metadata_rice_v5.json
   {
     "classes": {
       "0": "Blast",
       "1": "Brown_Spot",
       "2": "Healthy",
       "3": "Leaf_Scald",
       "4": "Background",
       "5": "Bacterial_Leaf_Blight"
     }
   }
   
   // public/data/diseases_rice_v2.json (create new file or update existing)
   {
     "Blast": { ... },
     "Brown_Spot": { ... },
     "Healthy": { ... },
     "Leaf_Scald": { ... },
     "Background": {
       "name_bn": "ধানের পাতা নয়",
       "name_en": "Not a Rice Leaf",
       "symptoms_bn": "",
       "symptoms_en": "",
       "treatment_bn": "অনুগ্রহ করে ধানের পাতার স্পষ্ট ছবি তুলুন।",
       "treatment_en": "Please capture a clear image of a rice leaf."
     },
     "Bacterial_Leaf_Blight": {
       "name_bn": "ব্যাকটেরিয়াল লিফ ব্লাইট",
       "name_en": "Bacterial Leaf Blight",
       "symptoms_bn": "পাতায় জলসিক্ত দাগ যা পরে হলুদ হয়ে যায়। তীব্র সংক্রমণে পুরো পাতা শুকিয়ে যায়।",
       "symptoms_en": "Water-soaked lesions that turn yellow. Severe infection causes entire leaf drying.",
       "treatment_bn": "কপার অক্সিক্লোরাইড বা স্ট্রেপটোমাইসিন স্প্রে করুন। আক্রান্ত পাতা সরান।",
       "treatment_en": "Spray Copper oxychloride or Streptomycin. Remove infected leaves."
     }
   }
   ```
6. **Update `crops_config.json`** to point to new metadata and disease files
7. **Deploy** as in Scenario A

---

## 🌾 Scenario C: Add NEW Crop (e.g., Wheat, Maize)
*Use when expanding beyond rice to other crops.*

1. **Collect dataset** for new crop (e.g., wheat diseases)
   - Organize into class folders: `wheat/Rust/`, `wheat/Powdery_Mildew/`, etc.
   - Minimum 200 images per class recommended
   - Add Background class: 400 images from Intel Image Classification (Kaggle)

2. **Train new model** using same EfficientNet-B0 + CBAM architecture
   - Adjust `CLASSES` list in Colab notebook
   - Export as `wheat_model_v1_int8.onnx` (INT8, production) and optionally `wheat_model_v1.onnx` (FP32)
   - Create `metadata_wheat_v1.json`

3. **Create disease data file**: `public/data/diseases_wheat_v1.json`
   ```json
   {
     "Rust": {
       "name_bn": "গমের মরিচা রোগ",
       "name_en": "Wheat Rust",
       "symptoms_bn": "...",
       "symptoms_en": "...",
       "treatment_bn": "...",
       "treatment_en": "..."
     }
   }
   ```

4. **Update `crops_config.json`**:
   ```json
   {
     "default_crop": "rice",
     "crops": {
       "rice": {
         "name_bn": "ধান",
         "name_en": "Rice",
         "current_metadata_file": "metadata_rice_v4.json",
         "diseases_data_file": "diseases_rice_v1.json",
         "fallback_warning_bn": "নিশ্চিত নয়, কৃষি কর্মকর্তার পরামর্শ নিন",
         "fallback_warning_en": "Uncertain result. Please consult an agriculture officer."
       },
       "wheat": {
         "name_bn": "গম",
         "name_en": "Wheat",
         "current_metadata_file": "metadata_wheat_v1.json",
         "diseases_data_file": "diseases_wheat_v1.json",
         "fallback_warning_bn": "নিশ্চিত নয়, কৃষি কর্মকর্তার পরামর্শ নিন",
         "fallback_warning_en": "Uncertain result. Please consult an agriculture officer."
       }
     }
   }
   ```

5. **No React code changes needed!** The app dynamically loads crop configurations.

6. **Deploy** and test crop selector dropdown

---

## 🔧 Scenario D: Switch Between FP32 and INT8 Models
*Use if you need to toggle between precision and performance.*

### Current Situation (V4.1)
- Using INT8 model: `rice_model_v4_int8.onnx` (~3.2 MB) - **PRODUCTION (Optimized for Mobile)**
- Backup available: `rice_model_v4.onnx` (~17 MB) - **TESTING OPTION (Maximum Precision)**

### To Switch to FP32 (Maximum Precision for Testing)

1. **Update `metadata_rice_v4.json`**:
   ```json
   {
     "model_filename": "rice_model_v4.onnx",  // ← Changed from _int8
     "quantization": "FP32",                  // ← Changed from Static_INT8
     "model_size_mb": 17                      // ← Updated size
   }
   ```

2. **Test locally**:
   ```bash
   npm run dev
   # Verify model loads (< 3s on WiFi)
   # Check accuracy on test images
   ```

3. **Deploy**:
   ```bash
   npm run build
   git push
   ```

### To Switch Back to INT8 (Production Optimization)

1. **Update `metadata_rice_v4.json`**:
   ```json
   {
     "model_filename": "rice_model_v4_int8.onnx",  // ← Changed back to INT8
     "quantization": "Static_INT8",                // ← Changed from FP32
     "model_size_mb": 3.2                          // ← Updated size
   }
   ```

2. **Test and deploy** as above

### Comparison

| Feature | FP32 (Testing) | INT8 (Production) |
|---------|------------------|---------------------|
| File Size | ~17 MB | ~3.2 MB |
| Load Time (3G) | 30-40s | < 10s |
| Memory Usage | 20-30 MB | 15-20 MB |
| Accuracy | 94.06% | ~93.5-94% |
| Inference Speed | < 150ms | < 120ms |
| Best For | Validation, high-end devices | Production on all devices, fast loading |

---

## 📊 Version History & Model Comparison

| Version | Base Model | Attention | Loss | Classes | Quantization | Size | Test Accuracy | Status |
|---------|-----------|-----------|------|---------|--------------|------|---------------|--------|
| V1 | MobileNetV2 | None | Sparse CE | 4 | INT8 | 2.48 MB | 78.49% | Deprecated |
| V2 | MobileNetV2 | None | Sparse CE | 4 | INT8 | 2.85 MB | 86.61% | Deprecated |
| V3 | EfficientNet-B0 | SE Block | Sparse CE | 4 | FP32 | 17.8 MB | 90.875% | Deprecated |
| V3 | EfficientNet-B0 | SE Block | Sparse CE | 4 | INT8 | 3.2 MB | ~90.5% | Deprecated |
| **V4** | **EfficientNet-B0** | **CBAM** | **Focal Loss** | **5** | **Static INT8** | **~3.2 MB** | **94.06%** | ✅ **CURRENT** |
| **V4** | **EfficientNet-B0** | **CBAM** | **Focal Loss** | **5** | **FP32** | **~17 MB** | **94.06%** | **Testing** |
| V5+ | Future iterations | TBD | TBD | TBD | TBD | TBD | TBD | Planned |

---

## ⚠️ Critical Reminders for Retraining

### Preprocessing Consistency
- **ALWAYS** use RAW 0-255 pixel values (NO /255.0 division) - **CRITICAL FOR EFFICIENTNET-B0**
- **ALWAYS** use NHWC format `[1, 224, 224, 3]`
- **ALWAYS** use opset=16 for ONNX export (required for EfficientNet Swish activation)
- **ALWAYS** name output tensor `"rice_output"` (or crop-specific name)
- **Why?** EfficientNet-B0 has an internal Normalization layer that expects [0, 255] input

### Loss Function
- **USE**: **Focal Loss (gamma=2.0, alpha=class_weights)** for better hard-example mining
- **DO NOT USE**: sparse_categorical_crossentropy (was used in V3, but Focal Loss is superior)
- **⚠️ CRITICAL**: Do NOT pass `class_weight` to `model.fit()` when using Focal Loss with alpha weights. This would apply weights twice and cause severe bias.

### Frontend Image Quality Validation (IQA)
The frontend validates the **center 60%** of images before inference. If you notice high rejection rates:
- **Center brightness thresholds**: Adjust `< 25` (too dark) or `> 240` (too bright) in `useClassifier.js`
- **Center blur variance**: Change threshold `< 150` based on camera quality of target devices
- **🆕 Smart leaf detection tuning**: The green-dominant check uses G > R+20 and G > B+10. Adjust these values if healthy leaves are still being rejected, or if non-leaf green objects are passing through.
- **Leaf detection sample rate**: Currently checks every 20th pixel from brightnessValues array. Increase/decrease the step size for more/less thorough checking.
- **Green dominance threshold**: Currently requires > 5 green-dominant pixels out of sampled set. Adjust this number based on your testing.
- **No standalone green pixel ratio** — leaf presence is handled by the AI's Background class; green detection only helps IQA avoid false "blurry" rejections on uniform healthy leaves
- **Center-only approach**: Prevents false rejections when leaves are on white paper or black backgrounds
- **Test thoroughly**: Verify IQA doesn't reject valid field photos under different lighting/background conditions, AND doesn't reject healthy uniform green leaves

### Per-Channel Contrast Stretching
Applied before ALL TTA variations. If you notice issues:
- **Range threshold**: Currently stretches only when channel range > 30. Adjust if colors appear distorted
- **Disable for testing**: Comment out `applyContrastStretch()` calls to compare with/without stretching
- **Interaction with model**: Since the model expects RAW 0-255, stretching is safe — it just expands the existing value range

### Test-Time Augmentation (TTA) Performance
TTA runs 4 **sequential** weighted inferences, which impacts performance:
- **Expected latency**: ~480-530ms on low-end Android (vs ~120ms single inference)
- **Why Sequential?**: Parallel execution caused WebAssembly memory race conditions leading to NaN outputs on low-end devices
- **Why Center Crop?**: Strips white/black paper borders, giving the model a cleaner leaf view. Gets 1.5x weight.
- **If too slow**: Consider reducing to 3 variations (drop V-flip) or reduce center crop weight to 1.0
- **Optimization tip**: Ensure `ort.env.wasm.numThreads = 1` for stable performance
- **Memory impact**: Minimal increase (~8 MB additional during inference for 4 tensors)
- **NaN Safety Check**: Code includes `if (isNaN(maxConf)) maxConf = 0;` as fallback

### CBAM Block Implementation
- **USE**: Functional API definition (not subclassed Layer)
- **Benefit**: No `custom_objects` needed for Keras load_model or ONNX export
- **Keras 3 Compatibility**: Lambda layers MUST have explicit `output_shape` parameter
- **Code**:
  ```python
  def cbam_block_safe(x, reduction=8):
      channels = x.shape[-1]
      # Channel attention
      avg_pool = layers.GlobalAveragePooling2D(keepdims=True)(x)
      max_pool = layers.GlobalMaxPooling2D(keepdims=True)(x)
      shared_dense1 = layers.Dense(channels // reduction, activation='relu')
      shared_dense2 = layers.Dense(channels)
      avg_out = shared_dense2(shared_dense1(avg_pool))
      max_out = shared_dense2(shared_dense1(max_pool))
      channel_att = layers.Activation('sigmoid')(avg_out + max_out)
      x = layers.Multiply()([x, channel_att])

      # Spatial attention (✅ MUST specify output_shape for Keras 3 Lambda layers)
      avg_sp = layers.Lambda(
          lambda t: tf.reduce_mean(t, axis=-1, keepdims=True),
          name='spatial_avg_pool',
          output_shape=lambda s: (s[0], s[1], s[2], 1)
      )(x)
      max_sp = layers.Lambda(
          lambda t: tf.reduce_max(t, axis=-1, keepdims=True),
          name='spatial_max_pool',
          output_shape=lambda s: (s[0], s[1], s[2], 1)
      )(x)
      sp_concat = layers.Concatenate(axis=-1)([avg_sp, max_sp])
      spatial_att = layers.Conv2D(1, 7, padding='same', activation='sigmoid')(sp_concat)
      x = layers.Multiply()([x, spatial_att])
      return x
  ```

### Data Improvements
- **MD5 Deduplication**: Remove duplicate images before training to prevent overfitting
- **Stratified Split**: Use 80/10/10 split (train/val/test) with `random_state=42`
- **Background Class**: Add 400 out-of-distribution images to reduce false positives
- **Enhanced Augmentation**: Include rotation ±15%, zoom ±15%, brightness ±15%, contrast ±15%
- **Image Decoding Fix**: Use `tf.io.decode_image(..., expand_animations=False)` + `tf.squeeze()` to handle GIFs and malformed PNGs

### Keras 3 Model Loading Workaround
**⚠️ CRITICAL**: Due to Keras 3 security restrictions, `tf.keras.models.load_model()` will fail with Lambda and Focal_Loss errors.

**Always use this pattern:**
```python
# 1. Rebuild model structure in memory
model = build_model_safe(num_classes=5, trainable_base=False)
# 2. Load ONLY the weights from the saved checkpoint
model.load_weights(P2_CKPT)
# 3. Proceed with ONNX export or model.predict()
```

### Metadata Updates
Every time you create a new model version:
1. Increment version number (v4 → v5 → v6...)
2. Update all references in `crops_config.json`
3. Test thoroughly before deploying
4. Keep old models as backup until new version is verified
5. **Override Colab's auto-generated metadata**: The Colab script may print `"normalization": "divide_255"` - this is a bug. Always set it to `"raw_0_255"`.
6. **Verify class indices**: Run `print(train_dataset.class_names)` to confirm mapping matches your JSON.

### PWA Cache Management
- Workbox `cleanupOutdatedCaches: true` automatically removes old models
- Users will download new model on next visit after deployment
- Consider adding version display in UI for debugging:
  ```javascript
  console.log(`Model version: ${meta.model_version}`);
  ```

### Testing Checklist Before Deployment
- [ ] Model loads without errors
- [ ] Preprocessing debug log shows "CORRECT: Raw 0-255 values"
- [ ] All classes predict correctly with test images
- [ ] Confidence threshold works (< 0.75 triggers fallback)
- [ ] Background class properly detects non-rice images
- [ ] Bilingual UI displays correctly
- [ ] PWA installs and works offline
- [ ] Tested on target devices (low-end Android, iOS)
- [ ] Load time acceptable on 3G/4G networks (< 10s for INT8)
- [ ] Memory usage within limits (< 30 MB for INT8)
- [ ] **🆕 Image Quality Validation**: Test with blurry/dark/bright/non-leaf images - should show error screen
- [ ] **🆕 TTA Performance**: Verify inference completes in < 500ms on target devices
- [ ] **🆕 Invalid Image Screen**: Confirm user-friendly error messages appear in both languages

---

## 🎯 Quick Reference Commands

### Local Testing
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check for code errors
```

### Deployment
```bash
vercel --prod        # Deploy to production
vercel ls            # List deployments
vercel logs          # View deployment logs
```

### Model File Verification
```bash
# Check model files exist and have correct sizes
ls -lh public/models/*.onnx
# Expected output:
# rice_model_v4_int8.onnx    ~3.2M   ← Current production (Static INT8)
# rice_model_v4.onnx         ~17M    ← Backup/testing (FP32)
```

---

## 📞 Support & Troubleshooting

### Common Issues During Retraining

**Issue**: New model has lower accuracy than previous version  
**Fix**: 
- Increase training epochs
- Add more diverse augmentation
- Check for data leakage in train/val split
- Verify class balance (use class weights if imbalanced)
- Ensure loss function is **Focal Loss** (not sparse_categorical_crossentropy)
- Verify CBAM block is correctly implemented

**Issue**: ONNX export fails with opset error  
**Fix**:
- Ensure opset=16 for EfficientNet models (required for Swish activation)
- Use rebuild + load_weights pattern instead of load_model()
- Install latest `tf2onnx`: `pip install -U tf2onnx`

**Issue**: Frontend predictions are random/wrong  
**Fix**:
- **VERIFY PREPROCESSING**: Must use RAW 0-255 values (NO /255.0 division)
- Check input shape is NHWC `[1, 224, 224, 3]`
- Confirm output tensor name matches metadata (`"rice_output"`)
- Use debug logging in `useClassifier.js`
- Run diagnostic test in Colab to verify model expectations

**Issue**: PWA doesn't update to new model  
**Fix**:
- Clear browser cache and Service Workers
- Uninstall and reinstall PWA
- Check `cleanupOutdatedCaches: true` in `vite.config.js`
- Verify new model filename is different from old version

**Issue**: App crashes on low-end Android  
**Fix**:
- Monitor RAM usage (should be 15-20 MB for INT8)
- Ensure `ort.env.wasm.numThreads = 1` in `useClassifier.js`
- If still crashing, check device compatibility with WASM
- **TTA Consideration**: If TTA causes memory issues, reduce to single inference or 2 variations

**Issue**: Background class detected too frequently  
**Fix**:
- Review confusion matrix for false positive patterns
- Check image quality and lighting conditions
- Ensure proper camera focus on rice leaf
- Consider adjusting confidence threshold
- Verify alpha[4] was tuned down during training (e.g., alpha[4] = 2.0)
- **Check IQA**: Ensure blurry/dark images are being rejected before inference

**Issue**: Keras 3 Lambda layer errors during export  
**Fix**:
- **DO NOT** use `tf.keras.models.load_model()`
- Use rebuild + load_weights pattern:
  ```python
  model = build_model_safe(num_classes=5)
  model.load_weights(checkpoint_path)
  ```
- Ensure all Lambda layers have explicit `output_shape` parameter

**Issue**: Image Quality Validation rejecting valid photos  
**Fix**:
- Adjust brightness thresholds in `validateImageQuality()` function
- Lower green pixel ratio threshold for non-standard rice varieties
- Reduce blur detection variance threshold for older cameras
- **🆕 Tune smart leaf detection**: If healthy uniform green leaves are still rejected, adjust the green-dominant criteria (currently G > R+20 and G > B+10) or lower the required count (currently > 5 pixels)
- Test with diverse field conditions (morning/evening light, cloudy days)

**Issue**: TTA making app too slow (> 600ms per inference)  
**Fix**:
- Reduce from 3 variations to 2 (original + H-flip only)
- Or disable TTA entirely for very low-end devices (detect via User-Agent)
- Ensure WASM SIMD is enabled: `ort.env.wasm.simd = true`
- Profile using Chrome DevTools Performance tab

---

## 🛠️ DEBUGGING & DIAGNOSTICS

### Preprocessing Verification (Colab)
Run this if you are unsure what normalization the model expects:
```python
import tensorflow as tf, numpy as np, cv2, os

# Rebuild model (DO NOT use load_model)
model = build_model_safe(num_classes=5)
model.load_weights('/content/drive/MyDrive/rice_project_v4/checkpoints/best_phase2.keras')

img = cv2.cvtColor(cv2.imread('test.jpg'), cv2.COLOR_BGR2RGB)
img = cv2.resize(img, (224, 224))

pred_raw = model.predict(np.expand_dims(img.astype(np.float32), 0), verbose=0)          # 0-255
pred_norm = model.predict(np.expand_dims(img.astype(np.float32) / 255.0, 0), verbose=0) # 0-1

CLASSES = ['Blast', 'Brown_Spot', 'Healthy', 'Leaf_Scald', 'Background']
print(f"Raw 0-255: {CLASSES[np.argmax(pred_raw[0])]} @ {np.max(pred_raw[0])*100:.1f}%")
print(f"Normalized (/255.0): {CLASSES[np.argmax(pred_norm[0])]} @ {np.max(pred_norm[0])*100:.1f}%")
# ✅ For THIS model: Raw 0-255 should give ~90%+ confidence. /255.0 will give near 0%.
```

### Preprocessing Verification (Browser Console)
```javascript
// Paste in browser console to verify frontend tensor creation
const canvas = document.createElement('canvas');
canvas.width = canvas.height = 224;
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'rgb(255,0,0)';  // Pure red
ctx.fillRect(0, 0, 224, 224);
const img = new Image();
img.src = canvas.toDataURL();
await new Promise(res => img.onload = res);

// Call your actual preprocessing function here
const tensor = preprocessImage(img); 

console.log(`🎨 Preprocessing check: First pixel R value = ${tensor.data[0].toFixed(1)}`);
if (tensor.data[0] >= 250.0 && tensor.data[0] <= 255.0) {
  console.log('✅ CORRECT: Raw 0-255 values (matches training & internal norm layer)');
} else if (tensor.data[0] <= 1.0) {
  console.error('❌ WRONG: Values in [0,1] range — remove /255.0 division immediately!');
}
```

---

## 🔄 Frontend Consistency Check (For AI Agents)

When updating the model, you **MUST** verify that `src/hooks/useClassifier.js` matches the new training preprocessing.

### Checklist for `useClassifier.js`:
1.  **Input Shape:** Must be `[1, 224, 224, 3]` (NHWC).
2.  **Normalization:**
    -   If Model uses `EfficientNet` with internal norm: **Keep RAW 0-255** (No `/255.0`).
    -   If Model uses custom norm layer expecting [0,1]: **Add `/255.0`** in the loop.
3.  **Class Mapping:** Ensure `meta.classes` from `metadata.json` matches the output indices of the new model.
4.  **Threshold:** Verify `meta.confidence_threshold` is set correctly (V4 default: `0.75`).
5.  **🆕 Center-Region IQA:** Ensure `validateImageQuality()` only checks center 60% — verify thresholds match target device camera capabilities.
6.  **🆕 Contrast Stretching:** Confirm `applyContrastStretch()` is applied to ALL TTA variations. Range threshold (>30) may need tuning.
7.  **🆕 4-Variation Weighted TTA:** Confirm all 4 variations (original + H-flip + V-flip + center crop) are weighted correctly (1:1:1:1.5) and averaged with total=4.5.

### How to Verify Preprocessing in Browser Console:
Open the PWA in Dev Mode (`npm run dev`) and check the console after scanning an image:
*   ✅ `✅ CORRECT: Raw 0-255 values (matches training)` -> Good to go.
*   ❌ `❌ WRONG: Values in [0,1] range` -> You must remove the division by 255 in `useClassifier.js`.

### Testing IQA, Contrast Stretching, and TTA:
1. **Center-Region IQA Testing**: Try photos on white paper, black surface, and natural backgrounds. Only genuinely dark/bright/blurry center regions should be rejected.
2. **🆕 Smart Leaf Detection Testing**: Test with healthy uniform green leaves to ensure they're NOT falsely rejected as "blurry". Also test with non-leaf green objects (grass, other plants) to verify they don't bypass the blur check inappropriately.
3. **Contrast Stretching Testing**: Compare predictions with/without contrast stretching on photos with different backgrounds. Disease spots should be more confidently detected.
4. **4-Variation TTA Testing**: Compare predictions with full 4-variation TTA vs single inference on edge cases (partial leaves, angled shots, white/black paper). TTA should provide more stable results.
5. **Performance Profiling**: Use Chrome DevTools > Performance tab to measure total inference time with 4-variation TTA. Expect ~480-530ms due to sequential execution.
6. **NaN Check**: Verify no NaN outputs occur during TTA by checking console logs.
7. **Low-End Device Testing**: Critical to test on 2GB RAM devices to ensure WASM memory stability with 4 sequential inferences.

> 🌾 *This guide ensures zero React code changes for model updates. All modifications happen through configuration files, making the app future-proof and easily maintainable. V4.2 has been audited against actual Colab training source code to ensure accuracy. Now includes Center-Region IQA (tolerates white/black backgrounds), Per-Channel Contrast Stretching, and 4-Variation Weighted TTA for improved robustness across diverse photography conditions.*

**Last Updated**: 2026-04-30 (V4.2 Production Release with Enhanced IQA, 4-Variation TTA & Contrast Stretching)  
**Current Version**: V4.2 (EfficientNet-B0 + CBAM, Focal Loss, Background Class, Center-Region IQA, Per-Channel Contrast Stretching, 4-Variation Weighted TTA)  
**Next Planned**: V5 (Improved accuracy or additional crops)
