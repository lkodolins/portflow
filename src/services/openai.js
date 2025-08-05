// Enhanced OpenAI API service with backend AI integration and content extraction
import contentExtractor from './contentExtractor'
import aiAnalysisService from './aiAnalysisService'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'

class OpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY
    this.useBackendAI = true // Prefer backend AI for enhanced analysis
  }

  async generateProjectDescription(projectInfo) {
    const { file, url, notes, fileUrl } = projectInfo
    
    // Try backend AI analysis first (Phase 2 enhancement)
    if (this.useBackendAI && aiAnalysisService.isAIAnalysisAvailable()) {
      try {
        let analysisResult = null
        
        if (file) {
          // For file uploads, use the new AI analysis service
          analysisResult = await aiAnalysisService.analyzeFile(file, fileUrl)
        } else if (url) {
          // For URL inputs, use URL analysis
          analysisResult = await aiAnalysisService.analyzeUrl(url)
        }
        
        if (analysisResult && analysisResult.title && analysisResult.description && !analysisResult.fallback) {
          // Enhance with user notes if provided
          let finalDescription = analysisResult.description
          if (notes && notes.trim()) {
            finalDescription += ` Additional context: ${notes.trim()}`
          }
          
          return {
            title: analysisResult.title,
            description: finalDescription,
            aiGenerated: analysisResult.aiGenerated,
            extractedContent: analysisResult.extractedContent,
            analysisMethod: analysisResult.analysisMethod || 'backend-ai'
          }
        }
      } catch (error) {
        console.warn('Backend AI analysis failed, falling back to legacy method:', error)
      }
    }
    
    // Fallback to legacy analysis method
    return await this.generateWithLegacyMethod(projectInfo)
  }

  async generateWithLegacyMethod(projectInfo) {
    const { file, url, notes } = projectInfo
    
    // Extract content based on file type
    let extractedContent = null
    let contentType = 'unknown'
    
    try {
      if (file) {
        extractedContent = await this.extractFileContent(file)
        contentType = contentExtractor.detectProjectType(file, null)
      } else if (url) {
        extractedContent = await contentExtractor.extractURLContent(url)
        contentType = contentExtractor.detectProjectType(null, url)
      }
    } catch (error) {
      console.error('Content extraction failed:', error)
    }
    
    // Generate description using AI if available
    if (!this.apiKey) {
      console.warn('OpenAI API key not found, using intelligent fallback')
      return this.getIntelligentFallback(projectInfo, extractedContent, contentType)
    }
    
    try {
      const result = await this.generateWithAI(projectInfo, extractedContent, contentType)
      return {
        ...result,
        analysisMethod: 'frontend-legacy'
      }
    } catch (error) {
      console.error('AI generation failed:', error)
      return this.getIntelligentFallback(projectInfo, extractedContent, contentType)
    }
  }

  async extractFileContent(file) {
    const fileType = file.type || ''
    
    if (fileType.includes('pdf')) {
      return await contentExtractor.extractPDFText(file)
    } else if (fileType.startsWith('image/')) {
      return await contentExtractor.extractImageText(file)
    }
    
    return null
  }
  
  async generateWithAI(projectInfo, extractedContent, contentType) {
    const { file, url, notes } = projectInfo
    
    // Handle images with OCR results
    if (contentType === 'image' && extractedContent) {
      if (extractedContent.hasText) {
        return await this.generateFromOCR(extractedContent.content, file, notes)
      } else {
        return await this.generateFromImageVision(file, notes)
      }
    }
    
    // Handle PDFs with extracted text
    if (contentType === 'pdf' && extractedContent?.success) {
      return await this.generateFromPDFText(extractedContent.content, file, notes)
    }
    
    // Handle URLs with extracted content
    if (contentType.includes('link') && extractedContent?.success) {
      return await this.generateFromURLContent(extractedContent.content, url, notes)
    }
    
    // Fallback to basic generation
    return await this.generateBasic(projectInfo)
  }
  
  async generateFromOCR(ocrText, file, notes) {
    const prompt = `Summarize this image based on the extracted text. Write a short title and a 1-sentence description.

Extracted text: "${ocrText}"

File: ${file.name}
Additional notes: ${notes || 'None'}

Generate a JSON response with this format:
{
  "title": "3-6 word title",
  "description": "Professional 1-2 sentence description for a portfolio"
}`
    
    return await this.callOpenAI(prompt, 'gpt-3.5-turbo')
  }
  
  async generateFromImageVision(file, notes) {
    try {
      const base64Image = await contentExtractor.imageToBase64(file)
      
      const prompt = `This image has no extractable text. Analyze its visual content and generate:
- A title (3–6 words)
- A description (1–2 sentences) describing what is shown, e.g. color, layout, subject matter.
Focus on clarity. Assume this will be used in a portfolio.

File: ${file.name}
Additional notes: ${notes || 'None'}

Respond in JSON format:
{
  "title": "Professional title",
  "description": "Clear description of visual content"
}`
      
      return await this.callOpenAIVision(prompt, base64Image)
    } catch (error) {
      console.error('Vision API failed, using fallback:', error)
      return this.getImageFallback(file, notes)
    }
  }
  
  async generateFromPDFText(pdfText, file, notes) {
    const prompt = `Generate a professional title and description for this PDF portfolio piece.

PDF Content (first 2 pages):
"${pdfText}"

File: ${file.name}
Additional notes: ${notes || 'None'}

Generate a JSON response:
{
  "title": "Professional project title",
  "description": "Engaging 2-3 sentence description highlighting skills and impact"
}`
    
    return await this.callOpenAI(prompt, 'gpt-3.5-turbo')
  }
  
  async generateFromURLContent(urlContent, url, notes) {
    const prompt = `Generate a professional title and description for this web project.

URL: ${url}
Title: ${urlContent.title}
Description: ${urlContent.metaDescription}
Key content: ${urlContent.fullContent.substring(0, 1000)}

Additional notes: ${notes || 'None'}

Generate a JSON response:
{
  "title": "Professional project title",
  "description": "Compelling 2-3 sentence description for a portfolio"
}`
    
    return await this.callOpenAI(prompt, 'gpt-3.5-turbo')
  }
  
  async generateBasic(projectInfo) {
    const prompt = this.buildBasicPrompt(projectInfo)
    return await this.callOpenAI(prompt, 'gpt-3.5-turbo')
  }
  
  buildBasicPrompt(projectInfo) {
    const { fileName, fileType, url, notes } = projectInfo
    
    let prompt = 'Generate a professional project title and description for a portfolio piece. '
    
    if (fileName) {
      prompt += `File: "${fileName}" (${fileType}). `
    }
    
    if (url) {
      prompt += `Link: ${url}. `
    }
    
    if (notes) {
      prompt += `Additional context: ${notes}. `
    }
    
    prompt += 'Create an engaging description that highlights skills, impact, and professional value. Respond in JSON format:\n{\n  "title": "Project title",\n  "description": "Professional description"\n}'
    
    return prompt
  }

  async callOpenAI(prompt, model = 'gpt-3.5-turbo') {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: 'You are a professional portfolio writer. Generate concise, impressive project descriptions for creative professionals. Always respond with valid JSON containing "title" and "description" fields.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 200,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content?.trim()
    
    try {
      return JSON.parse(content)
    } catch {
      // If JSON parsing fails, extract title and description manually
      const lines = content.split('\n').filter(line => line.trim())
      return {
        title: this.extractTitleFromText(content),
        description: lines[lines.length - 1] || 'Professional creative project'
      }
    }
  }
  
  async callOpenAIVision(prompt, base64Image) {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 200
      })
    })

    if (!response.ok) {
      throw new Error(`OpenAI Vision API error: ${response.status}`)
    }

    const data = await response.json()
    const content = data.choices[0]?.message?.content?.trim()
    
    try {
      return JSON.parse(content)
    } catch {
      return {
        title: this.extractTitleFromText(content),
        description: content || 'Visual content analysis'
      }
    }
  }
  
  extractTitleFromText(text) {
    const lines = text.split('\n')
    for (const line of lines) {
      if (line.toLowerCase().includes('title') && line.includes(':')) {
        return line.split(':')[1].trim().replace(/"/g, '')
      }
    }
    return text.split('\n')[0].substring(0, 50)
  }

  cleanFileName(fileName) {
    // Remove extension and clean up filename
    const nameWithoutExt = fileName.replace(/\.[^/.]+$/, '')
    return this.humanizeString(nameWithoutExt)
  }

  humanizeString(str) {
    return str
      .replace(/[-_]/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  capitalizeWords(str) {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  getIntelligentFallback(projectInfo, extractedContent, contentType) {
    const { file, url, notes } = projectInfo
    
    // Use extracted content for intelligent fallback
    if (extractedContent?.success) {
      if (contentType === 'pdf') {
        return this.getPDFFallback(file, extractedContent.content, notes)
      } else if (contentType === 'image') {
        return this.getImageFallback(file, extractedContent.content, notes)
      } else if (contentType.includes('link')) {
        return this.getURLFallback(url, extractedContent.content, notes)
      }
    }
    
    // Basic fallback
    return this.getBasicFallback(file, url, notes)
  }
  
  getPDFFallback(file, content, notes) {
    const title = contentExtractor.generateFallbackTitle(file, null)
    const description = `Professional PDF document showcasing ${this.getProjectContext(notes)}. ${content ? 'Contains structured content and detailed information' : 'Comprehensive documentation'} demonstrating expertise and attention to detail.`
    
    return { title, description }
  }
  
  getImageFallback(file, ocrContent, notes) {
    const title = contentExtractor.generateFallbackTitle(file, null)
    let description = `Visual ${this.getProjectContext(notes)} `
    
    if (ocrContent && ocrContent.length > 10) {
      description += `featuring structured design elements and professional presentation. Contains detailed visual information and demonstrates strong design principles.`
    } else {
      description += `showcasing creative design work and visual communication skills. Professional visual content demonstrating artistic expertise and design thinking.`
    }
    
    return { title, description }
  }
  
  getURLFallback(url, content, notes) {
    let title = contentExtractor.generateFallbackTitle(null, url)
    
    if (content?.title) {
      title = content.title.substring(0, 60)
    }
    
    let description = content?.metaDescription || `Web-based ${this.getProjectContext(notes)} demonstrating digital expertise and modern development practices.`
    
    if (description.length < 50) {
      description += ' Features professional implementation and user-focused design principles.'
    }
    
    return { title, description }
  }
  
  getBasicFallback(file, url, notes) {
    const title = contentExtractor.generateFallbackTitle(file, url)
    const context = this.getProjectContext(notes)
    
    const descriptions = [
      `Professional ${context} demonstrating creative expertise and technical proficiency. Features innovative problem-solving and attention to detail.`,
      `Comprehensive ${context} showcasing modern design principles and professional execution. Highlights skills in creative development and strategic thinking.`,
      `Strategic ${context} reflecting expertise in creative solutions and professional delivery. Demonstrates strong technical skills and design methodology.`
    ]
    
    return {
      title,
      description: descriptions[Math.floor(Math.random() * descriptions.length)]
    }
  }
  
  getProjectContext(notes) {
    if (!notes) return 'creative project'
    
    const lowerNotes = notes.toLowerCase()
    
    if (lowerNotes.includes('web') || lowerNotes.includes('website')) return 'web development project'
    if (lowerNotes.includes('app') || lowerNotes.includes('mobile')) return 'application development'
    if (lowerNotes.includes('brand') || lowerNotes.includes('logo')) return 'branding project'
    if (lowerNotes.includes('ui') || lowerNotes.includes('interface')) return 'interface design'
    if (lowerNotes.includes('graphic') || lowerNotes.includes('design')) return 'design project'
    
    return 'creative project'
  }
}

export default new OpenAIService()