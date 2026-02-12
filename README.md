# Silo - Personal Knowledge Management PWA

Silo is a minimalist PKM (Personal Knowledge Management) tool designed for technical profiles. Use it to centralize, organize, and retrieve web links, code snippets, and research papers with zero friction.

## 🚀 Vision
**"Capture Fast, Contextualize Later"**

- **Zero Friction:** Magic Paste detects content type automatically.
- **Context Focused:** Prompt for user notes on every save.
- **Immersive UI:** Vertical masonry layout with a floating dock.

## 🛠 Tech Stack
- **Framework:** Next.js 14+ (App Router)
- **Styling:** Tailwind CSS + shadcn/ui
- **Animations:** Framer Motion
- **ORM:** Prisma
- **Database:** PostgreSQL (Supabase)
- **Auth:** Supabase Auth

## 📦 Features
- [x] **Magic Paste:** One-click capture for links, text, and code.
- [x] **Masonry Grid:** Dynamic organization of resources.
- [x] **Floating Dock:** Bottom navigation for a mobile-first experience.
- [x] **Glassmorphism:** Modern visual style with depth.
- [x] **Dark Mode:** Native support for deep dark themes.

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (Supabase recommended)

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file with the following:
   ```env
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."
   NEXT_PUBLIC_SUPABASE_URL="https://..."
   NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
   ```
4. Push the schema to your database:
   ```bash
   npx prisma db push
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```

## 📂 Project Structure
- `src/app`: Next.js pages and layouts.
- `src/components`: UI components and feature modules.
- `src/components/ui`: Shadcn/ui core components.
- `src/lib`: Utility functions.
- `prisma`: Database schema and migrations.
