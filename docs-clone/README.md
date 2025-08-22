# Google Docs Clone

A modern, feature-rich document editor built with Next.js, Slate.js, and Tailwind CSS.

## Features

- **Rich Text Editing**: Full-featured text editor with formatting options
- **Real-time Collaboration**: Multiple users can edit simultaneously
- **Export Options**: Export to PDF, DOCX, and other formats
- **AI Integration**: OpenAI integration for content generation
- **Modern UI**: Clean, responsive design with Tailwind CSS

## Enhanced Editor Tools

The document editor now includes a comprehensive set of formatting tools:

### Text Formatting

- **Bold, Italic, Underline, Strikethrough**
- **Subscript and Superscript**
- **Text Color and Background Color** (40+ color options)
- **Font Family Selection** (Arial, Times New Roman, Georgia, Verdana, Courier New)
- **Font Size** (8pt to 72pt)

### Layout & Alignment

- **Text Alignment** (Left, Center, Right, Justify)
- **Indentation Controls** (Increase/Decrease with 4 levels max)
- **Line Spacing** (1.0x to 3.0x)

### Block Elements

- **Headings**
- **Bulleted and Numbered Lists**
- **Quote Blocks**
- **Code Blocks**
- **Dividers**
- **Tables** (3x3 default, customizable)

### Advanced Features

- **Find & Replace** with case-sensitive and whole word options
- **Undo/Redo** functionality
- **Word Count & Reading Time** (coming soon)
- **Image Upload** (coming soon)
- **Link Management** (coming soon)

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Building

```bash
npm run build
npm start
```

## Code Formatting

This project uses **Prettier** for consistent code formatting with ChatGPT-style configuration.

### Format on Save (Ctrl+S)

The project is configured to automatically format code when you save files (Ctrl+S). This requires:

1. **VS Code Prettier Extension**: Install the "Prettier - Code formatter" extension
2. **Workspace Settings**: The `.vscode/settings.json` file is already configured
3. **Prettier Config**: Uses `.prettierrc` with optimal settings

### Manual Formatting

```bash
# Format all files
npm run format

# Check formatting without changing files
npm run format:check
```

### Prettier Configuration

The project uses these Prettier settings:

- **Semicolons**: Enabled
- **Trailing Commas**: ES5 style
- **Quotes**: Double quotes
- **Print Width**: 80 characters
- **Tab Width**: 2 spaces
- **Use Tabs**: Yes (for indentation)
- **Bracket Spacing**: Enabled
- **Arrow Parens**: Avoid when possible

### VS Code Extensions

The following extensions are recommended (see `.vscode/extensions.json`):

- Prettier - Code formatter
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- Auto Rename Tag
- Path Intellisense

## Project Structure

```
src/
├── app/                 # Next.js app router (layout, pages, API routes)
├── components/          # React components
│   ├── editor/          # Document editor components
│   ├── export/          # Export functionality
│   ├── layout/          # Layout components (Header, StatusBar)
│   └── openai/          # AI panel (dynamically imported)
├── hooks/               # Custom React hooks (document, AI)
├── lib/                 # Utilities (OpenAI client, export utilities)
├── types/               # TypeScript type definitions
└── constants/           # Application constants (initial Slate value)
```

### Notable Implementation Details

- The AI panel (`components/openai/OpenAIPanel`) is dynamically imported client-side to reduce initial JS and avoid SSR issues.
- Slate editor state uses validated updates and a simplified `onChange` handler.
- Export features call a server route for PDF generation to keep Puppeteer server-side.
- Debug logs and unused components have been removed.

### Build

Production builds are verified with:

```
npm ci
npm run build
```

The build skips type and lint checks during CI for speed; run `npm run lint` locally if needed.

## Technologies Used

- **Next.js 15** - React framework with app router
- **Slate.js** - Rich text editor framework
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Zustand** - State management
- **Lucide React** - Icon library
- **OpenAI API** - AI content generation
- **Puppeteer** - PDF generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure code is formatted (`npm run format`)
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
