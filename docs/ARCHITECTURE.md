# Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│  React Frontend  │  Mobile App (React Native)  │  Admin Panel    │
└────────────┬──────────────────────────┬─────────────────────────┘
             │                          │
             │                          │
┌────────────▼──────────────────────────▼─────────────────────────┐
│                     API GATEWAY LAYER                             │
├──────────────────────────────────────────────────────────────────┤
│  Load Balancer  │  Request Validation  │  Rate Limiting          │
│  CORS Handling  │  Logging             │  Authentication Check   │
└────────────┬───────────────────────────┬──────────────────────────┘
             │                           │
┌────────────▼───────────────────────────▼──────────────────────────┐
│                    APPLICATION LAYER                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                     Express.js Server                       │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │                                                              │ │
│  │  Controllers  →  Services  →  Models  →  Database           │ │
│  │                                                              │ │
│  │  • Auth Service        • User Service      • Match Service   │ │
│  │  • Message Service     • Analytics Service • Interest Srv    │ │
│  │  • Recommendation Eng  • Notification Srv  • Search Service  │ │
│  │                                                              │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │                     WebSocket Layer                          │ │
│  ├──────────────────────────────────────────────────────────────┤ │
│  │  Socket.io for Real-time Communication                       │ │
│  │  • Live Messaging     • Presence Tracking  • Notifications  │ │
│  │  • Typing Indicators  • Group Chat         • Live Updates   │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────┬────────────────────────────────────┬─────────────────────┘
         │                                    │
    ┌────▼─────────────────────────────┬─────▼──────────────────┐
    │      CACHING & SESSION LAYER     │   PERSISTENCE LAYER    │
    ├──────────────────────────────────┼──────────────────────┤
    │  Redis                           │  PostgreSQL Database  │
    │  • Session Store                 │  • User Data          │
    │  • Match Score Cache             │  • Messages           │
    │  • User Presence                 │  • Relationships      │
    │  • Rate Limiting                 │  • Analytics          │
    │  • Queue (Bull)                  │                       │
    └──────────────────────────────────┴──────────────────────┘
```

## Microservices Architecture (Optional - Future)

```
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway                                  │
│                   (Kong / AWS Gateway)                            │
└─────────────┬───────────────────────────┬──────────┬─────────────┘
              │                           │          │
    ┌─────────▼──────────┐    ┌──────────▼────┐   ┌─▼────────────┐
    │  User Service      │    │ Matching Svc  │   │Message Svc   │
    ├────────────────────┤    ├───────────────┤   ├──────────────┤
    │ • Auth             │    │ • Algorithms  │   │ • Messaging  │
    │ • Profiles         │    │ • Scoring     │   │ • Groups     │
    │ • Preferences      │    │ • Recommend   │   │ • Presence   │
    └────────────────────┘    └───────────────┘   └──────────────┘
              │                        │                 │
    ┌─────────▼──────────┐    ┌──────────▼────┐   ┌─▼────────────┐
    │Analytics Service   │    │ Interest Svc  │   │Notification │
    ├────────────────────┤    ├───────────────┤   ├──────────────┤
    │ • Events           │    │ • Categories  │   │ • Alerts     │
    │ • Engagement       │    │ • Tagging     │   │ • Email      │
    │ • Reports          │    │ • Trending    │   │ • Push       │
    └────────────────────┘    └───────────────┘   └──────────────┘
```

---

## Backend Structure

### Project Layout

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Database connection config
│   │   ├── redis.js             # Redis connection config
│   │   ├── env.js               # Environment variables
│   │   └── constants.js         # App constants
│   │
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   ├── errorHandler.js      # Global error handling
│   │   ├── requestLogger.js     # Request logging
│   │   ├── rateLimit.js         # Rate limiting
│   │   ├── validation.js        # Input validation
│   │   └── cors.js              # CORS configuration
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── matchController.js
│   │   ├── messageController.js
│   │   ├── interestController.js
│   │   ├── notificationController.js
│   │   └── analyticsController.js
│   │
│   ├── services/
│   │   ├── authService.js       # Auth logic
│   │   ├── userService.js       # User operations
│   │   ├── matchService.js      # Matching algorithms
│   │   ├── messageService.js    # Messaging logic
│   │   ├── interestService.js   # Interest operations
│   │   ├── recommendationEngine.js
│   │   ├── analyticsService.js
│   │   └── notificationService.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Message.js
│   │   ├── FriendRequest.js
│   │   ├── Interest.js
│   │   ├── Notification.js
│   │   ├── GroupChat.js
│   │   └── AnalyticsEvent.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── matches.js
│   │   ├── messages.js
│   │   ├── interests.js
│   │   ├── notifications.js
│   │   ├── analytics.js
│   │   └── index.js             # Main router
│   │
│   ├── websocket/
│   │   ├── handlers/
│   │   │   ├── messageHandler.js
│   │   │   ├── presenceHandler.js
│   │   │   └── notificationHandler.js
│   │   ├── events.js            # WebSocket events
│   │   └── namespace.js         # Namespace configs
│   │
│   ├── utils/
│   │   ├── validators.js        # Validation helpers
│   │   ├── crypto.js            # Encryption utilities
│   │   ├── email.js             # Email sending
│   │   ├── logger.js            # Logging utility
│   │   ├── cache.js             # Cache helpers
│   │   ├── pagination.js        # Pagination logic
│   │   └── errors.js            # Custom error classes
│   │
│   ├── jobs/
│   │   ├── recommendationJob.js # Calculate recommendations
│   │   ├── analyticsJob.js      # Aggregate analytics
│   │   ├── cleanupJob.js        # Clean expired data
│   │   └── emailJob.js          # Send emails
│   │
│   └── app.js                   # Express app setup
│
├── migrations/
│   ├── 001_create_users_table.js
│   ├── 002_create_interests_table.js
│   ├── 003_create_messages_table.js
│   └── ...
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── fixtures/
│
├── .env.example
├── .env.test
├── package.json
└── server.js                    # Entry point
```

---

## Frontend Structure

### React Component Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── Layout.jsx
│   │   │
│   │   ├── Auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── EmailVerification.jsx
│   │   │   └── PasswordReset.jsx
│   │   │
│   │   ├── User/
│   │   │   ├── ProfileCard.jsx
│   │   │   ├── ProfileEdit.jsx
│   │   │   ├── UserList.jsx
│   │   │   └── UserDetail.jsx
│   │   │
│   │   ├── Match/
│   │   │   ├── RecommendationCard.jsx
│   │   │   ├── RecommendationList.jsx
│   │   │   ├── FriendRequestCard.jsx
│   │   │   ├── FriendsList.jsx
│   │   │   └── MatchHistory.jsx
│   │   │
│   │   ├── Messages/
│   │   │   ├── ConversationList.jsx
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   ├── GroupChatList.jsx
│   │   │   └── GroupChatWindow.jsx
│   │   │
│   │   ├── Search/
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterPanel.jsx
│   │   │   └── SearchResults.jsx
│   │   │
│   │   ├── Notifications/
│   │   │   ├── NotificationBell.jsx
│   │   │   ├── NotificationCenter.jsx
│   │   │   └── NotificationItem.jsx
│   │   │
│   │   └── Common/
│   │       ├── Button.jsx
│   │       ├── Modal.jsx
│   │       ├── Loader.jsx
│   │       ├── Avatar.jsx
│   │       └── Badge.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Explore.jsx
│   │   ├── Messages.jsx
│   │   ├── Profile.jsx
│   │   ├── Settings.jsx
│   │   ├── Help.jsx
│   │   └── NotFound.jsx
│   │
│   ├── services/
│   │   ├── api.js               # Axios instance
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── matchService.js
│   │   ├── messageService.js
│   │   ├── socketService.js
│   │   └── analyticsService.js
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUser.js
│   │   ├── useMatches.js
│   │   ├── useMessages.js
│   │   ├── usePagination.js
│   │   └── useSocket.js
│   │
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── UserContext.jsx
│   │   ├── NotificationContext.jsx
│   │   └── ThemeContext.jsx
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── variables.css
│   │   ├── components/
│   │   └── pages/
│   │
│   ├── utils/
│   │   ├── helpers.js
│   │   ├── validators.js
│   │   ├── formatters.js
│   │   └── constants.js
│   │
│   ├── App.jsx
│   ├── index.jsx
│   └── Router.jsx
│
├── public/
│   ├── index.html
│   └── assets/
│
└── package.json
```

---

## Data Flow

### User Registration Flow

```
Frontend (Register Form)
    │
    ├─→ Validate Input (Client-side)
    │
    ├─→ POST /api/auth/register
    │
    └─→ Backend
         │
         ├─→ Validate Input (Server-side)
         │
         ├─→ Hash Password
         │
         ├─→ Create User Record
         │
         ├─→ Generate Verification Token
         │
         ├─→ Send Verification Email (Queue Job)
         │
         ├─→ Generate JWT Token
         │
         └─→ Response: { token, user }
         
Frontend (Receives Token)
    │
    ├─→ Store in localStorage/sessionStorage
    │
    ├─→ Setup Authorization Header
    │
    └─→ Redirect to Email Verification Page
```

### Message Flow (Real-time)

```
User A Sends Message
    │
    ├─→ Message Input
    │
    ├─→ emit 'send_message' (WebSocket)
    │
    └─→ Backend Socket Handler
         │
         ├─→ Validate Message
         │
         ├─→ Save to Database
         │
         ├─→ Check if Recipient Online
         │
         ├─→ emit 'new_message' to User B
         │
         ├─→ Create Notification
         │
         └─→ emit 'message_sent_confirmation' to User A
         
User B (if online)
    │
    ├─→ Receive 'new_message'
    │
    ├─→ Update Chat UI
    │
    ├─→ Play Notification Sound
    │
    └─→ Auto-mark as read (if in focus)
    
User B (if offline)
    │
    ├─→ Notification stored
    │
    └─→ Delivered when reconnected
```

---

## Technology Stack Details

### Backend Technologies

**Runtime & Framework:**
- Node.js v16+ - JavaScript runtime
- Express.js 4.x - Web framework
- Socket.io - WebSocket library

**Database & Caching:**
- PostgreSQL 12+ - Primary database
- Redis 6+ - Caching and sessions
- Sequelize/Knex - ORM/Query builder
- Bull - Job queue

**Authentication & Security:**
- JWT (jsonwebtoken) - Token auth
- Bcrypt - Password hashing
- CORS - Cross-origin requests
- Helmet - Security headers

**Validation & Processing:**
- Joi - Input validation
- Multer - File uploads
- Sharp - Image processing
- Compression - Response compression

**Logging & Monitoring:**
- Winston - Logging library
- Morgan - HTTP request logger
- Sentry - Error tracking
- New Relic - Performance monitoring

### Frontend Technologies

**Framework & Build:**
- React 18+ - UI library
- Vite - Build tool
- React Router 6 - Routing

**State Management:**
- Context API - State management
- Custom Hooks - State logic
- Redux (optional) - For complex state

**HTTP & WebSocket:**
- Axios - HTTP client
- Socket.io-client - WebSocket client

**UI & Styling:**
- TailwindCSS - Utility-first CSS
- React Query - Server state
- React Hook Form - Form handling

**Development Tools:**
- ESLint - Code linting
- Prettier - Code formatting
- Vitest - Unit testing
- React Testing Library - Component testing

---

## Deployment Architecture

### Production Environment

```
                    ┌─────────────────────┐
                    │   CloudFlare CDN    │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  AWS Application    │
                    │  Load Balancer      │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
    ┌───▼────┐             ┌───▼────┐            ┌───▼────┐
    │  EC2   │             │  EC2   │            │  EC2   │
    │ Server │             │ Server │            │ Server │
    │   (1)  │             │   (2)  │            │   (3)  │
    └────────┘             └────────┘            └────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               │
                    ┌──────────▼──────────┐
                    │  RDS PostgreSQL    │
                    │  (Multi-AZ)         │
                    └────────────────────┘
                    
                    ┌──────────────────────┐
                    │  ElastiCache Redis  │
                    │  (Cluster Mode)     │
                    └────────────────────┘
```

---

## Security Considerations

1. **Authentication**
   - JWT with secure expiration
   - Refresh token rotation
   - UNSW email verification required

2. **Data Protection**
   - Passwords hashed with bcrypt
   - HTTPS/TLS for all communications
   - Data encryption at rest
   - Environment variables for secrets

3. **Access Control**
   - Role-based access control (RBAC)
   - User can only access their own data
   - Admin-only analytics endpoints
   - Rate limiting on auth endpoints

4. **Monitoring**
   - Request logging and analysis
   - Error tracking with Sentry
   - Suspicious activity alerts
   - Regular security audits

---

## Performance Optimization

1. **Caching**
   - Redis for session storage
   - Match score caching (24hrs)
   - User preference caching
   - Interest categories caching

2. **Database**
   - Connection pooling
   - Query optimization with indexes
   - Denormalization where needed
   - Batch operations for bulk inserts

3. **Frontend**
   - Code splitting and lazy loading
   - Image optimization
   - CSS-in-JS optimization
   - Virtual scrolling for large lists

4. **Backend**
   - Compression middleware
   - Response pagination
   - Background job processing
   - Load balancing across servers

---

## Scalability

1. **Horizontal Scaling**
   - Stateless API servers (can be added/removed)
   - Load balancer distributes traffic
   - Database read replicas
   - Redis cluster for high availability

2. **Vertical Scaling**
   - Increase server resources as needed
   - Database optimization
   - Cache tuning
   - Connection pooling adjustment

3. **Database Scaling**
   - Read replicas for analytics queries
   - Sharding for large datasets
   - Archiving old data
   - Query optimization

---

## Disaster Recovery

1. **Backup Strategy**
   - Daily automated database backups
   - Point-in-time recovery enabled
   - Cross-region backup replication

2. **Monitoring & Alerts**
   - Service health checks
   - Database connectivity monitoring
   - Error rate alerts
   - Performance degradation alerts

3. **Failover**
   - Automatic database failover
   - Load balancer health checks
   - Cache layer redundancy
   - Blue-green deployment support
