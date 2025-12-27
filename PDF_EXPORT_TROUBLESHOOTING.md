# PDF Export Troubleshooting Guide

## What I Fixed

1. ✅ **API URL** - Updated to use port 5001 (or your configured port)
2. ✅ **HTML Escaping** - Fixed security issues with special characters
3. ✅ **Client-Side Fallback** - Added backup PDF generation if backend fails
4. ✅ **Better Error Handling** - More informative error messages
5. ✅ **Puppeteer Configuration** - Added Windows-compatible flags

## How to Test

1. **Make sure both servers are running:**
   - Backend on port 5001
   - Frontend on port 3000

2. **Fill in some resume data** (at least your name)

3. **Click "Export PDF" button**

4. **Check what happens:**
   - ✅ **Success**: PDF downloads automatically
   - ❌ **Error**: Check the steps below

## Common Issues & Solutions

### Issue 1: "Failed to generate PDF" Error

**Check the backend terminal** for error messages. Common causes:

#### A. Puppeteer Not Installed
```powershell
cd backend
npm install puppeteer
```

#### B. Puppeteer Browser Download Failed
Puppeteer needs to download Chromium. If it fails:
```powershell
cd backend
npm install puppeteer --force
```

Or set environment variable:
```powershell
$env:PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
npm install puppeteer
```

#### C. Windows Firewall Blocking
- Allow Node.js through Windows Firewall when prompted
- Or manually add exception for Node.js

### Issue 2: PDF Downloads But Is Empty/Corrupted

**Solution**: The client-side fallback should work. If backend fails, it automatically tries client-side generation.

### Issue 3: "Connection Refused" Error

**Check:**
1. Is backend running? Look for "Server running on port 5001"
2. Is the API URL correct in `frontend/.env.local`?
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```
3. Restart frontend after changing `.env.local`

### Issue 4: Puppeteer Timeout

**Solution**: Increase timeout in `backend/services/pdfService.js`:
```javascript
await page.setContent(html, { 
  waitUntil: 'networkidle0',
  timeout: 60000  // 60 seconds
})
```

### Issue 5: PDF Generation Is Very Slow

**This is normal** - Puppeteer needs to:
1. Launch browser
2. Render HTML
3. Generate PDF

First generation is slower (5-10 seconds). Subsequent ones are faster (2-5 seconds).

## Testing Backend PDF Directly

Test if backend PDF works by making a direct API call:

```powershell
# In PowerShell
$body = @{
    resumeData = @{
        personalInfo = @{
            fullName = "Test User"
            email = "test@example.com"
        }
        experiences = @()
        education = @()
        projects = @()
        skills = @()
        certifications = @()
        languages = @()
        template = "modern"
    }
} | ConvertTo-Json -Depth 10

Invoke-WebRequest -Uri "http://localhost:5001/api/pdf/generate" `
    -Method POST `
    -Body $body `
    -ContentType "application/json" `
    -OutFile "test-resume.pdf"
```

If this works, the backend is fine. If not, check backend terminal for errors.

## Enable Client-Side Only Mode

If Puppeteer keeps failing, you can force client-side generation by modifying `frontend/utils/pdfGenerator.ts`:

```typescript
export async function generatePDF(resumeData: ResumeData): Promise<void> {
  // Skip backend, use client-side only
  return generatePDFClientSide(resumeData)
}
```

## Check Browser Console

1. Open browser DevTools (F12)
2. Go to Console tab
3. Click "Export PDF"
4. Look for error messages
5. Share those errors for more help

## Still Not Working?

Share these details:
1. **Backend terminal output** when you click Export PDF
2. **Browser console errors** (F12 → Console)
3. **What happens** - Does it show loading? Error message? Nothing?
4. **Your OS and Node version**: `node --version`
