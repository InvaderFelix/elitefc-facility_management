import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

// Testing Library cannot auto-clean up because `globals` is disabled.
afterEach(() => {
  cleanup()
})

// jsdom does not implement these; components under test call them.
window.scrollTo = vi.fn()
Element.prototype.scrollIntoView = vi.fn()
