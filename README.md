# HobbyHub - Experience Booking Platform 🎨🕺🏔️

Instead of booking homes, users book unique hands-on experiences:
- Pottery Workshops
- Dance & Salsa Classes
- Trekking Groups & Nature Hikes
- Acrylic Painting Sessions
- Handmade Cooking Classes
- Music & Jam Sessions

Built with **MERN Stack** (MongoDB, Express, React, Node.js) with custom aesthetics using the **Twisted Spot Palette**:
- Electric Cyan: `#00D7FF`
- Deep Terracotta: `#7E2D00`
- Warm Cream Surface: `#FFE9CF`
- Muted Taupe Accent: `#917159`

---

##  Features

1. **Browse & Search Experiences**: Filter by Category (Pottery, Dance, Trekking, Painting, Cooking, Music), City/Location, or search terms.
2. **Interactive Experience Modal**: View full host bio, gallery images, detailed itinerary, included items, available date/time slots, and user reviews.
3. **Seamless Booking Flow**: Dynamic price calculator based on number of guests, date selection, instant confirmation badge with booking reference.
4. **Host an Experience**: Community members can list their own workshop or activity with pricing, photos, capacity, and schedule.
5. **My Bookings Dashboard**: Track and manage upcoming reservations with instant cancellation functionality.
6. **Zero-Setup Local Dev**: Automatically starts `mongodb-memory-server` if no external database URI is supplied!

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Run backend server (with auto seed & in-memory MongoDB fallback)
npm run dev:server

# 3. In another terminal, run frontend React app
npm run dev:client
```

Open `http://localhost:5173` to explore the app!

---

## 📤 Pushing to GitHub & Deploying on Render

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit - HobbyHub MERN App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/hobbyhub.git
git push -u origin main
```

### Step 2: Deploy on Render

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository `hobbyhub`.
4. Configure service settings:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Environment Variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string (e.g. `mongodb+server://user:pass@cluster.mongodb.net/hobbyhub?retryWrites=true&w=majority`).
6. Click **Create Web Service**! Render will automatically run `npm run build` to compile the Vite React app into `client/dist`, then launch `server/index.js` which serves both the API routes `/api/*` and the static React app.
