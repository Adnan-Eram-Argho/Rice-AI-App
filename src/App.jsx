import { useState } from 'react'
import CropSelector from './components/CropSelector'
import CameraScanner from './components/CameraScanner'
import ResultDisplay from './components/ResultDisplay'
import useClassifier from './hooks/useClassifier'

export default function App() {
  const [crop, setCrop] = useState('rice')
  const [lang, setLang] = useState('bn') // 'bn' or 'en'
  const [imageSrc, setImageSrc] = useState(null)
  const [result, setResult] = useState(null)
  const [scanning, setScanning] = useState(false)
  
  const [currentScreen, setCurrentScreen] = useState('crop') // 'crop', 'scanner', 'result'

  const { isLoading, error, classify, fallbackWarning } = useClassifier(crop)

  const handleCapture = async (canvas) => {
    if (scanning) return
    setScanning(true)
    setImageSrc(canvas.toDataURL('image/jpeg'))
    setResult(null)

    try {
      // Create temporary img element for ONNX preprocessing
      const img = new Image()
      img.src = canvas.toDataURL('image/jpeg')
      await new Promise(res => img.onload = res)
      
      const res = await classify(img)
      setResult({ ...res, fallbackWarning })
      setCurrentScreen('result')
    } catch (err) {
      console.error('Inference failed:', err)
    } finally {
      setScanning(false)
    }
  }

  // Navigation handlers
  const goBackToCrop = () => setCurrentScreen('crop')
  const goBackToScanner = () => {
    setImageSrc(null)
    setResult(null)
    setCurrentScreen('scanner')
  }

  // Language toggle shared across screens
  const toggleLang = () => setLang(l => l === 'bn' ? 'en' : 'bn')

  return (
    <div className="min-h-screen bg-[#0a1a0f] text-[#f0fdf4] flex flex-col font-sans relative overflow-hidden">
      
      {/* Global Background Gradient Mesh (Blobs) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/20 rounded-full blur-[100px] animate-blob pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-800/10 rounded-full blur-[120px] animate-blob-slow pointer-events-none"></div>

      {currentScreen === 'crop' && (
        <CropSelector 
          currentCrop={crop} 
          onCropChange={setCrop} 
          onStart={() => setCurrentScreen('scanner')}
          lang={lang}
          toggleLang={toggleLang}
          isLoading={isLoading}
          error={error}
        />
      )}

      {currentScreen === 'scanner' && (
        <CameraScanner 
          onCapture={handleCapture} 
          onBack={goBackToCrop}
          lang={lang}
          toggleLang={toggleLang}
          scanning={scanning}
        />
      )}

      {currentScreen === 'result' && (
        <ResultDisplay 
          result={result} 
          lang={lang} 
          onBack={goBackToScanner}
          imageSrc={imageSrc}
        />
      )}
    </div>
  )
}