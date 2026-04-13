# Self-Hosted Email Backend Plan (No 3rd Party)

**Goal:** Remove EmailJS, use our Express + Nodemailer API.

**Info:** Frontend-only project. Add serverless API.

**Plan:**
1. Remove @emailjs/browser (npm uninstall)
2. Create api/send-email/route.ts (Vercel serverless, Nodemailer)
3. Update ContactSection.tsx: POST to /api/send-email
4. User: Gmail App Password
5. Deploy: vercel.com (free hosting)

**Files:**
- Uninstall dep
- Create api/send-email/route.ts
- Edit ContactSection.tsx (fetch POST)
- package.json deps: express cors nodemailer

Approve self-hosted backend?
