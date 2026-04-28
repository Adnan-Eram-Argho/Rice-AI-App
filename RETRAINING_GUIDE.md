# 🌾 Rice AI Doctor - Retraining & Expansion Guide (V3)

## ⚙️ Core Architecture Rule
**NEVER modify React/Vite code to add crops or diseases.**  
All changes happen in:
1. `public/config/crops_config.json` (Crop registry)
2. `public/models/metadata_*.json` (Model specs & class mapping)
3. `public/data/diseases_*.json` (Symptoms & treatments)
4. New `.onnx` files in `public/models/`

---

## 🔄 Scenario A: Improve Existing Rice Model (Add More Images)
*Use when you collect 100+ new field photos for Blast, Brown_Spot, Leaf_Scald, or Healthy.*

### Current Configuration (V3)
- **Base Model**: EfficientNet-B0 (upgraded from MobileNetV2 in V2)
- **Preprocessing**: RAW 0-255 pixel values (NO /255.0 division)
- **Current Model**: `rice_model_v3_fp32.onnx` (~17.8 MB, FP32)
- **Alternative**: `rice_model_v3.onnx` (~3.2 MB, INT8 quantized)

### Steps to Retrain

1. **Merge new images** into your dataset folders:
   ```
   rice_project_dataset_v1/
   ├── Blast/
   ├── Brown_Spot/
   ├── Healthy/
   └── Leaf_Scald/
   ```

2. **Rerun Phase 2 Training** in Colab (EfficientNet-B0 transfer learning)
   - Use the same architecture: `EfficientNetB0(input_shape=(224,224,3), include_top=False, weights='imagenet')`
   - Folder structure auto-reads class names & counts
   - Exports new `class_indices.json`
   - **Important**: Maintain RAW 0-255 preprocessing (no normalization)

3. **Rerun Phase 3 Export**:
   - **FP32 Export** (for testing/validation):
     ```python
     tf2onnx.convert.from_keras(model, input_signature=[...], opset=16)
     # Output: rice_model_v4_fp32.onnx (~17-18 MB)
     ```
   - **INT8 Quantization** (optional, for production optimization):
     ```python
     quantize_dynamic(model_input=fp32_path, model_output=int8_path, weight_type=QuantType.QUInt8)
     # Output: rice_model_v4.onnx (~3-4 MB)
     ```

4. **Update files in React project:**
   - Copy new model to `public/models/rice_model_v4_fp32.onnx` (or INT8 version)
   - Create `public/models/metadata_rice_v4.json` with updated fields:
     ```json
     {
       "crop_id": "rice",
       "model_version": "v4",
       "model_filename": "rice_model_v4_fp32.onnx",
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
         "3": "Leaf_Scald"
       },
       "quantization": "FP32",
       "model_size_mb": 17.8,
       "base_model": "EfficientNet-B0",
       "preprocessing_note": "Resize 224x224, use raw 0-255 pixel values (NO division), NHWC format"
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
           "current_metadata_file": "metadata_rice_v4.json",  // ← Changed from v3
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
   git commit -m "Update to rice model v4 with improved accuracy"
   git push
   # Vercel auto-redeploys
   ```

✅ **PWA Cache:** Workbox automatically fetches the new model on next visit. Old `v3` cache is purged due to `cleanupOutdatedCaches: true`.

---

## 🌿 Scenario B: Add NEW Disease to Rice (e.g., Bacterial Leaf Blight)
*Use when you want to detect a 5th rice disease.*

1. **Create folder:** `dataset/rice/Bacterial_Leaf_Blight/`
2. **Add ≥200 images** to the new folder (more is better for training stability)
3. **Rerun Phase 2 Training**
   - Code auto-detects 5 classes
   - Exports `class_indices.json` with `{"Blast": 0, "Brown_Spot": 1, "Healthy": 2, "Leaf_Scald": 3, "Bacterial_Leaf_Blight": 4}`
   - Train with same EfficientNet-B0 architecture
4. **Rerun Phase 3 Export** → Get `rice_model_v4_fp32.onnx` (and optionally INT8)
5. **Update configs:**
   ```json
   // public/models/metadata_rice_v4.json
   {
     "classes": {
       "0": "Blast",
       "1": "Brown_Spot",
       "2": "Healthy",
       "3": "Leaf_Scald",
       "4": "Bacterial_Leaf_Blight"
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

2. **Train new model** using same EfficientNet-B0 architecture
   - Adjust `CLASSES` list in Colab notebook
   - Export as `wheat_model_v1_fp32.onnx`
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
         "current_metadata_file": "metadata_rice_v3.json",
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

## 🔧 Scenario D: Switch from FP32 to INT8 (Performance Optimization)
*Use if you experience slow loading or memory issues on low-end devices.*

### Current Situation
- Using FP32 model: `rice_model_v3_fp32.onnx` (~17.8 MB)
- Experiencing: Slow load times (>30s on 3G) or memory issues on 2GB RAM devices

### Solution: Switch to INT8 Quantized Model

1. **Download INT8 model** from Google Drive:
   - File: `/content/drive/MyDrive/rice_project_models_v3/rice_model_v3.onnx`
   - Size: ~3.2 MB (5x smaller than FP32)

2. **Place in project**: `public/models/rice_model_v3.onnx`

3. **Update `metadata_rice_v3.json`**:
   ```json
   {
     "model_filename": "rice_model_v3.onnx",  // ← Changed from _fp32
     "quantization": "INT8",                   // ← Changed from FP32
     "model_size_mb": 3.2                      // ← Updated size
   }
   ```

4. **Test locally**:
   ```bash
   npm run dev
   # Verify model loads faster (< 5s on WiFi)
   # Check accuracy remains similar (< 0.5% drop expected)
   ```

5. **Deploy**:
   ```bash
   npm run build
   git push
   ```

### Benefits
- ✅ 5x smaller file size (3.2 MB vs 17.8 MB)
- ✅ Faster loading on 3G networks (< 10s)
- ✅ Lower memory usage (~15-20 MB vs 20-30 MB)
- ✅ Minimal accuracy loss (< 0.5%)

### Trade-offs
- ⚠️ Slight accuracy reduction (typically < 0.5%)
- ⚠️ May not be suitable for medical-grade applications requiring maximum precision

---

## 📊 Version History & Model Comparison

| Version | Base Model | Quantization | Size | Val Accuracy | Status |
|---------|-----------|--------------|------|--------------|--------|
| V1 | MobileNetV2 | INT8 | 2.48 MB | 78.49% | Deprecated |
| V2 | MobileNetV2 | INT8 | 2.85 MB | 86.61% | Deprecated |
| V3 | EfficientNet-B0 | FP32 | 17.8 MB | 90.875% | ✅ CURRENT |
| V3 | EfficientNet-B0 | INT8 | 3.2 MB | ~90.5% | Available (optimization) |
| V4+ | Future iterations | TBD | TBD | TBD | Planned |

---

## ⚠️ Critical Reminders for Retraining

### Preprocessing Consistency
- **ALWAYS** use RAW 0-255 pixel values (NO /255.0 division)
- **ALWAYS** use NHWC format `[1, 224, 224, 3]`
- **ALWAYS** use opset=16 for ONNX export (required for EfficientNet Swish activation)
- **ALWAYS** name output tensor `"rice_output"` (or crop-specific name)

### Metadata Updates
Every time you create a new model version:
1. Increment version number (v3 → v4 → v5...)
2. Update all references in `crops_config.json`
3. Test thoroughly before deploying
4. Keep old models as backup until new version is verified

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
- [ ] Bilingual UI displays correctly
- [ ] PWA installs and works offline
- [ ] Tested on target devices (low-end Android, iOS)
- [ ] Load time acceptable on 3G/4G networks

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
# rice_model_v3_fp32.onnx  ~17.8M  ← Current production
# rice_model_v3.onnx       ~3.2M   ← INT8 backup (optional)
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

**Issue**: ONNX export fails with opset error  
**Fix**:
- Ensure opset=16 for EfficientNet models
- Use `compile=False` when loading Keras model
- Install latest `tf2onnx`: `pip install -U tf2onnx`

**Issue**: Frontend predictions are random/wrong  
**Fix**:
- Verify preprocessing matches training (RAW 0-255, not /255.0)
- Check input shape is NHWC `[1, 224, 224, 3]`
- Confirm output tensor name matches metadata (`"rice_output"`)
- Use debug logging in `useClassifier.js`

**Issue**: PWA doesn't update to new model  
**Fix**:
- Clear browser cache and Service Workers
- Uninstall and reinstall PWA
- Check `cleanupOutdatedCaches: true` in `vite.config.js`
- Verify new model filename is different from old version

---

> 🌾 *This guide ensures zero React code changes for model updates. All modifications happen through configuration files, making the app future-proof and easily maintainable.*

**Last Updated**: 2026-04-28  
**Current Version**: V3 (EfficientNet-B0, FP32)  
**Next Planned**: V4 (Improved accuracy or INT8 optimization)