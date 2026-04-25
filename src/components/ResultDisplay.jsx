export default function ResultDisplay({ result, lang }) {
  if (!result) return null

  const isConfident = result.confident
  const t = lang === 'bn' ? 'bn' : 'en'

  if (isConfident && result.data) {
    return (
      <div className="mt-4 w-full max-w-sm mx-auto bg-white rounded-xl shadow-md p-4 border-l-4 border-green-500">
        <h3 className="text-lg font-bold text-green-800">
          ✅ {result.data[`name_${t}`]}
        </h3>
        <div className="mt-2 space-y-2 text-sm text-gray-700">
          <p><span className="font-semibold">লক্ষণ / Symptoms:</span> {result.data[`symptoms_${t}`]}</p>
          <p><span className="font-semibold">চিকিৎসা / Treatment:</span> {result.data[`treatment_${t}`]}</p>
          <p className="text-xs text-gray-500 mt-2">আস্থার স্তর / Confidence: {(result.confidence * 100).toFixed(1)}%</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 w-full max-w-sm mx-auto bg-yellow-50 rounded-xl shadow-md p-4 border-l-4 border-yellow-500">
      <h3 className="text-lg font-bold text-yellow-800">⚠️ অনিশ্চিত ফলাফল / Uncertain Result</h3>
      <p className="mt-2 text-sm text-gray-700">
        {lang === 'bn' ? result.fallbackWarning?.bn : result.fallbackWarning?.en}
      </p>
      <p className="text-xs text-gray-500 mt-2">Confidence: {(result.confidence * 100).toFixed(1)}% &lt; 75%</p>
    </div>
  )
}