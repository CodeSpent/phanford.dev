/**
 * Document export utilities for generating PDF, DOCX, and MD files
 * All exports are client-side only - no server required
 */

/**
 * Sanitize a filename by removing invalid characters
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

/**
 * Trigger a file download in the browser
 */
function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export rendered HTML content to PDF
 * Uses html2pdf.js for client-side generation
 */
export async function exportToPDF(
  element: HTMLElement,
  title: string
): Promise<void> {
  const html2pdf = (await import('html2pdf.js')).default

  const filename = `${sanitizeFilename(title)}.pdf`

  const options = {
    margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      letterRendering: true,
    },
    jsPDF: {
      unit: 'in',
      format: 'letter',
      orientation: 'portrait' as const,
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
    },
  }

  await html2pdf().set(options).from(element).save()
}

/**
 * Export rendered HTML content to DOCX
 * Uses html-docx-js for client-side generation
 */
export async function exportToDOCX(
  element: HTMLElement,
  title: string
): Promise<void> {
  const htmlDocx = await import('html-docx-js')

  const filename = `${sanitizeFilename(title)}.docx`

  // Get the HTML content and wrap it with proper styling
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: 'Calibri', sans-serif;
            font-size: 11pt;
            line-height: 1.6;
            color: #333;
          }
          h1 { font-size: 24pt; margin-top: 24pt; margin-bottom: 12pt; }
          h2 { font-size: 18pt; margin-top: 18pt; margin-bottom: 9pt; }
          h3 { font-size: 14pt; margin-top: 14pt; margin-bottom: 7pt; }
          p { margin-bottom: 12pt; }
          ul, ol { margin-bottom: 12pt; }
          li { margin-bottom: 6pt; }
          code {
            font-family: 'Consolas', monospace;
            background-color: #f4f4f4;
            padding: 2pt 4pt;
          }
          pre {
            background-color: #f4f4f4;
            padding: 12pt;
            overflow-x: auto;
            font-family: 'Consolas', monospace;
            font-size: 10pt;
          }
          a { color: #0066cc; }
        </style>
      </head>
      <body>
        ${element.innerHTML}
      </body>
    </html>
  `

  const blob = htmlDocx.asBlob(htmlContent, {
    orientation: 'portrait',
    margins: {
      top: 720, // 0.5 inch in twips
      right: 720,
      bottom: 720,
      left: 720,
    },
  })

  downloadBlob(blob, filename)
}

/**
 * Export raw markdown content to a .md file
 * Simply creates a blob from the raw content
 */
export function exportToMarkdown(rawContent: string, title: string): void {
  const filename = `${sanitizeFilename(title)}.md`
  const blob = new Blob([rawContent], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, filename)
}
