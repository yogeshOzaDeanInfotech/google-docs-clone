# Optimized Folder Structure

```
docs-clone/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── api/                 # API routes
│   │   │   └── generate-pdf/    # PDF generation endpoint
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   └── globals.css          # Global styles
│   │
│   ├── components/              # React components
│   │   ├── editor/              # Editor-related components
│   │   │   ├── DocumentEditor.tsx
│   │   │   ├── DocumentCanvas.tsx
│   │   │   ├── Toolbar.tsx
│   │   │   └── FindReplaceDialog.tsx
│   │   ├── export/              # Export functionality
│   │   │   └── ExportDialog.tsx
│   │   ├── ai/                  # AI integration (renamed from openai)
│   │   │   └── AIPanel.tsx
│   │   ├── layout/              # Layout components
│   │   │   ├── Header.tsx
│   │   │   └── StatusBar.tsx
│   │   └── common/              # Common/shared components
│   │       └── ClientOnly.tsx
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useDocument.ts
│   │   ├── useExport.ts
│   │   └── useAI.ts             # Renamed from useOpenAI.ts
│   │
│   ├── lib/                     # Utility functions
│   │   ├── ai.ts                # AI utilities (renamed from openai.ts)
│   │   ├── document-utils.ts
│   │   ├── export-utils.ts
│   │   └── utils.ts
│   │
│   ├── types/                   # TypeScript types
│   │   ├── document.ts
│   │   └── ai.ts                # AI types (renamed from openai.ts)
│   │
│   └── constants/               # Constants and config
│       └── templates.ts
│
├── public/                      # Static assets
├── .eslintrc.json              # ESLint config
├── .gitignore
├── next.config.ts              # Next.js config
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Key Changes:
1. Removed duplicate `gemini` folder
2. Renamed `openai` to `ai` for better abstraction
3. Added `common` folder for shared components
4. Simplified wrapper components
5. Better organized AI-related files