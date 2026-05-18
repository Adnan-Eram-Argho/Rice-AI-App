import { motion } from 'framer-motion'
import { Smartphone, Cloud, Database, Cpu, Shield } from 'lucide-react'

export default function ArchitectureDiagram() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-slate-900 mb-4">System Architecture</h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
          Client-side AI inference architecture with zero backend dependencies
        </p>
      </div>

      {/* Architecture Diagram */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <div className="relative">
          {/* User Layer */}
          <div className="flex justify-center mb-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-lg"
            >
              <Smartphone className="w-12 h-12 mx-auto mb-2" />
              <div className="text-center">
                <div className="font-bold">User Device</div>
                <div className="text-xs opacity-90">Android/iOS Browser</div>
              </div>
            </motion.div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-8">
            <div className="text-slate-400 text-2xl">↓</div>
          </div>

          {/* Frontend Layer */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-6 shadow-lg"
            >
              <div className="text-center">
                <div className="font-bold mb-2">React App</div>
                <div className="text-xs space-y-1 opacity-90">
                  <div>• Vite Build</div>
                  <div>• TailwindCSS</div>
                  <div>• React Router</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6 shadow-lg"
            >
              <Cpu className="w-10 h-10 mx-auto mb-2" />
              <div className="text-center">
                <div className="font-bold mb-2">ONNX Runtime Web</div>
                <div className="text-xs space-y-1 opacity-90">
                  <div>• WASM Inference</div>
                  <div>• SIMD Support</div>
                  <div>• Single-thread</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-6 shadow-lg"
            >
              <Database className="w-10 h-10 mx-auto mb-2" />
              <div className="text-center">
                <div className="font-bold mb-2">Service Worker</div>
                <div className="text-xs space-y-1 opacity-90">
                  <div>• PWA Cache</div>
                  <div>• Offline Storage</div>
                  <div>• Auto-update</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Arrow */}
          <div className="flex justify-center mb-8">
            <div className="text-slate-400 text-2xl">↓</div>
          </div>

          {/* AI Model Layer */}
          <div className="flex justify-center mb-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-xl p-6 shadow-lg"
            >
              <div className="text-center">
                <div className="font-bold mb-2">AI Model (INT8)</div>
                <div className="text-xs space-y-1 opacity-90">
                  <div>EfficientNet-B0 + CBAM</div>
                  <div>3.2 MB • 94% Accuracy</div>
                  <div>5 Classes • &lt;120ms Inference</div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Security Badge */}
          <div className="absolute top-4 right-4">
            <div className="bg-green-100 border-2 border-green-500 rounded-lg px-4 py-2 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-semibold text-green-800">100% Client-Side</span>
            </div>
          </div>
        </div>
      </div>

      {/* Architecture Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Key Design Decisions</h3>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>No Backend:</strong> All processing happens in browser for privacy and offline capability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>WASM over WebGL:</strong> Better compatibility on low-end devices despite slower speed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Single-thread:</strong> Prevents memory conflicts on 2GB RAM devices</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-600 font-bold">✓</span>
              <span><strong>Configuration-driven:</strong> Zero hardcoding enables rapid expansion</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Performance Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-700">Model Load Time (3G)</span>
              <span className="text-sm font-bold text-emerald-600">&lt;10s</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-700">Inference Time</span>
              <span className="text-sm font-bold text-emerald-600">&lt;550ms</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-700">RAM Usage</span>
              <span className="text-sm font-bold text-emerald-600">15-20 MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-slate-700">Bundle Size</span>
              <span className="text-sm font-bold text-emerald-600">&lt;500 KB</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
