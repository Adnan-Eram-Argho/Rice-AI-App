# 🔧 Docs Access Troubleshooting Guide

## ❓ Problem: "Documentation Unavailable" Message

If you're seeing this error when visiting `/docs`, here's how to fix it:

---

## 🚀 Quick Fixes (Choose One)

### **Option 1: Use the Reset Button (Easiest)**
1. On the "Documentation Unavailable" page, look for the button:
   ```
   🔧 Reset Access (Debug)
   ```
2. Click it
3. Confirm the dialog
4. Page will reload and docs should be accessible

### **Option 2: Use Browser Console**
1. Open browser console: `F12` or `Ctrl+Shift+J` (Windows) / `Cmd+Option+J` (Mac)
2. Type this command and press Enter:
   ```javascript
   window.__docsDebug.resetAccess()
   ```
3. Page will automatically reload with access restored

### **Option 3: Clear Browser Storage**
1. Open DevTools: `F12`
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. In left sidebar, expand **Local Storage**
4. Click on your domain (e.g., `http://localhost:5174`)
5. Find key: `docs_access_config`
6. Right-click → **Delete**
7. Refresh the page (`F5`)

### **Option 4: Visit Admin Panel Directly**
1. Go to: `http://localhost:5174/docs/admin`
2. Login with token: `admin123`
3. Toggle "Enable Documentation" to ON
4. Click "Save Configuration"
5. Return to `/docs`

---

## 🔍 Understanding the Problem

The docs access control system has three states:

### 1. **Globally Disabled** (`enabled: false`)
- Administrator manually turned off docs
- Shows: "Documentation Disabled"
- **Fix**: Admin panel → Enable toggle

### 2. **Scheduled - Not Started Yet**
- Current date is before start date
- Shows: "Coming Soon" with date
- **Fix**: Wait until start date OR admin changes schedule

### 3. **Scheduled - Expired**
- Current date is after end date
- Shows: "Viewing Period Ended"
- **Fix**: Admin extends end date OR reset config

---

## 📊 Diagnostic Steps

### Check Current Status via Console

Open browser console (`F12`) and run:

```javascript
window.__docsDebug.checkAccess()
```

This will display a table showing:
- ✅ **Access**: true/false
- 📝 **Reason**: DISABLED / NOT_STARTED / EXPIRED
- 💬 **Message**: Human-readable explanation
- ⚙️ **Config**: Full configuration object

### Example Output:
```
┌─────────┬──────────────────────────────┐
│ Access  │ false                        │
│ Reason  │ DISABLED                     │
│ Message │ Documentation unavailable    │
│ Config  │ {enabled: false, ...}        │
└─────────┴──────────────────────────────┘
```

---

## 🛠️ Common Scenarios & Solutions

### Scenario 1: Just Installed / First Time Setup
**Problem**: Docs show as unavailable immediately after installation

**Cause**: localStorage might have corrupted default config

**Solution**:
```javascript
// Console command
localStorage.removeItem('docs_access_config')
location.reload()
```

### Scenario 2: After Testing Admin Panel
**Problem**: You disabled docs in admin panel and forgot to re-enable

**Solution**:
1. Visit `/docs/admin`
2. Login: `admin123`
3. Toggle "Enable Documentation" ON
4. Save

### Scenario 3: Scheduled Window Expired
**Problem**: Set June 10-14 schedule, now it's June 15

**Solution A** (Extend Schedule):
1. Admin panel → Enable "Schedule Availability"
2. Update End Date to future date
3. Save

**Solution B** (Disable Scheduling):
1. Admin panel → Disable "Schedule Availability" toggle
2. Ensure "Enable Documentation" is ON
3. Save

### Scenario 4: Production Deployment Issue
**Problem**: Works locally but not on Vercel/production

**Cause**: Different localStorage per domain

**Solution**:
1. Visit production URL: `https://your-app.vercel.app/docs`
2. Use reset button or console commands on production site
3. Or deploy with default enabled config (already set in code)

---

## 🎯 Prevention Tips

### For Developers
1. **Always check config before deploying**:
   ```javascript
   // In console before git push
   console.log(JSON.parse(localStorage.getItem('docs_access_config')))
   ```

2. **Use environment-specific configs** (future enhancement):
   - Dev: Always enabled
   - Staging: Controlled by team
   - Production: Scheduled windows only

3. **Document schedule changes** in team chat/calendar

### For Administrators
1. **Set calendar reminders** for scheduled windows
2. **Test access** 1 hour before important events (judging, investor meetings)
3. **Keep backup access method** (console commands work even if UI breaks)

---

## 📱 Mobile Troubleshooting

If accessing from mobile device:

### iOS Safari
1. Enable Web Inspector: Settings → Safari → Advanced → Web Inspector
2. Connect to Mac → Safari Develop menu → Your device
3. Use console commands as above

### Android Chrome
1. Enable USB debugging
2. Connect to computer
3. Chrome → `chrome://inspect/#devices`
4. Inspect your page → Console tab

### Quick Mobile Fix
Simply visit: `https://your-app.vercel.app/docs/admin`
- Login: `admin123`
- Enable docs
- Done!

---

## 🔐 Security Notes

### Current Implementation (Demo)
- Admin token stored in localStorage (insecure)
- Anyone can reset via console (by design for debugging)
- No server-side validation

### Production Recommendations
1. **JWT Authentication**: Replace localStorage token with JWT
2. **Backend Validation**: Verify admin status server-side
3. **Audit Logging**: Track who changed access settings
4. **Rate Limiting**: Prevent brute-force on admin panel
5. **Remove Emergency Reset**: Only allow admin-controlled resets

---

## 🆘 Still Having Issues?

### Step-by-Step Nuclear Option

If nothing else works:

1. **Clear Everything**:
   ```javascript
   // Run in console
   localStorage.clear()
   sessionStorage.clear()
   location.reload()
   ```

2. **Hard Refresh**:
   - Windows: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

3. **Rebuild App** (if local dev):
   ```bash
   npm run build
   npm run preview
   ```

4. **Check Browser Compatibility**:
   - ✅ Chrome/Edge (recommended)
   - ✅ Firefox
   - ✅ Safari 14+
   - ❌ IE11 (not supported)

---

## 📞 Support Resources

- **GitHub Issues**: https://github.com/Adnan-Eram-Argho/Rice-AI-App/issues
- **Email**: adnan.argho@example.com
- **Documentation**: `DOCS_MODULE_README.md`
- **Quick Start**: `QUICK_START_DOCS.md`

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] Can access `/docs` without error message
- [ ] All sections load correctly (Pitch Deck, Technical Docs, etc.)
- [ ] Search bar works
- [ ] Navigation sidebar visible
- [ ] Admin panel accessible at `/docs/admin`
- [ ] Export options functional
- [ ] Mobile responsive (test on phone)

---

## 🎓 Learning Resources

Understanding the access control system:

1. **Code Location**: `src/utils/docsAccessControl.js`
2. **Default Config**: 
   ```javascript
   {
     enabled: true,              // Global toggle
     scheduleEnabled: false,     // Date-based access
     startDate: '2026-06-10...', // When to start
     endDate: '2026-06-14...'    // When to end
   }
   ```
3. **Storage Key**: `docs_access_config` in localStorage
4. **Admin Token Key**: `docs_admin_token` in localStorage

---

**Last Updated**: 2026-05-18  
**Status**: ✅ All fixes deployed and tested  
**Build**: Passing  

*Remember: The emergency reset is a debugging feature. In production, implement proper admin authentication!* 🔒
