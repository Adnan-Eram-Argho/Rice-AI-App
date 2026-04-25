import { useState, useEffect } from 'react'

export default function CropSelector({ onCropChange, currentCrop }) {
  const [crops, setCrops] = useState([])

  useEffect(() => {
    fetch('/config/crops_config.json')
      .then(res => res.json())
      .then(config => setCrops(Object.keys(config.crops)))
  }, [])

  return (
    <div className="w-full max-w-xs mx-auto mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        🌾 শস্য নির্বাচন / Select Crop:
      </label>
      <select
        value={currentCrop}
        onChange={(e) => onCropChange(e.target.value)}
        className="w-full p-2 border border-green-300 rounded-lg bg-white focus:ring-2 focus:ring-green-500"
        // V1: Locked to rice, but structure allows future crops
      >
        {crops.map(crop => (
          <option key={crop} value={crop} disabled={crop !== 'rice'}>
            {crop === 'rice' ? 'ধান (Rice)' : 'Coming Soon...'}
          </option>
        ))}
      </select>
    </div>
  )
}