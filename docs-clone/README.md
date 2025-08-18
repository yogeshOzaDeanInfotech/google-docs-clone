# Docs Clone with OpenAI

Single-page Google Docs-like editor using Next.js, Tailwind, Slate, and OpenAI.

## Quickstart

1. Create `.env.local` and add:

```
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key
```

2. Run:

```
npm install
npm run dev
```

Open http://localhost:3000

- Right panel: OpenAI chat (reads current document context)
- Top bar: Export to PDF/DOCX/TXT/HTML
- Document loads with an RTI Marathi template
