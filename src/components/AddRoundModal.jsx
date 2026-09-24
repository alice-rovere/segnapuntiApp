import { useState } from 'react'

const emptyValues = (teams) =>
  Object.fromEntries(teams.map((team) => [team.id, { base: '', points: '' }]))

function AddRoundModal({
  teams,
  roundNumber,
  onCancel,
  onSubmit,
  useBasePoints = false,
  players = [],
  suggestedDealerId = null,
}) {
  const [values, setValues] = useState(() => emptyValues(teams))
  const [dealerId, setDealerId] = useState(
    () => suggestedDealerId ?? players[0]?.id ?? null,
  )

  const num = (value) => (value === '' ? NaN : Number(value))

  function update(id, key, value) {
    if (value !== '' && !/^-?\d*$/.test(value)) return
    setValues((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }))
  }

  const anyFilled = teams.some(
    (team) => values[team.id].base !== '' || values[team.id].points !== '',
  )
  const allValid = teams.every((team) => {
    const base = num(values[team.id].base)
    const points = num(values[team.id].points)
    const baseOk = values[team.id].base === '' || Number.isFinite(base)
    const pointsOk = values[team.id].points === '' || Number.isFinite(points)
    return baseOk && pointsOk
  })

  function teamTotal(team) {
    const v = values[team.id]
    return (num(v.base) || 0) + (num(v.points) || 0)
  }

  function handleSubmit() {
    const scores = Object.fromEntries(
      teams.map((team) => [team.id, teamTotal(team)]),
    )
    onSubmit(scores, dealerId)
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <h2 className="modal__title">Manche {roundNumber}</h2>
        <p className="modal__subtitle">
          Inserisci i punti di ogni {teams.length > 1 && useBasePoints ? 'base e i punti' : 'squadra'}
        </p>
        <div className="modal__teams">
          {teams.map((team) => {
            const v = values[team.id]
            return (
              <div key={team.id} className="round-field-group">
                <span className="round-field-group__label">{team.name}</span>
                <div className="round-field-group__inputs">
                  {useBasePoints && (
                    <label className="round-field">
                      <span className="round-field__label">Base</span>
                      <input
                        className="round-field__input"
                        type="text"
                        inputMode="numeric"
                        placeholder="0"
                        value={v.base}
                        onChange={(e) => update(team.id, 'base', e.target.value)}
                      />
                    </label>
                  )}
                  <label className="round-field">
                    <span className="round-field__label">{useBasePoints ? 'Punti' : 'Punti'}</span>
                    <input
                      className="round-field__input"
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={v.points}
                      onChange={(e) => update(team.id, 'points', e.target.value)}
                    />
                  </label>
                </div>
                {useBasePoints && (
                  <span className="round-field-group__total">
                    Totale: {teamTotal(team)}
                  </span>
                )}
              </div>
            )
          })}
        </div>
        <p className="form-hint">Usa il segno − per le multe (es. −20)</p>
        {players.length > 0 && (
          <div className="dealer-picker">
            <span className="dealer-picker__label">
              🂡 Chi fa carte?
            </span>
            <div className="dealer-picker__options">
              {players.map((player) => (
                <button
                  key={player.id}
                  type="button"
                  className={`dealer-chip${dealerId === player.id ? " dealer-chip--active" : ""}`}
                  onClick={() => setDealerId(player.id)}
                >
                  {player.name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className="modal__actions">
          <button type="button" className="btn btn--ghost" onClick={onCancel}>
            Annulla
          </button>
          <button
            type="button"
            className="btn btn--primary"
            disabled={!anyFilled || !allValid}
            onClick={handleSubmit}
          >
            Conferma
          </button>
        </div>
      </div>
    </div>
  )
}

export default AddRoundModal