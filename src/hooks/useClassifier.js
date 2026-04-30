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

  // 🌟 FIXED: Removed NO_GREEN check. Now only blocks technical issues (Blur, Light)
  const validateImageQuality = (canvas) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const { data } = ctx.getImageData(0, 0, 224, 224)
    
    let totalBrightness = 0
    let brightnessValues = []
    const totalPixels = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2]
      const brightness = (r + g + b) / 3
      totalBrightness += brightness
      brightnessValues.push(brightness)
    }

    const avgBrightness = totalBrightness / totalPixels

    let sumSquaredDiff = 0
    const mean = avgBrightness
    for(let i=0; i<brightnessValues.length; i+=10) { 
      sumSquaredDiff += Math.pow(brightnessValues[i] - mean, 2)
    }
    const variance = sumSquaredDiff / (brightnessValues.length / 10)

    // 🚨 Rule 1: Too Dark
    if (avgBrightness < 30) { // Slightly lowered threshold
      return { valid: false, error: 'TOO_DARK', message: { bn: 'ছবি খুব অন্ধকার! আলোতে ছবি তুলুন।', en: 'Too dark! Please take photo in good light.' } }
    }
    // 🚨 Rule 2: Too Bright / Overexposed / White Screen
    if (avgBrightness > 235) { 
      return { valid: false, error: 'TOO_BRIGHT', message: { bn: 'ছবি খুব উজ্জ্বল! সূর্যের আলো এড়িয়ে তুলুন।', en: 'Too bright! Avoid direct sunlight.' } }
    }
    // 🚨 Rule 3: Too Blurry / Solid Color Wall (Low variance means no edges)
    if (variance < 200) { 
      return { valid: false, error: 'TOO_BLURRY', message: { bn: 'ছবি ঝাপসা বা স্পষ্ট নয়! ক্যামেরা স্থির রেখে তুলুন।', en: 'Image is blurry or unclear! Hold camera steady.' } }
    }

    // ✅ If no technical issues, let the AI model decide if it's a leaf or background
    return { valid: true }
  }

  const classify = useCallback(async (imgElement) => {
    if (!sessionRef.current || !classes) return null

    try {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 224
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(imgElement, 0, 0, 224, 224)

      // STEP 1: Validate Image Quality
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

      // STEP 2: Test-Time Augmentation (TTA) - 3 Variations
      const tensorOriginal = getTensorFromCanvas(canvas)

      ctx.clearRect(0, 0, 224, 224)
      ctx.save()
      ctx.translate(224, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(imgElement, 0, 0, 224, 224)
      ctx.restore()
      const tensorHFlip = getTensorFromCanvas(canvas)

      ctx.clearRect(0, 0, 224, 224)
      ctx.save()
      ctx.translate(0, 224)
      ctx.scale(1, -1)
      ctx.drawImage(imgElement, 0, 0, 224, 224)
      ctx.restore()
      const tensorVFlip = getTensorFromCanvas(canvas)

      // Run SEQUENTIALLY to prevent WASM NaN issue
      const probsOriginal = await runInference(tensorOriginal)
      const probsHFlip = await runInference(tensorHFlip)
      const probsVFlip = await runInference(tensorVFlip)

      const avgProbs = probsOriginal.map((val, idx) => {
        return (val + probsHFlip[idx] + probsVFlip[idx]) / 3
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