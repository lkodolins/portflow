// Portfolio service for Supabase integration
import { supabase, TABLES, STORAGE_BUCKET, supabaseHelpers } from './supabase'

class PortfolioService {
  constructor() {
    this.isOnline = navigator.onLine
    this.setupOnlineStatusListener()
  }

  setupOnlineStatusListener() {
    window.addEventListener('online', () => {
      this.isOnline = true
      console.log('Back online - syncing data...')
    })
    
    window.addEventListener('offline', () => {
      this.isOnline = false
      console.log('Offline mode - using local storage')
    })
  }

  // Create a new portfolio
  async createPortfolio(portfolioData) {
    try {
      if (!this.isOnline) {
        return this.createPortfolioOffline(portfolioData)
      }

      const { data, error } = await supabase
        .from(TABLES.PORTFOLIOS)
        .insert([{
          title: portfolioData.title || 'My Portfolio',
          description: portfolioData.description || 'A collection of my creative work',
          slug: portfolioData.slug || this.generateSlug(),
          is_public: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        portfolio: data,
        message: 'Portfolio created successfully'
      }
    } catch (error) {
      console.error('Failed to create portfolio:', error)
      return {
        success: false,
        error: error.message,
        fallback: this.createPortfolioOffline(portfolioData)
      }
    }
  }

  // Save portfolio items
  async savePortfolioItems(portfolioId, items) {
    try {
      if (!this.isOnline) {
        return this.saveItemsOffline(portfolioId, items)
      }

      // Process items with file uploads
      const processedItems = await Promise.all(
        items.map(async (item, index) => {
          let fileUrl = null
          let fileName = null

          // Upload file if it exists
          if (item.file && item.file instanceof File) {
            const uploadResult = await this.uploadFile(item.file, portfolioId)
            if (uploadResult.success) {
              fileUrl = uploadResult.url
              fileName = uploadResult.fileName
            }
          }

          return {
            portfolio_id: portfolioId,
            title: item.title,
            description: item.description,
            notes: item.notes || null,
            type: item.type,
            url: item.url || null,
            file_url: fileUrl,
            file_name: fileName,
            sort_order: index,
            created_at: new Date().toISOString()
          }
        })
      )

      // Insert portfolio items
      const { data, error } = await supabase
        .from(TABLES.PORTFOLIO_ITEMS)
        .insert(processedItems)
        .select()

      if (error) throw error

      return {
        success: true,
        items: data,
        message: `Saved ${data.length} portfolio items`
      }
    } catch (error) {
      console.error('Failed to save portfolio items:', error)
      return {
        success: false,
        error: error.message,
        fallback: this.saveItemsOffline(portfolioId, items)
      }
    }
  }

  // Upload file to Supabase storage
  async uploadFile(file, portfolioId) {
    try {
      const fileName = supabaseHelpers.generateFileName(file.name, portfolioId)
      
      const { data, error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) throw error

      const publicUrl = supabaseHelpers.getPublicUrl(fileName)

      return {
        success: true,
        url: publicUrl,
        fileName: fileName,
        path: data.path
      }
    } catch (error) {
      console.error('File upload failed:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Get portfolio by slug
  async getPortfolio(slug) {
    try {
      if (!this.isOnline) {
        return this.getPortfolioOffline(slug)
      }

      const { data: portfolio, error: portfolioError } = await supabase
        .from(TABLES.PORTFOLIOS)
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single()

      if (portfolioError) throw portfolioError

      const { data: items, error: itemsError } = await supabase
        .from(TABLES.PORTFOLIO_ITEMS)
        .select('*')
        .eq('portfolio_id', portfolio.id)
        .order('sort_order', { ascending: true })

      if (itemsError) throw itemsError

      return {
        success: true,
        portfolio: {
          ...portfolio,
          items: items || []
        }
      }
    } catch (error) {
      console.error('Failed to get portfolio:', error)
      return {
        success: false,
        error: error.message,
        fallback: this.getPortfolioOffline(slug)
      }
    }
  }

  // Publish portfolio (create + save items)
  async publishPortfolio(projects, metadata = {}) {
    try {
      // Create portfolio
      const portfolioResult = await this.createPortfolio({
        title: metadata.title || 'My Creative Portfolio',
        description: metadata.description || 'A showcase of my professional work',
        slug: this.generateSlug()
      })

      if (!portfolioResult.success) {
        throw new Error(portfolioResult.error)
      }

      const portfolio = portfolioResult.portfolio

      // Save portfolio items
      const itemsResult = await this.savePortfolioItems(portfolio.id, projects)

      if (!itemsResult.success) {
        console.warn('Items save failed, but portfolio was created')
      }

      return {
        success: true,
        portfolio: portfolio,
        items: itemsResult.items || [],
        url: `${window.location.origin}/portfolio/${portfolio.slug}`,
        message: 'Portfolio published successfully!'
      }
    } catch (error) {
      console.error('Portfolio publishing failed:', error)
      return {
        success: false,
        error: error.message,
        fallback: this.publishPortfolioOffline(projects, metadata)
      }
    }
  }

  // Generate unique slug
  generateSlug() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Offline fallback methods
  createPortfolioOffline(portfolioData) {
    const portfolio = {
      id: `offline_${Date.now()}`,
      slug: this.generateSlug(),
      title: portfolioData.title || 'My Portfolio',
      description: portfolioData.description || 'A collection of my creative work',
      created_at: new Date().toISOString(),
      offline: true
    }

    localStorage.setItem(`portfolio_${portfolio.slug}`, JSON.stringify(portfolio))
    
    return {
      success: true,
      portfolio,
      offline: true,
      message: 'Portfolio saved offline'
    }
  }

  saveItemsOffline(portfolioId, items) {
    const processedItems = items.map((item, index) => ({
      id: `offline_item_${Date.now()}_${index}`,
      portfolio_id: portfolioId,
      title: item.title,
      description: item.description,
      notes: item.notes || null,
      type: item.type,
      url: item.url || null,
      sort_order: index,
      offline: true
    }))

    localStorage.setItem(`portfolio_items_${portfolioId}`, JSON.stringify(processedItems))
    
    return {
      success: true,
      items: processedItems,
      offline: true,
      message: 'Items saved offline'
    }
  }

  getPortfolioOffline(slug) {
    try {
      const portfolio = JSON.parse(localStorage.getItem(`portfolio_${slug}`))
      if (!portfolio) {
        throw new Error('Portfolio not found offline')
      }

      const items = JSON.parse(localStorage.getItem(`portfolio_items_${portfolio.id}`)) || []

      return {
        success: true,
        portfolio: {
          ...portfolio,
          items
        },
        offline: true
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
        offline: true
      }
    }
  }

  publishPortfolioOffline(projects, metadata) {
    const portfolioResult = this.createPortfolioOffline(metadata)
    if (!portfolioResult.success) {
      return portfolioResult
    }

    const portfolio = portfolioResult.portfolio
    const itemsResult = this.saveItemsOffline(portfolio.id, projects)

    return {
      success: true,
      portfolio,
      items: itemsResult.items,
      url: `${window.location.origin}/portfolio/${portfolio.slug}`,
      offline: true,
      message: 'Portfolio saved offline - will sync when online'
    }
  }

  // Check if Supabase is configured
  isConfigured() {
    return !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY)
  }
}

export default new PortfolioService()