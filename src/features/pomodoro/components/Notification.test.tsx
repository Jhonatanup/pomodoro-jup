import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Notification } from './Notification'

const notification = {
  message: 'Focus session complete! Time for a break.',
  type: 'success',
} as const

describe('Notification', () => {
  it('renders the notification message', () => {
    render(<Notification notification={notification} closeNotification={vi.fn()} />)

    expect(screen.getByText(/session complete/i)).toBeInTheDocument()
  })

  it('is rendered as an alert', () => {
    render(<Notification notification={notification} closeNotification={vi.fn()} />)

    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders a dismiss button', () => {
    render(<Notification notification={notification} closeNotification={vi.fn()} />)

    expect(screen.getByRole('button', { name: /dismiss notification/i })).toBeInTheDocument()
  })

  it('calls closeNotification when dismissed', async () => {
    const user = userEvent.setup()
    const closeNotification = vi.fn()

    render(<Notification notification={notification} closeNotification={closeNotification} />)

    await user.click(screen.getByRole('button', { name: /dismiss notification/i }))

    expect(closeNotification).toHaveBeenCalledTimes(1)
  })
})
