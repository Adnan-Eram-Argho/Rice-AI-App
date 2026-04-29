# 🌾 Rice AI Doctor - Retraining & Expansion Guide (V4)

## ⚙️ Core Architecture Rule
**NEVER modify React/Vite code to add crops or diseases.**  
All changes happen in:
1. `public/config/crops_config.json` (Crop registry)
2. `public/models/metadata_*.json` (Model specs & class mapping)
3. `public/data/diseases_*.json` (Symptoms & treatments)
4. New `.onnx` files in `public/models/`

---

## 🔄 Scenario A: Improve Existing Rice Model (Add More Images)
*Use when you collect 100+ new field photos for Blast, Brown_Spot, Leaf_Scald, Healthy, or Background.*

### Current Configuration (V4 - Production)
- **Base Model**: EfficientNet-B0 with CBAM Attention Block (Functional API, no custom objects)
- **Preprocessing**: RAW 0-255 pixel values (NO /255.0 division) - **CRITICAL**
- **Loss Function**: **Focal Loss (gamma=2.0, alpha=class_weights)** - Better than sparse_categorical_crossentropy
- **Current Production Model**: `rice_model_v4_fp32.onnx` (~17-18 MB, FP32) - **MAXIMUM PRECISION**
- **Alternative**: `rice_model_v4_int8.onnx` (~3-4 MB, Static INT8 quantized) - Available for optimization
- **Test Accuracy**: 94.06%

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

3. **Rerun Phase 3 Export**:
   - **FP32 Export** (for production - maximum precision):
     ```python
     tf2onnx.convert.from_keras(model, input_signature=[...], opset=16)
     # Output: rice_model_v5_fp32.onnx (~17-18 MB) — RECOMMENDED FOR PRODUCTION
     ```
   - **Static INT8 Quantization** (optional, for performance optimization):
     ```python
     # Requires calibration dataset representative of real-world data
     quantize_static(
         model_input=fp32_path, 
         model_output=int8_path, 
         calibration_data_reader=calibration_reader,
         weight_type=QuantType.QInt8,
         activation_type=QuantType.QUInt8,
         per_channel=True,
         ActivationSymmetry=False
     )
     # Output: rice_model_v5_int8.onnx (~3-4 MB) — Weights + Activations quantized
     ```

4. **Update files in React project:**
   - Copy new models to `public/models/`:
     - `rice_model_v5_fp32.onnx` (FP32, production - recommended)
     - `rice_model_v5_int8.onnx` (INT8, optional backup)
   - Create `public/models/metadata_rice_v5.json` with updated fields:
     ```json
     {
       "crop_id": "rice",
       "model_version": "v5",
       "model_filename": "rice_model_v5_fp32.onnx",
       "input_name": "input",
       "input_shape": [1, 224, 224, 3],
       "output_name": "rice_output",
       "input_format": "NHWC",
       "normalization": "raw_0_255",
       "confidence_threshold": 0.75,
       "classes": {
         "0": "Background",
         "1": "Blast",
         "2": "Brown_Spot",
         "3": "Healthy",
         "4": "Leaf_Scald"
       },
       "quantization": "FP32",
       "model_size_mb": 17.8,
       "base_model": "EfficientNet-B0 + CBAM",
       "preprocessing_note": "Resize 224x224, use raw 0-255 pixel values (NO division), NHWC format. EfficientNet has internal norm layer.",
       "val_accuracy": 0.94,
       "test_accuracy": 0.94,
       "training_strategy": "Phase 1: Frozen backbone (20 epochs, lr=1e-3). Phase 2: Last 30 layers unfrozen (30 epochs, lr=1e-4). Focal Loss (gamma=2.0).",
       "data_improvements": "MD5 deduplication, stratified 80/10/10 split, Background class added, focal loss for hard examples"
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
   - Exports `class_indices.json` with `{"Background": 0, "Blast": 1, "Brown_Spot": 2, "Healthy": 3, "Leaf_Scald": 4, "Bacterial_Leaf_Blight": 5}`
   - Train with same EfficientNet-B0 + CBAM architecture
   - **Loss**: **Focal Loss (gamma=2.0, alpha=class_weights)** for better hard-example mining
4. **Rerun Phase 3 Export** → Get `rice_model_v5_fp32.onnx` (FP32, production) and optionally `rice_model_v5_int8.onnx` (INT8)
5. **Update configs:**
   ```json
   // public/models/metadata_rice_v5.json
   {
     "classes": {
       "0": "Background",
       "1": "Blast",
       "2": "Brown_Spot",
       "3": "Healthy",
       "4": "Leaf_Scald",
       "5": "Bacterial_Leaf_Blight"
     }
   }
   
   // public/data/diseases_rice_v2.json (create new file or update existing)
   {
     "Blast": { ... },
     "Brown_Spot": { ... },
     "Healthy": { ... },
     "Leaf_Scald": { ... },
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
   - Export as `wheat_model_v1_fp32.onnx` (FP32, production) and optionally `wheat_model_v1_int8.onnx` (INT8)
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

### Current Situation (V4)
- Using FP32 model: `rice_model_v4_fp32.onnx` (~17-18 MB) - **PRODUCTION (Maximum Precision)**
- Backup available: `rice_model_v4_int8.onnx` (~3-4 MB) - **OPTIMIZATION OPTION (Static INT8)**

### To Switch to INT8 (Performance Optimization)

1. **Update `metadata_rice_v4.json`**:
   ```json
   {
     "model_filename": "rice_model_v4_int8.onnx",  // ← Changed from _fp32
     "quantization": "INT8",                       // ← Changed from FP32
     "model_size_mb": 3.5                          // ← Updated size
   }
   ```

2. **Test locally**:
   ```bash
   npm run dev
   # Verify model loads faster (< 5s on WiFi)
   # Check accuracy remains similar (< 0.5% drop expected)
   ```

3. **Deploy**:
   ```bash
   npm run build
   git push
   ```

### To Switch Back to FP32 (Maximum Precision)

1. **Update `metadata_rice_v4.json`**:
   ```json
   {
     "model_filename": "rice_model_v4_fp32.onnx",  // ← Changed back to FP32
     "quantization": "FP32",                        // ← Changed from INT8
     "model_size_mb": 17.8                          // ← Updated size
   }
   ```

2. **Test and deploy** as above

### Comparison

| Feature | FP32 (Production) | INT8 (Optimization) |
|---------|------------------|---------------------|
| File Size | ~17-18 MB | ~3-4 MB |
| Load Time (3G) | 20-40s | < 10s |
| Memory Usage | 20-30 MB | 15-20 MB |
| Accuracy | 94.06% | ~93.5-94% |
| Inference Speed | < 150ms | < 120ms |
| Best For | Maximum precision, testing, validation | Production on low-end devices, fast loading |

---

## 📊 Version History & Model Comparison

| Version | Base Model | Attention | Loss | Classes | Quantization | Size | Test Accuracy | Status |
|---------|-----------|-----------|------|---------|--------------|------|---------------|--------|
| V1 | MobileNetV2 | None | Sparse CE | 4 | INT8 | 2.48 MB | 78.49% | Deprecated |
| V2 | MobileNetV2 | None | Sparse CE | 4 | INT8 | 2.85 MB | 86.61% | Deprecated |
| V3 | EfficientNet-B0 | SE Block | Sparse CE | 4 | FP32 | 17.8 MB | 90.875% | Deprecated |
| V3 | EfficientNet-B0 | SE Block | Sparse CE | 4 | INT8 | 3.2 MB | ~90.5% | Deprecated |
| **V4** | **EfficientNet-B0** | **CBAM** | **Focal Loss** | **5** | **FP32** | **~17-18 MB** | **94.06%** | ✅ **CURRENT** |
| **V4** | **EfficientNet-B0** | **CBAM** | **Focal Loss** | **5** | **INT8** | **~3-4 MB** | **~93.5-94%** | **Available** |
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
- This was verified from actual Colab source code and provides better performance on imbalanced datasets

### CBAM Block Implementation
- **USE**: Functional API definition (not subclassed Layer)
- **Benefit**: No `custom_objects` needed for Keras load_model or ONNX export
- **Code**:
  ```python
  def cbam_block(inputs, ratio=16):
      # Channel Attention
      channels = inputs.shape[-1]
      avg_pool = layers.GlobalAveragePooling2D()(inputs)
      max_pool = layers.GlobalMaxPooling2D()(inputs)
      
      avg_pool = layers.Reshape((1, 1, channels))(avg_pool)
      max_pool = layers.Reshape((1, 1, channels))(max_pool)
      
      shared_dense = layers.Dense(channels // ratio, activation='relu', 
                                   kernel_initializer='he_normal')
      avg_att = shared_dense(avg_pool)
      max_att = shared_dense(max_pool)
      
      channel_att = layers.Dense(channels, activation='sigmoid',
                                  kernel_initializer='he_normal')
      avg_att = channel_att(avg_att)
      max_att = channel_att(max_att)
      
      channel_att = layers.multiply([inputs, avg_att])
      channel_att = layers.multiply([channel_att, max_att])
      
      # Spatial Attention
      avg_spatial = tf.reduce_mean(channel_att, axis=-1, keepdims=True)
      max_spatial = tf.reduce_max(channel_att, axis=-1, keepdims=True)
      spatial_concat = layers.Concatenate(axis=-1)([avg_spatial, max_spatial])
      
      spatial_att = layers.Conv2D(1, kernel_size=7, padding='same',
                                   activation='sigmoid')(spatial_concat)
      
      return layers.multiply([channel_att, spatial_att])
  ```

### Data Improvements
- **MD5 Deduplication**: Remove duplicate images before training to prevent overfitting
- **Stratified Split**: Use 80/10/10 split (train/val/test) with `random_state=42`
- **Background Class**: Add 400 out-of-distribution images to reduce false positives
- **Enhanced Augmentation**: Include rotation ±15%, zoom ±15%, brightness ±15%, contrast ±15%

### Metadata Updates
Every time you create a new model version:
1. Increment version number (v4 → v5 → v6...)
2. Update all references in `crops_config.json`
3. Test thoroughly before deploying
4. Keep old models as backup until new version is verified
5. **Override Colab's auto-generated metadata**: The Colab script may print `"normalization": "divide_255"` - this is a bug. Always set it to `"raw_0_255"`.

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
- [ ] Load time acceptable on 3G/4G networks
- [ ] Memory usage within limits (< 40 MB for FP32)

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
# rice_model_v4_fp32.onnx    ~17-18M  ← Current production (FP32)
# rice_model_v4_int8.onnx    ~3-4M    ← Backup/optimization (INT8)
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
- Use `compile=False` when loading Keras model
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
- Monitor RAM usage (should be 20-30 MB for FP32)
- If exceeding 40 MB, switch to INT8 model (~3-4 MB)
- Reduce `ort.env.wasm.numThreads` to 1 in `useClassifier.js`

**Issue**: Background class detected too frequently  
**Fix**:
- Review confusion matrix for false positive patterns
- Check image quality and lighting conditions
- Ensure proper camera focus on rice leaf
- Consider adjusting confidence threshold

---

## 🛠️ DEBUGGING & DIAGNOSTICS

### Preprocessing Verification (Colab)
Run this if you are unsure what normalization the model expects:
```python
import tensorflow as tf, numpy as np, cv2, os
model = tf.keras.models.load_model('/content/drive/MyDrive/rice_project_models_v4/rice_model_v4.keras', compile=False)
img = cv2.cvtColor(cv2.imread('test.jpg'), cv2.COLOR_BGR2RGB)
img = cv2.resize(img, (224, 224))

pred_raw = model.predict(np.expand_dims(img.astype(np.float32), 0), verbose=0)          # 0-255
pred_norm = model.predict(np.expand_dims(img.astype(np.float32) / 255.0, 0), verbose=0) # 0-1

CLASSES = ['Background', 'Blast', 'Brown_Spot', 'Healthy', 'Leaf_Scald']
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

> 🌾 *This guide ensures zero React code changes for model updates. All modifications happen through configuration files, making the app future-proof and easily maintainable. V4 has been audited against actual Colab training source code to ensure accuracy. FP32 model is recommended for maximum precision.*

**Last Updated**: 2026-04-30 (V4 Production Release)  
**Current Version**: V4 (EfficientNet-B0 + CBAM, Focal Loss, Background Class, FP32 Production)  
**Next Planned**: V5 (Improved accuracy or additional crops)
