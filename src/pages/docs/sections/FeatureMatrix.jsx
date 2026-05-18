import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Clock, Zap } from 'lucide-react'

export default function FeatureMatrix() {
  const features = [
    {
      category: "Core Features",
      items: [
        { name: "Offline AI Inference", status: "live", description: "100% offline disease detection using ONNX Runtime Web" },
        { name: "Bilingual Interface", status: "live", description: "Full Bengali and English support" },
        { name: "Camera Scanner", status: "live", description: "Real-time camera capture with quality assessment" },
        { name: "Image Quality Assessment", status: "live", description: "Smart center-region IQA prevents invalid inputs" },
        { name: "Test-Time Augmentation", status: "live", description: "4-variation weighted TTA for improved accuracy" },
        { name: "PWA Support", status: "live", description: "Installable app with offline caching" },
      ]
    },
    {
      category: "AI & Model Features",
      items: [
        { name: "EfficientNet-B0 Backbone", status: "live", description: "Optimized CNN architecture for mobile devices" },
        { name: "CBAM Attention Mechanism", status: "live", description: "Channel + spatial attention (94% accuracy)" },
        { name: "INT8 Quantization", status: "live", description: "3.2 MB model size for fast loading" },
        { name: "Background Class Detection", status: "live", description: "Prevents false positives on non-leaf images" },
        { name: "Focal Loss Training", status: "live", description: "Handles class imbalance effectively" },
        { name: "Multi-Crop Support", status: "planned", description: "Expand to wheat, maize, potato (V5+)" },
      ]
    },
    {
      category: "User Experience",
      items: [
        { name: "Low-End Device Optimization", status: "live", description: "Runs smoothly on 2GB RAM Android phones" },
        { name: "Fast Loading (<10s on 3G)", status: "live", description: "Optimized bundle and model caching" },
        { name: "Confidence Thresholding", status: "live", description: "75% threshold prevents uncertain predictions" },
        { name: "Treatment Recommendations", status: "live", description: "Localized treatment steps in Bangla/English" },
        { name: "Share Diagnosis", status: "live", description: "Web Share API integration" },
        { name: "History & Tracking", status: "upcoming", description: "Save and track past diagnoses (V5)" },
      ]
    },
    {
      category: "Advanced Features (Planned)",
      items: [
        { name: "Cloud Verification (Groq)", status: "planned", description: "Optional cloud-based AI verification when online" },
        { name: "Offline Sync (Supabase)", status: "planned", description: "Sync scan history when connectivity returns" },
        { name: "User Feedback Loop", status: "planned", description: "Flag incorrect predictions for retraining" },
        { name: "Disease Outbreak Mapping", status: "planned", description: "Anonymous aggregated data visualization" },
        { name: "Voice Guidance", status: "planned", description: "Audio instructions for illiterate farmers" },
        { name: "Multi-Language Expansion", status: "planned", description: "Hindi, Vietnamese, Tagalog support" },
      ]
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'live':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case 'upcoming':
        return <Clock className="w-5 h-5 text-amber-600" />
      case 'planned':
        return <Zap className="w-5 h-5 text-blue-600" />
      default:
        return <XCircle className="w-5 h-5 text-slate-400" />
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      live: 'bg-emerald-100 text-emerald-800',
      upcoming: 'bg-amber-100 text-amber-800',
      planned: 'bg-blue-100 text-blue-800'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.toUpperCase()}
      </span>
    )
  }

  return (
    <div className="space-y-10">
      <div className="text-center py-4">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Feature Matrix</h2>
        <p className="text-xl text-slate-800 max-w-3xl mx-auto leading-relaxed">
          Comprehensive overview of current capabilities and future roadmap
        </p>
      </div>

      {features.map((category, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden"
        >
          {/* Category Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-8 py-6 border-b-2 border-emerald-200">
            <h3 className="text-2xl font-bold text-slate-900">{category.category}</h3>
          </div>

          {/* Features List */}
          <div className="divide-y divide-slate-200">
            {category.items.map((feature, fIdx) => (
              <div key={fIdx} className="px-8 py-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(feature.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-bold text-slate-900">{feature.name}</h4>
                      {getStatusBadge(feature.status)}
                    </div>
                    <p className="text-base text-slate-800 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
