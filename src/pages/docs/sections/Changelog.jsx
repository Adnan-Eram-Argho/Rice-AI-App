import { motion } from 'framer-motion'
import { GitCommit, Tag } from 'lucide-react'

export default function Changelog() {
  const versions = [
    {
      version: 'V4.2',
      date: '2026-05-11',
      type: 'current',
      changes: [
        'EfficientNet-B0 + CBAM attention mechanism (94.06% accuracy)',
        'Static INT8 quantization (3.2 MB model size)',
        'Center-region Image Quality Assessment (IQA)',
        'Per-channel contrast stretching preprocessing',
        '4-variation weighted Test-Time Augmentation (TTA)',
        'Background class for OOD detection',
        'Focal Loss with tuned alpha weights',
        'Two-phase training strategy',
        'Configuration-driven architecture (zero hardcoding)',
        'PWA support with offline caching'
      ]
    },
    {
      version: 'V3',
      date: '2026-04-15',
      type: 'deprecated',
      changes: [
        'EfficientNet-B0 + SE block attention (90.875% accuracy)',
        'Introduced Focal Loss for class imbalance',
        'Added Background class from Intel Dataset',
        'FP32 ONNX export (~17 MB)',
        'Basic image quality checks'
      ]
    },
    {
      version: 'V2',
      date: '2026-03-20',
      type: 'deprecated',
      changes: [
        'Upgraded from MobileNetV2 to EfficientNet-B0',
        'Added class weights to cross-entropy loss',
        'Improved dataset balance',
        '~90% test accuracy'
      ]
    },
    {
      version: 'V1',
      date: '2026-02-10',
      type: 'deprecated',
      changes: [
        'Initial prototype with MobileNetV2',
        '4-class detection (no Background class)',
        'Standard categorical cross-entropy loss',
        '~87% accuracy with frequent false positives',
        'No attention mechanism'
      ]
    }
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">Changelog</h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Version history and evolution of Rice AI Doctor
        </p>
      </div>

      <div className="space-y-6">
        {versions.map((version, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`
              bg-white rounded-2xl shadow-lg border-2 p-6
              ${version.type === 'current' ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-white' : 'border-slate-200'}
            `}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${version.type === 'current' ? 'bg-emerald-600' : 'bg-slate-600'}
                `}>
                  <Tag className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-bold text-slate-900">{version.version}</h3>
                    {version.type === 'current' && (
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium">
                        CURRENT
                      </span>
                    )}
                    {version.type === 'deprecated' && (
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-medium">
                        DEPRECATED
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-600">{version.date}</p>
                </div>
              </div>
            </div>

            <ul className="space-y-2">
              {version.changes.map((change, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <GitCommit className="w-4 h-4 text-emerald-600 mt-1 flex-shrink-0" />
                  <span>{change}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
