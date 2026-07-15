import { describe, expect, it } from 'vitest'
import type { FlightMission } from '../types/flight'
import { calculateReadiness } from './readiness'

function createMission(
  overrides: Partial<FlightMission> = {},
): FlightMission {
  return {
    id: 'mission-test',
    flightNumber: 'FX999',
    aircraftRegistration: 'F-TEST',
    departureAirport: 'TLS',
    destinationAirport: 'MRS',
    scheduledDate: '2026-07-20T10:00',
    checklist: {
      documentsVerified: true,
      fuelConfirmed: true,
      maintenanceReleased: true,
      weatherReviewed: true,
    },
    submitted: true,
    ...overrides,
  }
}

describe('calculateReadiness', () => {
  it('returns DRAFT when the mission has not been submitted', () => {
    const mission = createMission({
      submitted: false,
    })

    expect(calculateReadiness(mission)).toBe('DRAFT')
  })

  it('returns READY when every check is complete', () => {
    const mission = createMission()

    expect(calculateReadiness(mission)).toBe('READY')
  })

  it('returns BLOCKED when a checklist item is incomplete', () => {
    const mission = createMission({
      checklist: {
        documentsVerified: true,
        fuelConfirmed: true,
        maintenanceReleased: false,
        weatherReviewed: true,
      },
    })

    expect(calculateReadiness(mission)).toBe('BLOCKED')
  })

  it('returns BLOCKED when a technical issue exists', () => {
    const mission = createMission({
      technicalIssue: 'Hydraulic inspection required.',
    })

    expect(calculateReadiness(mission)).toBe('BLOCKED')
  })

  it('ignores a technical issue containing only whitespace', () => {
    const mission = createMission({
      technicalIssue: '   ',
    })

    expect(calculateReadiness(mission)).toBe('READY')
  })
})
