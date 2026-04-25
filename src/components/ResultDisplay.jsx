export default function ResultDisplay({ result, lang, onBack, imageSrc }) {
  if (!result) return null

  const isConfident = result.confident
  const percentage = (result.confidence * 100).toFixed(0)

  // Determine dynamic styling based on AI confidence
  const theme = isConfident ? {
    cardBorder: 'border-emerald-500/30',
    cardShadow: 'shadow-[0_0_40px_rgba(16,185,129,0.15)]',
    heroAccent: 'text-emerald-400',
    barGradient: 'from-emerald-600 to-emerald-400',
    buttonSolid: 'bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)]',
    buttonOutline: 'border-emerald-500 text-emerald-400 hover:bg-emerald-500/10'
  } : {
    cardBorder: 'border-amber-500/40',
    cardShadow: 'shadow-[0_0_40px_rgba(245,158,11,0.2)]',
    heroAccent: 'text-amber-400',
    barGradient: 'from-amber-600 to-amber-400',
    buttonSolid: 'bg-amber-500 hover:bg-amber-400 text-amber-950 shadow-[0_0_20px_rgba(245,158,11,0.4)]',
    buttonOutline: 'border-amber-500 text-amber-400 hover:bg-amber-500/10'
  }

  // Safe split for list items
  const splitItems = (text) => text ? text.split(/[.।]/).map(s => s.trim()).filter(s => s.length > 0) : []

  return (
    <div className="absolute inset-0 z-20 flex flex-col bg-[#0a1a0f] overflow-y-auto animate-fade-in-up pb-28">
      
      {/* Dynamic Background Radial Glow */}
      <div className={`fixed top-1/4 left-1/2 -translate-x-1/2 w-[90vw] h-[90vw] rounded-full blur-[130px] pointer-events-none transition-colors duration-1000 ${isConfident ? 'bg-emerald-900/30' : 'bg-amber-900/20'}`}></div>

      {/* Top Header */}
      <div className="sticky top-0 z-30 flex items-center p-4 bg-[#0a1a0f]/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={onBack} className="p-2 mr-3 rounded-full hover:bg-white/10 transition-colors text-emerald-100">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <h2 className="text-xl font-bold text-white tracking-wide">
          {lang === 'bn' ? 'রোগ নির্ণয় প্রতিবেদন' : 'Diagnostic Report'}
        </h2>
      </div>

      <div className="p-4 flex flex-col gap-5 max-w-lg mx-auto w-full mt-2 relative z-10">
        
        {/* Main Hero Result Card */}
        <div className={`glass-card glass-card-highlight rounded-3xl p-6 border ${theme.cardBorder} ${theme.cardShadow} animate-scale-in relative overflow-hidden transition-all duration-500`}>
          
          {!isConfident && (
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-amber-500/30 via-amber-400/20 to-amber-500/30 border-b border-amber-500/40 p-2.5 text-center animate-pulse-opacity">
              <p className="text-amber-300 text-sm font-bold tracking-wide flex items-center justify-center gap-2">
                <span>⚠️</span> {lang === 'bn' ? 'নিশ্চিত নয় — কৃষি কর্মকর্তার পরামর্শ নিন' : 'Uncertain — Please consult an agriculture officer'}
              </p>
            </div>
          )}

          <div className={`flex flex-col items-center text-center ${!isConfident ? 'mt-8' : ''}`}>
            {result.data ? (
              <>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 leading-tight">
                  {lang === 'bn' ? result.data.name_bn : result.data.name_en}
                </h1>
                <h3 className="text-emerald-200/60 text-lg font-medium mb-6 tracking-wide">
                  {lang === 'bn' ? result.data.name_en : result.data.name_bn}
                </h3>
              </>
            ) : (
              <h1 className="text-3xl font-extrabold text-amber-400 mb-6 leading-tight">
                {lang === 'bn' ? 'অনিশ্চিত ফলাফল' : 'Uncertain Result'}
              </h1>
            )}

            <div className="flex items-baseline gap-1 mb-5">
              <span className={`text-[80px] leading-none font-black tracking-tighter ${theme.heroAccent}`} style={{ textShadow: `0 4px 25px ${isConfident ? 'rgba(16,185,129,0.4)' : 'rgba(245,158,11,0.4)'}` }}>
                {percentage}
              </span>
              <span className="text-4xl text-emerald-100/30 font-bold">%</span>
            </div>

            <div className="w-full bg-black/50 rounded-full h-3 mb-2 overflow-hidden border border-white/5 shadow-inner">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${theme.barGradient} animate-bar-fill relative`}
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-12 bg-white/30 blur-sm mix-blend-overlay"></div>
              </div>
            </div>
            <p className="text-xs text-emerald-100/50 uppercase tracking-[0.2em] font-bold mt-2">
              {lang === 'bn' ? 'আস্থার স্তর' : 'Confidence Level'}
            </p>
          </div>
        </div>

        {/* Info Sections */}
        {result.data ? (
          <div className="flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Symptoms Card */}
            <div className="glass-card rounded-[1.5rem] p-6 border-l-4 border-l-emerald-500 hover:-translate-y-1 transition-transform">
              <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {lang === 'bn' ? 'লক্ষণসমূহ' : 'Symptoms'}
              </h4>
              <ul className="space-y-3">
                {splitItems(lang === 'bn' ? result.data.symptoms_bn : result.data.symptoms_en).map((symptom, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-emerald-50/90 text-[15px] leading-relaxed">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2.5 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Treatment Card */}
            <div className="glass-card rounded-[1.5rem] p-6 hover:-translate-y-1 transition-transform">
              <h4 className="text-xl font-bold text-white mb-5 flex items-center gap-3">
                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {lang === 'bn' ? 'চিকিৎসা ও করণীয়' : 'Treatment Steps'}
              </h4>
              <div className="space-y-3">
                {splitItems(lang === 'bn' ? result.data.treatment_bn : result.data.treatment_en).map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm font-bold shrink-0 border border-emerald-500/30">
                      {lang === 'bn' ? ['১','২','৩','৪','৫','৬','৭','৮'][idx] || idx + 1 : idx + 1}
                    </div>
                    <p className="text-emerald-50/90 text-[15px] leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        ) : (
           <div className="glass-card rounded-2xl p-6 text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <p className="text-amber-200/90 text-[15px] leading-relaxed font-medium">
                {lang === 'bn' ? result.fallbackWarning?.bn : result.fallbackWarning?.en}
              </p>
           </div>
        )}
      </div>

      {/* Bottom Action Bar (Fixed) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pt-8 bg-gradient-to-t from-[#0a1a0f] via-[#0a1a0f]/95 to-transparent z-40">
        <div className="max-w-lg mx-auto flex gap-4">
          <button 
            onClick={onBack}
            className={`flex-1 py-4.5 rounded-2xl font-bold text-[15px] transition-all duration-300 active:scale-[0.97] hover:scale-[1.02] border-2 ${theme.buttonOutline} flex items-center justify-center gap-2`}
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
            className={`flex-1 py-4.5 rounded-2xl font-bold text-[15px] transition-all duration-300 active:scale-[0.97] hover:scale-[1.02] ${theme.buttonSolid} flex items-center justify-center gap-2`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            {lang === 'bn' ? 'রিপোর্ট শেয়ার' : 'Share Report'}
          </button>
        </div>
      </div>
    </div>
  )
}