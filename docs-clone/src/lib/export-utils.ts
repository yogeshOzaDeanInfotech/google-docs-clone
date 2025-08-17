import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export async function exportToPDF(element: HTMLElement, title: string) {
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    })
    
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 297 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    pdf.save(`${title}.pdf`)
  } catch (error) {
    console.error('PDF export error:', error)
    throw new Error('Failed to export PDF')
  }
}

export function exportToText(content: string, title: string) {
  // Convert HTML to plain text
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = content
  const text = tempDiv.textContent || tempDiv.innerText || ''
  
  // Create and download text file
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${title}.txt`
  link.click()
  URL.revokeObjectURL(link.href)
}

export function exportToHTML(content: string, title: string) {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1, h2, h3 { margin-top: 20px; margin-bottom: 10px; }
        p { margin-bottom: 10px; }
        ul, ol { margin-bottom: 10px; padding-left: 30px; }
    </style>
</head>
<body>
    ${content}
</body>
</html>`
  
  const blob = new Blob([htmlTemplate], { type: 'text/html;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${title}.html`
  link.click()
  URL.revokeObjectURL(link.href)
}

// Note: For Word export, we would need a more complex library like docx.js
// For now, we'll export as HTML which can be opened in Word
export function exportToWord(content: string, title: string) {
  const wordTemplate = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" 
          xmlns:w="urn:schemas-microsoft-com:office:word" 
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
            body { font-family: Arial, sans-serif; }
            @page { margin: 1in; }
        </style>
    </head>
    <body>
        ${content}
    </body>
    </html>`
  
  const blob = new Blob([wordTemplate], { type: 'application/msword' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${title}.doc`
  link.click()
  URL.revokeObjectURL(link.href)
}