import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Document as DocxDocument, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'
import { Document } from '@/types/document'

export async function exportToPDF(document: Document) {
  try {
    // Get the document content element
    const element = window.document.querySelector('.ql-editor') as HTMLElement
    if (!element) throw new Error('Document content not found')

    // Create canvas from HTML
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    // Add image to PDF
    const imgData = canvas.toDataURL('image/png')
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add new pages if content is longer than one page
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Save PDF
    pdf.save(`${document.title || 'document'}.pdf`)
  } catch (error) {
    console.error('Error exporting to PDF:', error)
    throw error
  }
}

export async function exportToWord(document: Document) {
  try {
    // Parse HTML content to extract text
    const parser = new DOMParser()
    const doc = parser.parseFromString(document.content, 'text/html')
    const paragraphs = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li')

    // Create Word document
    const docx = new DocxDocument({
      sections: [{
        properties: {},
        children: Array.from(paragraphs).map(para => {
          const text = para.textContent || ''
          const isBold = para.querySelector('strong, b') !== null
          const isItalic = para.querySelector('em, i') !== null
          const isHeading = /^h[1-6]$/i.test(para.tagName)

          return new Paragraph({
            children: [
              new TextRun({
                text,
                bold: isBold || isHeading,
                italics: isItalic,
                size: isHeading ? 28 : 24
              })
            ]
          })
        })
      }]
    })

    // Generate and save
    const blob = await Packer.toBlob(docx)
    saveAs(blob, `${document.title || 'document'}.docx`)
  } catch (error) {
    console.error('Error exporting to Word:', error)
    throw error
  }
}

export function exportToHTML(document: Document) {
  try {
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${document.title || 'Document'}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3, h4, h5, h6 {
            margin-top: 24px;
            margin-bottom: 16px;
        }
        p {
            margin-bottom: 16px;
        }
        ul, ol {
            margin-bottom: 16px;
            padding-left: 40px;
        }
        blockquote {
            margin: 16px 0;
            padding-left: 16px;
            border-left: 4px solid #ddd;
        }
    </style>
</head>
<body>
    <h1>${document.title}</h1>
    ${document.content}
</body>
</html>`

    const blob = new Blob([htmlContent], { type: 'text/html' })
    saveAs(blob, `${document.title || 'document'}.html`)
  } catch (error) {
    console.error('Error exporting to HTML:', error)
    throw error
  }
}

export function exportToText(document: Document) {
  try {
    // Parse HTML and extract text
    const parser = new DOMParser()
    const doc = parser.parseFromString(document.content, 'text/html')
    const textContent = doc.body.textContent || ''

    const fullText = `${document.title}\n\n${textContent}`
    
    const blob = new Blob([fullText], { type: 'text/plain' })
    saveAs(blob, `${document.title || 'document'}.txt`)
  } catch (error) {
    console.error('Error exporting to text:', error)
    throw error
  }
}

export async function handleExport(document: Document, format: string) {
  switch (format) {
    case 'pdf':
      await exportToPDF(document)
      break
    case 'docx':
      await exportToWord(document)
      break
    case 'html':
      exportToHTML(document)
      break
    case 'txt':
      exportToText(document)
      break
    default:
      throw new Error(`Unsupported export format: ${format}`)
  }
}