# 🌐 Socially - A Modern Social Media App Built with Next.js

**Socially** is a minimal, full-stack social media platform built with **Next.js**, **Tailwind CSS**, and **ShadCN UI**. It allows users to create accounts, post content with images, and browse a real-time feed. This project is great for learning full-stack development and experimenting with modern web technologies.

![App Screenshot](./screenshot.png) <!-- Replace with actual screenshot path -->

---

## ✨ Features

- 🔐 User authentication system (Sign up / Log in)
- 📝 Create and share posts with image uploads (max 4MB)
- 👤 User profile page with follower/following stats
- 📰 Real-time post feed
- 🌑 Elegant dark mode UI
- 📸 Drag-and-drop file upload for images
- ⚙️ Built using modular and scalable folder structure

---

## 🛠 Tech Stack

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [ShadCN UI](https://ui.shadcn.com/)
- **Backend:** (Optional) [Prisma](https://www.prisma.io/) ORM, [MongoDB](https://www.mongodb.com/) or [PostgreSQL](https://www.postgresql.org/)
- **File Upload:** Custom image handler or third-party like Cloudinary
- **Auth:** NextAuth.js or custom auth (can be extended)

---

## 🚀 Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/luongvankiet/nextjs-socially
cd socially
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure environment variables
Create a .env.local file:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_public_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_database_url
UPLOADTHING_TOKEN=your_uploadthing_key
```

### 4. Run the development server
```bash
npm run dev
# or
yarn dev
```

Visit http://localhost:3000 in your browser to see the app.
