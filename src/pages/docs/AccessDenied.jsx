import { Lock, Clock, AlertCircle } from 'lucide-react'
import { getDocsConfig, emergencyResetDocsConfig } from '../../utils/docsAccessControl'

export default function AccessDenied() {
  const config = getDocsConfig()
  const now = new Date()
  
  // Determine specific reason for denial
  const getDenialReason = () => {
    if (!config.enabled) {
      return {
        icon: <Lock className="w-10 h-10 text-red-600" />,
        title: "Documentation Disabled",
        message: "The administrator has temporarily disabled access to the documentation.",
        bgColor: "bg-red-100"
      }
    }
    
    if (config.scheduleEnabled) {
      const startDate = new Date(config.startDate)
      const endDate = new Date(config.endDate)
      
      if (now < startDate) {
        return {
          icon: <Clock className="w-10 h-10 text-amber-600" />,
          title: "Coming Soon",
          message: `Documentation will be available on ${startDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}`,
          bgColor: "bg-amber-100"
        }
      }
      
      if (now > endDate) {
        return {
          icon: <AlertCircle className="w-10 h-10 text-blue-600" />,
          title: "Viewing Period Ended",
          message: `The documentation viewing period ended on ${endDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}`,
          bgColor: "bg-blue-100"
        }
      }
    }
    
    return {
      icon: <Lock className="w-10 h-10 text-red-600" />,
      title: "Access Restricted",
      message: "Documentation is currently unavailable.",
      bgColor: "bg-red-100"
    }
  }
  
  const reason = getDenialReason()
  
  // Quick reset for debugging (hidden feature - press R key)
  const handleQuickReset = () => {
    if (window.confirm('This will restore docs access to default settings (enabled). Continue?')) {
      emergencyResetDocsConfig()
      window.location.reload()
    }
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50 p-4">
      <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-8 md:p-10 text-center">
        {/* Icon */}
        <div className={`w-20 h-20 ${reason.bgColor} rounded-full flex items-center justify-center mx-auto mb-6`}>
          {reason.icon}
        </div>
        
        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
          {reason.title}
        </h1>
        
        {/* Message */}
        <p className="text-lg text-slate-800 mb-6 leading-relaxed">
          {reason.message}
        </p>
        
        {/* Schedule Info */}
        {config.scheduleEnabled && (
          <div className="bg-slate-50 border-2 border-slate-200 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-bold text-slate-900 mb-3 text-lg">📅 Scheduled Access Window</h3>
            <div className="space-y-2 text-base text-slate-800">
              <p><strong>Starts:</strong> {new Date(config.startDate).toLocaleString()}</p>
              <p><strong>Ends:</strong> {new Date(config.endDate).toLocaleString()}</p>
              <p className="text-sm text-slate-600 mt-3 pt-3 border-t border-slate-300">
                <strong>Current Time:</strong> {now.toLocaleString()}
              </p>
            </div>
          </div>
        )}
        
        {/* Admin Access Note */}
        {!localStorage.getItem('docs_admin_token') && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-emerald-900">
              <strong>💡 Are you an admin?</strong><br />
              Visit <a href="/docs/admin" className="underline font-semibold hover:text-emerald-700">/docs/admin</a> to manage access settings.
            </p>
          </div>
        )}
        
        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full px-6 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold text-lg shadow-md hover:shadow-lg"
          >
            Return to App
          </button>
          
          <button
            onClick={handleQuickReset}
            className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors font-medium text-sm"
          >
            🔧 Reset Access (Debug)
          </button>
          
          <p className="text-xs text-slate-500 mt-4">
            Need help? Contact the administrator or use the debug reset button above.
          </p>
        </div>
      </div>
    </div>
  )
}