# 🚀 How to Run AI Resume Maker - Step by Step

## ⚠️ IMPORTANT: Read This First

You need **TWO terminal windows** open at the same time - one for backend, one for frontend.

---

## Step 1: Open Terminal 1 (Backend)

1. Open PowerShell or Command Prompt
2. Navigate to the backend folder:
   ```powershell
   cd "C:\Users\khush\OneDrive - Lake Washington School District\AI Resume\backend"
   ```

3. Check if you have a `.env` file:
   ```powershell
   dir .env
   ```
   
   **If it doesn't exist**, create it:
   ```powershell
   copy env.example .env
   ```
   
   Then edit `.env` and make sure it has:
   ```
   PORT=5001
   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-3.5-turbo
   PYTHON_PATH=python
   ```

4. Start the backend:
   ```powershell
   npm run dev
   ```

5. **Wait for this message:**
   ```
   Server running on port 5001
   ```
   
   ✅ **Keep this terminal open!** Don't close it.

---

## Step 2: Open Terminal 2 (Frontend)

1. Open a **NEW** PowerShell or Command Prompt window
2. Navigate to the frontend folder:
   ```powershell
   cd "C:\Users\khush\OneDrive - Lake Washington School District\AI Resume\frontend"
   ```

3. Check if you have a `.env.local` file:
   ```powershell
   dir .env.local
   ```
   
   **If it doesn't exist**, create it:
   ```powershell
   copy env.example .env.local
   ```
   
   Then edit `.env.local` and make sure it has:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5001/api
   ```

4. Start the frontend:
   ```powershell
   npm run dev
   ```

5. **Wait for this message:**
   ```
   ✓ Ready in X seconds
   ○ Local:        http://localhost:3000
   ```
   
   ✅ **Keep this terminal open too!**

---

## Step 3: Open in Browser

Once you see "Ready" in Terminal 2, open your web browser and go to:

### 👉 **http://localhost:3000**

That's it! The application should load.

---

## 🔍 Troubleshooting

### Problem: "Port 5001 already in use"
**Solution:** Change port to 5002 in `backend/.env`:
```
PORT=5002
```
Then update `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5002/api
```
Restart both servers.

### Problem: "Cannot find module"
**Solution:** Install dependencies:
```powershell
# In backend folder
npm install

# In frontend folder  
npm install
```

### Problem: Frontend shows "localhost refused to connect"
**Check:**
1. Is Terminal 2 showing "Ready"?
2. Did you wait for it to finish starting?
3. Try http://localhost:3001 or http://localhost:3002 (Next.js might use a different port)

### Problem: Backend won't start
**Check:**
1. Do you have `backend/.env` file?
2. Is port 5001 free? (Try 5002 if not)
3. Are dependencies installed? (`npm install` in backend folder)

---

## 📋 Quick Checklist

Before opening browser, make sure:

- [ ] Terminal 1 shows: "Server running on port 5001"
- [ ] Terminal 2 shows: "Ready" and "Local: http://localhost:3000"
- [ ] Both terminals are still open (don't close them!)
- [ ] You're using the correct URL: **http://localhost:3000**

---

## 🎯 What You Should See

When you open http://localhost:3000, you should see:
- A header with "AI Resume Maker"
- Left side: Resume Editor with tabs
- Right side: Live Preview
- Template selector dropdown
- Export PDF button

If you see this, **it's working!** 🎉

---

## 💡 Still Not Working?

1. **Check both terminals** - Are they showing errors?
2. **Copy the error messages** and share them
3. **Make sure both servers are running** - You need BOTH terminals open
4. **Try a different browser** - Sometimes Chrome/Firefox cache issues

---

## 🔄 To Stop the Servers

Press `Ctrl + C` in each terminal window to stop the servers.

---

**Need more help?** Share the exact error messages you see in the terminals!
