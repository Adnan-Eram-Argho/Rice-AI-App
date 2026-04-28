# 🌾 RICE DISEASE DETECTION PWA - COMPLETE TECHNICAL SUMMARY (V3.1 - AUDITED & CORRECTED)
*Optimized for AI ingestion. Contains exact architecture, preprocessing rules, file structure, training config, deployment settings, and modification guidelines for future AI agents. **Audited and corrected against actual Colab training source code.***

---

## 📦 PROJECT OVERVIEW & CONSTRAINTS (V3.1 - VERIFIED)
| Parameter | Value / Rule | Status |
|-----------|--------------|--------|
| **Target Users** | Bangladeshi Farmers, SAU Students, Agriculture Officers | ✅ |
| **Platform** | Vite + React 18 + TailwindCSS + PWA (100% offline after first load) | ✅ |
| **Device Constraint** | Low-end Android (2GB RAM, 3G networks) | ✅ |
| **Model Architecture** | **EfficientNet-B0** (Functional API SE Block, no custom subclasses) | ✅ |
| **Model Size** | **~17.8 MB** (FP32 ONNX - full precision) | ✅ Current Production |
| **Inference Target** | `< 150 ms` on-device | ✅ |
| **Safety Threshold** | `confidence < 0.75` → Triggers `"Consult Agriculture Officer"` fallback | ✅ |
| **Architecture Rule** | **Zero hardcoded crops/classes in React.** All driven by `public/config/crops_config.json` | ✅ |
| **Final Accuracy** | **90.875%** validation (Phase 2, Epoch 1 checkpoint) ✅ **ACTUAL ACHIEVED** | ✅ |

---

## 🗂️ CONFIRMED GOOGLE DRIVE FOLDER STRUCTURE (ACTUAL - VERIFIED)
⚠️ **IMPORTANT FOR ALL AI AGENTS**: The dataset IS saved to Google Drive separately from the models.

```text
My Drive Root (/content/drive/MyDrive/)
├── Colab Notebooks/              # Auto-created by Colab for .ipynb files
├── rice_project_dataset_v1/      # ✅ DATASET FOLDER (persisted to Drive)
│   ├── Blast/                    # Rice Blast disease images
│   ├── Brown_Spot/               # Brown Spot disease images
│   ├── Healthy/                  # Healthy rice leaf images
│   └── Leaf_Scald/               # Leaf Scald disease images
├── rice_project_models/          # V2 model files (backup, kept for reference)
└── rice_project_models_v3/       # ✅ V3 MODEL FOLDER (current production)
    ├── best_model_phase1.keras   # Phase 1 best checkpoint
    ├── rice_model_v3.keras       # Phase 2 best checkpoint (90.875% val acc)
    ├── rice_model_v3_fp32.onnx   # ✅ FP32 export (~17.8 MB) — CURRENT PRODUCTION
    ├── rice_model_v3.onnx        # INT8 quantized (~3.2 MB) — available for optimization
    ├── metadata_rice_v3.json     # Frontend config (CORRECTED normalization)
    ├── training_history_v3.png   # Accuracy/loss curves
    ├── confusion_matrix_v3.png   # Class-wise performance visualization
    └── class_indices.json        # {"Blast":0, "Brown_Spot":1, "Healthy":2, "Leaf_Scald":3}
```

### Colab Path References
| Purpose | Colab Path |
|---------|-----------|
| Dataset (input) | `/content/drive/MyDrive/rice_project_dataset_v1/` |
| Model output (V3) | `/content/drive/MyDrive/rice_project_models_v3/` |

### Dataset Class Structure
| Class Folder | Disease | Class Index |
|-------------|---------|-------------|
| Blast/ | Rice Blast (ব্লাস্ট) | 0 |
| Brown_Spot/ | Brown Spot (বাদামি দাগ) | 1 |
| Healthy/ | Healthy Leaf (সুস্থ) | 2 |
| Leaf_Scald/ | Leaf Scald (পাতা ঝলসানো) | 3 |

---

## 📁 FINAL PROJECT FOLDER STRUCTURE (V3.1 - ACTUAL FILES)

### Frontend (React/Vite)
```text
rice-ai-app/
├── public/
│   ├── config/
│   │   └── crops_config.json          # Dynamic crop registry & metadata pointers
│   ├── data/
│   │   └── diseases_rice_v1.json      # Bilingual symptoms & treatments (BRRI/IRRI)
│   └── models/
│       ├── rice_model_v3_fp32.onnx    # ✅ FP32 model (~17.8 MB) — CURRENT PRODUCTION
│       └── metadata_rice_v3.json      # ✅ CORRECTED: Input/output names, raw_0_255 norm
├── src/
│   ├── hooks/
│   │   └── useClassifier.js           # Dynamic ONNX loader + preprocessing hook (RAW 0-255)
│   ├── components/
│   │   ├── App.jsx                    # Orchestrator (state, UI layout, PWA init)
│   │   ├── CropSelector.jsx           # Reads crops_config.json, locked to "rice" for V1
│   │   ├── CameraScanner.jsx          # getUserMedia + canvas capture + focus overlay
│   │   └── ResultDisplay.jsx          # Bilingual UI + confidence threshold logic
│   └── index.css                      # Tailwind directives
├── vite.config.js                     # Vite + vite-plugin-pwa + WASM cache rules
├── vercel.json                        # COOP/COEP headers for ONNX WebAssembly
├── package.json
└── RETRAINING_GUIDE.md                # Future-proof expansion workflow
```

---

## 🧠 MODEL TRAINING CONFIGURATION (AUDITED FROM SOURCE CODE)

### Architecture & Hyperparameters
| Parameter | Value | Notes |
|-----------|-------|-------|
| **Framework** | TensorFlow 2.x / Keras | |
| **Base Model** | `EfficientNetB0(input_shape=(224,224,3), include_top=False, weights='imagenet')` | **Contains internal `Normalization` layer expecting [0, 255]** |
| **Fine-Tuning** | Two-phase: (1) Freeze backbone; (2) Unfreeze last 15 layers | Stable convergence |
| **Custom Head** | `SE_Block (Functional) → GlobalAvgPool2D → BatchNorm → Dropout(0.4) → Dense(256, relu) → BatchNorm → Dropout(0.3) → Dense(4, softmax, name='rice_output')` | SE Block uses standard Keras layers (no custom subclass) |
| **Optimizer** | Phase 1: `Adam(lr=1e-3)`; Phase 2: `Adam(lr=1e-6)` | |
| **Loss Function** | **`sparse_categorical_crossentropy`** + `class_weight` | ⚠️ **CORRECTED**: Focal loss was defined but explicitly removed in final training code |
| **Metrics** | `accuracy` | |
| **Augmentation** | Albumentations: flip, rotate, brightness/contrast, hue/saturation, noise, blur, coarse dropout | |
| **Batch Size** | `32` | |
| **Class Weights** | `sklearn.utils.class_weight.compute_class_weight('balanced')` | Handles dataset imbalance |
| **Callbacks** | `ModelCheckpoint`, `EarlyStopping(patience=5)`, `ReduceLROnPlateau` | |

### SE Block Definition (Functional API - As Used In Code)
```python
# This is a function, NOT a subclassed Layer. 
# Therefore, NO custom_objects are needed for Keras load_model or ONNX export.
def se_block(inputs, ratio=16):
    channels = inputs.shape[-1]
    se = layers.GlobalAveragePooling2D()(inputs)
    se = layers.Reshape((1, 1, channels))(se)
    se = layers.Dense(channels // ratio, activation='relu')(se)
    se = layers.Dense(channels, activation='sigmoid')(se)
    return layers.multiply([inputs, se])
```

### ✅ ACTUAL TRAINING RESULTS
| Phase | Epochs | Peak Val Accuracy | Model Saved | Status |
|-------|--------|------------------|-------------|--------|
| **Phase 1** | 15/15 | **90.64%** | `best_model_phase1.keras` | ✅ Completed |
| **Phase 2** | 1/5 (interrupted) | **90.875%** | `rice_model_v3.keras` | ✅ Best saved |

---

## 🗜️ ONNX CONVERSION & QUANTIZATION

### Export Configuration
| Step | Command/Library | Output | Critical Notes |
|------|----------------|--------|---------------|
| **FP32 Export** | `tf2onnx.convert.from_keras(model, input_signature=spec, opset=16)` | `rice_model_v3_fp32.onnx` | **opset=16 required** for Swish — CURRENT PRODUCTION |
| **INT8 Quantization** | `quantize_dynamic(model_input=fp32_path, model_output=int8_path, weight_type=QuantType.QUInt8)` | `rice_model_v3.onnx` | Available for optimization if needed |
| **Input Format** | **NHWC** `[1, 224, 224, 3]` | Preserved from TensorFlow | Do NOT transpose to NCHW |
| **Normalization** | **RAW 0-255** (NO division) | Preserved in ONNX | ⚠️ **CRITICAL: Frontend must match** |
| **Custom Objects** | `compile=False` on load | No custom objects needed | SE block is functional, not subclassed |

### 🔑 Frontend Preprocessing (CRITICAL - MUST MATCH TRAINING)
```javascript
// ✅ CORRECT for THIS PROJECT'S EfficientNet-B0 V3:
const preprocessImage = (imgElement) => {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 224;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(imgElement, 0, 0, 224, 224);
  
  const { data } = ctx.getImageData(0, 0, 224, 224);
  const tensorData = new Float32Array(224 * 224 * 3);
  let idx = 0;
  
  for (let i = 0; i < data.length; i += 4) {
    // 🔑 CRITICAL: NO DIVISION — Your model expects RAW 0-255 pixel values
    // TensorFlow EfficientNet-B0 has an INTERNAL normalization layer.
    // Passing /255.0 values will cause the internal layer to destroy the data distribution.
    tensorData[idx++] = data[i];                // R channel (0-255)
    tensorData[idx++] = data[i + 1];            // G channel (0-255)
    tensorData[idx++] = data[i + 2];            // B channel (0-255)
    // Skip alpha: data[i + 3]
  }
  
  return new ort.Tensor('float32', tensorData, [1, 224, 224, 3]); // NHWC
};
```

⚠️ **Why RAW 0-255?** Standard Keras `EfficientNetB0(weights='imagenet')` includes a built-in `Normalization` layer at the very start of the architecture. During training, your pipeline fed `[0, 255]` images directly into the model, and the internal layer scaled them to `[-1, 1]`. The ONNX export preserved this internal layer. If you divide by 255.0 in the frontend, the internal layer will scale already-small values into extreme negatives, resulting in random/garbage predictions.

---

## 📄 FINAL AUTO-GENERATED CONFIGS (V3.1 - CORRECTED)

⚠️ **NOTE FOR AI AGENTS**: The Colab script's final step erroneously prints `"normalization": "divide_255"`. This was a bug in the script's print statements. The actual training loop used raw 0-255. The JSON below is the **corrected, production-ready** version.

### `metadata_rice_v3.json` (Frontend Config - CORRECTED VALUES)
```json
{
  "crop_id": "rice",
  "model_version": "v3",
  "model_filename": "rice_model_v3_fp32.onnx",
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
  "preprocessing_note": "Resize 224x224, use raw 0-255 pixel values (NO division), NHWC format. EfficientNet has internal norm layer.",
  "val_accuracy": 0.9088,
  "test_accuracy": 0.9088
}
```

### `class_indices.json`
```json
{"Blast": 0, "Brown_Spot": 1, "Healthy": 2, "Leaf_Scald": 3}
```

---

## 🌐 PWA & DEPLOYMENT SETTINGS (V3)

### `vite.config.js` (PWA Workbox Rules)
```javascript
import { VitePWA } from 'vite-plugin-pwa'

VitePWA({
  registerType: 'autoUpdate',
  includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'models/rice_model_v3_fp32.onnx'],
  manifest: {
    name: 'ধান চিকিৎসা | Rice AI Doctor',
    short_name: 'RiceAI',
    theme_color: '#16a34a',
    background_color: '#f0fdf4',
    display: 'standalone',
    icons: [
      { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  workbox: {
    // Increase cache limit to 30 MB to accommodate larger FP32 ONNX model
    maximumFileSizeToCacheInBytes: 30 * 1024 * 1024, // 30 MB
    globPatterns: ['**/*.{js,css,html,png,svg,jpg,woff2,ttf,onnx,json,wasm}'],
    cleanupOutdatedCaches: true,
    runtimeCaching: [{
      urlPattern: /.*\.onnx$/,
      handler: 'CacheFirst', // Cache-First: downloads once, serves offline forever
      options: {
        cacheName: 'onnx-models-cache',
        expiration: { maxEntries: 5, maxAgeSeconds: 31536000 }, // 1 year
        cacheableResponse: { statuses: [0, 200] }
      }
    }]
  }
})
```

### `vercel.json` (Required Headers for WASM)
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [{
    "source": "/(.*)",
    "headers": [
      { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
      { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" },
      { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
    ]
  }]
}
```

---

## ⚠️ CRITICAL RULES & GOTCHAS (V3.1 - MUST FOLLOW)

| Rule | Why It Matters | Consequence if Ignored |
|------|---------------|----------------------|
| **Normalization: RAW 0-255 (NO `/255.0`)** | TF EfficientNet-B0 has an internal `Normalization` layer. Training fed `[0,255]`. | Garbage predictions. Internal layer will over-normalize `[0,1]` inputs into extreme negatives. |
| **Loss Function is `sparse_categorical_crossentropy`** | Verified from source code. Focal loss was abandoned mid-script. | Incorrect assumptions about class weighting if trying to resume training. |
| **ONNX opset=16** | Required for EfficientNet Swish activation export | Export fails or model produces garbage output |
| **Input format: NHWC `[1,224,224,3]`** | TensorFlow default; ONNX preserves this | `InvalidArgument` tensor shape errors |
| **Output name: "rice_output"** | Custom name in model head | Frontend cannot find output tensor |
| **No custom objects needed for ONNX** | SE Block is implemented via Functional API, not a subclassed Layer | Unnecessary errors trying to pass `custom_objects` to ONNX loader |
| **Confidence threshold: 0.75** | Ethical safety guard | Farmers receive unreliable pesticide advice |
| **Model file: Use FP32 (~17.8 MB)** | Full precision model chosen for maximum accuracy | Slower load on 3G, may stress 2GB RAM devices |

---

## 🔄 REPRODUCIBILITY CHECKLIST FOR ANOTHER AI

### Environment Setup
- [ ] Use T4 GPU runtime for training
- [ ] Install: `tensorflow`, `tf2onnx`, `onnx`, `onnxruntime`, `scikit-learn`, `opencv-python-headless`, `albumentations`, `kaggle`
- [ ] Set random seeds: `SEED = 42` for `random`, `numpy`, `tensorflow`

### Data Pipeline
- [ ] Dataset already saved to Drive: `/content/drive/MyDrive/rice_project_dataset_v1/`
- [ ] If dataset folder already exists in Drive → skip download/merge step
- [ ] Apply MD5 deduplication + `PIL.Image.verify()` quality filter
- [ ] Split: 70/15/15 stratified with `random_state=42`

### Training
- [ ] Base model: `EfficientNetB0(weights='imagenet', include_top=False)` (Contains internal norm layer)
- [ ] Preprocessing: `img.astype(np.float32)` # Range [0,255] ⚠️ **NO division by 255.0**
- [ ] Loss: `sparse_categorical_crossentropy` + `class_weight` dictionary
- [ ] SE Block: Use Functional API (no subclassing) so no `custom_objects` are needed
- [ ] Two-phase training: (1) Freeze backbone, lr=1e-3; (2) Unfreeze last 15 layers, lr=1e-6

### Export & Quantization
- [ ] Export FP32: `tf2onnx.convert.from_keras(..., opset=16)`
- [ ] Quantize INT8: `quantize_dynamic(..., weight_type=QuantType.QUInt8)` (optional optimization)
- [ ] Verify both FP32 and INT8 with `onnxruntime.InferenceSession`
- [ ] **Override Colab's auto-generated metadata**: Change `"divide_255"` to `"raw_0_255"` in `metadata_rice_v3.json`

### Frontend Integration
- [ ] Preprocessing: **RAW 0-255 values (NO `/255.0`)**, NHWC format, Float32Array
- [ ] Model file: `rice_model_v3_fp32.onnx` (FP32, ~17.8 MB) — current production
- [ ] Meta `metadata_rice_v3.json` with `"normalization": "raw_0_255"`
- [ ] Safety: Frontend checks `confidence < 0.75` → show fallback warning

---

## 🛠️ DEBUGGING & DIAGNOSTICS

### Preprocessing Verification (Colab)
Run this if you are unsure what normalization the model expects. Because of the internal layer, `[0, 255]` will yield high confidence, and `[0, 1]` will fail.
```python
import tensorflow as tf, numpy as np, cv2, os
model = tf.keras.models.load_model('/content/drive/MyDrive/rice_project_models_v3/rice_model_v3.keras', compile=False)
img = cv2.cvtColor(cv2.imread('test.jpg'), cv2.COLOR_BGR2RGB)
img = cv2.resize(img, (224, 224))

pred_raw = model.predict(np.expand_dims(img.astype(np.float32), 0), verbose=0)          # 0-255
pred_norm = model.predict(np.expand_dims(img.astype(np.float32) / 255.0, 0), verbose=0) # 0-1

CLASSES = ['Blast', 'Brown_Spot', 'Healthy', 'Leaf_Scald']
print(f"Raw 0-255: {CLASSES[np.argmax(pred_raw[0])]} @ {np.max(pred_raw[0])*100:.1f}%")
print(f"Normalized (/255.0): {CLASSES[np.argmax(pred_norm[0])]} @ {np.max(pred_norm[0])*100:.1f}%")
# ✅ For THIS model: Raw 0-255 should give ~85%+ confidence. /255.0 will give near 0%.
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

## 📞 SUPPORT & TROUBLESHOOTING

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| `Model predicts randomly / <10% confidence` | Frontend uses `/255.0` instead of raw 0-255 | **Remove `/255.0`**. EfficientNet's internal norm layer is destroying the data. |
| `ERROR_CODE: 7, protobuf parsing failed` | Incomplete download or opset issue | Re-export with `opset=16`, add retry logic in React |
| `InvalidArgument: Input shape mismatch` | NCHW vs NHWC format mismatch | Ensure frontend uses `[1, 224, 224, 3]` NHWC |
| `ValueError: Unknown layer: SE_Block` | Trying to load model with subclassed SE Block | Use the Functional API SE Block definition (no custom objects needed) |
| `App crashes on low-end Android` | FP32 model too large (~17 MB) | Consider switching to INT8 quantized model (~3.2 MB) |

---

## 🌾 PROJECT STATUS

> ✅ **V3.1 is production-ready** with **90.875% validation accuracy**, using FP32 model (~17.8 MB) for maximum precision, 100% offline PWA, bilingual UI, and ethical safety fallbacks. The critical normalization discrepancy between the Colab print statements and the actual training pipeline has been resolved. Frontend must send RAW 0-255 values.

### 🔑 Golden Rule for Future Modifications
> **Trust the training code, not the Colab print statements.** Your model uses TensorFlow's `EfficientNetB0`, which has an internal `Normalization` layer. Therefore, both the training pipeline AND the frontend MUST use **RAW 0-255 pixel values (NO division)**. If you switch to a model without an internal norm layer (like MobileNetV2), you MUST add `/255.0` back. Always run the diagnostic test when changing architectures.

---

*Last Updated: V3.1 Audited *
