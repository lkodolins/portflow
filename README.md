# Portflow

> **Your messy work. Beautifully shown.**

Portflow is an MVP web app that helps freelancers and creatives instantly generate clean, scrollable portfolios from messy, unorganized files.

![Portflow Preview](https://via.placeholder.com/800x400/0ea5e9/ffffff?text=Portflow+Portfolio+Builder)

## 🎯 The Problem

Many freelancers lose jobs because their work is scattered across:
- Screenshots on their desktop
- PDFs in various folders  
- GitHub repositories
- Figma files
- Random zip files
- Loom recordings

## ✨ The Solution

Portflow lets you upload your work (in any format) and instantly get a beautifully formatted, scrollable portfolio page that you can share with clients.

## 🚀 Features

### Core Functionality
- **📁 File Upload**: Drag & drop images, PDFs, ZIP files
- **🔗 Link Integration**: Paste GitHub, Figma, Loom, or any links
- **🤖 AI-Powered Summaries**: Auto-generated project titles and descriptions (simulated)
- **✏️ Inline Editing**: Edit project titles and descriptions directly
- **📱 Responsive Design**: Beautiful on desktop and mobile
- **🔗 Shareable Links**: Instant portfolio URLs for clients

### Design Features
- Minimalist, clean design inspired by super.so
- Smooth animations with Framer Motion
- Rounded corners and modern typography
- Neutral and pastel color scheme
- Hover states and micro-interactions

## 🛠 Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **File Handling**: React Dropzone
- **Font**: Inter (Google Fonts)

## 🏗 Project Structure

```
portflow/
├── src/
│   ├── components/
│   │   ├── HeroSection.jsx       # Landing hero section
│   │   ├── UploadSection.jsx     # File upload & link input
│   │   ├── PortfolioPreview.jsx  # Project grid/list view
│   │   ├── ProjectCard.jsx       # Individual project cards
│   │   ├── PublishSection.jsx    # Call-to-action section
│   │   ├── PublishModal.jsx      # Success modal with share link
│   │   └── EditableText.jsx      # Inline text editing utility
│   ├── App.jsx                   # Main app component
│   ├── main.jsx                  # React entry point
│   └── index.css                 # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#0ea5e9 to #0284c7)
- **Secondary**: Rose accent (#f43f5e)
- **Neutral**: Gray scale for backgrounds and text
- **Success**: Green for confirmations

### Typography
- **Font**: Inter (variable weight)
- **Hierarchy**: 5xl/6xl for headlines, xl for subheadings, base for body

### Spacing
- **Border Radius**: 2xl (1rem) for cards, 3xl (1.5rem) for special elements
- **Padding**: Consistent 8-unit spacing grid
- **Gaps**: 4-6 units for components, 16 units for sections

## 🎬 User Flow

1. **Hero Section**: User lands and sees clear value proposition
2. **Upload Zone**: Drag & drop files or paste links
3. **AI Processing**: Automatic project data generation (mock)
4. **Preview**: Projects displayed in beautiful cards
5. **Edit**: Inline editing of titles and descriptions
6. **Publish**: Generate shareable portfolio link
7. **Share**: Copy link or share on social media

## 📱 Component Breakdown

### HeroSection
- Animated headline with gradient text
- Call-to-action buttons
- Preview mockup with blur effects

### UploadSection  
- Dual upload zones (files + links)
- Drag & drop with visual feedback
- File type detection and icons
- Mock AI project generation

### PortfolioPreview
- Grid/list view toggle
- Animated project cards
- Portfolio statistics
- Responsive layout

### ProjectCard
- Preview thumbnails
- Type-based icons and colors
- Inline editing capabilities
- Remove functionality
- External link actions

### PublishModal
- Success animation
- Shareable link generation
- Copy to clipboard
- Social media sharing
- Mobile-optimized

## 🔧 Setup & Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/portflow.git
cd portflow

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Development Server
The app runs on `http://localhost:5173` by default.

## 🎯 MVP Scope & Limitations

### What's Included ✅
- Complete UI/UX flow
- File upload simulation
- Mock AI project generation
- Responsive design
- Shareable links (fake URLs)
- Social sharing buttons

### What's Excluded (for speed) ❌
- Real backend/database
- Actual file storage
- Real AI integration
- User authentication
- Persistent data
- Real portfolio hosting

## 🚀 Future Enhancements

### Phase 2 Features
- [ ] User accounts and login
- [ ] Real file storage (S3/Cloudinary)
- [ ] Actual AI integration (OpenAI)
- [ ] Custom domain support
- [ ] Portfolio templates
- [ ] Analytics dashboard
- [ ] Team collaboration

### Phase 3 Features
- [ ] Payment integration
- [ ] Custom branding
- [ ] Portfolio password protection
- [ ] SEO optimization
- [ ] Portfolio themes
- [ ] Export to PDF

## 🎨 Design Philosophy

Portflow follows these design principles:

1. **Simplicity First**: Clean, uncluttered interface
2. **Speed**: Instant results and fast interactions  
3. **Beauty**: Professional, modern aesthetic
4. **Accessibility**: Clear hierarchy and readable text
5. **Mobile-First**: Responsive across all devices

## 📄 License

MIT License - feel free to use this project as inspiration or starting point for your own portfolio tools.

## 🤝 Contributing

This is an MVP project, but contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests
- Improve documentation

---

**Built with ❤️ for the creative community** 