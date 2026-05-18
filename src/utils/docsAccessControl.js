/**
 * Docs Access Control Utility
 * Manages visibility toggling and scheduling for /docs endpoint
 */

const DOCS_CONFIG_KEY = 'docs_access_config'

// Default configuration
const DEFAULT_CONFIG = {
  enabled: true,
  scheduleEnabled: false,
  startDate: '2026-06-10T00:00:00',
  endDate: '2026-06-14T23:59:59',
  lastUpdated: new Date().toISOString()
}

/**
 * Get current docs access configuration
 */
export function getDocsConfig() {
  try {
    const stored = localStorage.getItem(DOCS_CONFIG_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Error reading docs config:', error)
  }
  
  // Return default config if none exists
  return DEFAULT_CONFIG
}

/**
 * Save docs access configuration (admin only)
 */
export function saveDocsConfig(config) {
  try {
    const adminToken = localStorage.getItem('docs_admin_token')
    if (!adminToken) {
      throw new Error('Unauthorized: Admin token required')
    }
    
    const updatedConfig = {
      ...config,
      lastUpdated: new Date().toISOString()
    }
    
    localStorage.setItem(DOCS_CONFIG_KEY, JSON.stringify(updatedConfig))
    return { success: true, config: updatedConfig }
  } catch (error) {
    console.error('Error saving docs config:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Check if docs should be accessible based on current config
 */
export function checkDocsAccess() {
  const config = getDocsConfig()
  const now = new Date()
  
  // If globally disabled, deny access
  if (!config.enabled) {
    return {
      access: false,
      reason: 'DISABLED',
      message: 'Documentation is currently unavailable'
    }
  }
  
  // If scheduling is enabled, check date range
  if (config.scheduleEnabled) {
    const startDate = new Date(config.startDate)
    const endDate = new Date(config.endDate)
    
    if (now < startDate) {
      return {
        access: false,
        reason: 'NOT_STARTED',
        message: `Documentation will be available on ${startDate.toLocaleDateString()}`,
        availableFrom: startDate.toISOString()
      }
    }
    
    if (now > endDate) {
      return {
        access: false,
        reason: 'EXPIRED',
        message: 'Documentation viewing period has ended',
        expiredAt: endDate.toISOString()
      }
    }
  }
  
  // Access granted
  return {
    access: true,
    message: 'Access granted',
    config: {
      scheduleEnabled: config.scheduleEnabled,
      startDate: config.startDate,
      endDate: config.endDate
    }
  }
}

/**
 * Initialize default config if not exists
 */
export function initializeDocsConfig() {
  const existing = localStorage.getItem(DOCS_CONFIG_KEY)
  if (!existing) {
    localStorage.setItem(DOCS_CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG))
    console.log('Initialized default docs config:', DEFAULT_CONFIG)
  }
}

/**
 * Reset to default configuration (admin only)
 */
export function resetDocsConfig() {
  const adminToken = localStorage.getItem('docs_admin_token')
  if (!adminToken) {
    throw new Error('Unauthorized: Admin token required')
  }
  
  localStorage.setItem(DOCS_CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG))
  return DEFAULT_CONFIG
}

/**
 * Emergency reset - allows anyone to restore docs access (for debugging)
 */
export function emergencyResetDocsConfig() {
  localStorage.setItem(DOCS_CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG))
  console.log('Emergency reset performed - docs access restored')
  return DEFAULT_CONFIG
}

// Initialize on module load
if (typeof window !== 'undefined') {
  initializeDocsConfig()
}
