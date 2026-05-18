import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Save, RotateCcw, Lock, Unlock, Calendar, 
  Clock, AlertTriangle, CheckCircle, Eye, EyeOff 
} from 'lucide-react'
import { getDocsConfig, saveDocsConfig, resetDocsConfig } from '../../utils/docsAccessControl'

export default function AdminPanel() {
  const [config, setConfig] = useState(getDocsConfig())
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminToken, setAdminToken] = useState('')
  const [message, setMessage] = useState(null)
  const [showPassword, setShowPassword] = useState(false)

  // Simple admin authentication (for demo - use proper auth in production)
  const handleLogin = (e) => {
    e.preventDefault()
    if (adminToken === 'admin123') { // Demo password
      localStorage.setItem('docs_admin_token', adminToken)
      setIsAuthenticated(true)
      setMessage({ type: 'success', text: 'Admin access granted' })
    } else {
      setMessage({ type: 'error', text: 'Invalid admin token' })
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('docs_admin_token')
    setIsAuthenticated(false)
    setAdminToken('')
  }

  useEffect(() => {
    const token = localStorage.getItem('docs_admin_token')
    if (token === 'admin123') {
      setIsAuthenticated(true)
    }
  }, [])

  const handleSave = () => {
    const result = saveDocsConfig(config)
    if (result.success) {
      setMessage({ type: 'success', text: 'Configuration saved successfully' })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'error', text: result.error })
    }
  }

  const handleReset = () => {
    if (window.confirm('Reset to default configuration?')) {
      const newConfig = resetDocsConfig()
      setConfig(newConfig)
      setMessage({ type: 'success', text: 'Configuration reset to defaults' })
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
            <p className="text-sm text-slate-600 mt-2">Enter admin token to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={adminToken}
                onChange={(e) => setAdminToken(e.target.value)}
                placeholder="Enter admin token"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="mt-2 text-sm text-slate-600 hover:text-emerald-600 flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPassword ? 'Hide' : 'Show'} token
              </button>
            </div>

            {message && (
              <div className={`p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                {message.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Login
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              Demo token: admin123
            </p>
          </form>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Docs Admin Panel</h1>
            <p className="text-slate-600 mt-1">Manage documentation visibility and scheduling</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Message Banner */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}

        {/* Configuration Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 space-y-6">
          {/* Global Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              {config.enabled ? (
                <Unlock className="w-6 h-6 text-emerald-600" />
              ) : (
                <Lock className="w-6 h-6 text-red-600" />
              )}
              <div>
                <h3 className="font-semibold text-slate-900">Documentation Visibility</h3>
                <p className="text-sm text-slate-600">
                  {config.enabled ? 'Publicly accessible at /docs' : 'Hidden - shows "Not Available" page'}
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Scheduling */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-slate-900">Schedule Availability</h3>
                  <p className="text-sm text-slate-600">Set start and end dates for public access</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.scheduleEnabled}
                  onChange={(e) => setConfig({ ...config, scheduleEnabled: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {config.scheduleEnabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="grid md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg"
              >
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Start Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={config.startDate.slice(0, 16)}
                    onChange={(e) => setConfig({ ...config, startDate: e.target.value + ':00' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={config.endDate.slice(0, 16)}
                    onChange={(e) => setConfig({ ...config, endDate: e.target.value + ':00' })}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </motion.div>
            )}
          </div>

          {/* Current Status */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Current Status
            </h4>
            <div className="space-y-2 text-sm text-slate-700">
              <p><strong>Visibility:</strong> {config.enabled ? '✅ Enabled' : '❌ Disabled'}</p>
              {config.scheduleEnabled && (
                <>
                  <p><strong>Schedule:</strong> Enabled</p>
                  <p><strong>Start:</strong> {new Date(config.startDate).toLocaleString()}</p>
                  <p><strong>End:</strong> {new Date(config.endDate).toLocaleString()}</p>
                </>
              )}
              <p><strong>Last Updated:</strong> {new Date(config.lastUpdated).toLocaleString()}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Configuration
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium flex items-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-6 flex gap-4">
          <a
            href="/docs"
            target="_blank"
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            View Public Docs →
          </a>
          <a
            href="/"
            className="px-4 py-2 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm"
          >
            ← Back to App
          </a>
        </div>
      </div>
    </div>
  )
}
