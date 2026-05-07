import { useState, useEffect, useRef, useCallback } from 'react'
import * as ort from 'onnxruntime-web'

export default function useClassifier(cropId) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [classes, setClasses] = useState({})
  const [diseases, setDiseases] = useState({})
  const [fallbackWarning, setFallbackWarning] = useState({})
  const [threshold, setThreshold] = useState(0.75)
  const sessionRef = useRef(null)

  useEffect(() => {
    let isMounted = true
    const loadModel = async () => {
      try {
        setIsLoading(true)
        setError(null)
        ort.env.wasm.numThreads = 1 
        ort.env.wasm.simd = true 
        
        const configRes = await fetch('/config/crops_config.json')
        if (!configRes.ok) throw new Error(`Failed to load crops_config.json`)
        const config = await configRes.json()
        const crop = config.crops[cropId]

        const [metaRes, diseaseRes] = await Promise.all([
          fetch(`/models/${crop.current_metadata_file}`),
          fetch(`/data/${crop.diseases_data_file}`)
        ])
        
        const meta = await metaRes.json()
        const diseaseData = await diseaseRes.json()

        if (isMounted) {
          setClasses(meta.classes)
          setDiseases(diseaseData)
          setFallbackWarning({ bn: crop.fallback_warning_bn, en: crop.fallback_warning_en })
          setThreshold(meta.confidence_threshold)
        }

        const sess = await ort.InferenceSession.create(`/models/${meta.model_filename}`, {
          executionProviders: ['wasm'],
          graphOptimizationLevel: 'all'
        })
        
        sessionRef.current = sess
        if (isMounted) setIsLoading(false)
      } catch (err) {
        if (isMounted) setError(`Failed to load AI model: ${err.message}`)
      }
    }

    loadModel()
    return () => {
      isMounted = false
      if (sessionRef.current) sessionRef.current.release()
    }
  }, [cropId])

  // ═══════════════════════════════════════════════════════════════
  // 🔬 Per-Channel Contrast Stretching
  // Normalizes each R/G/B channel independently so that disease
  // spots are equally visible whether the leaf is on white paper,
  // black surface, or natural background.
  // ═══════════════════════════════════════════════════════════════
  const applyContrastStretch = (tensorData) => {
    const totalPixels = 224 * 224
    const stretched = new Float32Array(tensorData.length)

    // Process each channel (R=0, G=1, B=2) independently
    for (let ch = 0; ch < 3; ch++) {
      let minVal = 255, maxVal = 0

      // Find min/max for this channel (sample every 4th pixel for speed)
for (let p = 0; p < totalPixels; p++) {
  const val = tensorData[p * 3 + ch]
  if (val < minVal) minVal = val
  if (val > maxVal) maxVal = val
}

      const range = maxVal - minVal
      // Only stretch if there's meaningful range (avoids division by zero
      // and preserves solid-color regions)
      if (range > 30) {
        // Stretch to [0, 255] range
        for (let p = 0; p < totalPixels; p++) {
          const idx = p * 3 + ch
          stretched[idx] = Math.min(255, Math.max(0, ((tensorData[idx] - minVal) / range) * 255))
        }
      } else {
        // Not enough dynamic range — keep original values
        for (let p = 0; p < totalPixels; p++) {
          stretched[p * 3 + ch] = tensorData[p * 3 + ch]
        }
      }
    }

    return stretched
  }

  const getTensorFromCanvas = (canvas) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const { data } = ctx.getImageData(0, 0, 224, 224)
    const tensorData = new Float32Array(224 * 224 * 3)
    let idx = 0
    for (let i = 0; i < data.length; i += 4) {
      tensorData[idx++] = data[i]     // R
      tensorData[idx++] = data[i+1]   // G
      tensorData[idx++] = data[i+2]   // B
    }
    return tensorData
  }

  const runInference = async (tensorData) => {
    const inputTensor = new ort.Tensor('float32', tensorData, [1, 224, 224, 3])
    const feeds = { [sessionRef.current.inputNames[0]]: inputTensor }
    const results = await sessionRef.current.run(feeds)
    return Array.from(results[sessionRef.current.outputNames[0]].data)
  }

  // ═══════════════════════════════════════════════════════════════
  // 🛡️ CENTER-REGION Image Quality Assessment (IQA)
  // Only checks the center 60% of the image for brightness/blur.
  // This prevents false rejections when leaves are placed on white
  // paper or black backgrounds — the leaf is almost always centered.
  // ═══════════════════════════════════════════════════════════════
  const validateImageQuality = (canvas) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const { data } = ctx.getImageData(0, 0, 224, 224)
    
    // Define center region: 60% of the image (center 134x134 pixels)
    const margin = Math.floor(224 * 0.2) // 20% margin on each side = 44px
    const regionStart = margin
    const regionEnd = 224 - margin

    let totalBrightness = 0
    let brightnessValues = []
    let centerPixelCount = 0

    for (let y = 0; y < 224; y++) {
      for (let x = 0; x < 224; x++) {
        const i = (y * 224 + x) * 4
        const r = data[i], g = data[i+1], b = data[i+2]
        const brightness = (r + g + b) / 3

        // Only use center pixels for quality assessment
        if (x >= regionStart && x < regionEnd && y >= regionStart && y < regionEnd) {
          totalBrightness += brightness
          brightnessValues.push(brightness)
          centerPixelCount++
        }
      }
    }

    const avgBrightness = totalBrightness / centerPixelCount

    // Calculate variance (blur detection) on center region only
    let sumSquaredDiff = 0
    for (let i = 0; i < brightnessValues.length; i += 10) { 
      sumSquaredDiff += Math.pow(brightnessValues[i] - avgBrightness, 2)
    }
    const variance = sumSquaredDiff / (brightnessValues.length / 10)

    // 🚨 Rule 1: Center too dark (leaf itself is underexposed)
    if (avgBrightness < 25) {
      return { valid: false, error: 'TOO_DARK', message: { bn: 'ছবি খুব অন্ধকার! আলোতে ছবি তুলুন।', en: 'Too dark! Please take photo in good light.' } }
    }
    // 🚨 Rule 2: Center too bright (completely overexposed/washed out)
    if (avgBrightness > 240) { 
      return { valid: false, error: 'TOO_BRIGHT', message: { bn: 'ছবি খুব উজ্জ্বল! সূর্যের আলো এড়িয়ে তুলুন।', en: 'Too bright! Avoid direct sunlight.' } }
    }
    // 🚨 Rule 3: Center has no detail (solid color = no leaf texture)

// সবুজ পাতায় variance কম হতে পারে (uniform color), কিন্তু তা blurry নয়
const isLikelyLeaf = (() => {
  let greenDominant = 0
  for (let i = 0; i < brightnessValues.length; i += 20) {
    // brightnessValues থেকে pixel index বের করে data থেকে RGB দেখি
    const pixelIdx = i * 4 // rough mapping back to ImageData
    if (pixelIdx < data.length - 3) {
      if (data[pixelIdx + 1] > data[pixelIdx] + 20 && 
          data[pixelIdx + 1] > data[pixelIdx + 2] + 10) {
        greenDominant++
      }
    }
  }
  return greenDominant > 5 // বেশিরভাগ center pixel সবুজ-dominant
})()

if (variance < 150 && !isLikelyLeaf) { 
  return { valid: false, error: 'TOO_BLURRY', message: { 
    bn: 'ছবি ঝাপসা বা স্পষ্ট নয়! ক্যামেরা স্থির রেখে তুলুন।', 
    en: 'Image is blurry or unclear! Hold camera steady.' 
  }}
}

    // ✅ Center region looks good — let the AI model handle the rest
    return { valid: true }
  }

  const classify = useCallback(async (imgElement) => {
    if (!sessionRef.current || !classes) return null

    try {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 224
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(imgElement, 0, 0, 224, 224)

      // ═══════════════════════════════════════════════════════════
      // STEP 1: Validate Image Quality (center-region based)
      // ═══════════════════════════════════════════════════════════
      const qualityCheck = validateImageQuality(canvas)
      if (!qualityCheck.valid) {
        return {
          class: 'InvalidImage',
          confidence: 0,
          confident: false,
          qualityError: qualityCheck.message,
          data: null
        }
      }

      // ═══════════════════════════════════════════════════════════
      // STEP 2: Per-Channel Contrast Stretching
      // Normalizes brightness so disease patterns are visible
      // regardless of white/black/natural background
      // ═══════════════════════════════════════════════════════════
      const rawOriginal = getTensorFromCanvas(canvas)
      const tensorOriginal = applyContrastStretch(rawOriginal)

      // ═══════════════════════════════════════════════════════════
      // STEP 3: Test-Time Augmentation (TTA) - 4 Variations
      //   ① Original (contrast-stretched)
      //   ② Horizontal Flip
      //   ③ Vertical Flip
      //   ④ Center Crop (75%) — removes white/black paper edges
      // ═══════════════════════════════════════════════════════════

      // Variation ②: Horizontal Flip
      ctx.clearRect(0, 0, 224, 224)
      ctx.save()
      ctx.translate(224, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(imgElement, 0, 0, 224, 224)
      ctx.restore()
      const tensorHFlip = applyContrastStretch(getTensorFromCanvas(canvas))

      // Variation ③: Vertical Flip
      ctx.clearRect(0, 0, 224, 224)
      ctx.save()
      ctx.translate(0, 224)
      ctx.scale(1, -1)
      ctx.drawImage(imgElement, 0, 0, 224, 224)
      ctx.restore()
      const tensorVFlip = applyContrastStretch(getTensorFromCanvas(canvas))

      // Variation ④: Center Crop (75% of image, resized back to 224x224)
      // This strips away edge backgrounds (white paper, black surface)
      // and focuses the model on the leaf itself
      const cropRatio = 0.75
      const srcW = imgElement.naturalWidth || imgElement.width
      const srcH = imgElement.naturalHeight || imgElement.height
      const cropW = srcW * cropRatio
      const cropH = srcH * cropRatio
      const cropX = (srcW - cropW) / 2
      const cropY = (srcH - cropH) / 2
      ctx.clearRect(0, 0, 224, 224)
      ctx.drawImage(imgElement, cropX, cropY, cropW, cropH, 0, 0, 224, 224)
      const tensorCenterCrop = applyContrastStretch(getTensorFromCanvas(canvas))

      // ═══════════════════════════════════════════════════════════
      // STEP 4: Sequential Inference (prevents WASM NaN issues)
      // ═══════════════════════════════════════════════════════════
      const probsOriginal = await runInference(tensorOriginal)
      const probsHFlip = await runInference(tensorHFlip)
      const probsVFlip = await runInference(tensorVFlip)
      const probsCenterCrop = await runInference(tensorCenterCrop)

      // ═══════════════════════════════════════════════════════════
      // STEP 5: Weighted Average (center crop gets slight boost
      // because it's the cleanest view of the leaf)
      // Weights: Original=1, HFlip=1, VFlip=1, CenterCrop=1.5
      // ═══════════════════════════════════════════════════════════
      const weightTotal = 4.5 // 1 + 1 + 1 + 1.5
      const avgProbs = probsOriginal.map((val, idx) => {
        return (
          val +
          probsHFlip[idx] +
          probsVFlip[idx] +
          probsCenterCrop[idx] * 1.5
        ) / weightTotal
      })

      let maxIdx = 0, maxConf = avgProbs[0]
      for (let i = 1; i < avgProbs.length; i++) {
        if (avgProbs[i] > maxConf) { 
          maxConf = avgProbs[i]; 
          maxIdx = i 
        }
      }

      // Safety check for NaN
      if (isNaN(maxConf)) {
        maxConf = 0;
      }

      const predicted = classes[String(maxIdx)]
      
      return {
        class: predicted,
        confidence: maxConf,
        confident: maxConf >= threshold,
        data: diseases[predicted]
      }
    } catch (err) {
      console.error('❌ Classification failed:', err)
      return null
    }
  }, [classes, diseases, threshold])

  return { isLoading, error, classify, fallbackWarning }
}