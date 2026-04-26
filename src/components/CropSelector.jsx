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
      {/* Language Toggle - Modern Segmented Control */}
      <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-xl rounded-full p-1.5 border border-slate-200 shadow-lg shadow-slate-200/50">
        <button 
          onClick={toggleLang}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${lang === 'bn' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30' : 'text-slate-600 hover:text-slate-900'}`}
        >
          🇧🇩 বাং
        </button>
        <button 
          onClick={toggleLang}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${lang === 'en' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/30' : 'text-slate-600 hover:text-slate-900'}`}
        >
          🇬🇧 EN
        </button>
      </div>

      {/* Main Card with Modern Design */}
      <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 w-full max-w-md flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 border border-slate-100 shadow-xl shadow-slate-200/50">
        
        {/* Logo & Title */}
        <div className="mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl shadow-lg shadow-emerald-500/30 rotate-3 hover:rotate-6 transition-transform duration-300">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
            ধান চিকিৎসা
          </h1>
          <p className="text-slate-500 font-medium text-lg">Rice AI Doctor</p>
        </div>

        {/* Modern Styled Dropdown */}
        <div className="w-full mb-8 text-left">
          <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
            {lang === 'bn' ? 'শস্য নির্বাচন করুন' : 'Select Crop'}
          </label>
          <div className="relative group">
            <select
              value={currentCrop}
              onChange={(e) => onCropChange(e.target.value)}
              className="w-full appearance-none bg-slate-50 border-2 border-slate-200 text-slate-900 rounded-2xl px-4 py-4 focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all cursor-pointer group-hover:border-emerald-300 font-medium"
            >
              {crops.map(crop => (
                <option key={crop} value={crop} disabled={crop !== 'rice'} className="bg-white text-slate-900">
                  {crop === 'rice' ? (lang === 'bn' ? 'ধান (Rice)' : 'Rice (ধান)') : 'Coming Soon...'}
                </option>
              ))}
            </select>
            {/* Custom CSS Chevron */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform group-hover:translate-y-[2px]">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {error && <div className="text-amber-600 text-sm mb-4 bg-amber-50 border border-amber-200 py-3 px-4 rounded-xl w-full font-medium">{error}</div>}

        {/* Start Scanning CTA - Modern Gradient Button */}
        <button
          onClick={onStart}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all duration-300 active:scale-95 hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 bg-[length:200%_auto] animate-gradient-x"
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

        {/* Offline Indicator - Modern Badge */}
        <div className="mt-8 inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-2 rounded-full">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"></path>
          </svg>
          <span>{lang === 'bn' ? '১০০% অফলাইন • ইন্টারনেট লাগবে না' : '100% Offline • No internet required'}</span>
        </div>

      </div>
    </div>
  )
}