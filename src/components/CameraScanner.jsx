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
      } catch {
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
    <div className="fixed inset-0 z-20 bg-slate-950 flex flex-col animate-fade-in-up">
      {/* Live Camera Background */}
      <video ref={videoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none"></div>
      
      {/* Vignette Overlay Focus Guide */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle, transparent 35%, rgba(0,0,0,0.7) 100%)' }}></div>

      <canvas ref={canvasRef} className="hidden" width="224" height="224" />

      {/* Top Header Bar - Modern Glassmorphism */}
      <div className="relative z-30 flex items-center justify-between p-4 pt-6">
        <button onClick={onBack} className="p-2.5 rounded-xl bg-white/10 backdrop-blur-xl text-white border border-white/20 hover:bg-white/20 transition-all active:scale-95 shadow-lg">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold text-white tracking-wide drop-shadow-lg">
          {lang === 'bn' ? 'ধান চিকিৎসা' : 'Rice AI Doctor'}
        </h2>
        <div className="flex bg-white/10 backdrop-blur-xl rounded-full p-0.5 border border-white/20 shadow-lg">
          <button onClick={toggleLang} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${lang === 'bn' ? 'bg-emerald-500 text-white shadow-md' : 'text-white/80 hover:text-white'}`}>বাং</button>
          <button onClick={toggleLang} className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${lang === 'en' ? 'bg-emerald-500 text-white shadow-md' : 'text-white/80 hover:text-white'}`}>EN</button>
        </div>
      </div>

      {error && (
        <div className="relative z-30 mx-4 mt-2 bg-amber-500 text-white text-sm p-3 rounded-xl backdrop-blur-md shadow-lg text-center font-medium">
          {error}
        </div>
      )}

      {/* Center Viewfinder - Modern Design */}
      <div className="flex-1 relative flex items-center justify-center pointer-events-none">
        <div className="relative w-64 h-64 sm:w-80 sm:h-80">
          {/* Animated Corner Brackets */}
          <div className="absolute top-0 left-0 w-10 h-10 border-t-[3px] border-l-[3px] border-emerald-400 rounded-tl-2xl shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>
          <div className="absolute top-0 right-0 w-10 h-10 border-t-[3px] border-r-[3px] border-emerald-400 rounded-tr-2xl shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>
          <div className="absolute bottom-0 left-0 w-10 h-10 border-b-[3px] border-l-[3px] border-emerald-400 rounded-bl-2xl shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>
          <div className="absolute bottom-0 right-0 w-10 h-10 border-b-[3px] border-r-[3px] border-emerald-400 rounded-br-2xl shadow-[0_0_20px_rgba(16,185,129,0.6)]"></div>
          
          {/* Sweeping Scanning Line with Glow */}
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <div className="w-full h-[3px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_rgba(16,185,129,1)] animate-sweep"></div>
          </div>
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: 'linear-gradient(rgba(16,185,129,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.3) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>
      </div>

      {/* Bottom Control Panel - Modern Card */}
      <div className="relative z-30 mt-auto bg-white/95 backdrop-blur-2xl rounded-t-[2rem] p-6 pb-10 text-center animate-fade-in-up border-t border-slate-200 shadow-2xl shadow-black/20" style={{ animationDelay: '0.1s' }}>
        <p className="text-slate-600 text-sm mb-6 font-medium">
          {lang === 'bn' ? 'ফসলের পাতার ডিজিজ অংশটি ফ্রেমে আনুন' : 'Frame the affected part of the leaf'}
        </p>
        
        {scanning ? (
          <div className="flex flex-col items-center justify-center h-[120px]">
            {/* Modern Spinner */}
            <div className="relative w-14 h-14">
               <div className="absolute inset-0 rounded-full border-4 border-slate-200"></div>
               <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin"></div>
            </div>
            <p className="mt-5 text-emerald-600 font-bold tracking-wide text-sm uppercase">
              {lang === 'bn' ? 'বিশ্লেষণ চলছে...' : 'Analyzing...'}
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5 h-[120px] justify-center">
            {/* Large Primary Capture Button - Modern Design */}
            <button 
              onClick={handleCapture}
              disabled={!cameraOn}
              className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center disabled:opacity-50 active:scale-95 transition-all group shadow-xl shadow-emerald-500/40 hover:shadow-2xl hover:shadow-emerald-500/50 hover:scale-105"
            >
              <div className="w-16 h-16 bg-white rounded-full group-hover:scale-95 transition-transform"></div>
            </button>
            
            {/* File Upload Button - Modern Outline Style */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 text-slate-600 hover:text-emerald-600 transition-colors text-sm py-2 px-6 rounded-full hover:bg-emerald-50 active:scale-95 border-2 border-slate-200 hover:border-emerald-300 font-medium"
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