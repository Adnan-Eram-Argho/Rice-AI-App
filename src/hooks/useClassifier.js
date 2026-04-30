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

  const validateImageQuality = (canvas) => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    const { data } = ctx.getImageData(0, 0, 224, 224)
    
    let totalBrightness = 0
    let greenPixels = 0
    let brightnessValues = []
    const totalPixels = data.length / 4

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2]
      const brightness = (r + g + b) / 3
      totalBrightness += brightness
      brightnessValues.push(brightness)

      if (g > r && g > b && g > 50) {
        greenPixels++
      }
    }

    const avgBrightness = totalBrightness / totalPixels
    const greenRatio = greenPixels / totalPixels

    let sumSquaredDiff = 0
    const mean = avgBrightness
    for(let i=0; i<brightnessValues.length; i+=10) { 
      sumSquaredDiff += Math.pow(brightnessValues[i] - mean, 2)
    }
    const variance = sumSquaredDiff / (brightnessValues.length / 10)

    if (avgBrightness < 35) {
      return { valid: false, error: 'TOO_DARK', message: { bn: 'ছবি খুব অন্ধকার! আলোতে ছবি তুলুন।', en: 'Too dark! Please take photo in good light.' } }
    }
    if (avgBrightness > 225) {
      return { valid: false, error: 'TOO_BRIGHT', message: { bn: 'ছবি খুব উজ্জ্বল! সূর্যের আলো এড়িয়ে তুলুন।', en: 'Too bright! Avoid direct sunlight.' } }
    }
    if (greenRatio < 0.03) { 
      return { valid: false, error: 'NO_GREEN', message: { bn: 'পাতা পরিষ্কারভাবে দেখা যাচ্ছে না! ক্যামেরা কাছে নিন।', en: 'Leaf not clearly visible! Move camera closer.' } }
    }
    if (variance < 250) { 
      return { valid: false, error: 'TOO_BLURRY', message: { bn: 'ছবি ঝাপসা! ক্যামেরা স্থির রেখে তুলুন।', en: 'Image is blurry! Hold camera steady.' } }
    }

    return { valid: true }
  }

  const classify = useCallback(async (imgElement) => {
    if (!sessionRef.current || !classes) return null

    try {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 224
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      ctx.drawImage(imgElement, 0, 0, 224, 224)

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

      // 1. Original
      const tensorOriginal = getTensorFromCanvas(canvas)

      // 2. Horizontal Flip
      ctx.clearRect(0, 0, 224, 224)
      ctx.save()
      ctx.translate(224, 0)
      ctx.scale(-1, 1)
      ctx.drawImage(imgElement, 0, 0, 224, 224)
      ctx.restore()
      const tensorHFlip = getTensorFromCanvas(canvas)

      // 3. Vertical Flip
      ctx.clearRect(0, 0, 224, 224)
      ctx.save()
      ctx.translate(0, 224)
      ctx.scale(1, -1)
      ctx.drawImage(imgElement, 0, 0, 224, 224)
      ctx.restore()
      const tensorVFlip = getTensorFromCanvas(canvas)

      console.log('🔍 Running TTA Inference sequentially...')
      
      // 🌟 FIX: Run SEQUENTIALLY to prevent WASM race conditions/NaN outputs
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

      // 🌟 FIX: Safety check for NaN (if WASM memory fails)
      if (isNaN(maxConf)) {
        maxConf = 0;
      }

      const predicted = classes[String(maxIdx)]
      console.log(`✅ TTA Prediction: ${predicted} (${(maxConf * 100).toFixed(1)}%)`)
      
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