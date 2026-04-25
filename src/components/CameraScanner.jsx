import { useRef, useState, useEffect } from 'react'

export default function CameraScanner({ onCapture, onBack, lang, toggleLang, scanning }) {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const [cameraOn, setCameraOn] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let stream = null
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1080 }, height: { ideal: 1920 } }
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setCameraOn(true)
          setError('')
        }
      } catch (err) {
        setError(lang === 'bn' ? '⚠️ ক্যামেরা অনুমতি দিন' : '⚠️ Enable camera permission')
        setCameraOn(false)
      }
    }

    startCamera()
    return () => { stream?.getTracks().forEach(t => t.stop()) }
  }, [lang])

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current && cameraOn) {
      const ctx = canvasRef.current.getContext('2d')
      ctx.drawImage(videoRef.current, 0, 0, 224, 224)
      onCapture(canvasRef.current)
    }
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const img = new Image()
    img.onload = () => {
      if (!canvasRef.current) return
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, 224, 224)
      onCapture(canvas)
    }
    img.src = URL.createObjectURL(file)
  }

  return (
    <div className="fixed inset-0 z-20 bg-black flex flex-col animate-fade-in-up">
      {/* Live Camera Background */}
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black/30 pointer-events-none"></div>
      
      {/* Vignette Overlay Focus Guide */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.85) 100%)' }}></div>

      <canvas ref={canvasRef} className="hidden" width="224" height="224" />

      {/* Top Header Bar */}
      <div className="relative z-30 flex items-center justify-between p-4 pt-6">
        <button onClick={onBack} className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md border border-white/10 hover:bg-black/60 transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold text-white tracking-wide" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {lang === 'bn' ? 'ধান চিকিৎসা' : 'Rice AI Doctor'}
        </h2>
        <div className="flex bg-black/40 backdrop-blur-md rounded-full p-0.5 border border-white/10">
          <button onClick={toggleLang} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${lang === 'bn' ? 'bg-emerald-500 text-white' : 'text-emerald-100 hover:text-white'}`}>বাং</button>
          <button onClick={toggleLang} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${lang === 'en' ? 'bg-emerald-500 text-white' : 'text-emerald-100 hover:text-white'}`}>EN</button>
        </div>
      </div>

      {error && (
        <div className="relative z-30 mx-4 mt-2 bg-amber-500/90 text-white text-sm p-3 rounded-xl backdrop-blur-md shadow-lg text-center font-medium">
          {error}
        </div>
      )}

      {/* Center Viewfinder */}
      <div className="flex-1 relative flex items-center justify-center pointer-events-none">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          {/* Animated Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-3xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-3xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-3xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-3xl shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          
          {/* Sweeping Scanning Line */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <div className="w-full h-[2px] bg-emerald-400 shadow-[0_0_15px_4px_rgba(16,185,129,0.8)] animate-sweep"></div>
          </div>
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="relative z-30 mt-auto glass-card glass-card-highlight rounded-t-[2.5rem] p-6 pb-10 text-center animate-fade-in-up border-b-0 border-x-0" style={{ animationDelay: '0.1s' }}>
        <p className="text-emerald-100/80 text-sm mb-6 font-medium">
          {lang === 'bn' ? 'ফসলের পাতার ডিজিজ অংশটি ফ্রেমে আনুন' : 'Frame the affected part of the leaf'}
        </p>
        
        {scanning ? (
          <div className="flex flex-col items-center justify-center h-[120px]">
            {/* Minimal Spinner */}
            <div className="relative w-12 h-12 animate-spin">
               <div className="absolute top-0 left-1/2 w-3.5 h-3.5 bg-emerald-400 rounded-full -translate-x-1/2 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></div>
               <div className="absolute bottom-0 left-1/2 w-3.5 h-3.5 bg-emerald-600 rounded-full -translate-x-1/2 shadow-[0_0_10px_rgba(5,150,105,0.8)]"></div>
               <div className="absolute top-1/2 left-0 w-3.5 h-3.5 bg-emerald-300 rounded-full -translate-y-1/2 shadow-[0_0_10px_rgba(110,231,183,0.8)]"></div>
            </div>
            <p className="mt-5 text-emerald-400 font-bold tracking-widest text-sm uppercase">
              {lang === 'bn' ? 'বিশ্লেষণ চলছে...' : 'Analyzing...'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 h-[120px] justify-center">
            {/* Large Primary Capture Button */}
            <button 
              onClick={handleCapture}
              disabled={!cameraOn}
              className="relative w-20 h-20 rounded-full border-[5px] border-white/90 flex items-center justify-center disabled:opacity-50 active:scale-95 transition-transform group shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            >
              <div className="w-[60px] h-[60px] bg-emerald-500 rounded-full group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(16,185,129,0.6)] animate-pulse-opacity"></div>
            </button>
            
            {/* File Upload Button */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-emerald-200/80 hover:text-white transition-colors text-sm py-2 px-5 rounded-full hover:bg-white/10 active:scale-95 border border-transparent hover:border-emerald-500/30"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              {lang === 'bn' ? 'গ্যালারি থেকে আপলোড করুন' : 'Upload from gallery'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}