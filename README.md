# 🏺 Silo — Your Digital Second Brain

[![Vercel Deployment](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://getsilo.me)
[![Next.js](https://img.shields.io/badge/Framework-Next.js%2016.1.6-blue?style=flat-square&logo=next.js)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Silo** is a minimalist, professional workspace designed to capture, organize, and secure your digital life. It serves as your personal knowledge vault, ensuring you never lose a link, bury an idea, or forget a resource.

---

## 🚀 Key Features

Most tools are either too complex or too messy. Silo focuses on **speed**, **structure**, and **portability**:

- **🏺 Centralized Vault:** Save and organize Links, Notes, and Media in one secure place.
- **🏷️ Contextual Tagging:** Move beyond rigid folders. Use tags to link ideas across different contexts and projects.
- **🎬 Visual Summaries (Remotion):** Generate stunning video summaries of your vault contents using built-in Remotion integration.
- **🔒 Security First:** Your data is protected by Supabase Auth, including 2FA (Two-Factor Authentication) and protected session management.
- **📦 Smart Export:** One-click export of your entire "brain" in JSON and structured ZIP formats, preserving your data ownership.
- **📱 PWA Ready:** Install Silo on your mobile device or desktop for a native-like, focused experience.

---

## 🛠️ The Tech Stack

Built with a cutting-edge, scalable architecture to ensure peak performance:

- **Frontend:** [Next.js 16.1.6](https://nextjs.org/) (App Router & Turbopack)
- **Visuals:** [Remotion](https://remotion.dev/) for programmatic video creation
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/) + [Shadcn UI](https://ui.shadcn.com/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) via [Supabase](https://supabase.com/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** Supabase Auth (Magic Links, OAuth, 2FA)
- **Deployment:** [Vercel](https://vercel.com/)

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
   Create a `.env` file based on `.env.template` and fill it with your Supabase credentials.

4. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the engine:**
   ```bash
   npm run dev
   ```

---

## 📦 Export & Portability

Silo ensures you are never locked into a platform. Use the **Export Center** to generate a full ZIP archive of your resources, including metadata and structured folders.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

