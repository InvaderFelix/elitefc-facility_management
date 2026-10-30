import { render, screen } from '@testing-library/react'
import { createRef } from 'react'
import { describe, expect, it } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders children and the default variant/size classes', () => {
    render(<Button>Save</Button>)

    const button = screen.getByRole('button', { name: 'Save' })
    expect(button).toHaveClass('btn', 'btn--primary', 'btn--md')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('applies the requested variant and size', () => {
    render(
      <Button variant="ghost" size="lg">
        Go
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Go' })).toHaveClass('btn--ghost', 'btn--lg')
  })

  it('adds the full-width modifier', () => {
    render(<Button fullWidth>Wide</Button>)

    expect(screen.getByRole('button', { name: 'Wide' })).toHaveClass('btn--full')
  })

  it('disables the button and shows a spinner while loading', () => {
    render(<Button isLoading>Saving</Button>)

    const button = screen.getByRole('button', { name: 'Saving' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')
    expect(button.querySelector('.btn__spinner')).toBeInTheDocument()
  })

  it('renders left and right icons when idle but hides them while loading', () => {
    const { rerender } = render(
      <Button leftIcon={<i>L</i>} rightIcon={<i>R</i>}>
        Icon
      </Button>,
    )

    expect(screen.getByRole('button', { name: 'Icon' }).querySelectorAll('.btn__icon')).toHaveLength(2)

    rerender(
      <Button isLoading leftIcon={<i>L</i>} rightIcon={<i>R</i>}>
        Icon
      </Button>,
    )

    expect(screen.getByRole('button').querySelectorAll('.btn__icon')).toHaveLength(0)
  })

  it('forwards the ref to the underlying button element', () => {
    const ref = createRef<HTMLButtonElement>()
    render(<Button ref={ref}>Ref</Button>)

    expect(ref.current).toBeInstanceOf(HTMLButtonElement)
  })

  it('honours an explicit native type', () => {
    render(<Button type="submit">Submit</Button>)

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit')
  })
})
