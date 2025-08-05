import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Storage bucket name
export const STORAGE_BUCKET = 'portfolios'

// Database tables
export const TABLES = {
  PORTFOLIOS: 'portfolios',
  PORTFOLIO_ITEMS: 'portfolio_items'
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Test connection
  async testConnection() {
    try {
      const { data, error } = await supabase.from(TABLES.PORTFOLIOS).select('count(*)')
      if (error) throw error
      return { success: true, message: 'Connected to Supabase successfully' }
    } catch (error) {
      console.error('Supabase connection failed:', error)
      return { success: false, error: error.message }
    }
  },

  // Check if storage bucket exists
  async checkBucket() {
    try {
      const { data, error } = await supabase.storage.getBucket(STORAGE_BUCKET)
      if (error) throw error
      return { success: true, bucket: data }
    } catch (error) {
      console.error('Storage bucket check failed:', error)
      return { success: false, error: error.message }
    }
  },

  // Generate unique filename for storage
  generateFileName(originalName, portfolioId) {
    const timestamp = Date.now()
    const extension = originalName.split('.').pop()
    const sanitizedName = originalName
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .toLowerCase()
    
    return `${portfolioId}/${timestamp}_${sanitizedName}`
  },

  // Get public URL for stored file
  getPublicUrl(path) {
    const { data } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(path)
    
    return data.publicUrl
  }
}

export default supabase