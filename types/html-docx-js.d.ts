declare module 'html-docx-js' {
  interface HtmlDocxOptions {
    orientation?: 'portrait' | 'landscape'
    margins?: {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
  }

  export function asBlob(html: string, options?: HtmlDocxOptions): Blob
}
