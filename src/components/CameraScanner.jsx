import { useRef, useState, useEffect } from 'react'

export default function CameraScanner({ onCapture }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let stream = null
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: 320, height: 320 }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraOn(true)
          setError('')
        }
      // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError('⚠️ ক্যামেরা অনুমতি দিন / Enable camera permission')
        setCameraOn(false)
      }
    }

    if (cameraOn) startCamera()
    return () => { stream?.getTracks().forEach(t => t.stop()) }
  }, [cameraOn])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0, 224, 224)
      onCapture(canvasRef.current)
    }
  }

  return (
    <div className="relative w-full max-w-sm mx-auto bg-black rounded-xl overflow-hidden shadow-lg">
      <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />
      <canvas ref={canvasRef} className="hidden" width="224" height="224" />
      
      {/* Focus Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 border-2 border-dashed border-green-400 rounded-lg opacity-70"></div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 p-2 bg-black/50 backdrop-blur-sm">
        <button onClick={() => setCameraOn(!cameraOn)} className="px-3 py-1 bg-green-600 text-white rounded-full text-sm">
          {cameraOn ? '⏹️ বন্ধ করুন' : '📷 চালু করুন'}
        </button>
        <button onClick={handleCapture} disabled={!cameraOn} className="px-3 py-1 bg-white text-green-800 rounded-full text-sm disabled:opacity-50">
          📸 স্ক্যান করুন
        </button>
      </div>

      {error && <p className="absolute top-2 left-2 right-2 text-xs text-yellow-300 bg-black/70 p-1 rounded">{error}</p>}
      
      <p className="text-center text-xs text-gray-400 mt-2">
        পাতাটি ফ্রেমের ভেতরে আনুন / Move the leaf into the frame
      </p>
    </div>
  )
}