// Vercel API function for advanced AI file analysis
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

// Helper function to extract PDF text using pdf-parse
async function extractPDFText(fileBuffer) {
  try {
    // Dynamic import to avoid bundling issues
    const pdf = await import('pdf-parse')
    const data = await pdf.default(fileBuffer)
    
    // Return first 2000 characters to stay within token limits
    return data.text.substring(0, 2000)
  } catch (error) {
    console.error('PDF extraction failed:', error)
    return null
  }
}

// Helper function to extract link metadata
async function extractLinkMetadata(url) {
  try {
    // Use a CORS proxy for fetching external URLs
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`
    const response = await fetch(proxyUrl)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    const html = data.contents
    
    // Extract metadata using regex (simple but effective)
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i)
    const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']+)["']/i)
    
    return {
      title: titleMatch ? titleMatch[1].trim() : null,
      description: descriptionMatch ? descriptionMatch[1].trim() : null,
      url: url
    }
  } catch (error) {
    console.error('Link metadata extraction failed:', error)
    return { title: null, description: null, url }
  }
}

// Helper function to detect file type
function detectFileType(fileUrl, fileName) {
  if (fileName) {
    if (fileName.toLowerCase().endsWith('.pdf')) return 'pdf'
    if (fileName.match(/\.(jpg|jpeg|png|gif|svg|webp)$/i)) return 'image'
  }
  
  if (fileUrl.startsWith('http')) {
    if (fileUrl.includes('github.com')) return 'github'
    if (fileUrl.includes('figma.com')) return 'figma'
    if (fileUrl.includes('behance.net')) return 'behance'
    if (fileUrl.includes('dribbble.com')) return 'dribbble'
    return 'link'
  }
  
  return 'unknown'
}

// Main analysis function
async function analyzeWithAI(input) {
  const { fileType, fileUrl, extractedText, metadata, fileName } = input
  
  let prompt = ''
  let model = 'gpt-3.5-turbo'
  let messages = []
  
  try {
    switch (fileType) {
      case 'pdf':
        if (extractedText) {
          prompt = `You're building a personal portfolio. Analyze this PDF document and return:
- A short, relevant title (2–5 words)
- A 1–2 sentence summary describing the type of content and purpose.

Document content: "${extractedText}"

Only return JSON like this:
{ "title": "UX Research Notes", "description": "A PDF summarizing research findings and user feedback from recent usability tests." }`
        } else {
          // Fallback based on filename
          const baseName = fileName ? fileName.replace(/\.[^/.]+$/, "") : "Document"
          return {
            title: `PDF: ${baseName}`,
            description: `A PDF document that couldn't be analyzed. Filename: ${fileName || 'Unknown'}`
          }
        }
        break
        
      case 'image':
        // Use GPT-4 Vision for image analysis
        model = 'gpt-4-vision-preview'
        messages = [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You're helping someone organize their creative and professional portfolio. Given this image, generate:
- A descriptive title (2–5 words)
- A sentence describing what the image likely represents (mockup, screenshot, artwork, etc.)

Return only JSON like this:
{ "title": "App Login Screen", "description": "Screenshot of login UI with modern branding and clean design." }`
              },
              {
                type: 'image_url',
                image_url: { url: fileUrl }
              }
            ]
          }
        ]
        break
        
      case 'github':
      case 'figma':
      case 'behance':
      case 'dribbble':
      case 'link':
        if (metadata && (metadata.title || metadata.description)) {
          prompt = `Given this web page metadata, summarize it for a portfolio:
Title: ${metadata.title || 'No title'}
Description: ${metadata.description || 'No description'}
URL: ${metadata.url}

Return JSON like this:
{ "title": "GitHub Project", "description": "Open-source code for a React portfolio website" }`
        } else {
          // Fallback based on URL patterns
          let title = 'Web Link'
          let description = `A link to ${fileUrl}`
          
          if (fileType === 'github') {
            title = 'GitHub Repository'
            description = 'A software development project hosted on GitHub'
          } else if (fileType === 'figma') {
            title = 'Figma Design'
            description = 'A design project or prototype created in Figma'
          } else if (fileType === 'behance') {
            title = 'Behance Project'
            description = 'A creative project showcased on Behance'
          } else if (fileType === 'dribbble') {
            title = 'Dribbble Shot'
            description = 'A design concept or animation shared on Dribbble'
          }
          
          return { title, description }
        }
        break
        
      default:
        return {
          title: 'Unknown File',
          description: 'This file type could not be analyzed'
        }
    }
    
    // Make OpenAI API call
    const response = await openai.createChatCompletion({
      model: model,
      messages: messages.length > 0 ? messages : [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
      response_format: { type: "json_object" }
    })
    
    const content = response.data.choices[0]?.message?.content
    
    if (content) {
      try {
        const parsed = JSON.parse(content)
        return {
          title: parsed.title || 'Untitled',
          description: parsed.description || 'No description available'
        }
      } catch (parseError) {
        console.error('Failed to parse OpenAI response:', content)
        throw new Error('Invalid JSON response from AI')
      }
    } else {
      throw new Error('No response from AI')
    }
    
  } catch (error) {
    console.error('AI analysis failed:', error)
    
    // Fallback responses based on type
    const fallbacks = {
      pdf: { title: 'PDF Document', description: 'A PDF file that could not be analyzed' },
      image: { title: 'Image File', description: 'An image that could not be analyzed' },
      github: { title: 'GitHub Link', description: 'A link to a GitHub repository' },
      figma: { title: 'Figma Design', description: 'A link to a Figma design project' },
      link: { title: 'Web Link', description: 'A link to an external website' }
    }
    
    return fallbacks[fileType] || { title: 'Unknown File', description: 'File could not be analyzed' }
  }
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  try {
    const { fileUrl, fileName, fileBuffer } = req.body
    
    if (!fileUrl && !fileBuffer) {
      return res.status(400).json({ error: 'fileUrl or fileBuffer is required' })
    }
    
    // Detect file type
    const fileType = detectFileType(fileUrl, fileName)
    
    let extractedText = null
    let metadata = null
    
    // Extract content based on file type
    switch (fileType) {
      case 'pdf':
        if (fileBuffer) {
          // Convert base64 to buffer if needed
          const buffer = Buffer.isBuffer(fileBuffer) 
            ? fileBuffer 
            : Buffer.from(fileBuffer, 'base64')
          extractedText = await extractPDFText(buffer)
        } else if (fileUrl) {
          // Fetch PDF from URL
          const response = await fetch(fileUrl)
          const arrayBuffer = await response.arrayBuffer()
          const buffer = Buffer.from(arrayBuffer)
          extractedText = await extractPDFText(buffer)
        }
        break
        
      case 'github':
      case 'figma':
      case 'behance':
      case 'dribbble':
      case 'link':
        metadata = await extractLinkMetadata(fileUrl)
        break
        
      case 'image':
        // For images, we'll pass the URL directly to GPT-4 Vision
        break
    }
    
    // Analyze with AI
    const result = await analyzeWithAI({
      fileType,
      fileUrl,
      extractedText,
      metadata,
      fileName
    })
    
    return res.status(200).json({
      success: true,
      ...result,
      fileType,
      extractedText: extractedText ? extractedText.substring(0, 100) + '...' : null // Return preview
    })
    
  } catch (error) {
    console.error('Analysis failed:', error)
    return res.status(500).json({
      success: false,
      error: error.message,
      fallback: {
        title: 'Analysis Failed',
        description: 'This file could not be analyzed due to a technical error'
      }
    })
  }
}