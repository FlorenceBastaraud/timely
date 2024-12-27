import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import App from '../App'

describe('App', () => {
  it('should render correctly', () => {
    const { getByText } = render(<App />)
    expect(getByText('Timely: Plan. Work. Thrive.')).toBeInTheDocument()
  })
})
