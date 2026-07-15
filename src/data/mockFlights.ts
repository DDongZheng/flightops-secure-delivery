import type { FlightMission } from '../types/flight'

export const mockFlights: FlightMission[] = [
  {
    id: 'mission-001',
    flightNumber: 'FX101',
    aircraftRegistration: 'F-DEMO',
    departureAirport: 'TLS',
    destinationAirport: 'MRS',
    scheduledDate: '2026-07-18T08:30',
    checklist: {
      documentsVerified: true,
      fuelConfirmed: true,
      maintenanceReleased: true,
      weatherReviewed: true,
    },
    submitted: true,
  },
  {
    id: 'mission-002',
    flightNumber: 'FX204',
    aircraftRegistration: 'F-TEST',
    departureAirport: 'BOD',
    destinationAirport: 'LYS',
    scheduledDate: '2026-07-18T11:15',
    checklist: {
      documentsVerified: true,
      fuelConfirmed: true,
      maintenanceReleased: false,
      weatherReviewed: true,
    },
    technicalIssue: 'Maintenance release is still pending.',
    submitted: true,
  },
  {
    id: 'mission-003',
    flightNumber: 'FX310',
    aircraftRegistration: 'F-LABS',
    departureAirport: 'NTE',
    destinationAirport: 'TLS',
    scheduledDate: '2026-07-19T14:00',
    checklist: {
      documentsVerified: false,
      fuelConfirmed: false,
      maintenanceReleased: false,
      weatherReviewed: false,
    },
    submitted: false,
  },
]
