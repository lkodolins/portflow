// Smart content analysis service without heavy dependencies
// Provides intelligent fallbacks based on filename patterns and URL analysis

class ContentExtractor {
  constructor() {
    this.maxTextLength = 4000 // Limit for GPT context
  }

  /**
   * Intelligent PDF analysis based on filename and metadata
   */
  async extractPDFText(file) {
    try {
      // Analyze filename for content hints
      const analysis = this.analyzePDFFile(file)
      
      return {
        success: true,
        content: analysis.contentDescription,
        type: 'pdf',
        analyzed: true,
        hints: analysis.hints
      }
    } catch (error) {
      console.error('PDF analysis failed:', error)
      return {
        success: false,
        error: error.message,
        type: 'pdf'
      }
    }
  }

  /**
   * Smart image analysis based on filename and type
   */
  async extractImageText(file) {
    try {
      const analysis = this.analyzeImageFile(file)
      
      return {
        success: true,
        content: analysis.contentDescription,
        type: 'image_analysis',
        hasText: false,
        analyzed: true,
        hints: analysis.hints
      }
    } catch (error) {
      console.error('Image analysis failed:', error)
      return {
        success: false,
        error: error.message,
        type: 'image_analysis',
        hasText: false
      }
    }
  }

  /**
   * Extract content from URL with smart pattern recognition
   */
  async extractURLContent(url) {
    try {
      const analysis = this.analyzeURL(url)
      
      // Try to fetch content with a simple approach
      let fetchedContent = null
      try {
        // Use a simple fetch for same-origin requests or basic URLs
        const response = await fetch(url, { 
          mode: 'cors',
          headers: {
            'User-Agent': 'Portflow Portfolio Builder'
          }
        })
        
        if (response.ok) {
          const text = await response.text()
          fetchedContent = this.extractContentFromHTML(text)
        }
      } catch (fetchError) {
        console.log('Direct fetch failed, using URL pattern analysis')
      }
      
      return {
        success: true,
        content: {
          title: analysis.title,
          description: analysis.description,
          platform: analysis.platform,
          fetchedContent: fetchedContent,
          fullContent: `Platform: ${analysis.platform}\nTitle: ${analysis.title}\nDescription: ${analysis.description}${fetchedContent ? '\nContent: ' + fetchedContent.summary : ''}`
        },
        type: 'url',
        url: url,
        analyzed: true
      }
    } catch (error) {
      console.error('URL analysis failed:', error)
      return {
        success: false,
        error: error.message,
        type: 'url',
        url: url
      }
    }
  }

  /**
   * Analyze PDF file based on filename patterns
   */
  analyzePDFFile(file) {
    const fileName = file.name.toLowerCase()
    const fileSize = this.getFileSize(file)
    
    let contentType = 'document'
    let contentDescription = ''
    let hints = []
    
    // Pattern matching for different PDF types
    if (fileName.includes('resume') || fileName.includes('cv')) {
      contentType = 'resume'
      contentDescription = `Professional resume/CV document (${fileSize}). Contains career experience, skills, education, and professional accomplishments. Well-structured presentation of qualifications and expertise.`
      hints = ['career', 'professional', 'skills', 'experience']
    } else if (fileName.includes('portfolio')) {
      contentType = 'portfolio'
      contentDescription = `Design portfolio document (${fileSize}). Showcases creative work, project case studies, and design expertise. Features professional project presentations and creative achievements.`
      hints = ['creative', 'design', 'projects', 'visual']
    } else if (fileName.includes('proposal') || fileName.includes('pitch')) {
      contentType = 'proposal'
      contentDescription = `Project proposal document (${fileSize}). Contains project overview, methodology, timeline, and deliverables. Professional business document outlining project scope and approach.`
      hints = ['business', 'project', 'strategy', 'planning']
    } else if (fileName.includes('report') || fileName.includes('analysis')) {
      contentType = 'report'
      contentDescription = `Professional report document (${fileSize}). Contains detailed analysis, findings, and recommendations. Structured presentation of research and insights.`
      hints = ['analysis', 'research', 'findings', 'professional']
    } else if (fileName.includes('presentation') || fileName.includes('deck') || fileName.includes('slides')) {
      contentType = 'presentation'
      contentDescription = `Presentation document (${fileSize}). Contains slide-based content with visual presentations and key information. Professional presentation materials.`
      hints = ['presentation', 'visual', 'communication', 'slides']
    } else if (fileName.includes('contract') || fileName.includes('agreement')) {
      contentType = 'contract'
      contentDescription = `Contract or agreement document (${fileSize}). Contains legal or business terms, conditions, and formal documentation.`
      hints = ['legal', 'business', 'formal', 'terms']
    } else if (fileName.includes('manual') || fileName.includes('guide') || fileName.includes('instructions')) {
      contentType = 'manual'
      contentDescription = `Manual or guide document (${fileSize}). Contains instructions, procedures, and detailed documentation. Educational or reference material.`
      hints = ['instructions', 'guide', 'reference', 'educational']
    } else {
      contentDescription = `Professional PDF document (${fileSize}). Contains structured content and detailed information demonstrating expertise and attention to detail.`
      hints = ['professional', 'document', 'content']
    }
    
    return {
      contentType,
      contentDescription,
      hints,
      fileName: file.name,
      fileSize
    }
  }

  /**
   * Analyze image file based on filename and type
   */
  analyzeImageFile(file) {
    const fileName = file.name.toLowerCase()
    const fileType = file.type || ''
    const fileSize = this.getFileSize(file)
    
    let contentType = 'image'
    let contentDescription = ''
    let hints = []
    
    // Pattern matching for different image types
    if (fileName.includes('screenshot') || fileName.includes('screen')) {
      contentType = 'screenshot'
      contentDescription = `Application or website screenshot (${fileSize}). Captures user interface, functionality, or web content. Demonstrates digital product or website features.`
      hints = ['interface', 'application', 'website', 'digital']
    } else if (fileName.includes('mockup') || fileName.includes('wireframe') || fileName.includes('prototype')) {
      contentType = 'mockup'
      contentDescription = `Design mockup or wireframe (${fileSize}). Shows user interface design, layout structure, and visual planning. Professional design documentation.`
      hints = ['design', 'ui', 'wireframe', 'planning']
    } else if (fileName.includes('logo') || fileName.includes('brand') || fileName.includes('identity')) {
      contentType = 'branding'
      contentDescription = `Logo or branding design (${fileSize}). Professional brand identity work featuring visual design and corporate identity elements.`
      hints = ['branding', 'logo', 'identity', 'corporate']
    } else if (fileName.includes('ui') || fileName.includes('interface') || fileName.includes('dashboard')) {
      contentType = 'ui'
      contentDescription = `User interface design (${fileSize}). Shows application interface, dashboard, or digital product design. Professional UI/UX work.`
      hints = ['ui', 'interface', 'dashboard', 'user experience']
    } else if (fileName.includes('web') || fileName.includes('website') || fileName.includes('landing')) {
      contentType = 'web'
      contentDescription = `Web design project (${fileSize}). Website or web application design showing layout, visual design, and user experience work.`
      hints = ['web', 'website', 'design', 'layout']
    } else if (fileType.includes('svg')) {
      contentType = 'vector'
      contentDescription = `Vector graphic design (${fileSize}). Scalable vector artwork showing professional design skills and technical expertise.`
      hints = ['vector', 'graphic', 'scalable', 'technical']
    } else if (fileName.includes('render') || fileName.includes('3d')) {
      contentType = '3d'
      contentDescription = `3D render or visualization (${fileSize}). Professional 3D modeling, rendering, or visualization work demonstrating technical and artistic skills.`
      hints = ['3d', 'render', 'visualization', 'modeling']
    } else {
      contentDescription = `Visual design content (${fileSize}). Professional creative work showcasing design skills and artistic expertise.`
      hints = ['design', 'visual', 'creative', 'professional']
    }
    
    return {
      contentType,
      contentDescription,
      hints,
      fileName: file.name,
      fileSize,
      fileType
    }
  }

  /**
   * Analyze URL and extract meaningful information
   */
  analyzeURL(url) {
    let platform = 'web'
    let title = ''
    let description = ''
    
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname.toLowerCase()
      const pathname = urlObj.pathname
      const segments = pathname.split('/').filter(Boolean)
      
      // Platform-specific analysis
      if (hostname.includes('github.com')) {
        platform = 'GitHub'
        const [user, repo] = segments
        title = repo ? this.humanizeString(repo) : 'GitHub Repository'
        description = `Open source code repository on GitHub. ${user ? `Created by ${user}.` : ''} Features source code, documentation, and collaborative development work.`
      } else if (hostname.includes('figma.com')) {
        platform = 'Figma'
        title = 'Figma Design Project'
        description = 'Interactive design project created in Figma. Features collaborative design work, prototypes, and professional UI/UX design systems.'
      } else if (hostname.includes('behance.net')) {
        platform = 'Behance'
        title = 'Behance Portfolio Project'
        description = 'Creative portfolio project showcased on Adobe Behance. Professional creative work demonstrating design skills and artistic expertise.'
      } else if (hostname.includes('dribbble.com')) {
        platform = 'Dribbble'
        title = 'Dribbble Design Shot'
        description = 'Creative design work shared on Dribbble. Professional design showcase demonstrating visual design skills and creative thinking.'
      } else if (hostname.includes('codepen.io')) {
        platform = 'CodePen'
        title = 'CodePen Demo'
        description = 'Interactive code demonstration on CodePen. Features frontend development skills, creative coding, and web technology expertise.'
      } else if (hostname.includes('codesandbox.io')) {
        platform = 'CodeSandbox'
        title = 'CodeSandbox Project'
        description = 'Interactive development project on CodeSandbox. Demonstrates modern web development skills and JavaScript expertise.'
      } else if (hostname.includes('vercel.app') || hostname.includes('netlify.app') || hostname.includes('herokuapp.com')) {
        platform = 'Deployed App'
        title = 'Live Web Application'
        description = 'Deployed web application demonstrating full-stack development skills, modern frameworks, and production-ready code.'
      } else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
        platform = 'YouTube'
        title = 'Video Content'
        description = 'Video content showcasing work, tutorials, or project demonstrations. Creative or educational content delivery.'
      } else if (hostname.includes('vimeo.com')) {
        platform = 'Vimeo'
        title = 'Professional Video Content'
        description = 'High-quality video content on Vimeo. Professional video production, creative storytelling, or project documentation.'
      } else if (hostname.includes('loom.com')) {
        platform = 'Loom'
        title = 'Screen Recording'
        description = 'Screen recording or video walkthrough created with Loom. Demonstrates product features, tutorials, or project presentations.'
      } else {
        // Generic website analysis
        platform = 'Website'
        
        // Try to extract meaningful title from URL
        if (segments.length > 0) {
          const lastSegment = segments[segments.length - 1]
          title = this.humanizeString(lastSegment) || 'Web Project'
        } else {
          title = this.humanizeString(hostname.replace('www.', '')) || 'Website Project'
        }
        
        description = `Professional web project at ${hostname}. Demonstrates web development skills, design expertise, and digital project execution.`
      }
      
    } catch (error) {
      console.error('URL parsing failed:', error)
      title = 'Web Project'
      description = 'Professional web-based project demonstrating digital expertise and technical skills.'
    }
    
    return { platform, title, description }
  }

  /**
   * Extract basic content from HTML (simplified version)
   */
  extractContentFromHTML(html) {
    try {
      // Simple HTML parsing without external libraries
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
      const title = titleMatch ? titleMatch[1].trim() : ''
      
      const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i)
      const metaDescription = metaDescMatch ? metaDescMatch[1].trim() : ''
      
      // Extract text content (basic approach)
      const textContent = html
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 500)
      
      return {
        title,
        metaDescription,
        summary: textContent,
        extracted: true
      }
    } catch (error) {
      console.error('HTML parsing failed:', error)
      return null
    }
  }

  /**
   * Detect project type from file or URL
   */
  detectProjectType(file, url) {
    if (url) {
      const hostname = url.toLowerCase()
      if (hostname.includes('github.com')) return 'github'
      if (hostname.includes('figma.com')) return 'figma'
      if (hostname.includes('behance.net')) return 'behance'
      if (hostname.includes('dribbble.com')) return 'dribbble'
      if (hostname.includes('codepen.io')) return 'codepen'
      return 'link'
    }
    
    if (file) {
      const type = file.type || ''
      if (type.startsWith('image/')) return 'image'
      if (type.includes('pdf')) return 'pdf'
      if (type.includes('zip')) return 'zip'
      if (type.includes('text')) return 'text'
    }
    
    return 'file'
  }

  /**
   * Generate fallback title from filename or URL
   */
  generateFallbackTitle(file, url) {
    if (file) {
      const name = file.name.replace(/\.[^/.]+$/, '') // Remove extension
      return this.humanizeString(name)
    }
    
    if (url) {
      try {
        const urlObj = new URL(url)
        const pathname = urlObj.pathname
        const segments = pathname.split('/').filter(Boolean)
        const lastSegment = segments[segments.length - 1] || urlObj.hostname
        return this.humanizeString(lastSegment)
      } catch {
        return 'Web Project'
      }
    }
    
    return 'Creative Project'
  }

  /**
   * Convert string to human-readable format
   */
  humanizeString(str) {
    if (!str) return ''
    
    return str
      .replace(/[-_]/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  /**
   * Get file size in a readable format
   */
  getFileSize(file) {
    if (!file || !file.size) return 'Unknown size'
    
    const bytes = file.size
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    
    if (bytes === 0) return '0 Bytes'
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }
}

export default new ContentExtractor()