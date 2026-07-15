import { useState } from 'react'
import './App.css'
import { MissionForm } from './components/MissionForm'
import { mockFlights } from './data/mockFlights'
import { calculateReadiness } from './domain/readiness'
import type {
  FlightMission,
  ReadinessStatus,
} from './types/flight'

const statusLabels: Record<ReadinessStatus, string> = {
  DRAFT: 'Draft',
  READY: 'Ready',
  BLOCKED: 'Blocked',
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function App() {
  const [flightMissions, setFlightMissions] =
    useState<FlightMission[]>(mockFlights)
  const [showForm, setShowForm] = useState(false)

  const missions = flightMissions.map((mission) => ({
    ...mission,
    readinessStatus: calculateReadiness(mission),
  }))

  const statusCounts = {
    total: missions.length,
    ready: missions.filter(
      (mission) => mission.readinessStatus === 'READY',
    ).length,
    blocked: missions.filter(
      (mission) => mission.readinessStatus === 'BLOCKED',
    ).length,
    draft: missions.filter(
      (mission) => mission.readinessStatus === 'DRAFT',
    ).length,
  }

  function handleCreateMission(mission: FlightMission) {
    setFlightMissions((currentMissions) => [mission, ...currentMissions])
    setShowForm(false)
  }

  return (
    <main className="dashboard">
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">FlightOps Secure Delivery Factory</p>
          <h1>Flight Readiness Dashboard</h1>
          <p className="header-description">
            Monitor simulated flight missions and verify their operational
            readiness before release.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={() => setShowForm(true)}
        >
          Create mission
        </button>
      </header>

      {showForm && (
        <MissionForm
          onCreate={handleCreateMission}
          onCancel={() => setShowForm(false)}
        />
      )}

      <section className="summary-grid" aria-label="Mission summary">
        <article className="summary-card">
          <span>Total missions</span>
          <strong>{statusCounts.total}</strong>
        </article>

        <article className="summary-card summary-card-ready">
          <span>Ready</span>
          <strong>{statusCounts.ready}</strong>
        </article>

        <article className="summary-card summary-card-blocked">
          <span>Blocked</span>
          <strong>{statusCounts.blocked}</strong>
        </article>

        <article className="summary-card summary-card-draft">
          <span>Draft</span>
          <strong>{statusCounts.draft}</strong>
        </article>
      </section>

      <section className="missions-section">
        <div className="section-heading">
          <div>
            <h2>Upcoming missions</h2>
            <p>Readiness status is calculated from operational checks.</p>
          </div>
        </div>

        <div className="mission-list">
          {missions.map((mission) => {
            const completedChecks = Object.values(mission.checklist).filter(
              Boolean,
            ).length

            return (
              <article className="mission-card" key={mission.id}>
                <div className="mission-primary">
                  <div>
                    <span
                      className={`status-badge status-${mission.readinessStatus.toLowerCase()}`}
                    >
                      {statusLabels[mission.readinessStatus]}
                    </span>

                    <h3>{mission.flightNumber}</h3>

                    <p className="route">
                      {mission.departureAirport}
                      <span aria-hidden="true"> → </span>
                      {mission.destinationAirport}
                    </p>
                  </div>

                  <dl className="mission-details">
                    <div>
                      <dt>Aircraft</dt>
                      <dd>{mission.aircraftRegistration}</dd>
                    </div>

                    <div>
                      <dt>Scheduled</dt>
                      <dd>
                        <time dateTime={mission.scheduledDate}>
                          {formatDate(mission.scheduledDate)}
                        </time>
                      </dd>
                    </div>

                    <div>
                      <dt>Checks completed</dt>
                      <dd>{completedChecks} / 4</dd>
                    </div>
                  </dl>
                </div>

                {mission.technicalIssue && (
                  <div className="technical-issue">
                    <strong>Technical issue</strong>
                    <p>{mission.technicalIssue}</p>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>
    </main>
  )
}

export default App
