// The CJK display fonts are only needed inside the editor (the text tool and
// the canvas). The landing page uses the system font, so loading these on every
// page wasted ~346 KiB of mostly-unused font CSS. Inject them lazily when the
// editor mounts instead.
const FONTS_HREF =
  'https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;700;900' +
  '&family=Noto+Serif+TC:wght@400;700;900&family=Zen+Maru+Gothic:wght@400;700;900' +
  '&family=Zhi+Mang+Xing&display=swap'

let injected = false

/** Inject the editor font stylesheet once (idempotent). */
export function ensureEditorFonts(): void {
  if (injected || typeof document === 'undefined') return
  injected = true

  for (const href of ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']) {
    const link = document.createElement('link')
    link.rel = 'preconnect'
    link.href = href
    if (href.includes('gstatic')) link.crossOrigin = 'anonymous'
    document.head.appendChild(link)
  }

  const sheet = document.createElement('link')
  sheet.rel = 'stylesheet'
  sheet.href = FONTS_HREF
  document.head.appendChild(sheet)
}

/** Resolves when the page's fonts have finished loading (or immediately if unsupported). */
export function whenEditorFontsReady(): Promise<void> {
  if (typeof document === 'undefined' || !document.fonts) return Promise.resolve()
  return document.fonts.ready.then(() => undefined)
}
