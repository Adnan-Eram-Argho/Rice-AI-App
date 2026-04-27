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

        // Configure ONNX Runtime
        ort.env.wasm.numThreads = 1 // Use single thread for better compatibility
        ort.env.wasm.simd = true // Enable SIMD for performance
        
        console.log('🔄 Loading crop config...')
        // 1. Fetch crop config dynamically
        const configRes = await fetch('/config/crops_config.json')
        if (!configRes.ok) throw new Error(`Failed to load crops_config.json: ${configRes.status}`)
        const config = await configRes.json()
        const crop = config.crops[cropId]
        if (!crop) throw new Error(`Crop "${cropId}" not configured`)

        console.log('📦 Loading metadata and disease data...')
        // 2. Fetch metadata & disease data
        const [metaRes, diseaseRes] = await Promise.all([
          fetch(`/models/${crop.current_metadata_file}`),
          fetch(`/data/${crop.diseases_data_file}`)
        ])
        
        if (!metaRes.ok) throw new Error(`Failed to load metadata: ${metaRes.status}`)
        if (!diseaseRes.ok) throw new Error(`Failed to load disease data: ${diseaseRes.status}`)
        
        const meta = await metaRes.json()
        const diseaseData = await diseaseRes.json()

        if (isMounted) {
          setClasses(meta.classes)
          setDiseases(diseaseData)
          setFallbackWarning({ bn: crop.fallback_warning_bn, en: crop.fallback_warning_en })
          setThreshold(meta.confidence_threshold)
        }

        console.log('🤖 Loading ONNX model:', `/models/${meta.model_filename}`)
        // 3. Initialize ONNX session with explicit options
        const sess = await ort.InferenceSession.create(`/models/${meta.model_filename}`, {
          executionProviders: ['wasm'], // Explicitly use WASM backend
          graphOptimizationLevel: 'all'
        })
        
        sessionRef.current = sess
        console.log('✅ Model loaded successfully!')
        if (isMounted) setIsLoading(false)
      } catch (err) {
        console.error('❌ Classifier init failed:', err)
        if (isMounted) {
          setError(`Failed to load AI model: ${err.message}`)
        }
      }
    }

    loadModel()
    return () => {
      isMounted = false
      if (sessionRef.current) {
        sessionRef.current.release()
        console.log('🗑️ Model released')
      }
    }
  }, [cropId])

  // Preprocess + Inference
  const classify = useCallback(async (imgElement) => {
    if (!sessionRef.current || !classes) {
      console.error('Model not ready for classification')
      return null
    }

    try {
      // Canvas resize to 224x224
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 224
      const ctx = canvas.getContext('2d')
      ctx.drawImage(imgElement, 0, 0, 224, 224)
      
// Extract pixels [0,255] → NHWC (NO DIVISION)
const { data } = ctx.getImageData(0, 0, 224, 224)
const tensorData = new Float32Array(224 * 224 * 3)
let idx = 0
for (let i = 0; i < data.length; i += 4) {
  tensorData[idx++] = data[i]                // ✅ Raw R (0-255)
  tensorData[idx++] = data[i+1]              // ✅ Raw G (0-255)
  tensorData[idx++] = data[i+2]              // ✅ Raw B (0-255)
  // Skip alpha: data[i+3]
}

      const inputTensor = new ort.Tensor('float32', tensorData, [1, 224, 224, 3])
      const feeds = { [sessionRef.current.inputNames[0]]: inputTensor }
      
      console.log('🔍 Running inference...')
      const results = await sessionRef.current.run(feeds)
      
      // Find max probability
      const probs = Array.from(results[sessionRef.current.outputNames[0]].data)
      let maxIdx = 0, maxConf = probs[0]
      for (let i = 1; i < probs.length; i++) {
        if (probs[i] > maxConf) { maxConf = probs[i]; maxIdx = i }
      }

      const predicted = classes[String(maxIdx)]
      console.log(`✅ Prediction: ${predicted} (${(maxConf * 100).toFixed(1)}%)`)
      
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