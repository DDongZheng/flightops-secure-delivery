import { useState, type FormEvent } from 'react'
import type {
  FlightChecklist,
  FlightMission,
} from '../types/flight'

interface MissionFormProps {
  onCreate: (mission: FlightMission) => void
  onCancel: () => void
}

interface FormValues {
  flightNumber: string
  aircraftRegistration: string
  departureAirport: string
  destinationAirport: string
  scheduledDate: string
  technicalIssue: string
}

const initialValues: FormValues = {
  flightNumber: '',
  aircraftRegistration: '',
  departureAirport: '',
  destinationAirport: '',
  scheduledDate: '',
  technicalIssue: '',
}

const initialChecklist: FlightChecklist = {
  documentsVerified: false,
  fuelConfirmed: false,
  maintenanceReleased: false,
  weatherReviewed: false,
}

export function MissionForm({
  onCreate,
  onCancel,
}: MissionFormProps) {
  const [values, setValues] = useState(initialValues)
  const [checklist, setChecklist] = useState(initialChecklist)
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const flightNumber = values.flightNumber.trim().toUpperCase()
    const departureAirport = values.departureAirport.trim().toUpperCase()
    const destinationAirport = values.destinationAirport.trim().toUpperCase()

    if (
      !flightNumber ||
      !values.aircraftRegistration.trim() ||
      !departureAirport ||
      !destinationAirport ||
      !values.scheduledDate
    ) {
      setError('Complete all required fields before creating the mission.')
      return
    }

    if (!/^[A-Z0-9]{2,8}$/.test(flightNumber)) {
      setError('Flight number must contain 2 to 8 letters or numbers.')
      return
    }

    if (!/^[A-Z]{3}$/.test(departureAirport)) {
      setError('Departure airport must be a three-letter code.')
      return
    }

    if (!/^[A-Z]{3}$/.test(destinationAirport)) {
      setError('Destination airport must be a three-letter code.')
      return
    }

    if (departureAirport === destinationAirport) {
      setError('Departure and destination airports must be different.')
      return
    }

    const mission: FlightMission = {
      id: crypto.randomUUID(),
      flightNumber,
      aircraftRegistration: values.aircraftRegistration.trim().toUpperCase(),
      departureAirport,
      destinationAirport,
      scheduledDate: values.scheduledDate,
      checklist,
      technicalIssue: values.technicalIssue.trim() || undefined,
      submitted: true,
    }

    onCreate(mission)
  }

  return (
    <section className="mission-form-panel" aria-labelledby="mission-form-title">
      <div className="form-heading">
        <div>
          <p className="eyebrow">New mission</p>
          <h2 id="mission-form-title">Create flight mission</h2>
        </div>

        <button type="button" className="close-button" onClick={onCancel}>
          Cancel
        </button>
      </div>

      <form className="mission-form" onSubmit={handleSubmit} noValidate>
        {error && (
          <div className="form-error" role="alert">
            {error}
          </div>
        )}

        <div className="form-grid">
          <label>
            Flight number
            <input
              type="text"
              value={values.flightNumber}
              onChange={(event) =>
                setValues({
                  ...values,
                  flightNumber: event.target.value,
                })
              }
              placeholder="FX410"
              required
            />
          </label>

          <label>
            Aircraft registration
            <input
              type="text"
              value={values.aircraftRegistration}
              onChange={(event) =>
                setValues({
                  ...values,
                  aircraftRegistration: event.target.value,
                })
              }
              placeholder="F-DEMO"
              required
            />
          </label>

          <label>
            Departure airport
            <input
              type="text"
              value={values.departureAirport}
              onChange={(event) =>
                setValues({
                  ...values,
                  departureAirport: event.target.value,
                })
              }
              placeholder="TLS"
              maxLength={3}
              required
            />
          </label>

          <label>
            Destination airport
            <input
              type="text"
              value={values.destinationAirport}
              onChange={(event) =>
                setValues({
                  ...values,
                  destinationAirport: event.target.value,
                })
              }
              placeholder="MRS"
              maxLength={3}
              required
            />
          </label>

          <label>
            Scheduled date
            <input
              type="datetime-local"
              value={values.scheduledDate}
              onChange={(event) =>
                setValues({
                  ...values,
                  scheduledDate: event.target.value,
                })
              }
              required
            />
          </label>

          <label className="full-width">
            Technical issue
            <textarea
              value={values.technicalIssue}
              onChange={(event) =>
                setValues({
                  ...values,
                  technicalIssue: event.target.value,
                })
              }
              placeholder="Leave empty when no issue has been reported."
              rows={3}
            />
          </label>
        </div>

        <fieldset className="checklist-fieldset">
          <legend>Readiness checklist</legend>

          <label>
            <input
              type="checkbox"
              checked={checklist.documentsVerified}
              onChange={(event) =>
                setChecklist({
                  ...checklist,
                  documentsVerified: event.target.checked,
                })
              }
            />
            Documents verified
          </label>

          <label>
            <input
              type="checkbox"
              checked={checklist.fuelConfirmed}
              onChange={(event) =>
                setChecklist({
                  ...checklist,
                  fuelConfirmed: event.target.checked,
                })
              }
            />
            Fuel confirmed
          </label>

          <label>
            <input
              type="checkbox"
              checked={checklist.maintenanceReleased}
              onChange={(event) =>
                setChecklist({
                  ...checklist,
                  maintenanceReleased: event.target.checked,
                })
              }
            />
            Maintenance released
          </label>

          <label>
            <input
              type="checkbox"
              checked={checklist.weatherReviewed}
              onChange={(event) =>
                setChecklist({
                  ...checklist,
                  weatherReviewed: event.target.checked,
                })
              }
            />
            Weather reviewed
          </label>
        </fieldset>

        <div className="form-actions">
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>

          <button type="submit" className="primary-button">
            Create mission
          </button>
        </div>
      </form>
    </section>
  )
}
