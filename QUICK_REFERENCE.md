# ORNGlobal - Quick Reference Card

## 🚀 Start Project in 3 Steps

```bash
npm install              # Step 1: Install dependencies
# [Setup Supabase database - see README]
npm run dev             # Step 2: Start dev server
# Step 3: Open http://localhost:5173
```

## 📍 Key File Locations

| Purpose | File |
|---------|------|
| Routing | `src/App.jsx` |
| Auth Logic | `src/services/authService.js` |
| Auth State | `src/context/AuthContext.jsx` |
| Pages | `src/pages/*.jsx` |
| Services | `src/services/*.js` |
| Styling | `src/index.css` + `tailwind.config.js` |
| Database | `database/schema.sql` |

## 🔗 Route Map

| Route | Purpose | Protected |
|-------|---------|-----------|
| `/login` | User login | ❌ |
| `/register` | Create account | ❌ |
| `/verify-otp` | Verify email | ❌ |
| `/dashboard` | User dashboard | ✅ |
| `/` | Redirects to dashboard | - |

## 🧪 Test Credentials

Register a new account with any email:
- Email: `john@example.com`
- Password: `password123` (min 6 chars)
- Hospital: Select any from list
- OTP: Check browser console (F12)

## 🎨 Color Palette

```javascript
medical.blue       #0369A1    // Primary
medical.lightblue  #E0F2FE    // Light background
medical.green      #16A34A    // Success
medical.lightgreen #DCFCE7    // Light success
medical.red        #DC2626    // Error
medical.lightred   #FEE2E2    // Light error
```

## 🛠️ Common Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm install         # Install dependencies
npm update          # Update dependencies
npm audit fix       # Fix security issues
```

## 📱 Responsive Breakpoints

```javascript
sm  640px   // Mobile
md  768px   // Tablet
lg  1024px  // Desktop
xl  1280px  // Large desktop
```

## 🔐 Security Reminders

- ❌ Never commit `.env` files
- ❌ Don't share Supabase keys
- ✅ Validate all user inputs
- ✅ Use HTTPS in production
- ✅ Enable RLS on all tables

## 📚 Documentation Order

1. Start with: **QUICKSTART.md** (5 min read)
2. Then: **SETUP_INSTRUCTIONS.md** (detailed setup)
3. Reference: **DEVELOPER_GUIDE.md** (technical)
4. Overview: **README.md** (complete guide)
5. Summary: **BUILD_SUMMARY.md** (what was built)

## 🐛 Debugging Tips

```javascript
// View OTP in console
console.log('Check console for OTP');

// Check auth state
// DevTools → Application → LocalStorage

// React DevTools
// Install "React Developer Tools" extension

// Network debugging
// DevTools → Network → Filter 'supabase'
```

## 📊 Database Tables

```sql
hospitals      -- 8 sample hospitals
users          -- User profiles
otp_tokens     -- Temporary OTP codes
surgical_cases -- Ready for Phase 2
```

## 🚨 Troubleshooting

| Issue | Solution |
|-------|----------|
| Port in use | `npm run dev -- --port 3000` |
| Module error | `rm -rf node_modules && npm install` |
| CSS not loading | Clear cache, rebuild |
| DB connection fails | Check Supabase credentials |
| OTP not showing | Check console (F12) |

## 📦 Project Dependencies

**Key packages:**
- react@18.3.1
- vite@5.2.11
- tailwindcss@3.4.3
- @supabase/supabase-js@2.45.0
- react-router-dom@6.28.0
- react-hot-toast@2.4.1

## 🎯 Phase 1 Status

✅ Authentication system  
✅ Hospital management  
✅ User profiles  
✅ Database schema  
✅ Protected routes  
✅ Responsive design  
✅ Documentation  

**Status: COMPLETE & PRODUCTION READY**

## 🚀 Next Phase (Phase 2)

- [ ] Surgical case creation
- [ ] Case documentation
- [ ] Case sharing
- [ ] Search/filtering
- [ ] Analytics

## 📞 Quick Help

**Can't find something?**
1. Check DEVELOPER_GUIDE.md (technical reference)
2. Search source files for function name
3. Review code comments
4. Check browser console for errors

---

**Last Updated:** August 29, 2026  
**Version:** 1.0.0  
**Status:** ✅ PHASE 1 COMPLETE
