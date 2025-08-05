# 🗄️ Supabase Integration Setup

Complete guide to setting up Supabase backend for Portflow portfolio persistence and file storage.

## 🚀 **Quick Setup**

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and create account
2. Click "New Project"
3. Choose organization and name your project (e.g., "portflow-backend")
4. Set a secure database password
5. Choose region closest to your users
6. Wait for project to initialize (~2 minutes)

### 2. Get API Credentials
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy the **Project URL** (looks like: `https://abcdefgh.supabase.co`)
3. Copy the **anon/public key** (starts with `eyJhbGciOiJIUzI1NiI...`)
4. Add these to your `.env.local` file:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## 📊 **Database Schema**

### Create Required Tables

Go to **SQL Editor** in Supabase dashboard and run these commands:

#### 1. Portfolios Table
```sql
-- Create portfolios table
CREATE TABLE portfolios (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL DEFAULT 'My Portfolio',
    description TEXT DEFAULT 'A collection of my creative work',
    slug VARCHAR(50) UNIQUE NOT NULL,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index for faster slug lookups
CREATE INDEX idx_portfolios_slug ON portfolios(slug);
CREATE INDEX idx_portfolios_public ON portfolios(is_public);

-- Enable Row Level Security
ALTER TABLE portfolios ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public portfolios are viewable by everyone"
ON portfolios FOR SELECT
USING (is_public = true);

-- Create policy for insert (anyone can create)
CREATE POLICY "Anyone can create portfolios"
ON portfolios FOR INSERT
WITH CHECK (true);
```

#### 2. Portfolio Items Table
```sql
-- Create portfolio_items table
CREATE TABLE portfolio_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    notes TEXT,
    type VARCHAR(50) NOT NULL, -- 'image', 'pdf', 'github', 'figma', 'link', etc.
    url TEXT, -- external URL if applicable
    file_url TEXT, -- Supabase storage URL if file was uploaded
    file_name TEXT, -- original filename
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX idx_portfolio_items_portfolio_id ON portfolio_items(portfolio_id);
CREATE INDEX idx_portfolio_items_sort_order ON portfolio_items(portfolio_id, sort_order);

-- Enable Row Level Security
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (linked to public portfolios)
CREATE POLICY "Portfolio items are viewable for public portfolios"
ON portfolio_items FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM portfolios 
        WHERE portfolios.id = portfolio_items.portfolio_id 
        AND portfolios.is_public = true
    )
);

-- Create policy for insert (anyone can add items)
CREATE POLICY "Anyone can create portfolio items"
ON portfolio_items FOR INSERT
WITH CHECK (true);
```

#### 3. Auto-update Timestamps
```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for portfolios table
CREATE TRIGGER update_portfolios_updated_at 
    BEFORE UPDATE ON portfolios 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## 📁 **Storage Setup**

### Create Storage Bucket

1. Go to **Storage** in Supabase dashboard
2. Click **New Bucket**
3. Name: `portfolios`
4. Set as **Public bucket** ✅
5. Click **Create bucket**

### Configure Bucket Policies

Go to **SQL Editor** and run:

```sql
-- Storage policy for portfolios bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolios', 'portfolios', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Policy for public read access
CREATE POLICY "Public portfolio files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolios');

-- Policy for authenticated uploads (or public uploads)
CREATE POLICY "Anyone can upload portfolio files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolios');

-- Policy for file deletion (optional)
CREATE POLICY "Anyone can delete their portfolio files"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolios');
```

## 🔧 **Verification**

### Test Your Setup

Add this test component to verify everything works:

```javascript
// src/components/SupabaseTest.jsx
import { useState } from 'react'
import { supabase } from '../services/supabase'

const SupabaseTest = () => {
  const [status, setStatus] = useState('Testing...')

  const testConnection = async () => {
    try {
      // Test database connection
      const { data, error } = await supabase
        .from('portfolios')
        .select('count(*)')
        
      if (error) throw error
      
      // Test storage
      const { data: buckets, error: storageError } = await supabase
        .storage
        .listBuckets()
        
      if (storageError) throw storageError
      
      const hasBucket = buckets.some(bucket => bucket.name === 'portfolios')
      
      setStatus(`✅ Database: Connected | Storage: ${hasBucket ? 'Ready' : 'Missing bucket'}`)
    } catch (error) {
      setStatus(`❌ Error: ${error.message}`)
    }
  }

  React.useEffect(() => {
    testConnection()
  }, [])

  return (
    <div style={{ padding: '20px', background: '#f0f0f0', margin: '20px' }}>
      <h3>Supabase Connection Status</h3>
      <p>{status}</p>
    </div>
  )
}

export default SupabaseTest
```

## 🌐 **Environment Variables**

### Complete .env.local Example
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY5ODc2ODAwMCwiZXhwIjoyMDE0MzQ0MDAwfQ.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

# OpenAI (Optional)
VITE_OPENAI_API_KEY=sk-proj-your-openai-key-here

# App Config
VITE_APP_ENV=development
```

## 🚀 **Deployment Notes**

### For Production Deployment:

1. **Vercel/Netlify**: Add environment variables in dashboard
2. **Security**: Anon key is safe for frontend (designed for public use)
3. **RLS**: Row Level Security policies protect your data
4. **Scaling**: Supabase auto-scales with your usage

### Performance Optimization:

1. **Indexes**: Already created for common queries
2. **CDN**: Supabase storage includes global CDN
3. **Caching**: Enable browser caching for static assets
4. **Compression**: Supabase automatically compresses images

## 🔍 **Troubleshooting**

### Common Issues:

**"Failed to create portfolio"**
- Check if tables exist in Supabase dashboard
- Verify RLS policies are created
- Check browser console for detailed errors

**"Storage upload failed"**
- Ensure 'portfolios' bucket exists and is public
- Check storage policies are correctly set
- Verify file size limits (Supabase free tier: 1GB)

**"Portfolio not found"**
- Check if portfolio exists in portfolios table
- Verify `is_public = true` for the portfolio
- Check slug matches URL parameter

### Debug Commands:

```javascript
// Test in browser console
import { supabase } from './src/services/supabase'

// Test database
await supabase.from('portfolios').select('*').limit(1)

// Test storage
await supabase.storage.from('portfolios').list()

// Check bucket configuration
await supabase.storage.getBucket('portfolios')
```

---

**🎯 With this setup complete, Portflow will have full persistence, file uploads, and shareable portfolio URLs!**