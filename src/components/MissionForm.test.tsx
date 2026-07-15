import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { FlightMission } from '../types/flight'
import { MissionForm } from './MissionForm'

describe('MissionForm', () => {
  const onCreate = vi.fn<(mission: FlightMission) => void>()
  const onCancel = vi.fn()

  beforeEach(() => {
    onCreate.mockClear()
    onCancel.mockClear()
  })

  async function completeRequiredFields() {
    const user = userEvent.setup()

    await user.type(
      screen.getByLabelText('Flight number'),
      'fx410',
    )

    await user.type(
      screen.getByLabelText('Aircraft registration'),
      'f-demo',
    )

    await user.type(
      screen.getByLabelText('Departure airport'),
      'tls',
    )

    await user.type(
      screen.getByLabelText('Destination airport'),
      'mrs',
    )

    await user.type(
      screen.getByLabelText('Scheduled date'),
      '2026-07-20T10:30',
    )

    return user
  }

  it('displays an error when required fields are empty', async () => {
    const user = userEvent.setup()

    render(
      <MissionForm
        onCreate={onCreate}
        onCancel={onCancel}
      />,
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Create mission',
      }),
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Complete all required fields',
    )

    expect(onCreate).not.toHaveBeenCalled()
  })

  it('rejects an invalid flight number', async () => {
    const user = userEvent.setup()

    render(
      <MissionForm
        onCreate={onCreate}
        onCancel={onCancel}
      />,
    )

    await user.type(
      screen.getByLabelText('Flight number'),
      'F@',
    )

    await user.type(
      screen.getByLabelText('Aircraft registration'),
      'F-DEMO',
    )

    await user.type(
      screen.getByLabelText('Departure airport'),
      'TLS',
    )

    await user.type(
      screen.getByLabelText('Destination airport'),
      'MRS',
    )

    await user.type(
      screen.getByLabelText('Scheduled date'),
      '2026-07-20T10:30',
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Create mission',
      }),
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Flight number must contain 2 to 8 letters or numbers.',
    )

    expect(onCreate).not.toHaveBeenCalled()
  })

  it('rejects identical departure and destination airports', async () => {
    const user = userEvent.setup()

    render(
      <MissionForm
        onCreate={onCreate}
        onCancel={onCancel}
      />,
    )

    await user.type(
      screen.getByLabelText('Flight number'),
      'FX410',
    )

    await user.type(
      screen.getByLabelText('Aircraft registration'),
      'F-DEMO',
    )

    await user.type(
      screen.getByLabelText('Departure airport'),
      'TLS',
    )

    await user.type(
      screen.getByLabelText('Destination airport'),
      'TLS',
    )

    await user.type(
      screen.getByLabelText('Scheduled date'),
      '2026-07-20T10:30',
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Create mission',
      }),
    )

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Departure and destination airports must be different.',
    )

    expect(onCreate).not.toHaveBeenCalled()
  })

  it('creates a mission from valid form values', async () => {
    render(
      <MissionForm
        onCreate={onCreate}
        onCancel={onCancel}
      />,
    )

    const user = await completeRequiredFields()

    await user.click(
      screen.getByLabelText('Documents verified'),
    )

    await user.click(
      screen.getByLabelText('Fuel confirmed'),
    )

    await user.click(
      screen.getByLabelText('Maintenance released'),
    )

    await user.click(
      screen.getByLabelText('Weather reviewed'),
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Create mission',
      }),
    )

    expect(onCreate).toHaveBeenCalledTimes(1)

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        flightNumber: 'FX410',
        aircraftRegistration: 'F-DEMO',
        departureAirport: 'TLS',
        destinationAirport: 'MRS',
        scheduledDate: '2026-07-20T10:30',
        submitted: true,

        checklist: {
          documentsVerified: true,
          fuelConfirmed: true,
          maintenanceReleased: true,
          weatherReviewed: true,
        },
      }),
    )
  })

  it('includes a reported technical issue', async () => {
    render(
      <MissionForm
        onCreate={onCreate}
        onCancel={onCancel}
      />,
    )

    const user = await completeRequiredFields()

    await user.type(
      screen.getByLabelText('Technical issue'),
      'Hydraulic inspection required.',
    )

    await user.click(
      screen.getByRole('button', {
        name: 'Create mission',
      }),
    )

    expect(onCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        technicalIssue: 'Hydraulic inspection required.',
      }),
    )
  })

  it('calls onCancel when the user cancels the form', async () => {
    const user = userEvent.setup()

    render(
      <MissionForm
        onCreate={onCreate}
        onCancel={onCancel}
      />,
    )

    const cancelButtons = screen.getAllByRole('button', {
      name: 'Cancel',
    })

    await user.click(cancelButtons[0])

    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onCreate).not.toHaveBeenCalled()
  })
})
