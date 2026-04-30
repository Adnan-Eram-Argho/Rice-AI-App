export default function ResultDisplay({ result, lang, onBack }) {
  if (!result) return null

  const isConfident = result.confident
  const percentage = (result.confidence * 100).toFixed(0)
  const isBackground = result.class === 'Background'
  
  // 🌟 CHANGE: Handle Invalid/Blurry Images
  const isInvalidImage = result.class === 'InvalidImage'

  // If image is invalid (Blurry, Dark, No leaf) -> Show this specific screen
  if (isInvalidImage) {
    return (
      <div className="absolute inset-0 z-20 flex flex-col bg-gradient-to-br from-slate-50 via-white to-red-50/20 animate-fade-in-up overflow-hidden">
        <div className="sticky top-0 z-30 flex items-center p-4 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <button onClick={onBack} className="p-2 mr-3 rounded-xl hover:bg-slate-100 text-slate-700 active:scale-95">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </button>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {lang === 'bn' ? 'ছবির সমস্যা' : 'Image Issue'}
          </h2>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6 animate-bounce">
            <span className="text-5xl">📷</span>
          </div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            {lang === 'bn' ? 'ছবি পরিষ্কার নয়!' : 'Unclear Image!'}
          </h1>
          <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-sm">
            {result.qualityError?.bn || result.qualityError?.en}
          </p>
          
          <button 
            onClick={onBack}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/30 active:scale-95 transition-transform flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
            {lang === 'bn' ? 'আবার ছবি তুলুন' : 'Take Photo Again'}
          </button>
        </div>
      </div>
    )
  }

  // Determine dynamic styling based on AI confidence OR Background class
  const theme = isBackground ? {
    cardBorder: 'border-slate-200',
    cardShadow: 'shadow-xl shadow-slate-500/10',
    heroAccent: 'text-slate-600',
    barGradient: 'from-slate-400 to-slate-500',
    buttonSolid: 'bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white shadow-lg shadow-slate-500/30',
    buttonOutline: 'border-2 border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
  } : isConfident ? {
    cardBorder: 'border-emerald-200',
    cardShadow: 'shadow-xl shadow-emerald-500/10',
    heroAccent: 'text-emerald-600',
    barGradient: 'from-emerald-500 to-teal-500',
    buttonSolid: 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30',
    buttonOutline: 'border-2 border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50'
  } : {
    cardBorder: 'border-amber-200',
    cardShadow: 'shadow-xl shadow-amber-500/10',
    heroAccent: 'text-amber-600',
    barGradient: 'from-amber-500 to-orange-500',
    buttonSolid: 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/30',
    buttonOutline: 'border-2 border-slate-200 text-slate-700 hover:border-amber-300 hover:bg-amber-50'
  }

  // Safe split for list items
  const splitItems = (text) => text ? text.split(/[.।]/).map(s => s.trim()).filter(s => s.length > 0) : []

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-gradient-to-br from-slate-50 via-white to-emerald-50/20 animate-fade-in-up overflow-hidden">
      
      {/* Dynamic Background Radial Glow */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[90vw] h-[90vw] rounded-full blur-[130px] pointer-events-none transition-colors duration-1000 ${isBackground ? 'bg-slate-200/30' : isConfident ? 'bg-emerald-200/30' : 'bg-amber-200/20'}`}></div>

      <div className="flex-1 overflow-y-auto pb-28 relative z-10 w-full">

      {/* Top Header */}
      <div className="sticky top-0 z-30 flex items-center p-4 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <button onClick={onBack} className="p-2 mr-3 rounded-xl hover:bg-slate-100 transition-colors text-slate-700 active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {lang === 'bn' ? 'রোগ নির্ণয় প্রতিবেদন' : 'Diagnostic Report'}
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-5 max-w-lg mx-auto w-full mt-2 relative z-10">
        
        {/* Main Hero Result Card */}
        <div className={`bg-white rounded-3xl p-6 border ${theme.cardBorder} ${theme.cardShadow} animate-scale-in relative overflow-hidden transition-all duration-500`}>
          
          {/* Warning Banners */}
          {isBackground && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-slate-500/20 via-slate-400/15 to-slate-500/20 border-b border-slate-200 p-3 text-center">
              <p className="text-slate-700 text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
                <span className="text-lg">🚫</span> {lang === 'bn' ? 'ধানের পাতা শনাক্ত হয়নি' : 'No Rice Leaf Detected'}
              </p>
            </div>
          )}

          {!isConfident && !isBackground && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500/20 via-amber-400/15 to-amber-500/20 border-b border-amber-200 p-3 text-center">
              <p className="text-amber-700 text-sm font-semibold tracking-wide flex items-center justify-center gap-2">
                <span className="text-lg">⚠️</span> {lang === 'bn' ? 'নিশ্চিত নয় — কৃষি কর্মকর্তার পরামর্শ নিন' : 'Uncertain — Please consult an agriculture officer'}
              </p>
            </div>
          )}

          <div className={`flex flex-col items-center text-center ${(isBackground || !isConfident) ? 'mt-8' : ''}`}>
            {isBackground ? (
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 mb-2 leading-tight">
                {lang === 'bn' ? 'ধানের পাতা নয়' : 'Not a Rice Leaf'}
              </h1>
            ) : result.data ? (
              <>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 leading-tight">
                  {lang === 'bn' ? result.data.name_bn : result.data.name_en}
                </h1>
                <h3 className="text-slate-500 text-base font-medium mb-6">
                  {lang === 'bn' ? result.data.name_en : result.data.name_bn}
                </h3>
              </>
            ) : (
              <h1 className="text-3xl font-black text-amber-600 mb-6 leading-tight">
                {lang === 'bn' ? 'অনিশ্চিত ফলাফল' : 'Uncertain Result'}
              </h1>
            )}

            <div className="flex items-baseline gap-1 mb-5">
              <span className={`text-[72px] leading-none font-black tracking-tighter ${theme.heroAccent}`} style={{ textShadow: `0 2px 20px ${isBackground ? 'rgba(100,116,139,0.2)' : isConfident ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}` }}>
                {percentage}
              </span>
              <span className="text-3xl text-slate-400 font-bold">%</span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-4 mb-2 overflow-hidden border border-slate-200">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${theme.barGradient} animate-bar-fill relative`}
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-16 bg-white/30 blur-md mix-blend-overlay"></div>
              </div>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-[0.15em] font-bold mt-3">
              {isBackground 
                ? (lang === 'bn' ? 'পাতা না হওয়ার সম্ভাবনা' : 'Non-leaf Probability') 
                : (lang === 'bn' ? 'আস্থার স্তর' : 'Confidence Level')}
            </p>
          </div>
        </div>

        {/* Info Sections - Show only if it's a disease/healthy AND NOT Background */}
        {!isBackground && result.data ? (
          <div className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Symptoms Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all">
              <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                {lang === 'bn' ? 'লক্ষণসমূহ' : 'Symptoms'}
              </h4>
              <ul className="space-y-3">
                {splitItems(lang === 'bn' ? result.data.symptoms_bn : result.data.symptoms_en).map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-700 text-[15px] leading-relaxed">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 shrink-0"></div>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:-translate-y-1 transition-all">
              <h4 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                {lang === 'bn' ? 'চিকিৎসা ও করণীয়' : 'Treatment Steps'}
              </h4>
              <div className="space-y-3">
                {splitItems(lang === 'bn' ? result.data.treatment_bn : result.data.treatment_en).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md shadow-emerald-500/30">
                      {lang === 'bn' ? ['১','২','৩','৪','৫','৬','৭','৮'][idx] || idx + 1 : idx + 1}
                    </div>
                    <p className="text-slate-700 text-[15px] leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        ) : isBackground ? (
           <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-lg text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-slate-600 text-[15px] leading-relaxed font-medium">
                {lang === 'bn' ? 'অনুগ্রহ করে স্পষ্ট ধানের পাতার ছবি ক্যামেরার ফ্রেমের মধ্যে রেখে আবার স্ক্যান করুন।' : 'Please scan again keeping a clear rice leaf inside the camera frame.'}
              </p>
           </div>
        ) : (
           <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-lg text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-amber-700 text-[15px] leading-relaxed font-medium">
                {lang === 'bn' ? result.fallbackWarning?.bn : result.fallbackWarning?.en}
              </p>
           </div>
        )}
      </div>

      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-4 pt-12 bg-gradient-to-t from-white via-white/95 to-transparent z-40 pointer-events-none">
        <div className="max-w-lg mx-auto flex gap-4 pointer-events-auto">
          <button 
            onClick={onBack}
            className={`flex-1 py-4 rounded-2xl font-bold text-[15px] transition-all duration-300 active:scale-[0.97] hover:scale-[1.02] ${theme.buttonOutline} flex items-center justify-center gap-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /></svg>
            {lang === 'bn' ? 'আবার স্ক্যান করুন' : 'Scan Again'}
          </button>
          
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: lang === 'bn' ? 'ধান চিকিৎসা রিপোর্ট' : 'Rice AI Doctor Report',
                  text: result.data ? `${lang === 'bn' ? result.data.name_bn : result.data.name_en} (${percentage}%)` : 'Uncertain Result'
                }).catch(console.error)
              } else {
                alert(lang === 'bn' ? 'আপনার ব্রাউজার শেয়ারিং সমর্থন করে না।' : 'Your browser does not support sharing.')
              }
            }}
            className={`flex-1 py-4 rounded-2xl font-bold text-[15px] transition-all duration-300 active:scale-[0.97] hover:scale-[1.02] ${theme.buttonSolid} flex items-center justify-center gap-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            {lang === 'bn' ? 'রিপোর্ট শেয়ার' : 'Share Report'}
          </button>
        </div>
      </div>
    </div>
  )
}