# StreamSync – Watch Together, From Anywhere

**StreamSync** is a real-time co-watching platform that lets you and your friends watch YouTube videos in perfect sync—no matter where you are. With private rooms, host control, live chat, and seamless video syncing via Socket.IO, StreamSync transforms solo streaming into a shared experience.

---

## 🚀 Live Demo

[Try StreamSync Now](https://streamsyncc.vercel.app)

---

## 📸 Preview

![StreamSync Screenshot](https://adapalabhargavakrishna.github.io/Web-Development/Portfolio/assets/streamsync.png)

---

## ✨ Features

- **Room-Based Watching:** Create or join private rooms with unique IDs.
- **YouTube Sync:** Paste a video link or search in-app to watch together in real-time.
- **Host Control:** Only the room host can control playback (play, pause, seek).
- **Live Chat:** Talk with your friends as you watch—built-in real-time messaging.
- **Video Search Mode:** Quickly find and load trending or searched videos.
- **Responsive Design:** Built for all screen sizes with smooth animations and transitions.

---

## 🖥️ Tech Stack

- **Frontend:** React, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js, Socket.IO
- **Database:** MongoDB
- **Hosting:** Vercel (frontend), Render (backend)

---

## ⚡ Getting Started

1. **Clone the repository:**
```bash
git clone https://github.com/AdapalaBhargavaKrishna/StreamSync.git
cd StreamSync
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Create a `.env` file in the `backend` folder with the following:
```env
MONGO_URI=your_mongo_connection
CLIENT_URL=http://localhost:3000
PORT=5000
```

4. **Run the app locally:**

**Start Backend:**
```bash
cd backend
npm install
npm run dev
```

**Start Frontend:**
```bash
cd frontend
npm install
npm start
```

5. **Open in browser:**  
Visit `http://localhost:3000`

---

## 🏆 Highlights

- Real-time, low-latency sync using Socket.IO events (`play`, `pause`, `seek`)
- Private room architecture for isolated sessions
- Modern UI built with Tailwind and Framer Motion
- Built for binge-watchers, long-distance friends, and study groups

---

## 🙌 Feedback

Have feedback, feature ideas, or want to collaborate?  
Open an issue or connect with me on [LinkedIn](https://www.linkedin.com/in/adapalabhargavakrishna/)
