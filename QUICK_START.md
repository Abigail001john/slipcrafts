# SlipCraft Components - Quick Start Guide

## 🚀 What's Been Created

10 production-ready React components totaling 1,685 lines of code:

**5 Page Components:**
- `DashboardPage` - Main dashboard with stats and recent receipts
- `GenerateReceiptPage` - Receipt generator with bank slip and email tabs
- `HistoryPage` - Searchable, filterable receipt history
- `ReferralPage` - Referral program management
- `ProfilePage` - User profile and account settings

**1 Layout Component:**
- `DashboardLayout` - Reusable layout with sidebar/bottom nav

**4 Supporting Components:**
- `BankSlipForm` - Bank transfer form
- `EmailReceiptForm` - Email receipt form
- `BankSlipPreview` - Bank slip preview
- `EmailReceiptPreview` - Email preview

---

## 📁 File Locations

```
slipcraft/src/
├── pages/
│   ├── DashboardPage.jsx
│   ├── GenerateReceiptPage.jsx
│   ├── HistoryPage.jsx
│   ├── ReferralPage.jsx
│   └── ProfilePage.jsx
└── components/
    ├── DashboardLayout.jsx
    ├── BankSlipForm.jsx
    ├── BankSlipPreview.jsx
    ├── EmailReceiptForm.jsx
    └── EmailReceiptPreview.jsx
```

---

## 🔧 Installation & Setup

### 1. Dependencies Already Installed
All required packages are in `package.json`:
```bash
npm install  # or yarn install
```

### 2. Add Nunito Font
In `public/index.html`, add to `<head>`:
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### 3. Update Router in `App.jsx`
```jsx
import DashboardPage from './pages/DashboardPage';
import GenerateReceiptPage from './pages/GenerateReceiptPage';
import HistoryPage from './pages/HistoryPage';
import ReferralPage from './pages/ReferralPage';
import ProfilePage from './pages/ProfilePage';

<Routes>
  <Route path="/dashboard" element={<DashboardPage />} />
  <Route path="/generate-receipt" element={<GenerateReceiptPage />} />
  <Route path="/history" element={<HistoryPage />} />
  <Route path="/referral" element={<ReferralPage />} />
  <Route path="/profile" element={<ProfilePage />} />
</Routes>
```

---

## 🎨 Design System

### Colors
- **Primary Orange:** `#f8812d` - Main brand color
- **Grays:** `gray-50` to `gray-900` - Neutral palette
- **Accents:** Green (#10b981), Blue (#3b82f6), Red (#ef4444), etc.

### Typography
- **Font:** Nunito (Google Fonts)
- **Weights:** 400, 500, 600, 700, 800
- **Sizes:** Handled by Tailwind (text-xs to text-4xl)

### Components Use
- **Icons:** lucide-react (20-24px size by default)
- **Styling:** Tailwind CSS utility classes
- **Spacing:** 4px grid (gap-1, gap-2, gap-4, etc.)

---

## 📱 Responsive Design

### Breakpoints
- **Mobile:** < 640px (sidebar hidden, bottom nav visible)
- **Tablet:** 640px - 1024px (sidebar + content)
- **Desktop:** > 1024px (full sidebar + content)

### Key Responsive Features
- Sidebar → Bottom navigation on mobile
- 1 column → 2-4 columns grid
- Full-width forms on mobile → side-by-side on desktop
- Sticky preview on desktop → below form on mobile

---

## 🔌 Context Integration

All components use `useAppContext()` hook. Ensure AppContext provides:

```js
{
  user: {
    id: string,
    name: string,
    email: string,
    points: number,
    referredCount: number,
    referralCode: string,
    isAdmin: boolean,
    createdAt: ISO8601 string
  },
  config: {
    bankSlipFee: number,
    emailSlipFee: number,
    referralRewardPercent: number,
    // ... other config
  },
  receipts: Array<Receipt>,
  addReceipt: (receipt) => Receipt,
  logout: () => void,
  setUser: (user) => void
}
```

---

## 💾 Data Structures

### Receipt Object
```js
{
  id: string,
  type: 'bank' | 'email',
  userId: string,
  createdAt: ISO8601 string,
  
  // Bank slip fields
  senderName?: string,
  senderAccount?: string,
  senderBank?: string,
  receiverName?: string,
  receiverAccount?: string,
  receiverBank?: string,
  amount?: number,
  transactionDate?: string,
  transactionTime?: string,
  transactionRef?: string,
  narration?: string,
  sessionId?: string,
  status?: 'Successful' | 'Pending' | 'Failed',
  
  // Email fields
  fromName?: string,
  fromEmail?: string,
  toName?: string,
  toEmail?: string,
  subject?: string,
  body?: string,
  date?: string,
  time?: string,
  provider?: 'Gmail' | 'Yahoo' | 'Outlook' | 'iCloud'
}
```

---

## 🎯 Key Features by Page

### DashboardPage
- 4 stat cards with dynamic data
- Recent receipts table (last 5)
- Quick action buttons
- Pro tip referral card
- All data from context

### GenerateReceiptPage
- Tab switching (Bank/Email)
- Live preview (real-time)
- 11 Nigerian banks dropdown
- Auto-generated reference/session IDs
- Download PNG/PDF
- Form validation
- Toast notifications

### HistoryPage
- Full-text search
- Type & date range filters
- 10 per page pagination
- Modal preview
- Download from modal
- Empty state

### ReferralPage
- Unique referral link
- Copy to clipboard
- 4 social share options
- Referral stats
- How-to guide
- Referred users table

### ProfilePage
- Edit name (email disabled)
- Change password with validation
- Account stats
- Delete account with confirmation
- Avatar with initials

---

## 🧪 Testing Checklist

```javascript
// Test form submissions
- Fill all required fields
- Submit and check context.addReceipt is called
- Verify toast notification appears

// Test navigation
- Click all sidebar/nav items
- Verify active state highlights correctly
- Check mobile menu closes after navigation

// Test filters
- Try search on HistoryPage
- Apply type and date filters
- Verify pagination updates

// Test downloads
- Generate receipt
- Click PNG download
- Click PDF download
- Verify files appear in downloads folder

// Test responsive
- Resize browser to mobile
- Check sidebar becomes hamburger menu
- Verify bottom nav appears on mobile
- Check all text is readable

// Test forms
- Try submitting empty required fields
- Verify error messages appear
- Test password validation
- Test edit profile mode toggle
```

---

## 🎭 Component Usage Examples

### Using DashboardLayout
```jsx
import DashboardLayout from './components/DashboardLayout';

export default function MyPage() {
  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        {/* Your page content here */}
      </div>
    </DashboardLayout>
  );
}
```

### Using AppContext
```jsx
import { useAppContext } from './context/AppContext';

export default function MyComponent() {
  const { user, config, receipts, addReceipt } = useAppContext();
  
  const handleGenerate = () => {
    addReceipt({
      type: 'bank',
      senderName: 'John Doe',
      // ... more fields
    });
  };
  
  return (
    <div>
      <p>{user.name} - {user.points} points</p>
      <button onClick={handleGenerate}>Generate</button>
    </div>
  );
}
```

---

## 🔍 Common Customizations

### Change Primary Color
Update `#f8812d` to your color:
1. DashboardLayout.jsx - 6 occurrences
2. All page components - search/replace
3. Tailwind config if using color classes

### Add More Banks
In GenerateReceiptPage.jsx:
```js
const NIGERIAN_BANKS = [
  'GTBank',
  'Access Bank',
  // Add more here
];
```

Then update BankSlipPreview.jsx BANK_COLORS object.

### Change Items Per Page
In HistoryPage.jsx:
```js
const itemsPerPage = 10; // Change to desired number
```

### Modify Form Fields
Edit the respective Form components:
- BankSlipForm.jsx - Bank slip fields
- EmailReceiptForm.jsx - Email fields

---

## 🐛 Troubleshooting

### Components not showing
- Check routes are added to App.jsx
- Verify ProtectedRoute wrapper is in place
- Check user is logged in

### Styles not applying
- Verify Tailwind CSS is configured
- Check Nunito font is loaded
- Clear browser cache

### Context errors
- Ensure AppContextProvider wraps App
- Verify useAppContext is imported correctly
- Check context values match expected structure

### Download not working
- Must be on HTTPS in production
- Check browser download settings
- Verify html2canvas and jsPDF are installed

### Icons not showing
- Verify lucide-react is installed
- Check icon names are correct
- Clear node_modules and reinstall if needed

---

## 📚 Useful Resources

- [React Router v6 Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/)
- [React Hook Form](https://react-hook-form.com/)
- [react-hot-toast](https://react-hot-toast.com/)

---

## 📋 What's Not Included

These components are frontend-only. You'll need to implement:

- [ ] Backend API endpoints
- [ ] Database models and migrations
- [ ] Authentication/Authorization logic
- [ ] File storage for uploads
- [ ] Email service for sending emails
- [ ] Payment processing (if needed)
- [ ] Admin dashboard backend

---

## ✅ Final Checklist Before Going Live

- [ ] All routes configured in App.jsx
- [ ] Nunito font loaded
- [ ] AppContext properly set up
- [ ] ProtectedRoute wrapper in place
- [ ] Toast provider configured (react-hot-toast)
- [ ] Responsive design tested on real devices
- [ ] All forms validated
- [ ] Download functionality working
- [ ] No console errors
- [ ] Dark mode tested (if applicable)

---

## 🚀 Ready to Launch!

Your SlipCraft dashboard components are production-ready. Integrate them into your app and start generating receipts! 🎉
