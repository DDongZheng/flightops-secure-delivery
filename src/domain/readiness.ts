import type {
  FlightMission,
  ReadinessStatus,
} from '../types/flight'

export function calculateReadiness(
  mission: FlightMission,
): ReadinessStatus {
  if (!mission.submitted) {
    return 'DRAFT'
  }

  const checklistComplete = Object.values(mission.checklist).every(Boolean)
  const hasTechnicalIssue = Boolean(mission.technicalIssue?.trim())

  if (!checklistComplete || hasTechnicalIssue) {
    return 'BLOCKED'
  }

  return 'READY'
}
