# 🗳️ legitpoll-v2 - Cross-Platform Social Polling App

> **Where social media users debate through polls**

A mobile-first social polling platform where users vote on yes/no questions and engage in threaded discussions with rich social media embeds. Built for viral sharing and cross-platform community building.

## 🎯 Core Concept

**The Problem**: Current polling platforms lack engagement and social integration
**The Solution**: Combine Reddit-style discussions with TikTok-style content sharing and real-time poll results

### Key Features
- **1-click OAuth login** (no email/password bullshit)
- **Yes/No polls** with real-time percentage breakdowns by platform
- **Threaded comments** with social media embeds (TikTok, Twitter, YouTube, Instagram)
- **Like/dislike system** for community moderation
- **Viral sharing** with dynamic social cards showing live poll results
- **Platform analytics** (see how Reddit vs Twitter vs Google users vote)

## 🏗️ Tech Stack

### Frontend
- **Next.js 14** (JavaScript - no TypeScript)
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Capacitor** for mobile app deployment

### Backend
- **Firebase Auth** (OAuth only - Google, Twitter, Reddit, Truth Social)
- **Firestore** for real-time data
- **Firebase Functions** for serverless logic
- **Vercel** for hosting

### Mobile
- **Mobile-first design** (thumb-friendly UI)
- **Capacitor** for iOS/Android native apps
- **PWA** support for web app installation

## 🎨 Design Philosophy

### Mobile-First
- **Thumb navigation** - all interactions within thumb reach
- **Swipe gestures** for voting and navigation
- **Bottom sheets** for comments and modals
- **Large touch targets** (minimum 44px)
- **Safe area support** for notched devices

### Social-Native
- **Platform badges** show user's origin (Twitter, Reddit, etc.)
- **Rich embeds** for TikTok, YouTube, Twitter content
- **Share-first** design with viral mechanics built-in
- **Identity verification** through OAuth providers

## 📱 User Experience Flow

1. **Discover**: Scroll through vertical feed of polls (TikTok-style)
2. **Vote**: Tap large YES/NO buttons with haptic feedback
3. **Explore**: Expand platform breakdown to see how different social media users voted
4. **Engage**: Swipe up to view threaded comments with social embeds
5. **Share**: Generate beautiful cards with live poll results for social media

## 🔐 Authentication Strategy

### Supported Platforms
| Platform | Method | Data Retrieved |
|----------|---------|----------------|
| **Google** | Firebase Auth | Email, name, avatar |
| **Twitter/X** | Firebase Auth | @handle, name, avatar, verified status |
| **Reddit** | Custom OAuth | u/username, karma, avatar |
| **Truth Social** | Custom OAuth | Handle, name, avatar |

### Identity System
- **No passwords** - OAuth only
- **Verified identities** reduce spam and trolling
- **Platform badges** show user origin
- **Auto-profile creation** from social data

## 📊 Database Schema

### Core Collections

```javascript
// Polls
{
  id: "poll_123",
  question: "Should pineapple go on pizza?",
  yesVotes: 1247,
  noVotes: 892,
  platformBreakdown: {
    google: { yes: 234, no: 156 },
    twitter: { yes: 567, no: 234 },
    reddit: { yes: 445, no: 502 },
    truthsocial: { yes: 1, no: 0 }
  },
  topComments: [...], // Preview comments for poll card
  commentCount: 89,
  createdAt: timestamp,
  createdBy: "user_456"
}

// Comments (Threaded)
{
  id: "comment_789",
  pollId: "poll_123",
  userId: "user_456",
  content: "This is my hot take...",
  embedUrl: "https://tiktok.com/@user/video/123",
  embedType: "tiktok",
  upvotes: 45,
  downvotes: 12,
  parentId: null, // null = top-level, comment_id = reply
  level: 0, // nesting depth
  replyCount: 3,
  createdAt: timestamp
}

// Users
{
  id: "user_456",
  platform: "twitter",
  username: "@chadgpt",
  displayName: "Chad GPT",
  avatar: "https://...",
  profileUrl: "https://twitter.com/chadgpt",
  verified: true,
  createdAt: timestamp
}

// Votes
{
  pollId: "poll_123",
  userId: "user_456",
  choice: "yes",
  platform: "twitter",
  timestamp: timestamp
}
```

## 🚀 Development Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] **Project Setup**
  - [ ] Next.js + JavaScript + Tailwind
  - [ ] shadcn/ui installation
  - [ ] Firebase project setup
  - [ ] GitHub repository
  - [ ] Vercel deployment pipeline

- [ ] **Authentication System**
  - [ ] Firebase Auth setup
  - [ ] Google OAuth integration
  - [ ] Twitter OAuth integration
  - [ ] User profile creation
  - [ ] Auth state management

- [ ] **Basic Poll Interface**
  - [ ] Poll display component
  - [ ] Yes/No voting buttons
  - [ ] Real-time vote counting
  - [ ] Mobile-optimized layout

### Phase 2: Core Features (Week 3-4)
- [ ] **Poll Results & Analytics**
  - [ ] Platform breakdown display
  - [ ] Expandable details component
  - [ ] Animated progress bars
  - [ ] Percentage calculations

- [ ] **Comment System Foundation**
  - [ ] Text-only comments
  - [ ] Comment preview on poll cards
  - [ ] Basic threading structure
  - [ ] Like/dislike functionality

- [ ] **User Profiles**
  - [ ] Profile pages
  - [ ] Comment history
  - [ ] Platform badge system
  - [ ] User stats

### Phase 3: Rich Content (Week 5-6)
- [ ] **Social Media Embeds**
  - [ ] TikTok embed component
  - [ ] Twitter embed component
  - [ ] YouTube embed component
  - [ ] Instagram embed component
  - [ ] URL detection and parsing

- [ ] **Enhanced Comments**
  - [ ] Rich text support
  - [ ] Social embed integration
  - [ ] Threaded replies (Reddit-style)
  - [ ] Comment sorting options

### Phase 4: Sharing & Virality (Week 7-8)
- [ ] **Dynamic Share Cards**
  - [ ] OpenGraph image generation
  - [ ] Live poll results in shares
  - [ ] Platform-optimized formats
  - [ ] Copy link functionality

- [ ] **Additional OAuth Providers**
  - [ ] Reddit custom OAuth
  - [ ] Truth Social custom OAuth
  - [ ] Platform-specific features

### Phase 5: Mobile App (Week 9-10)
- [ ] **Capacitor Integration**
  - [ ] iOS app build
  - [ ] Android app build
  - [ ] Push notifications
  - [ ] Native sharing
  - [ ] Haptic feedback

- [ ] **Performance & Polish**
  - [ ] Image optimization
  - [ ] Offline support
  - [ ] Loading states
  - [ ] Error handling
  - [ ] Analytics tracking

## 🎯 Success Metrics

### Engagement Metrics
- **Daily Active Users** (DAU)
- **Poll participation rate** (votes per view)
- **Comment engagement** (comments per poll)
- **Share rate** (shares per poll)
- **Session duration** (time spent in app)

### Growth Metrics
- **Viral coefficient** (new users per share)
- **Platform diversity** (balance across social platforms)
- **Content creation** (user-generated polls)
- **Retention rate** (7-day, 30-day)

## 🔧 Technical Requirements

### Development Environment
```bash
# Required tools
Node.js 18+
npm or yarn
Git
Firebase CLI
Capacitor CLI (for mobile builds)
```

### API Keys & Services
- [ ] Firebase project (Auth, Firestore, Functions)
- [ ] Twitter Developer Account (for OAuth)
- [ ] Reddit App Registration (for OAuth)
- [ ] Truth Social API access (if available)
- [ ] Vercel account (for deployment)
- [ ] Google Cloud Console (for additional APIs)

### Third-Party Integrations
- [ ] **oEmbed APIs** for social embeds
- [ ] **Capacitor plugins** for native features
- [ ] **Analytics service** (Google Analytics, Mixpanel)
- [ ] **Error tracking** (Sentry)
- [ ] **Image optimization** (Cloudinary, Vercel)

## 📋 Pre-Launch Checklist

### Technical Checklist
- [ ] OAuth flows working for all platforms
- [ ] Real-time voting and comments
- [ ] Mobile responsive design
- [ ] Share card generation
- [ ] Error handling and edge cases
- [ ] Performance optimization
- [ ] Security review (Firebase rules)
- [ ] Cross-browser testing

### Content & Legal
- [ ] Terms of Service
- [ ] Privacy Policy
- [ ] Community Guidelines
- [ ] App Store descriptions
- [ ] Marketing materials
- [ ] Beta user recruitment

### Business Checklist
- [ ] Domain registration
- [ ] App Store developer accounts
- [ ] Analytics setup
- [ ] Support system
- [ ] Monetization strategy
- [ ] Marketing launch plan

## 🎬 Getting Started

### 1. Clone & Setup
```bash
git clone https://github.com/[username]/poll-social
cd poll-social
npm install
```

### 2. Environment Variables
```bash
# .env.local
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# OAuth credentials
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
REDDIT_CLIENT_ID=
REDDIT_CLIENT_SECRET=
```

### 3. Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### 4. Mobile Development
```bash
npm run build        # Build web app first
npx cap add ios      # Add iOS platform
npx cap add android  # Add Android platform
npx cap run ios      # Run on iOS simulator
npx cap run android  # Run on Android emulator
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ for the social polling revolution**

*Connect, debate, and discover what the world really thinks.*
