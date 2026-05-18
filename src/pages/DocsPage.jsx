import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import DocsViewer from './docs/DocsViewer'
import AdminPanel from './docs/AdminPanel'
import AccessDenied from './docs/AccessDenied'
import { checkDocsAccess, emergencyResetDocsConfig } from '../utils/docsAccessControl'

export default function DocsPage() {
  const [accessStatus, setAccessStatus] = useState('checking') // 'checking', 'granted', 'denied'
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    // Check access control
    const status = checkDocsAccess()
    console.log('📄 Docs Access Status:', status)
    setAccessStatus(status.access ? 'granted' : 'denied')
    
    // Check if user is admin (simple localStorage check for demo)
    const adminToken = localStorage.getItem('docs_admin_token')
    setIsAdmin(!!adminToken)
    
    // Add debug helper to window
    window.__docsDebug = {
      checkAccess: () => {
        const currentStatus = checkDocsAccess()
        console.table({
          'Access': currentStatus.access,
          'Reason': currentStatus.reason || 'N/A',
          'Message': currentStatus.message,
          'Config': JSON.parse(localStorage.getItem('docs_access_config') || '{}')
        })
        return currentStatus
      },
      resetAccess: () => {
        emergencyResetDocsConfig()
        console.log('✅ Docs access reset to default (enabled)')
        window.location.reload()
      }
    }
    
    console.log('💡 Debug commands available:')
    console.log('  - window.__docsDebug.checkAccess() - Check current status')
    console.log('  - window.__docsDebug.resetAccess() - Reset to enabled')
  }, [])

  if (accessStatus === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading documentation...</p>
        </div>
      </div>
    )
  }

  if (accessStatus === 'denied' && !isAdmin) {
    return <AccessDenied />
  }

  return (
    <Routes>
      <Route path="/" element={<DocsViewer isAdmin={isAdmin} />} />
      <Route path="/admin" element={isAdmin ? <AdminPanel /> : <AccessDenied />} />
    </Routes>
  )
}
