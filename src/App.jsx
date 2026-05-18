import { useState } from 'react'
import CropSelector from './components/CropSelector'
import CameraScanner from './components/CameraScanner'
import ResultDisplay from './components/ResultDisplay'
import useClassifier from './hooks/useClassifier'
import DocsPage from './pages/DocsPage'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

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
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 text-slate-900 flex flex-col font-sans relative overflow-hidden">
            
            {/* Modern Gradient Mesh Background */}
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-emerald-200/40 to-teal-200/40 rounded-full blur-3xl animate-blob pointer-events-none"></div>
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-tr from-green-200/30 to-emerald-100/30 rounded-full blur-3xl animate-blob-slow pointer-events-none"></div>
            <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-gradient-to-r from-lime-200/20 to-emerald-200/20 rounded-full blur-3xl animate-blob pointer-events-none" style={{ animationDelay: '2s' }}></div>

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
        } />
        <Route path="/docs/*" element={<DocsPage />} />
      </Routes>
    </Router>
  )
}