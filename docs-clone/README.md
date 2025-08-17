# Google Docs Clone with Gemini AI Integration

A full-featured Google Docs clone built with Next.js, featuring real-time document editing, Gemini AI integration, and multiple export formats.

![Google Docs Clone](https://via.placeholder.com/800x400)

## Features

### Document Editor
- **Rich Text Editing**: Full formatting capabilities including bold, italic, underline, alignment, lists, etc.
- **Google Docs UI**: Authentic recreation of the Google Docs interface
- **RTI Template**: Pre-loaded with a Marathi RTI (Right to Information) document template
- **Auto-save**: Documents automatically saved to browser localStorage
- **Document Title**: Editable document title with click-to-edit functionality

### Gemini AI Integration
- **AI Assistant Panel**: Collapsible right panel with chat interface
- **Context-Aware Responses**: AI understands current document content
- **Content Generation**: Generate new content based on prompts
- **Direct Insertion**: Insert AI-generated content directly at cursor position
- **Document Analysis**: Get summaries and suggestions for your document
- **Multi-language Support**: Works with both English and Marathi content

### Export Options
- **PDF Export**: High-quality PDF generation with proper formatting
- **Word Export**: Download as .doc file compatible with Microsoft Word
- **Text Export**: Plain text version of your document
- **HTML Export**: Formatted HTML file with embedded styles
- **Print**: Browser print functionality with optimized print styles

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Editor**: TipTap (rich text editor framework)
- **AI**: Google Gemini API
- **State Management**: Zustand with persistence
- **PDF Generation**: jsPDF + html2canvas
- **TypeScript**: Full type safety throughout

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/docs-clone.git
cd docs-clone
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Document Editing
- Click on the document title to rename it
- Use the toolbar for formatting options
- The document auto-saves to localStorage every 30 seconds
- Use keyboard shortcuts for common actions (Ctrl/Cmd+B for bold, etc.)

### Using Gemini AI
- The Gemini panel opens automatically on the right
- Type your question or request in the input field
- Press Enter or click Send to get AI responses
- Click "Insert" to add AI content at your cursor position
- Click "Copy" to copy AI responses to clipboard

### Exporting Documents
- Click "File" in the menu bar
- Choose your preferred export format:
  - PDF: Best for sharing and printing
  - Word: For further editing in Microsoft Word
  - Text: Plain text without formatting
  - HTML: Web-compatible format

## Project Structure

```
src/
├── app/                    # Next.js app router files
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Main page component
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── editor/           # Document editor components
│   ├── gemini/           # AI chat interface
│   ├── layout/           # Layout components
│   └── export/           # Export functionality
├── lib/                   # Utility functions
│   ├── gemini.ts         # Gemini API integration
│   ├── document-store.ts # Document state management
│   ├── gemini-store.ts   # AI chat state
│   └── export-utils.ts   # Export utilities
├── types/                 # TypeScript types
└── constants/            # App constants and templates
```

## Keyboard Shortcuts

- **Ctrl/Cmd + B**: Bold
- **Ctrl/Cmd + I**: Italic
- **Ctrl/Cmd + U**: Underline
- **Ctrl/Cmd + Z**: Undo
- **Ctrl/Cmd + Y**: Redo
- **Ctrl/Cmd + P**: Print

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Known Limitations

- No real-time collaboration (single-user only)
- No cloud storage (browser localStorage only)
- Word export creates simplified .doc files
- PDF export may have minor formatting differences

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Docs for the UI inspiration
- Gemini AI for intelligent content generation
- TipTap for the excellent editor framework
- shadcn/ui for beautiful components