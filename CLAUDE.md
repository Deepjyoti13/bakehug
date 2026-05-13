# BakeHug

A baking website built with Next.js, SQLite, and Tailwind CSS.

## Dev

```bash
npm run dev    # http://localhost:3000 (or 3001 if 3000 is in use)
npm run build
npm run start
```

## Next.js 16 Notes

- Auth proxy file: `proxy.ts` (not `middleware.ts` — that convention is deprecated in v16)
- Export name must be `proxy`, not `middleware`

## Admin

Visit `/admin/login`. Credentials in `.env.local` (`ADMIN_USERNAME`, `ADMIN_PASSWORD`).

## WhatsApp

Set `NEXT_PUBLIC_WHATSAPP_NUMBER` in `.env.local` to your number (e.g. `+919876543210`).
