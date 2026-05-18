import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Menu, X, Search, ChevronRight, Download, Share2, 
  BookOpen, Cpu, Database, Shield, TrendingUp, Users,
  Layers, GitBranch, FileText, Calendar, CheckCircle, HelpCircle
} from 'lucide-react'
import PitchDeck from './sections/PitchDeck'
import TechnicalDocs from './sections/TechnicalDocs'
import ArchitectureDiagram from './sections/ArchitectureDiagram'
import FeatureMatrix from './sections/FeatureMatrix'
import TeamSection from './sections/TeamSection'
import Roadmap from './sections/Roadmap'
import Changelog from './sections/Changelog'
import SearchBar from './components/SearchBar'
import TableOfContents from './components/TableOfContents'
import ExportOptions from './components/ExportOptions'

export default function DocsViewer({ isAdmin }) {
  const [activeSection, setActiveSection] = useState('pitch')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showExport, setShowExport] = useState(false)
  const [showHelp, setShowHelp] = useState(false)

  const sections = [
    { id: 'pitch', title: 'Pitch Deck', icon: BookOpen },
    { id: 'product', title: 'Product Overview', icon: Layers },
    { id: 'features', title: 'Feature Matrix', icon: CheckCircle },
    { id: 'architecture', title: 'Architecture', icon: GitBranch },
    { id: 'tech-stack', title: 'Technology Stack', icon: Cpu },
    { id: 'data-flow', title: 'Data Flow', icon: Database },
    { id: 'api-docs', title: 'API Documentation', icon: FileText },
    { id: 'ai-layer', title: 'AI & ML Layer', icon: Cpu },
    { id: 'team', title: 'Team', icon: Users },
    { id: 'roadmap', title: 'Roadmap', icon: Calendar },
    { id: 'performance', title: 'Performance', icon: TrendingUp },
    { id: 'security', title: 'Security', icon: Shield },
    { id: 'changelog', title: 'Changelog', icon: FileText },
  ]

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId)
    setSidebarOpen(false)
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b-2 border-slate-300 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-3 rounded-lg hover:bg-slate-100 transition-colors"
              >
                {sidebarOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
              </button>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-2xl">🌾</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Rice AI Doctor</h1>
                  <p className="text-sm text-slate-700 font-medium">Documentation & Pitch Deck</p>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-4 flex-1 max-w-xl mx-8">
              <SearchBar onSearch={setSearchQuery} />
            </div>

            <div className="flex items-center space-x-3">
              {/* Help Button */}
              <button
                onClick={() => setShowHelp(!showHelp)}
                className="p-3 rounded-lg hover:bg-slate-100 transition-colors relative"
                title="How to Access Admin Panel"
              >
                <HelpCircle className="w-6 h-6 text-blue-600" />
              </button>

              <button
                onClick={() => setShowExport(!showExport)}
                className="p-3 rounded-lg hover:bg-slate-100 transition-colors relative"
                title="Export Options"
              >
                <Download className="w-6 h-6 text-slate-800" />
              </button>
              
              <a
                href="/docs/admin"
                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg text-base font-semibold flex items-center gap-2"
              >
                <Shield className="w-5 h-5" />
                Admin Panel
              </a>
            </div>
          </div>
        </div>

        {/* Help Modal - Admin Access Guide */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-4 top-20 bg-white rounded-xl shadow-2xl border-2 border-blue-200 p-6 w-96 max-w-[calc(100vw-2rem)] z-50"
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-600" />
                  How to Access Admin Panel
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="p-1 hover:bg-slate-100 rounded"
                >
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>
              
              <div className="space-y-4 text-sm">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="font-semibold text-blue-900 mb-2">Quick Access:</p>
                  <ol className="list-decimal list-inside space-y-2 text-blue-800">
                    <li>Click the green <strong>"Admin Panel"</strong> button above</li>
                    <li>Or visit: <code className="bg-blue-100 px-2 py-1 rounded text-xs">/docs/admin</code></li>
                  </ol>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <p className="font-semibold text-emerald-900 mb-2">Login Credentials:</p>
                  <div className="bg-white rounded p-3 border border-emerald-300">
                    <p className="text-emerald-800 font-mono text-xs">
                      Token: <span className="font-bold text-emerald-900">admin123</span>
                    </p>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="font-semibold text-amber-900 mb-2">What You Can Do:</p>
                  <ul className="list-disc list-inside space-y-1 text-amber-800 text-xs">
                    <li>✓ Toggle docs visibility ON/OFF</li>
                    <li>✓ Schedule availability dates</li>
                    <li>✓ Enable/disable for judging windows</li>
                    <li>✓ Reset to default configuration</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                  <p className="text-xs text-slate-700">
                    <strong>Note:</strong> This is a demo token. For production, implement JWT authentication with backend validation.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Export Dropdown */}
        <AnimatePresence>
          {showExport && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-4 top-20 bg-white rounded-lg shadow-xl border border-slate-200 py-2 w-48 z-50"
            >
              <ExportOptions onClose={() => setShowExport(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar Navigation */}
          <aside className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white lg:bg-transparent
            transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:transform-none transition-transform duration-300 ease-in-out
            border-r border-slate-200 lg:border-none
            overflow-y-auto lg:overflow-visible
          `}>
            <TableOfContents 
              sections={sections}
              activeSection={activeSection}
              onSelect={scrollToSection}
            />
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            <div className="space-y-16 pb-20">
              {/* Pitch Deck Section */}
              <section id="pitch" className="scroll-mt-24">
                <PitchDeck />
              </section>

              {/* Product Overview */}
              <section id="product" className="scroll-mt-24">
                <TechnicalDocs section="product" />
              </section>

              {/* Feature Matrix */}
              <section id="features" className="scroll-mt-24">
                <FeatureMatrix />
              </section>

              {/* Architecture Diagram */}
              <section id="architecture" className="scroll-mt-24">
                <ArchitectureDiagram />
              </section>

              {/* Technology Stack */}
              <section id="tech-stack" className="scroll-mt-24">
                <TechnicalDocs section="tech-stack" />
              </section>

              {/* Data Flow */}
              <section id="data-flow" className="scroll-mt-24">
                <TechnicalDocs section="data-flow" />
              </section>

              {/* API Documentation */}
              <section id="api-docs" className="scroll-mt-24">
                <TechnicalDocs section="api-docs" />
              </section>

              {/* AI & ML Layer */}
              <section id="ai-layer" className="scroll-mt-24">
                <TechnicalDocs section="ai-layer" />
              </section>

              {/* Team Section */}
              <section id="team" className="scroll-mt-24">
                <TeamSection />
              </section>

              {/* Roadmap */}
              <section id="roadmap" className="scroll-mt-24">
                <Roadmap />
              </section>

              {/* Performance */}
              <section id="performance" className="scroll-mt-24">
                <TechnicalDocs section="performance" />
              </section>

              {/* Security */}
              <section id="security" className="scroll-mt-24">
                <TechnicalDocs section="security" />
              </section>

              {/* Changelog */}
              <section id="changelog" className="scroll-mt-24">
                <Changelog />
              </section>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}
