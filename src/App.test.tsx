import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  afterAll,
  beforeAll,
  describe,
  expect,
  it,
  vi,
} from 'vitest'
import App from './App'

describe('Flight Readiness Dashboard', () => {
  beforeAll(() => {
    vi.spyOn(globalThis.crypto, 'randomUUID').mockReturnValue(
      '00000000-0000-4000-8000-000000000001',
    )
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  function getSummaryCard(label: string): HTMLElement {
    const summarySection = screen.getByRole('region', {
      name: 'Mission summary',
    })

    const labelElement = within(summarySection).getByText(label)
    const card = labelElement.closest('article')

    if (!(card instanceof HTMLElement)) {
      throw new Error(`Summary card "${label}" was not found.`)
    }

    return card
  }

  function getMissionForm(): HTMLElement {
    return screen.getByRole('region', {
      name: 'Create flight mission',
    })
  }

  it('displays the initial flight missions', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', {
        name: 'Flight Readiness Dashboard',
      }),
    ).toBeInTheDocument()

    expect(screen.getByText('FX101')).toBeInTheDocument()
    expect(screen.getByText('FX204')).toBeInTheDocument()
    expect(screen.getByText('FX310')).toBeInTheDocument()
  })

  it('displays the correct initial mission summary', () => {
    render(<App />)

    expect(
      getSummaryCard('Total missions'),
    ).toHaveTextContent('3')

    expect(
      getSummaryCard('Ready'),
    ).toHaveTextContent('1')

    expect(
      getSummaryCard('Blocked'),
    ).toHaveTextContent('1')

    expect(
      getSummaryCard('Draft'),
    ).toHaveTextContent('1')
  })

  it('opens and closes the mission form', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(
      screen.getByRole('button', {
        name: 'Create mission',
      }),
    )

    expect(
      screen.getByRole('heading', {
        name: 'Create flight mission',
      }),
    ).toBeInTheDocument()

    const missionForm = getMissionForm()

    const cancelButtons = within(missionForm).getAllByRole(
      'button',
      {
        name: 'Cancel',
      },
    )

    await user.click(cancelButtons[0])

    expect(
      screen.queryByRole('heading', {
        name: 'Create flight mission',
      }),
    ).not.toBeInTheDocument()
  })

  it('creates a ready mission and updates the summary', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(
      screen.getByRole('button', {
        name: 'Create mission',
      }),
    )

    const missionForm = getMissionForm()
    const form = within(missionForm)

    await user.type(
      form.getByLabelText('Flight number'),
      'FX500',
    )

    await user.type(
      form.getByLabelText('Aircraft registration'),
      'F-NEW',
    )

    await user.type(
      form.getByLabelText('Departure airport'),
      'CDG',
    )

    await user.type(
      form.getByLabelText('Destination airport'),
      'NCE',
    )

    await user.type(
      form.getByLabelText('Scheduled date'),
      '2026-07-22T09:30',
    )

    await user.click(
      form.getByLabelText('Documents verified'),
    )

    await user.click(
      form.getByLabelText('Fuel confirmed'),
    )

    await user.click(
      form.getByLabelText('Maintenance released'),
    )

    await user.click(
      form.getByLabelText('Weather reviewed'),
    )

    await user.click(
      form.getByRole('button', {
        name: 'Create mission',
      }),
    )

    const newMissionHeading = screen.getByText('FX500')
    const missionCard = newMissionHeading.closest('article')

    if (!(missionCard instanceof HTMLElement)) {
      throw new Error('The new ready mission card was not found.')
    }

    expect(missionCard).toHaveTextContent('FX500')
    expect(missionCard).toHaveTextContent('CDG')
    expect(missionCard).toHaveTextContent('NCE')

    expect(
      within(missionCard).getByText('Ready'),
    ).toBeInTheDocument()

    expect(
      getSummaryCard('Total missions'),
    ).toHaveTextContent('4')

    expect(
      getSummaryCard('Ready'),
    ).toHaveTextContent('2')

    expect(
      screen.queryByRole('heading', {
        name: 'Create flight mission',
      }),
    ).not.toBeInTheDocument()
  })

  it('creates a blocked mission when a check is incomplete', async () => {
    const user = userEvent.setup()

    render(<App />)

    await user.click(
      screen.getByRole('button', {
        name: 'Create mission',
      }),
    )

    const missionForm = getMissionForm()
    const form = within(missionForm)

    await user.type(
      form.getByLabelText('Flight number'),
      'FX600',
    )

    await user.type(
      form.getByLabelText('Aircraft registration'),
      'F-BLOCK',
    )

    await user.type(
      form.getByLabelText('Departure airport'),
      'LYS',
    )

    await user.type(
      form.getByLabelText('Destination airport'),
      'BOD',
    )

    await user.type(
      form.getByLabelText('Scheduled date'),
      '2026-07-23T11:45',
    )

    await user.click(
      form.getByLabelText('Documents verified'),
    )

    await user.click(
      form.getByLabelText('Fuel confirmed'),
    )

    // Maintenance released 故意不勾选。

    await user.click(
      form.getByLabelText('Weather reviewed'),
    )

    await user.click(
      form.getByRole('button', {
        name: 'Create mission',
      }),
    )

    const newMissionHeading = screen.getByText('FX600')
    const missionCard = newMissionHeading.closest('article')

    if (!(missionCard instanceof HTMLElement)) {
      throw new Error('The new blocked mission card was not found.')
    }

    expect(missionCard).toHaveTextContent('FX600')
    expect(missionCard).toHaveTextContent('LYS')
    expect(missionCard).toHaveTextContent('BOD')

    expect(
      within(missionCard).getByText('Blocked'),
    ).toBeInTheDocument()

    expect(
      getSummaryCard('Total missions'),
    ).toHaveTextContent('4')

    expect(
      getSummaryCard('Blocked'),
    ).toHaveTextContent('2')
  })

  it('shows the technical issue from an existing mission', () => {
    render(<App />)

    expect(
      screen.getByText(
        'Maintenance release is still pending.',
      ),
    ).toBeInTheDocument()
  })
})