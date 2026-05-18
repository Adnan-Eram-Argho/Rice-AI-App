import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Clock, Zap } from 'lucide-react'

export default function Roadmap() {
  const roadmap = [
    {
      period: 'Q2 2026 (Current)',
      status: 'current',
      items: [
        'V4.2 production deployment with INT8 quantization',
        'PWA offline support with Service Worker caching',
        'Bilingual interface (Bangla/English)',
        '94% accuracy on 5-class detection',
        'Configuration-driven architecture'
      ]
    },
    {
      period: 'Q3-Q4 2026',
      status: 'upcoming',
      items: [
        'V5: Add wheat and maize crop support',
        'Cloud verification via Groq API (optional)',
        'Offline sync with Supabase',
        'User feedback loop for misclassifications',
        'Scan history and tracking'
      ]
    },
    {
      period: '2027',
      status: 'planned',
      items: [
        'Expand to 10+ crops (potato, tomato, corn)',
        'Multi-language support (Hindi, Vietnamese, Tagalog)',
        'Voice guidance for illiterate farmers',
        'Disease outbreak heatmaps',
        'Partnership with DAE (Department of Agricultural Extension)'
      ]
    },
    {
      period: '2028+',
      status: 'future',
      items: [
        'Regional expansion across Southeast Asia',
        'WebGPU acceleration for faster inference',
        'AI-powered treatment recommendation engine',
        'Integration with agrochemical supply chains',
        'Certification programs for agriculture officers'
      ]
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'current':
        return <CheckCircle className="w-6 h-6 text-emerald-600" />
      case 'upcoming':
        return <Clock className="w-6 h-6 text-amber-600" />
      case 'planned':
        return <Calendar className="w-6 h-6 text-blue-600" />
      case 'future':
        return <Zap className="w-6 h-6 text-purple-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'current':
        return 'border-emerald-500 bg-emerald-50'
      case 'upcoming':
        return 'border-amber-500 bg-amber-50'
      case 'planned':
        return 'border-blue-500 bg-blue-50'
      case 'future':
        return 'border-purple-500 bg-purple-50'
      default:
        return 'border-slate-300 bg-slate-50'
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Product Roadmap</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Strategic development timeline from current release to long-term vision
        </p>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-purple-500 hidden md:block"></div>

        <div className="space-y-8">
          {roadmap.map((phase, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Timeline Dot */}
              <div className={`
                absolute left-8 transform -translate-x-1/2 
                w-4 h-4 rounded-full border-4 ${getStatusColor(phase.status)}
                hidden md:block
              `}></div>

              {/* Content Card */}
              <div className={`
                ml-0 md:ml-16 p-6 rounded-2xl border-l-4 ${getStatusColor(phase.status)}
                bg-white shadow-lg
              `}>
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon(phase.status)}
                  <h3 className="text-xl font-bold text-slate-900">{phase.period}</h3>
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${phase.status === 'current' ? 'bg-emerald-100 text-emerald-800' : ''}
                    ${phase.status === 'upcoming' ? 'bg-amber-100 text-amber-800' : ''}
                    ${phase.status === 'planned' ? 'bg-blue-100 text-blue-800' : ''}
                    ${phase.status === 'future' ? 'bg-purple-100 text-purple-800' : ''}
                  `}>
                    {phase.status.toUpperCase()}
                  </span>
                </div>

                <ul className="space-y-2">
                  {phase.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-slate-700">
                      <span className="text-emerald-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
