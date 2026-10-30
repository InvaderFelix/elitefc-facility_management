import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFieldErrors } from './useFieldErrors'

describe('useFieldErrors', () => {
  it('starts with no errors', () => {
    const { result } = renderHook(() => useFieldErrors<'email'>())

    expect(result.current.errors).toEqual({})
  })

  it('sets and clears a single field error', () => {
    const { result } = renderHook(() => useFieldErrors<'email'>())

    act(() => result.current.setFieldError('email', 'Email is required'))
    expect(result.current.errors.email).toBe('Email is required')

    act(() => result.current.setFieldError('email', undefined))
    expect(result.current.errors.email).toBeUndefined()
  })

  it('keeps the same state object when clearing an error that is not set', () => {
    const { result } = renderHook(() => useFieldErrors<'email'>())
    const before = result.current.errors

    act(() => result.current.setFieldError('email', undefined))

    expect(result.current.errors).toBe(before)
  })

  it('replaces all errors via setAll and empties them via clear', () => {
    const { result } = renderHook(() => useFieldErrors<'a' | 'b'>())

    act(() => result.current.setAll({ a: 'one', b: 'two' }))
    expect(result.current.errors).toEqual({ a: 'one', b: 'two' })

    act(() => result.current.clear())
    expect(result.current.errors).toEqual({})
  })
})
