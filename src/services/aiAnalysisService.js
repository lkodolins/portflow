// Enhanced AI Analysis Service using backend functions
class AIAnalysisService {
  constructor() {
    this.apiEndpoint = '/api/analyze-file'
    this.isLocal = typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    this.isPreview = typeof window !== 'undefined' && window.location.port !== '5173'
    this.baseUrl = ''
    
    // Disable backend analysis in local preview mode (API functions don't work)
    this.backendAvailable = !this.isLocal && !this.isPreview
    
    console.log('AI Analysis Service initialized:', {
      isLocal: this.isLocal,
      isPreview: this.isPreview,
      backendAvailable: this.backendAvailable
    })
  }

  /**
   * Analyze file using advanced AI backend or fallback
   */
  async analyzeFile(file, fileUrl = null) {
    // Skip backend analysis if not available (local dev/preview)
    if (!this.backendAvailable) {
      console.log('Backend analysis not available, using fallback analysis')
      return this.getFallbackAnalysis(file, fileUrl, 'Backend not available in local mode')
    }

    try {
      // Prepare data for backend analysis
      const analysisData = {
        fileName: file ? file.name : null,
        fileUrl: fileUrl
      }

      // For file uploads, convert to base64 for backend
      if (file && file instanceof File) {
        // Get public URL from Supabase if available
        if (fileUrl) {
          analysisData.fileUrl = fileUrl
        } else {
          // Convert file to base64 for direct analysis
          analysisData.fileBuffer = await this.fileToBase64(file)
        }
      }

      // Call backend analysis function
      const response = await fetch(`${this.baseUrl}${this.apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(analysisData)
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (jsonError) {
          // Response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (result.success) {
        return {
          title: result.title,
          description: result.description,
          fileType: result.fileType,
          extractedContent: result.extractedText,
          aiGenerated: true,
          analysisMethod: 'backend-ai'
        }
      } else {
        throw new Error(result.error || 'Analysis failed')
      }

    } catch (error) {
      console.warn('Backend AI Analysis failed, using fallback:', error.message)
      
      // Fallback to local pattern analysis
      return this.getFallbackAnalysis(file, fileUrl, error.message)
    }
  }

  /**
   * Analyze URL using backend or fallback
   */
  async analyzeUrl(url) {
    // Skip backend analysis if not available (local dev/preview)
    if (!this.backendAvailable) {
      console.log('Backend analysis not available, using URL pattern analysis')
      return this.getFallbackUrlAnalysis(url, 'Backend not available in local mode')
    }

    try {
      const response = await fetch(`${this.baseUrl}${this.apiEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileUrl: url,
          fileName: null
        })
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch (jsonError) {
          // Response is not JSON, use status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const result = await response.json()

      if (result.success) {
        return {
          title: result.title,
          description: result.description,
          fileType: result.fileType,
          aiGenerated: true,
          analysisMethod: 'backend-ai'
        }
      } else {
        throw new Error(result.error || 'URL analysis failed')
      }

    } catch (error) {
      console.warn('Backend URL Analysis failed, using fallback:', error.message)
      return this.getFallbackUrlAnalysis(url, error.message)
    }
  }

  /**
   * Convert file to base64
   */
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        // Remove data URL prefix to get just the base64 string
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  /**
   * Fallback analysis when backend fails
   */
  getFallbackAnalysis(file, fileUrl, errorMessage) {
    const fileName = file ? file.name : (fileUrl ? fileUrl.split('/').pop() : 'Unknown')
    const fileType = this.detectFileType(fileName, fileUrl)
    
    let title = 'Unknown File'
    let description = `Analysis failed: ${errorMessage}`

    // Smart fallback based on filename patterns
    if (fileName) {
      const lowerFileName = fileName.toLowerCase()
      
      if (lowerFileName.includes('resume') || lowerFileName.includes('cv')) {
        title = 'Professional Resume'
        description = 'A comprehensive overview of professional experience and qualifications.'
      } else if (lowerFileName.includes('portfolio') || lowerFileName.includes('design')) {
        title = 'Creative Portfolio'
        description = 'A showcase of design work and creative projects.'
      } else if (lowerFileName.includes('mockup') || lowerFileName.includes('ui')) {
        title = 'UI/UX Design'
        description = 'A visual representation of user interface design concepts.'
      } else if (lowerFileName.includes('screenshot')) {
        title = 'Application Screenshot'
        description = 'A screenshot capturing application interface or functionality.'
      } else if (fileType === 'pdf') {
        title = `PDF: ${fileName.replace(/\.[^/.]+$/, "")}`
        description = 'A PDF document containing professional or creative content.'
      } else if (fileType === 'image') {
        title = `Image: ${fileName.replace(/\.[^/.]+$/, "")}`
        description = 'A visual asset that could be used in portfolio presentation.'
      } else {
        title = fileName.replace(/\.[^/.]+$/, "")
        description = 'A file uploaded to the portfolio for professional presentation.'
      }
    }

    return {
      title,
      description,
      fileType,
      aiGenerated: false,
      fallback: true,
      error: errorMessage
    }
  }

  /**
   * Fallback URL analysis when backend fails
   */
  getFallbackUrlAnalysis(url, errorMessage) {
    let title = 'Web Link'
    let description = `Analysis failed: ${errorMessage}`
    let fileType = 'link'

    // Pattern-based URL analysis
    if (url.includes('github.com')) {
      title = 'GitHub Repository'
      description = 'A software development project hosted on GitHub.'
      fileType = 'github'
    } else if (url.includes('figma.com')) {
      title = 'Figma Design'
      description = 'A design project or prototype created in Figma.'
      fileType = 'figma'
    } else if (url.includes('behance.net')) {
      title = 'Behance Project'
      description = 'A creative project showcased on Behance.'
      fileType = 'behance'
    } else if (url.includes('dribbble.com')) {
      title = 'Dribbble Shot'
      description = 'A design concept or animation shared on Dribbble.'
      fileType = 'dribbble'
    } else if (url.includes('loom.com')) {
      title = 'Loom Recording'
      description = 'A video recording or presentation shared via Loom.'
      fileType = 'video'
    } else if (url.includes('codepen.io')) {
      title = 'CodePen Demo'
      description = 'An interactive code snippet or web experiment.'
      fileType = 'demo'
    }

    return {
      title,
      description,
      fileType,
      aiGenerated: false,
      fallback: true,
      error: errorMessage
    }
  }

  /**
   * Detect file type from filename or URL
   */
  detectFileType(fileName, url) {
    if (fileName) {
      if (fileName.toLowerCase().endsWith('.pdf')) return 'pdf'
      if (fileName.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return 'image'
      if (fileName.match(/\.(doc|docx)$/i)) return 'document'
      if (fileName.match(/\.(ppt|pptx)$/i)) return 'presentation'
    }
    
    if (url) {
      if (url.includes('github.com')) return 'github'
      if (url.includes('figma.com')) return 'figma'
      if (url.includes('behance.net')) return 'behance'
      if (url.includes('dribbble.com')) return 'dribbble'
      if (url.includes('loom.com')) return 'video'
      if (url.includes('codepen.io')) return 'demo'
      return 'link'
    }
    
    return 'unknown'
  }

  /**
   * Check if backend AI analysis is available
   */
  isAIAnalysisAvailable() {
    // Backend analysis is only available in production with API functions
    return this.backendAvailable && !!(import.meta.env.VITE_OPENAI_API_KEY)
  }

  /**
   * Get analysis capabilities info
   */
  getCapabilities() {
    return {
      advancedAI: this.isAIAnalysisAvailable(),
      supportedTypes: ['pdf', 'image', 'github', 'figma', 'behance', 'dribbble', 'link'],
      features: {
        pdfTextExtraction: true,
        gpt4Vision: this.isAIAnalysisAvailable(),
        linkMetadata: true,
        fallbackAnalysis: true
      }
    }
  }
}

export default new AIAnalysisService()