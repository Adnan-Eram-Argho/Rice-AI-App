import { motion } from 'framer-motion'
import { Target, Lightbulb, TrendingUp, Award, Globe, DollarSign, Users, Rocket, Shield, Eye } from 'lucide-react'

export default function PitchDeck() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  }

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <motion.div 
        className="text-center space-y-6 py-12"
        {...fadeInUp}
      >
        <div className="inline-block px-6 py-3 bg-emerald-100 text-emerald-900 rounded-full text-base font-semibold mb-6 border border-emerald-200">
          Y Combinator Style Pitch Deck
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight tracking-tight">
          Rice AI Doctor
        </h1>
        <p className="text-2xl md:text-3xl text-slate-800 max-w-4xl mx-auto font-medium leading-relaxed">
          Offline AI-powered rice disease detection for Bangladeshi farmers
        </p>
        <div className="flex flex-wrap items-center justify-center gap-6 text-base font-medium text-slate-700 pt-4">
          <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
            <Award className="w-5 h-5 text-emerald-600" />
            94% Accuracy
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
            <Shield className="w-5 h-5 text-emerald-600" />
            100% Offline
          </span>
          <span className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-slate-200">
            <Globe className="w-5 h-5 text-emerald-600" />
            Bilingual (BN/EN)
          </span>
        </div>
      </motion.div>

      {/* Problem */}
      <motion.section 
        className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border-2 border-slate-200 hover:border-red-300 transition-colors"
        {...fadeInUp}
      >
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Target className="w-7 h-7 text-red-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">The Problem</h2>
            <ul className="space-y-4 text-lg text-slate-800 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1.5 text-xl">•</span>
                <span><strong className="text-slate-900">Rural Connectivity:</strong> Bangladesh's rural areas have unreliable internet, preventing farmers from using online AI diagnostic tools</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1.5 text-xl">•</span>
                <span><strong className="text-slate-900">Misdiagnosis Crisis:</strong> Farmers incorrectly identify diseases, leading to excessive pesticide use and crop damage</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1.5 text-xl">•</span>
                <span><strong className="text-slate-900">Language Barrier:</strong> Most agricultural tools are English-only, excluding Bengali-speaking farmers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-red-500 mt-1.5 text-xl">•</span>
                <span><strong className="text-slate-900">Low-End Devices:</strong> Existing solutions require high-end smartphones, but most farmers use budget Android devices (2GB RAM)</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Solution */}
      <motion.section 
        className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border-2 border-slate-200 hover:border-emerald-300 transition-colors"
        {...fadeInUp}
      >
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Lightbulb className="w-7 h-7 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Solution</h2>
            <p className="text-lg text-slate-800 mb-6 leading-relaxed">
              A Progressive Web Application (PWA) that brings offline AI-powered disease diagnosis directly to farmers' smartphones.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200">
                <h3 className="font-bold text-emerald-900 mb-2 text-lg">✓ 100% Offline</h3>
                <p className="text-base text-emerald-800">ONNX Runtime Web enables browser-based AI inference without internet</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200">
                <h3 className="font-bold text-emerald-900 mb-2 text-lg">✓ Low-End Optimized</h3>
                <p className="text-base text-emerald-800">INT8 quantized model (3.2 MB) runs smoothly on 2GB RAM devices</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200">
                <h3 className="font-bold text-emerald-900 mb-2 text-lg">✓ Bilingual Support</h3>
                <p className="text-base text-emerald-800">Full Bengali and English interface with localized treatment recommendations</p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-200">
                <h3 className="font-bold text-emerald-900 mb-2 text-lg">✓ 94% Accuracy</h3>
                <p className="text-base text-emerald-800">EfficientNet-B0 + CBAM attention mechanism achieves clinical-grade precision</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Why Now */}
      <motion.section 
        className="bg-white rounded-2xl shadow-lg p-8 md:p-10 border-2 border-slate-200 hover:border-blue-300 transition-colors"
        {...fadeInUp}
      >
        <div className="flex items-start gap-6">
          <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-7 h-7 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Now?</h2>
            <ul className="space-y-4 text-lg text-slate-800 leading-relaxed">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">1.</span>
                <span><strong className="text-slate-900">WebAssembly Maturity:</strong> ONNX Runtime Web now supports efficient WASM inference in browsers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">2.</span>
                <span><strong className="text-slate-900">Model Optimization:</strong> INT8 quantization makes large models viable for mobile browsers</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">3.</span>
                <span><strong className="text-slate-900">PWA Adoption:</strong> Progressive Web Apps provide native-like experience without app store friction</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">4.</span>
                <span><strong className="text-slate-900">Climate Urgency:</strong> Rice diseases cause 20-30% yield loss annually; timely diagnosis is critical</span>
              </li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Market Opportunity */}
      <motion.section 
        className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
        {...fadeInUp}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Globe className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Market Opportunity</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">150M+</div>
                <p className="text-sm text-slate-600">Rice farmers globally</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">$2B</div>
                <p className="text-sm text-slate-600">Agri-tech market by 2027</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">30%</div>
                <p className="text-sm text-slate-600">Yield loss from diseases</p>
              </div>
            </div>
            <div className="mt-6 space-y-2 text-slate-700">
              <p><strong>Primary Market:</strong> Bangladesh (8.5M rice farmers)</p>
              <p><strong>Expansion Markets:</strong> India, Vietnam, Philippines, Indonesia</p>
              <p><strong>Total Addressable Market:</strong> Southeast Asia & South Asia (100M+ farmers)</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Business Model */}
      <motion.section 
        className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
        {...fadeInUp}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Business Model</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-1">Freemium Model</h3>
                <p className="text-slate-700 text-sm">Free basic diagnosis for individual farmers; premium features for agriculture officers and institutions</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-1">B2B Licensing</h3>
                <p className="text-slate-700 text-sm">White-label solutions for agricultural NGOs, government extension services, and agri-tech companies</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-1">Data Insights</h3>
                <p className="text-slate-700 text-sm">Anonymized disease outbreak data sold to research institutions and agrochemical companies</p>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-slate-900 mb-1">Training & Certification</h3>
                <p className="text-slate-700 text-sm">Paid courses for agricultural students and certification programs for field officers</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Traction */}
      <motion.section 
        className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
        {...fadeInUp}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Rocket className="w-6 h-6 text-orange-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Traction & Milestones</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-600 mb-1">V4.2</div>
                <p className="text-sm text-slate-700">Current production model version</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-600 mb-1">94.06%</div>
                <p className="text-sm text-slate-700">Test accuracy on 5-class detection</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-600 mb-1">&lt;550ms</div>
                <p className="text-sm text-slate-700">Inference time with TTA</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-3xl font-bold text-orange-600 mb-1">3.2 MB</div>
                <p className="text-sm text-slate-700">INT8 model size</p>
              </div>
            </div>
            <div className="mt-6 space-y-2 text-slate-700">
              <p>✓ Deployed on Vercel with PWA support</p>
              <p>✓ Tested on low-end Android devices (2GB RAM)</p>
              <p>✓ Zero hardcoded architecture - fully configuration-driven</p>
              <p>✓ Open-source GitHub repository with comprehensive documentation</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Competition */}
      <motion.section 
        className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
        {...fadeInUp}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Competitive Landscape</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4 text-emerald-700 font-bold">Rice AI Doctor</th>
                    <th className="text-center py-3 px-4">Plantix</th>
                    <th className="text-center py-3 px-4">Traditional Apps</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">Offline Capability</td>
                    <td className="text-center py-3 px-4 text-emerald-600 font-bold">✓ 100%</td>
                    <td className="text-center py-3 px-4 text-red-500">✗ Requires Internet</td>
                    <td className="text-center py-3 px-4 text-red-500">✗ Limited</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">Model Size</td>
                    <td className="text-center py-3 px-4 text-emerald-600 font-bold">3.2 MB</td>
                    <td className="text-center py-3 px-4">Cloud-based</td>
                    <td className="text-center py-3 px-4">50+ MB</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">Bengali Support</td>
                    <td className="text-center py-3 px-4 text-emerald-600 font-bold">✓ Full</td>
                    <td className="text-center py-3 px-4 text-red-500">✗ English Only</td>
                    <td className="text-center py-3 px-4 text-red-500">✗ None</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-3 px-4 font-medium">Low-End Device</td>
                    <td className="text-center py-3 px-4 text-emerald-600 font-bold">✓ 2GB RAM</td>
                    <td className="text-center py-3 px-4">4GB+ Required</td>
                    <td className="text-center py-3 px-4">Varies</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">Accuracy</td>
                    <td className="text-center py-3 px-4 text-emerald-600 font-bold">94%</td>
                    <td className="text-center py-3 px-4">~90%</td>
                    <td className="text-center py-3 px-4">~80%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Unique Advantage */}
      <motion.section 
        className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl shadow-lg p-8 border-2 border-emerald-200"
        {...fadeInUp}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Unfair Advantage</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">1</span>
                  Configuration-Driven Architecture
                </h3>
                <p className="text-sm text-slate-700">Zero hardcoding enables rapid expansion to new crops and diseases without code changes</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">2</span>
                  CBAM Attention Mechanism
                </h3>
                <p className="text-sm text-slate-700">Spatial + channel attention captures disease patterns missed by standard models</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">3</span>
                  Background Class Detection
                </h3>
                <p className="text-sm text-slate-700">Prevents dangerous false positives on non-leaf images (hands, walls, sky)</p>
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900 mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs">4</span>
                  Smart Image Quality Assessment
                </h3>
                <p className="text-sm text-slate-700">Center-region IQA prevents rejection of valid photos on white/black backgrounds</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Go-To-Market */}
      <motion.section 
        className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200"
        {...fadeInUp}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Rocket className="w-6 h-6 text-cyan-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Go-To-Market Strategy</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-600 font-bold text-sm">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Phase 1: Bangladesh Pilot (Months 1-6)</h3>
                  <p className="text-sm text-slate-700">Partner with Sher-e-Bangla Agricultural University (SAU) for field testing with 500+ farmers</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-600 font-bold text-sm">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Phase 2: Government Partnerships (Months 6-12)</h3>
                  <p className="text-sm text-slate-700">Collaborate with Department of Agricultural Extension (DAE) for nationwide deployment</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-600 font-bold text-sm">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Phase 3: Regional Expansion (Year 2)</h3>
                  <p className="text-sm text-slate-700">Expand to India, Vietnam, and Philippines with localized datasets and languages</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-cyan-600 font-bold text-sm">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">Phase 4: Multi-Crop Platform (Year 3)</h3>
                  <p className="text-sm text-slate-700">Add wheat, maize, potato detection; become comprehensive crop health platform</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Vision */}
      <motion.section 
        className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-8 border-2 border-purple-200"
        {...fadeInUp}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h2>
            <blockquote className="text-xl text-purple-900 italic mb-4 border-l-4 border-purple-400 pl-4">
              "To empower every farmer with AI-powered agricultural expertise, eliminating crop losses from preventable diseases."
            </blockquote>
            <div className="space-y-3 text-slate-700">
              <p><strong>Short-term (2026):</strong> Become the go-to rice disease diagnosis tool in Bangladesh</p>
              <p><strong>Mid-term (2027-2028):</strong> Expand to 10+ crops across South and Southeast Asia</p>
              <p><strong>Long-term (2029+):</strong> Global platform serving 100M+ farmers with comprehensive crop health intelligence</p>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}
