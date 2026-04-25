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
    } catch (err) {
      console.error('Inference failed:', err)
    } finally {
      setScanning(false)
    }
  }

  return (
    <div className="min-h-screen bg-green-50 text-gray-800 flex flex-col">
      {/* Header */}
      <header className="bg-green-700 text-white p-4 shadow-md flex justify-between items-center">
        <h1 className="text-lg font-bold">🌾 ধান চিকিৎসা | Rice AI</h1>
        <button onClick={() => setLang(l => l === 'bn' ? 'en' : 'bn')} className="bg-white/20 px-2 py-1 rounded text-sm hover:bg-white/30">
          {lang === 'bn' ? '🇬🇧 EN' : '🇧🇩 বাংলা'}
        </button>
      </header>

      <main className="flex-1 p-4 flex flex-col items-center gap-4">
        <CropSelector currentCrop={crop} onCropChange={setCrop} />

        {isLoading ? (
          <div className="text-center mt-10">🤖 AI মডেল লোড হচ্ছে... / Loading model...</div>
        ) : error ? (
          <div className="text-center mt-10 text-red-600">❌ {error}</div>
        ) : (
          <>
            <CameraScanner onCapture={handleCapture} />
            {imageSrc && <img src={imageSrc} alt="Captured" className="w-32 h-32 object-cover rounded-lg border mt-2" />}
            
            <ResultDisplay result={result} lang={lang} />
            
            {scanning && (
              <div className="mt-2 text-green-700 font-medium animate-pulse">🔍 বিশ্লেষণ চলছে... / Analyzing...</div>
            )}
          </>
        )}
      </main>

      <footer className="p-3 text-center text-xs text-gray-500 bg-white border-t">
        100% অফলাইন কাজ করে | Works 100% offline after first load
      </footer>
    </div>
  )
}