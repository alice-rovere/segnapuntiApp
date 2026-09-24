import { computeTotals } from '../utils/scoring'
import { getGame } from '../constants/games'

function ResultScreen({ match, onRematch, onNewSetup }) {
  const game = getGame(match.gameId)
  const lowerScoreWins = Boolean(game.lowerScoreWins)
  const totals = computeTotals(match.teams, match.rounds)
  const sorted = [...match.teams].sort((a, b) =>
    lowerScoreWins
      ? totals[a.id] - totals[b.id]
      : totals[b.id] - totals[a.id],
  )
  const winner = match.teams.find((t) => t.id === match.winnerId)

  return (
    <div className="screen">
      <header className="screen__header screen__header--center">
        <p className="screen__kicker">
          {game.emoji} {game.name}
        </p>
        <h1 className="screen__title">Fine partita!</h1>
      </header>

      {winner && (
        <section className="winner-card">
          <span className="winner-card__trophy">🏆</span>
          <p className="winner-card__label">Vince</p>
          <p className="winner-card__name">{winner.name}</p>
          <p className="winner-card__points">
            {lowerScoreWins
              ? `${totals[winner.id]} punti`
              : `${totals[winner.id]} / ${match.target} punti`}
          </p>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">Classifica finale</h2>
        <ol className="final-list">
          {sorted.map((team, i) => (
            <li key={team.id} className={`final-row${team.id === winner?.id ? ' final-row--winner' : ''}`}>
              <span className="final-row__rank">{['🥇', '🥈', '🥉'][i] ?? i + 1}</span>
              <span className="final-row__name">{team.name}</span>
              <span className="final-row__points">{totals[team.id]}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <p className="section-summary">
          {match.rounds.length} manche giocate · obiettivo {match.target} punti
        </p>
      </section>

      <div className="fixed-actions">
        <button type="button" className="btn btn--primary" onClick={onRematch}>
          Rivincita
        </button>
        <button type="button" className="btn btn--ghost" onClick={onNewSetup}>
          Nuovo gioco / setup
        </button>
      </div>
    </div>
  )
}

export default ResultScreen