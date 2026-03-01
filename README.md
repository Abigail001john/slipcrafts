# SlipCraft - Receipt Generation Platform

SlipCraft is a full-featured receipt generation web app built with React 18, Vite, and Tailwind CSS. It allows users to create professional bank transfer slips and email receipts, manage their account, and refer friends.

## Features

- 🏠 **Public landing page** with hero, stats, features, testimonials, FAQ
- 🔐 **User authentication** (register/login) with localStorage persistence  
- 📄 **Bank Transfer Slip generator** (Nigerian banks, real-time preview, PNG/PDF download)
- 📧 **Email Receipt generator** (Gmail/Yahoo/Outlook/iCloud styles, real-time preview)
- 📋 **Receipt history** with search, filter, pagination
- 👥 **Referral program** with unique links and social sharing
- 👤 **User profile management**
- ⚙️ **Full admin panel** with config editor, testimonial manager, FAQ manager, content editor, user management
- 💾 **All data persisted** in localStorage (no backend required)
- 📱 **Fully responsive** (mobile + desktop)

## Tech Stack

- **React** 18
- **Vite** 5
- **Tailwind CSS** 3
- **React Router DOM** v6
- **react-hook-form**
- **react-hot-toast**
- **lucide-react**
- **html2canvas** + **jsPDF** (for receipt downloads)
- **@headlessui/react**

## Project Structure

```
slipcraft/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── package.json
└── src/
    ├── index.jsx          # Entry point
    ├── index.css          # Global styles + Tailwind
    ├── App.jsx            # Router + route definitions
    ├── context/
    │   └── AppContext.jsx  # Global state (config, user, receipts)
    ├── components/
    │   ├── Navbar.jsx
    │   ├── Footer.jsx
    │   ├── DashboardLayout.jsx
    │   ├── ProtectedRoute.jsx
    │   ├── AdminRoute.jsx
    │   ├── BankSlipForm.jsx
    │   ├── BankSlipPreview.jsx
    │   ├── EmailReceiptForm.jsx
    │   ├── EmailReceiptPreview.jsx
    │   └── AdminTabs/
    │       ├── AdminOverviewTab.jsx
    │       ├── AdminSettingsTab.jsx
    │       ├── AdminTestimonialsTab.jsx
    │       ├── AdminFAQTab.jsx
    │       ├── AdminContentTab.jsx
    │       └── AdminUsersTab.jsx
    └── pages/
        ├── HomePage.jsx
        ├── AboutPage.jsx
        ├── HelpPage.jsx
        ├── PrivacyPage.jsx
        ├── TermsPage.jsx
        ├── LoginPage.jsx
        ├── RegisterPage.jsx
        ├── DashboardPage.jsx
        ├── GenerateReceiptPage.jsx
        ├── HistoryPage.jsx
        ├── ReferralPage.jsx
        ├── ProfilePage.jsx
        └── AdminPage.jsx
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm 9+

### Installation

```bash
# Clone or download the project
cd slipcraft

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:3000 in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Default Admin Credentials

- **Email:** `admin@slipcraft.net`
- **Password:** `admin123`

Navigate to http://localhost:3000/admin after logging in to access the admin panel.

## Customization Guide

### Via Admin Panel (Recommended)

1. Log in as admin (`admin@slipcraft.net` / `admin123`)
2. Go to `/admin` (admin panel link visible in dashboard)
3. Use the following tabs to customize:
   - **Platform Settings** — Change site name, description, contact info, fees, point values, stats
   - **Testimonials Manager** — Add/edit/delete testimonials
   - **FAQ Manager** — Manage help content
   - **Content Editor** — Update About Us, Privacy Policy, Terms
   - **User Management** — View and manage users

All changes are saved to localStorage and take effect immediately.

### Via Code (AppContext Defaults)

Edit `src/context/AppContext.jsx` — the `defaultConfig` object controls all default values.

## Configuration Reference

| Field | Type | Description | Default |
|-------|------|-------------|----------|
| `name` | string | Platform name | SlipCraft |
| `title` | string | Page title | Receipt Generation Platform |
| `description` | string | Meta description | Full-featured receipt generation web app |
| `phone` | string | Support phone | +1 (555) 123-4567 |
| `email` | string | Support email | support@slipcraft.net |
| `address` | string | Business address | 123 Main Street, City, Country |
| `primaryColor` | string | Brand color (hex) | #f8812d |
| `totalUsers` | number | Stat shown on homepage | 283218 |
| `activities` | number | Receipts generated stat | 2394857 |
| `emailSent` | number | Emails sent stat | 9475986 |
| `signupBonus` | number | Points awarded on register | 0 |
| `bankSlipFee` | number | Points cost for bank slip | 250 |
| `emailSlipFee` | number | Points cost for email receipt | 250 |
| `storePassFee` | number | Points cost for store pass | 125 |
| `referralRewardPercent` | number | % reward for referrals | 1.5 |
| `pointTransferMin` | number | Min points transfer | 100 |
| `pointTransferMax` | number | Max points transfer | 15000 |
| `adminEmail` | string | Admin login email | admin@slipcraft.net |
| `telegramSupportLink` | string | Telegram support URL | https://t.me/slipcraft_support |
| `testimonials` | array | Homepage testimonials | 8 default items |
| `helpFAQ` | array | FAQ items | 3 default items |
| `aboutUs` | string | About page content | Default about text |
| `privacyPolicy` | string | Privacy policy content | Default privacy text |
| `termsConditions` | string | Terms content | Default terms text |

## User Flows

### Regular User

1. **Visit homepage** → View features and testimonials
2. **Register** → Click 'Get Started' → Fill name/email/password
3. **Dashboard** → See points balance and quick stats
4. **Generate Receipt** → Click 'Generate Receipt' → Fill bank slip or email form → Download PNG/PDF
5. **View History** → Search and filter past receipts
6. **Referral Program** → Copy referral link → Share with friends → Earn points
7. **Profile** → Update name, change password

### Admin

1. **Login** with `admin@slipcraft.net` / `admin123`
2. **Access Dashboard** → Admin panel link visible
3. **Admin Panel** (`/admin`) → Configure all platform settings
4. **Manage content** → Users, testimonials, FAQs, pages

## Important Notes

- **localStorage Only** — All data is stored in browser localStorage. No backend or database required.
- **Reset Data** — To reset all data: Clear localStorage in browser DevTools
- **Receipt Downloads** — Uses html2canvas (PNG) and jsPDF (PDF)
- **Self-Contained** — Designed to be deployable to any static hosting provider

## Deployment

### Local Build

```bash
npm run build
# Upload the dist/ folder to your hosting provider
```

### Vercel

```bash
vercel --prod
```
Run from the `slipcraft` directory.

### Netlify

Drag and drop the `dist/` folder into Netlify, or connect your Git repository and set the build command to `npm run build` with publish directory set to `dist/`.

### Other Static Hosts

1. Run `npm run build`
2. Upload the `dist/` folder to your hosting provider
3. Ensure the hosting provider is configured to serve `index.html` for all routes (important for React Router)

## Development Workflow

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Lint code (if configured)
npm run lint
```

### Environment Variables

Currently, the app does not require environment variables. All configuration is managed through the admin panel or `src/context/AppContext.jsx`.

## File Structure Explanation

- **`index.html`** — Entry HTML file
- **`vite.config.js`** — Vite build configuration
- **`tailwind.config.js`** — Tailwind CSS configuration
- **`postcss.config.js`** — PostCSS configuration for Tailwind
- **`src/index.jsx`** — React app entry point
- **`src/App.jsx`** — Route definitions and main layout
- **`src/context/AppContext.jsx`** — Global state management (config, user data, receipts)
- **`src/components/`** — Reusable components
- **`src/pages/`** — Page components for each route

## Troubleshooting

### Port 3000 Already in Use

```bash
# Kill process on port 3000 (macOS/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- --port 3001
```

### Data Not Persisting

Ensure your browser allows localStorage:
1. Check browser privacy settings
2. Verify you're not in private/incognito mode
3. Check browser storage quota

### Receipt Downloads Not Working

- Ensure popup blockers are disabled
- Check browser console for errors
- Verify that html2canvas and jsPDF are properly installed

### Admin Panel Not Accessible

1. Ensure you're logged in with `admin@slipcraft.net`
2. Clear browser localStorage and try logging in again
3. Check browser console for errors

## Performance Optimization

The app is optimized for performance:
- **Code splitting** via Vite
- **CSS optimization** with Tailwind's PurgeCSS
- **Lazy loading** of pages via React Router
- **localStorage caching** for instant data access

## Security Notes

- **Client-Side Only** — No sensitive data is sent to a server
- **localStorage Security** — Data is stored in plain text in localStorage; users should not store sensitive information
- **Password Hashing** — For a production app with backend, implement proper password hashing
- **HTTPS** — Deploy with HTTPS to protect data in transit

## Contributing

To extend SlipCraft:

1. **Add new features** in respective component/page files
2. **Update AppContext** if adding new global state
3. **Test thoroughly** in development mode
4. **Build and test** production build with `npm run build && npm run preview`

## License

MIT — Feel free to use and modify for your own projects.

## Support

For issues, questions, or feature requests:
- **Email:** support@slipcraft.net
- **Telegram:** https://t.me/slipcraft_support
- **Phone:** +1 (555) 123-4567

---

**Version:** 1.0.0  
**Last Updated:** 2024
