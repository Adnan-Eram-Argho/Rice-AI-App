# 🌾 Rice AI Doctor - Retraining & Expansion Guide

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

1. **Merge new images** into `dataset/rice/[Class]/` folders
2. **Rerun Phase 2 Training** in Colab (MobileNetV2 transfer learning)
   - Folder structure auto-reads class names & counts
   - Exports new `class_indices.json`
3. **Rerun Phase 3 Quantization** → Get `rice_model_v2.onnx` (~6-8 MB)
4. **Update files in React project:**
   - Replace `public/models/rice_model_v1.onnx` → `rice_model_v2.onnx`
   - Update `public/models/metadata_rice_v1.json` → `metadata_rice_v2.json`
   - Change `crops_config.json` → `"current_metadata_file": "metadata_rice_v2.json"`
5. **Deploy:** `npm run build` → Git push → Vercel auto-redeploys

✅ **PWA Cache:** Workbox automatically fetches the new model on next visit. Old `v1` cache is purged.

---

## 🌿 Scenario B: Add NEW Disease to Rice (e.g., Bacterial Leaf Blight)
*Use when you want to detect a 5th rice disease.*

1. **Create folder:** `dataset/rice/Bacterial_Leaf_Blight/`
2. **Add ≥200 images** to the new folder
3. **Rerun Phase 2 Training**
   - Code auto-detects 5 classes
   - Exports `class_indices.json` with `{"Bacterial_Leaf_Blight": 4}`
4. **Rerun Phase 3 Quantization** → Get `rice_model_v2.onnx`
5. **Update configs:**
   ```json
   // public/models/metadata_rice_v2.json
   "classes": { "0":"Blast", "1":"Brown_Spot", "2":"Healthy", "3":"Leaf_Scald", "4":"Bacterial_Leaf_Blight" }
   
   // public/data/diseases_rice_v2.json
   "Bacterial_Leaf_Blight": {
     "name_bn": "...", "name_en": "...",
     "symptoms_bn": "...", "symptoms_en": "...",
     "treatment_bn": "...", "treatment_en": "..."
   }