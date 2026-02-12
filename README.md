# 🏺 Silo — Your Digital Second Brain

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://getsilo.me)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2016-blue?style=flat-square&logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Silo** is a minimalist, professional workspace designed to capture, organize, and secure your digital life. No more losing links, burying ideas in notes, or forgetting where you saved that one PDF.



---

## 🚀 Why Silo?

Most tools are either too complex or too messy. Silo focuses on **speed** and **structure**:

- **⚡ Instant Capture:** Save any resource (Link, Note, Media) in seconds.
- **🏷️ Contextual Tagging:** Move beyond folders. Use tags to link ideas across different projects.
- **🔒 Privacy First:** Your data belongs to you. Built-in 2FA (Two-Factor Authentication) and full data portability.
- **📦 Smart Export:** One-click export of your entire brain in JSON and ZIP formats.

## 🛠️ The Tech Stack

Built with a modern, scalable architecture to ensure performance and reliability:

- **Frontend:** [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** Supabase Auth (including Google OAuth & 2FA)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 🏗️ Architecture Overview



Silo uses a serverless architecture where Next.js Server Actions interact directly with Supabase through Prisma. This ensures a fast, reactive UI while keeping the backend logic secure and scalable.

## 🏁 Getting Started

If you want to run this project locally:

1. **Clone the repo:**
   ```bash
   git clone [https://github.com/Kh-Abdou/Silo.git](https://github.com/Kh-Abdou/Silo.git)

2. **Install dependencies:**

```bash
npm install
```

3. **Set up environment variables:**

Create a .env file based on .env.example and fill it with your Supabase credentials.

4. **Run migrations:**

npx prisma generate
npx prisma db push

5. Start the engine:**

npm run dev

