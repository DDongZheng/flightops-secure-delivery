export type ReadinessStatus = 'DRAFT' | 'READY' | 'BLOCKED'

export interface FlightChecklist {
  documentsVerified: boolean
  fuelConfirmed: boolean
  maintenanceReleased: boolean
  weatherReviewed: boolean
}

export interface FlightMission {
  id: string
  flightNumber: string
  aircraftRegistration: string
  departureAirport: string
  destinationAirport: string
  scheduledDate: string
  checklist: FlightChecklist
  technicalIssue?: string
  submitted: boolean
}
