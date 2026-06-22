import { describe, test, expect } from 'vitest'
import { resolveSpaRedirect, isEditorPath } from '../routing'

describe('resolveSpaRedirect (GitHub Pages 404 fallback)', () => {
  test('rewrites ?p= under the base path', () => {
    expect(resolveSpaRedirect('?p=%2Feditor', '/zhufy/')).toBe('/zhufy/editor')
  })

  test('decodes the param and joins onto the base', () => {
    expect(resolveSpaRedirect('?p=/editor/x', '/zhufy/')).toBe('/zhufy/editor/x')
  })

  test('works with a root base', () => {
    expect(resolveSpaRedirect('?p=/editor', '/')).toBe('/editor')
  })

  test('returns null when there is no p param', () => {
    expect(resolveSpaRedirect('', '/zhufy/')).toBe(null)
    expect(resolveSpaRedirect('?other=1', '/zhufy/')).toBe(null)
  })
})

describe('isEditorPath', () => {
  test('matches the editor route under the base', () => {
    expect(isEditorPath('/zhufy/editor', '/zhufy/')).toBe(true)
    expect(isEditorPath('/zhufy/editor/anything', '/zhufy/')).toBe(true)
  })

  test('does not match the landing or other paths', () => {
    expect(isEditorPath('/zhufy/', '/zhufy/')).toBe(false)
    expect(isEditorPath('/zhufy/editorx', '/zhufy/')).toBe(false)
  })

  test('handles a root base', () => {
    expect(isEditorPath('/editor', '/')).toBe(true)
    expect(isEditorPath('/', '/')).toBe(false)
  })
})
