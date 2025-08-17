# Google Docs Clone with Gemini AI Integration

A full-featured Google Docs clone with integrated Gemini AI assistant, built using Next.js, Tailwind CSS, and shadcn/ui components.

![Google Docs Clone](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC)

## Features

### Document Editor
- 📝 Rich text editing with Quill.js
- 🎨 Full formatting capabilities (bold, italic, underline, colors, etc.)
- 📐 Google Docs-like UI with toolbar and ruler
- 📄 A4 paper visualization
- 💾 Auto-save to localStorage every 30 seconds
- 📱 Responsive design

### Gemini AI Integration
- 🤖 Context-aware AI assistant
- 💬 Chat interface in collapsible right sidebar
- ✍️ Content generation and improvement
- 🔤 Grammar and spell checking assistance
- 📑 Document templates and formatting help
- 🌐 Multi-language support (English and Marathi)

### Export Options
- 📊 PDF export with proper formatting
- 📝 Word document (.docx) export
- 🌐 HTML export
- 📄 Plain text export

### Templates
- 📋 RTI Application template (Marathi)
- 📄 Blank document
- 📨 Formal letter template
- 📊 Report template

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Gemini API key (get it from [Google AI Studio](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd docs-clone
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

3. Create a `.env.local` file:
```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Document Editing
- Click on the document title to rename it
- Use the toolbar for formatting options
- Document auto-saves to localStorage every 30 seconds

### Using Gemini AI
- Click the Gemini button in the right sidebar to open the AI assistant
- Use quick actions or type custom prompts
- Click "Insert" to add AI-generated content at cursor position
- Click "Copy" to copy AI responses to clipboard

### Exporting Documents
- Go to File → Download as
- Choose your preferred format (PDF, Word, HTML, or Text)

### Keyboard Shortcuts
- **Ctrl/Cmd + B**: Bold
- **Ctrl/Cmd + I**: Italic
- **Ctrl/Cmd + U**: Underline
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Y**: Redo
- **Ctrl/Cmd + P**: Print

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Main page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── editor/            # Document editor components
│   │   ├── DocumentEditor.tsx
│   │   └── Toolbar.tsx
│   ├── gemini/            # Gemini AI components
│   │   └── GeminiPanel.tsx
│   └── layout/            # Layout components
│       └── Header.tsx
├── lib/                   # Utility functions
│   ├── gemini.ts          # Gemini AI service
│   ├── document-store.ts  # Document state management
│   ├── export-utils.ts    # Export functionality
│   └── utils.ts           # Helper functions
├── types/                 # TypeScript types
│   ├── document.ts
│   └── gemini.ts
└── constants/             # Constants and templates
    └── templates.ts
```

## Technologies Used

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Rich Text Editor**: React Quill
- **State Management**: Zustand
- **AI Integration**: Google Gemini API
- **Export Libraries**: jsPDF, docx, html2canvas
- **Icons**: Lucide React

## Features in Detail

### Document Management
- Create new documents with templates
- Auto-save to browser localStorage
- Version history tracking (in memory)
- Document title editing

### Rich Text Editing
- Font family and size selection
- Text formatting (bold, italic, underline, strikethrough)
- Text and background colors
- Paragraph alignment
- Lists (bullet and numbered)
- Indentation control
- Link and image insertion

### AI Assistant Features
- Context-aware responses based on document content
- Quick actions for common tasks
- Document analysis and improvement suggestions
- Multi-language support
- Template generation

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Known Limitations

- No real-time collaboration (single-user only)
- No cloud storage (localStorage only)
- Limited to browser storage capacity
- No user authentication

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- UI design inspired by Google Docs
- Built with Next.js and Tailwind CSS
- AI powered by Google Gemini
