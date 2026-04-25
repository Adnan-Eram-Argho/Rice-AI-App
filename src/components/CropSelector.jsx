import { useState, useEffect } from 'react'

export default function CropSelector({ onCropChange, currentCrop, onStart, lang, toggleLang, isLoading, error }) {
  const [crops, setCrops] = useState([])

  useEffect(() => {
    fetch('/config/crops_config.json')
      .then(res => res.json())
      .then(config => setCrops(Object.keys(config.crops)))
      .catch(() => setCrops(['rice'])) // Default fallback
  }, [])

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10 animate-fade-in-up">
      {/* Language Toggle - Absolute Top Right */}
      <div className="absolute top-6 right-6 flex bg-[#0a1a0f]/80 backdrop-blur-md rounded-full p-1 border border-emerald-500/20 shadow-lg">
        <button 
          onClick={toggleLang}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${lang === 'bn' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-emerald-100/70 hover:text-white'}`}
        >
          🇧🇩 বাং
        </button>
        <button 
          onClick={toggleLang}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${lang === 'en' ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'text-emerald-100/70 hover:text-white'}`}
        >
          🇬🇧 EN
        </button>
      </div>

      {/* Main Glassmorphism Card */}
      <div className="glass-card glass-card-highlight rounded-3xl p-8 w-full max-w-md flex flex-col items-center text-center transition-all duration-300 hover:border-emerald-400/40 hover:-translate-y-1">
        
        {/* Logo & Title */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight" style={{ textShadow: '0 0 25px rgba(16, 185, 129, 0.4)' }}>
            ধান চিকিৎসা
          </h1>
          <p className="text-emerald-300/80 font-medium tracking-wide text-lg">Rice AI Doctor</p>
        </div>

        {/* Custom Styled Dropdown */}
        <div className="w-full mb-8 text-left">
          <label className="block text-sm font-medium text-emerald-200/70 mb-2 ml-1">
            {lang === 'bn' ? 'শস্য নির্বাচন করুন' : 'Select Crop'}
          </label>
          <div className="relative group">
            <select
              value={currentCrop}
              onChange={(e) => onCropChange(e.target.value)}
              className="w-full appearance-none bg-[#0a1a0f]/60 border border-emerald-500/30 text-white rounded-xl px-4 py-4 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 transition-colors cursor-pointer group-hover:border-emerald-400/60"
            >
              {crops.map(crop => (
                <option key={crop} value={crop} disabled={crop !== 'rice'} className="bg-[#0a1a0f] text-white">
                  {crop === 'rice' ? (lang === 'bn' ? 'ধান (Rice)' : 'Rice (ধান)') : 'Coming Soon...'}
                </option>
              ))}
            </select>
            {/* Custom CSS Chevron */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[2px]">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {error && <div className="text-amber-500 text-sm mb-4 bg-amber-500/10 py-2 px-4 rounded-lg w-full">{error}</div>}

        {/* Start Scanning CTA */}
        <button
          onClick={onStart}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 text-white font-bold text-lg py-4 rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all duration-300 active:scale-95 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
             <span className="flex items-center gap-2">
               <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
               </svg>
               {lang === 'bn' ? 'মডেল লোড হচ্ছে...' : 'Loading model...'}
             </span>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              {lang === 'bn' ? 'স্ক্যান শুরু করুন' : 'Start Scanning'}
            </>
          )}
        </button>

        {/* Offline Indicator text at bottom */}
        <div className="mt-8 flex items-center gap-2 text-emerald-200/50 text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"></path>
          </svg>
          <span>{lang === 'bn' ? '১০০% অফলাইন • ইন্টারনেট লাগবে না' : '100% Offline • No internet required'}</span>
        </div>

      </div>
    </div>
  )
}