/**
 * Pure routing helpers extracted from router/index.ts so the SPA-redirect and
 * editor-path logic is unit-testable (the router module itself imports .vue and
 * runs DOM side effects at load, so it can't be imported in a node test).
 */

/**
 * GitHub Pages 404 fallback: a deep link arrives as `/?p=/editor`. Returns the
 * real path to `history.replaceState` to, or null when there's no `p` param.
 */
export function resolveSpaRedirect(search: string, baseUrl: string): string | null {
  const redirectPath = new URLSearchParams(search).get('p')
  if (!redirectPath) return null
  return baseUrl.replace(/\/$/, '') + decodeURIComponent(redirectPath)
}

/** Whether a pathname is the editor route (under the app's base path). */
export function isEditorPath(pathname: string, baseUrl: string): boolean {
  const normalizedBase = baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '')
  const editorPath = `${normalizedBase}/editor`
  return pathname === editorPath || pathname.startsWith(`${editorPath}/`)
}
