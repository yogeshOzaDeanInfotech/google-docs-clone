# Docs Clone with Gemini

Single-page Google Docs-like editor using Next.js, Tailwind, Slate, and Gemini.

## Quickstart

1. Create `.env.local` and add:

```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

2. Run:

```
npm install
npm run dev
```

Open http://localhost:3000

- Right panel: Gemini chat (reads current document context)
- Top bar: Export to PDF/DOCX/TXT/HTML
- Document loads with an RTI Marathi template
