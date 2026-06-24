# 🚀 APIWatch

> **Real-Time API Monitoring Platform**
>
> Monitor API uptime, performance, availability, and health from a single dashboard with real-time updates.

---

## 📖 Overview

APIWatch is a full-stack web application that helps developers monitor REST APIs in real time. It continuously checks endpoint availability, measures response times, and provides a centralized dashboard to visualize API health.

The platform is designed to simplify monitoring by giving users instant visibility into the status of their APIs without manually testing endpoints.

---

## ✨ Features

### 📡 API Monitoring
- Add and manage multiple API endpoints
- Automatic health checks
- Live online/offline status
- HTTP status code tracking
- Response time measurement
- Uptime monitoring

### 📊 Dashboard
- Overview of all monitored APIs
- Active endpoint count
- Average response time
- Global uptime statistics
- Health summary
- Recent monitoring activity

### 📈 Analytics
- Response time trends
- Uptime visualization
- Performance insights
- Historical monitoring data

### 🚨 Incident Tracking
- Automatic incident creation
- Incident history
- Downtime tracking
- Recovery monitoring

### 🔔 Real-Time Updates
- Instant dashboard updates
- Live monitor status
- Socket.IO integration
- No manual page refresh required

### 🔐 Authentication
- User Registration
- Secure Login
- JWT Authentication
- Protected Routes
- Password visibility toggle

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Framer Motion
- Axios
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.IO
- Axios

---

## 📂 Project Structure

```
apiwatch
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   └── utils
│   └── public
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/SkZaraSultana/apiwatch.git
```

### Backend

```bash
cd apiwatch/backend
npm install
npm run dev
```

### Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🌐 Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_CONNECTION

JWT_SECRET=YOUR_SECRET

JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET

CLIENT_URL=http://localhost:5173
```

---

## 🎯 Current Capabilities

- ✅ User Authentication
- ✅ API Monitoring
- ✅ Dashboard
- ✅ Response Time Tracking
- ✅ Health Checks
- ✅ Status Monitoring
- ✅ Analytics
- ✅ Incident Management
- ✅ Real-Time Communication
- ✅ Responsive UI

---

## 🚀 Future Enhancements

- Email Notifications
- SSL Certificate Monitoring
- Advanced Security Analysis
- Custom Alert Rules
- Scheduled Reports
- Team Collaboration
- Public Status Page
- API Performance Forecasting

---

## 📸 Screenshots

Add screenshots of:

- Home Page
- Dashboard
- Analytics
- Monitor Management
- Incident Page
- Login Page

---

## 🤝 Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository
2. Create a new branch
3. Commit your changes
4. Push your branch
5. Open a Pull Request

---

## 📄 License

This project is developed for learning and educational purposes.

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It helps others discover the project and supports future improvements.

---

# 💙 APIWatch

**Monitor smarter. Respond faster. Build with confidence.**
