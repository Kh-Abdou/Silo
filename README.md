# 🏺 Silo — Your Digital Second Brain

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://getsilo.me)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2016.1.6-blue?style=flat-square&logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)


**Silo** is a minimalist, professional workspace designed to capture, organize, and secure your digital life. It serves as your personal knowledge vault, ensuring you never lose a link, bury an idea, or forget a resource.

---

## 🚀 Key Features

Most tools are either too complex or too messy. Silo focuses on **speed**, **structure**, and **portability**:

- **🏺 Centralized Vault:** Save and organize Links, Notes, and Media in one secure place with a beautiful Masonry grid layout.
- **🏷️ Contextual Tagging:** Move beyond rigid folders. Use multi-select tags to link ideas across different contexts and projects.
- **🎬 Visual Summaries (Remotion):** Generate stunning video summaries of your vault contents using built-in programmatic video creation.
- **🔒 Security First:** Your data is protected by Supabase Auth, including Magic Links, protected session management, and secure database row-level security.
- **📦 Smart Export:** One-click export of your entire "brain" in structured ZIP formats, preserving your data ownership and folder hierarchy.
- **📱 Mobile Responsive:** Optimized for both mobile and desktop devices with a native-like feel.
- **🌓 Adaptive UI:** Sleek dark and light modes with smooth Framer Motion transitions and a premium aesthetic.

---

## 🛠️ The Tech Stack

Built with a cutting-edge, scalable architecture to ensure peak performance:

- **Framework:** [Next.js 16.1.6](https://nextjs.org/) (App Router, Server Actions, Turbopack)
- **Visuals:** [Remotion](https://remotion.dev/) for programmatic video creation
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **Components:** [Shadcn UI](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **State Management:** [TanStack Query (React Query)](https://tanstack.com/query/latest)
- **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Deployment:** [Vercel](https://vercel.com/)

---

## 📁 Project Structure

```text
Silo/
├── prisma/             # Database schema and migrations
├── public/             # Static assets and PWA icons
├── src/
│   ├── app/            # Next.js App Router (Public & Protected routes)
│   ├── components/     # UI components (Shadcn, Landing, Core)
│   ├── hooks/          # Custom React hooks (Auth, UI, Logic)
│   ├── lib/            # Utilities, Supabase client, Prisma client
│   ├── remotion/       # Video composition source code
│   ├── types/          # TypeScript definitions
│   └── middleware.ts   # Auth & session protection
└── ... configs         # Tailwind, TS, ESLint, etc.
```

---

## 🏁 Getting Started

To run Silo locally and start building your second brain:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Kh-Abdou/Silo.git
   cd Silo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file based on `.env.template`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   DATABASE_URL=your_postgresql_url
   DIRECT_URL=your_direct_url
   ```

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

6. **(Optional) Preview Remotion composition:**
   ```bash
   npm run remotion:preview
   ```

---

## 📦 Export & Portability

Silo ensures you are never locked into a platform. Use the **Export Center** to generate a full ZIP archive of your resources, including metadata and structured folders. We believe in **data sovereignty**.

---

## 🤝 Third-Party Credits & Acknowledgments

Silo is built upon the shoulders of giants and wouldn't be possible without these amazing open-source projects and services:

- **Icons:** [Lucide React](https://lucide.dev/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Backend as a Service:** [Supabase](https://supabase.com/)
- **Video Engine:** [Remotion](https://remotion.dev/)
- **Fonts:** [Geist Sans & Mono](https://vercel.com/font)
- **Notifications:** [Sonner](https://sonner.emilkowal.ski/)
- **Email Service:** [Resend](https://resend.com/) (Transactional Emails & Magic Links)
- **Utilities:** [clsx](https://github.com/lukeed/clsx), [tailwind-merge](https://github.com/dcastil/tailwind-merge)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

