# M2DG Basketball Platform - Premium Enterprise Edition

## 🏀 Premium Basketball Platform with 10 Enterprise Features

### ✅ Features Included:
- 💳 **Stripe Payment System** - Secure court booking payments
- 🤖 **AI Coaching (Gemini)** - Personalized basketball coaching
- 📧 **Email Notifications (SendGrid)** - Booking confirmations & alerts
- 🏆 **Advanced Tournament Brackets** - Visual bracket management
- 📊 **Performance Analytics** - AI-powered insights
- 📱 **Social Media Integration** - Share achievements
- 🎥 **Video Analysis** - AI game footage analysis
- 🎮 **Gamification** - XP, levels, achievements
- 📱 **Progressive Web App** - Install prompt, offline support
- 🎨 **Premium UI/UX** - Glass morphism, animations

### 🚀 Quick Start:

#### 1. Setup Environment Variables
```bash
# Backend
cp backend/.env.example backend/.env
# Edit backend/.env with your API keys

# Frontend  
cp frontend/.env.example frontend/.env
# Edit frontend/.env with your keys
```

#### 2. Install Dependencies
```bash
# Backend
cd backend && pip install -r requirements.txt

# Frontend
cd frontend && yarn install
```

#### 3. Required API Keys:
- **Stripe**: https://dashboard.stripe.com/apikeys
- **Google Gemini**: https://makersuite.google.com/app/apikey
- **SendGrid**: https://app.sendgrid.com/settings/api_keys

#### 4. Start Development
```bash
# Backend: uvicorn server:app --reload --host 0.0.0.0 --port 8001
# Frontend: yarn start
```

### 🔧 Admin Demo (No Login Required):
Visit `/admin-demo` to see all premium features without authentication.

---
**Enterprise-level basketball platform with payments, AI, and analytics**
