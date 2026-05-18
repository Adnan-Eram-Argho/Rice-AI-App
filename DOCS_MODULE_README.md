# 📚 Rice AI Doctor - /docs Module Documentation

## Overview

The `/docs` module is a comprehensive, live documentation and pitch deck system for Rice AI Doctor. It combines:

1. **YC-Style Pitch Deck** - Business-focused presentation
2. **Technical Documentation** - Engineering deep-dive
3. **Live Data Integration** - Auto-synced with application state
4. **Access Control** - Admin-controlled visibility and scheduling

**Access URL**: `{app_base_url}/docs`  
**Admin Panel**: `{app_base_url}/docs/admin`

---

## 🎯 Features

### 1. Access Control & Scheduling (MANDATORY)

#### Admin Capabilities
- ✅ **Toggle Visibility**: ON/OFF for public access
- ✅ **Schedule Availability**: Set start/end dates and times
- ✅ **Override Controls**: Instant enable/disable
- ✅ **Default Configuration**: June 10 (00:00) → June 14 (23:59)

#### Use Cases
- Judging windows for competitions
- Investor preview periods
- Restricted showcase periods
- Maintenance mode

### 2. Document Structure

#### A. YC-Style Pitch Deck Sections
1. **Problem** - Rural connectivity, misdiagnosis crisis, language barriers
2. **Solution** - Offline PWA with 94% accuracy
3. **Why Now?** - WebAssembly maturity, model optimization, climate urgency
4. **Product Demo** - Live app demonstration
5. **Market Opportunity** - 150M+ rice farmers globally, $2B agri-tech market
6. **Business Model** - Freemium, B2B licensing, data insights, training
7. **Traction** - V4.2 deployed, 94.06% accuracy, <550ms inference
8. **Competition** - Comparison table vs Plantix and traditional apps
9. **Unique Advantage** - Configuration-driven, CBAM attention, background class detection
10. **Go-To-Market** - 4-phase strategy from Bangladesh pilot to global expansion
11. **Team** ⭐ - Professional grid layout with uniform profile pictures
12. **Vision** - Short/mid/long-term goals

#### B. Technical Documentation
- **Product Overview** - What it does, target users, use cases
- **Feature Matrix** - Live/synced status indicators (live/upcoming/planned)
- **Architecture Diagram** - Visual flow: UI → API → Services → DB
- **Technology Stack** - Frontend, Backend, DB, AI stack, infra
- **Data Flow** - Input → Processing → AI → Output → Feedback
- **API Documentation** - Endpoints, auth model, config files
- **AI & ML Layer** - Models, RAG, personalization, explainability
- **Performance & Scalability** - Load expectations, optimization
- **Security** - Auth, RBAC, data protection
- **Changelog** - Version history (V1 → V4.2)

### 3. Team Section (MANDATORY ENHANCEMENT)

#### Features
- ✅ **Uniform Profile Pictures**: Auto-resized to consistent dimensions (128x128px circular)
- ✅ **Professional Cards**: Grid layout with hover effects
- ✅ **Complete Information**: Name, role, email, bio, social links
- ✅ **Fallback Avatars**: UI Avatars API if image missing
- ✅ **Achievement Badges**: Visual indicators
- ✅ **Responsive Design**: Mobile/tablet/desktop optimized

#### Image Requirements
- Aspect ratio: 1:1 (square)
- Format: PNG/JPG/WebP
- Minimum size: 256x256px
- Automatic fallback to generated avatars
- Consistent styling with white border and shadow

### 4. UX Requirements
- ✅ Clean YC-style layout with gradient backgrounds
- ✅ Section navigation with smooth scrolling
- ✅ Responsive design (mobile/tablet/desktop)
- ✅ Fast loading with lazy-loaded sections
- ✅ Sticky header with search bar
- ✅ Sidebar table of contents with active highlighting

### 5. Search & Navigation
- ✅ Global search bar (filters content in real-time)
- ✅ Section jump via sidebar navigation
- ✅ Anchor links for deep linking
- ✅ Smooth scroll animations

### 6. Export Options
- ✅ **PDF Export**: Browser print-to-PDF functionality
- ✅ **Markdown Export**: Downloadable .md file
- ✅ Shareable links (via URL anchors)

### 7. Performance Optimizations
- Lazy-loaded sections via React Router
- Framer Motion animations (GPU-accelerated)
- Cached configuration in localStorage
- Minimal bundle size impact

---

## 🛠️ Technical Implementation

### File Structure
```
src/
├── pages/
│   ├── DocsPage.jsx              # Main router with access control
│   └── docs/
│       ├── DocsViewer.jsx        # Main documentation viewer
│       ├── AdminPanel.jsx        # Admin control panel
│       ├── AccessDenied.jsx      # 403/Not Available page
│       ├── index.js              # Module exports
│       ├── sections/
│       │   ├── PitchDeck.jsx     # YC-style pitch sections
│       │   ├── TeamSection.jsx   # Team showcase with photos
│       │   ├── FeatureMatrix.jsx # Live feature status
│       │   ├── ArchitectureDiagram.jsx # Visual architecture
│       │   ├── TechnicalDocs.jsx # All technical sections
│       │   ├── Roadmap.jsx       # Product roadmap timeline
│       │   └── Changelog.jsx     # Version history
│       └── components/
│           ├── SearchBar.jsx     # Global search input
│           ├── TableOfContents.jsx # Sidebar navigation
│           └── ExportOptions.jsx # PDF/Markdown export
├── utils/
│   └── docsAccessControl.js      # Access control logic
└── App.jsx                       # Updated with React Router
```

### Dependencies Added
```json
{
  "react-router-dom": "^6.x",
  "framer-motion": "^10.x",
  "lucide-react": "^0.x",
  "marked": "^10.x"
}
```

### Access Control Logic

#### Configuration Storage
```javascript
// localStorage key: 'docs_access_config'
{
  enabled: true,                    // Global toggle
  scheduleEnabled: false,           // Enable date-based scheduling
  startDate: '2026-06-10T00:00:00', // Start datetime
  endDate: '2026-06-14T23:59:59',   // End datetime
  lastUpdated: '2026-05-18T...'     // Auto-updated on save
}
```

#### Access Check Flow
```
User visits /docs
    ↓
checkDocsAccess() called
    ↓
Is enabled === false? → Show AccessDenied
    ↓
Is scheduleEnabled === true?
    ↓
Is now < startDate? → Show "Not Started" message
    ↓
Is now > endDate? → Show "Expired" message
    ↓
Access granted → Show DocsViewer
```

### Admin Authentication (Demo)
```javascript
// Simple localStorage-based token (replace with proper auth in production)
const ADMIN_TOKEN = 'admin123' // Demo password

// Login
localStorage.setItem('docs_admin_token', adminToken)

// Verify
const token = localStorage.getItem('docs_admin_token')
if (token === ADMIN_TOKEN) { /* Grant access */ }
```

**⚠️ Production Recommendation**: Implement JWT-based authentication with backend verification.

---

## 📖 Usage Guide

### For Public Users

1. **Visit**: Navigate to `{app_url}/docs`
2. **Browse**: Use sidebar or scroll through sections
3. **Search**: Use search bar to find specific topics
4. **Export**: Click download icon → Choose PDF or Markdown
5. **Navigate**: Click section titles to jump around

### For Administrators

#### Accessing Admin Panel
1. Visit `{app_url}/docs/admin`
2. Enter admin token (demo: `admin123`)
3. Click "Login"

#### Managing Visibility

**Option 1: Quick Toggle**
- Flip the "Documentation Visibility" switch
- Changes take effect immediately
- No scheduling involved

**Option 2: Scheduled Access**
1. Enable "Schedule Availability" toggle
2. Set Start Date & Time
3. Set End Date & Time
4. Click "Save Configuration"

**Example: Judging Window**
```
Start: June 10, 2026 at 12:00 AM
End: June 14, 2026 at 11:59 PM
Result: Docs accessible only during this 5-day window
```

#### Reset to Defaults
- Click "Reset" button
- Confirms action
- Restores default config (enabled=true, June 10-14 schedule)

---

## 🎨 Customization

### Updating Team Members

Edit `src/pages/docs/sections/TeamSection.jsx`:

```javascript
const teamMembers = [
  {
    name: "Your Name",
    role: "Your Role",
    email: "your@email.com",
    github: "https://github.com/username",
    linkedin: "https://linkedin.com/in/username",
    bio: "Brief description...",
    image: "https://your-image-url.com/photo.jpg" // Or use UI Avatars
  }
]
```

**Image Guidelines**:
- Use direct image URLs (Imgur, Cloudinary, etc.)
- Or keep UI Avatars: `https://ui-avatars.com/api/?name=First+Last&background=16a34a&color=fff&size=256`
- Recommended: Upload team photos to `/public/team/` folder

### Modifying Pitch Deck Content

Edit corresponding sections in `src/pages/docs/sections/PitchDeck.jsx`. Each section is clearly labeled with comments.

### Changing Default Schedule

Edit `src/utils/docsAccessControl.js`:

```javascript
const DEFAULT_CONFIG = {
  enabled: true,
  scheduleEnabled: false,
  startDate: '2026-06-10T00:00:00', // Change these dates
  endDate: '2026-06-14T23:59:59',
  lastUpdated: new Date().toISOString()
}
```

---

## 🔒 Security Considerations

### Current Implementation (Demo)
- Admin token stored in localStorage (client-side only)
- No server-side validation
- Token visible in browser DevTools

### Production Recommendations
1. **Backend Authentication**: Implement JWT tokens with server validation
2. **Role-Based Access**: Separate Super Admin vs Admin roles
3. **Audit Logging**: Track all admin actions
4. **Rate Limiting**: Prevent brute-force attacks
5. **HTTPS Enforcement**: Already handled by Vercel
6. **Token Expiration**: Auto-logout after 24 hours

---

## 🧪 Testing

### Manual Testing Checklist

#### Public Access
- [ ] Visit `/docs` → Should load documentation
- [ ] Click all sections → Should scroll smoothly
- [ ] Search functionality → Should filter content
- [ ] Export PDF → Should open print dialog
- [ ] Export Markdown → Should download .md file
- [ ] Mobile responsive → Test on phone/tablet

#### Access Control
- [ ] Disable docs in admin → Visit `/docs` → Should show "Not Available"
- [ ] Enable scheduling with future date → Should show countdown
- [ ] Set expired date → Should show "Period Ended"
- [ ] Re-enable → Should restore access

#### Admin Panel
- [ ] Login with correct token → Should grant access
- [ ] Login with wrong token → Should show error
- [ ] Toggle visibility → Should update immediately
- [ ] Set schedule → Should save to localStorage
- [ ] Reset config → Should restore defaults
- [ ] Logout → Should clear token

### Automated Testing (Future)
```javascript
// Example Cypress test
describe('/docs Module', () => {
  it('should load documentation', () => {
    cy.visit('/docs')
    cy.contains('Rice AI Doctor').should('be.visible')
  })

  it('should respect access control', () => {
    cy.visit('/docs/admin')
    cy.get('input[type="password"]').type('admin123')
    cy.contains('Login').click()
    cy.get('[data-testid="visibility-toggle"]').click()
    cy.visit('/docs')
    cy.contains('Documentation Unavailable').should('be.visible')
  })
})
```

---

## 🚀 Deployment

### Pre-Deployment Checklist
- [ ] Run `npm run build` → Ensure no errors
- [ ] Test `/docs` route locally
- [ ] Test `/docs/admin` route
- [ ] Verify access control works
- [ ] Check mobile responsiveness
- [ ] Validate all links work
- [ ] Test export functionality

### Deploy to Vercel
```bash
git add .
git commit -m "Add /docs module with access control"
git push origin main
# Vercel auto-deploys from GitHub
```

### Post-Deployment Verification
1. Visit `https://your-app.vercel.app/docs`
2. Verify all sections load correctly
3. Test admin panel at `/docs/admin`
4. Check access control toggles
5. Validate on multiple devices

---

## 📊 Analytics & Monitoring (Future)

### Metrics to Track
- Page views per section
- Average time on page
- Export downloads (PDF/Markdown)
- Search queries
- Admin panel usage
- Access denied attempts

### Implementation
```javascript
// Add to DocsViewer.jsx
useEffect(() => {
  // Track page view
  analytics.track('docs_view', {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent
  })
}, [])
```

---

## 🐛 Troubleshooting

### Issue: Docs not loading
**Solution**: Check browser console for errors. Verify React Router is properly configured in `App.jsx`.

### Issue: Admin login fails
**Solution**: Ensure token is `admin123` (case-sensitive). Clear localStorage and retry.

### Issue: Schedule not working
**Solution**: Verify date format is ISO 8601 (`YYYY-MM-DDTHH:mm:ss`). Check timezone settings.

### Issue: Team images not showing
**Solution**: Check image URLs are accessible (no CORS issues). Verify fallback avatars work.

### Issue: Export not working
**Solution**: PDF export uses `window.print()` - ensure browser allows printing. Markdown export creates Blob - check browser compatibility.

---

## 🔄 Future Enhancements (V5+)

### Planned Features
1. **WYSIWYG Editor**: Inline editing for all sections
2. **Version Control**: Git-like versioning for docs changes
3. **Collaborative Editing**: Multiple admins can edit simultaneously
4. **Analytics Dashboard**: Built-in usage statistics
5. **A/B Testing**: Test different pitch deck versions
6. **Multi-language Docs**: Translate entire documentation
7. **Interactive Demos**: Embedded app demos within docs
8. **Video Tutorials**: Section-specific video guides
9. **API Key Management**: Secure admin authentication
10. **Webhook Notifications**: Alert team when docs accessed

### Technical Improvements
- Server-side rendering (SSR) for SEO
- Incremental static regeneration (ISR)
- Real-time collaboration via WebSockets
- Advanced search with Elasticsearch
- CDN caching for global performance
- Accessibility improvements (WCAG 2.1 AA)

---

## 📞 Support

**Maintainer**: Adnan Eram Argho  
**GitHub**: https://github.com/Adnan-Eram-Argho/Rice-AI-App  
**Last Updated**: 2026-05-18

For issues or questions:
1. Check this documentation first
2. Review code comments in source files
3. Open GitHub issue with detailed description
4. Contact maintainer directly

---

## 📄 License

Proprietary. All rights reserved. © 2026 Adnan Eram Argho.

Unauthorized use, copying, or distribution is strictly prohibited.

---

*This /docs module represents best-in-class documentation systems used by Y Combinator startups and enterprise SaaS platforms. It combines investor-ready pitch decks with engineering-grade technical documentation in a single, controlled interface.*
