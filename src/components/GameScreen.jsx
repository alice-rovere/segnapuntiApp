import { useState } from "react";
import { getGame } from "../constants/games";
import { computeTotals, findPlayer, hasReachedTarget, nextDealerId } from "../utils/scoring";
import AddRoundModal from "./AddRoundModal";

function ProgressBar({ value, max }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className="progress">
      <div className="progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}

function GameScreen({ match, dispatch, onReset }) {
  const game = getGame(match.gameId);
  const lowerScoreWins = Boolean(game.lowerScoreWins);
  const [adding, setAdding] = useState(false);
  const [suggestedDealerId, setSuggestedDealerId] = useState(null);
  const totals = computeTotals(match.teams, match.rounds);
  const reached = hasReachedTarget(match.teams, totals, match.target);
  const rankedTeams = [...match.teams].sort((a, b) =>
    lowerScoreWins
      ? totals[a.id] - totals[b.id]
      : totals[b.id] - totals[a.id],
  );

  function openAddRound() {
    setSuggestedDealerId(nextDealerId(match.players, match.rounds));
    setAdding(true);
  }

  function handleAddRound(scores, dealerId) {
    dispatch({ type: "ADD_ROUND", payload: { scores, dealerId } });
    setAdding(false);
  }

  function handleUndo() {
    dispatch({ type: "UNDO_ROUND" });
  }

  function handleFinish() {
    dispatch({ type: "END_MATCH" });
  }

  function handleAbandon() {
    if (
      window.confirm("Vuoi davvero chiudere questa partita senza salvarla?")
    ) {
      dispatch({ type: "RESET" });
      onReset?.();
    }
  }

  return (
    <div className="screen">
      <header className="screen__header">
        <div>
          <p className="screen__kicker">
            {game.emoji} {game.name}
          </p>
          <h1 className="screen__title">Partita in corso</h1>
        </div>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={handleAbandon}
        >
          Chiudi
        </button>
      </header>

      {reached && !match.ended && (
        <div className="target-banner">
          <p className="target-banner__title">
            {lowerScoreWins
              ? `🚨 Qualcuno ha superato il limite di ${match.target}!`
              : `🎯 Obiettivo ${match.target} raggiunto!`}
          </p>
          <div className="target-banner__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={handleFinish}
            >
              Termina la partita
            </button>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={openAddRound}
            >
              Continua
            </button>
          </div>
        </div>
      )}

      <section className="section">
        <h2 className="section-title">Obiettivo {match.target}</h2>
        <div className="team-list">
          {rankedTeams.map((team, rank) => {
              const reachedTarget = totals[team.id] >= match.target;
              return (
                <div
                  key={team.id}
                  className={`team-card${reachedTarget ? (lowerScoreWins ? " team-card--danger" : " team-card--target") : ""}`}
                >
                  <div className="team-card__top">
                    <span className="team-card__rank big-num">{rank + 1}</span>
                    <div className="team-card__info">
                      <span className="team-card__name">{team.name}</span>
                      <span className="team-card__players">
                        {team.players.join(" · ")}
                      </span>
                    </div>
                    <span className="team-card__total big-num">
                      {totals[team.id]}
                    </span>
                  </div>
                  <ProgressBar value={totals[team.id]} max={match.target} />
                  <span className="team-card__target">
                    {lowerScoreWins
                      ? reachedTarget
                        ? "oltre il limite — fuori gioco ✗"
                        : `mancano ${match.target - totals[team.id]} ${match.target - totals[team.id] === 1 ? "punto" : "punti"} al limite`
                      : reachedTarget
                        ? "obiettivo raggiunto ✓"
                        : `mancano ${match.target - totals[team.id]} ${match.target - totals[team.id] === 1 ? "punto" : "punti"}`}
                  </span>
                </div>
              );
            })}
        </div>
      </section>

      <div className="section-actions">
        <button
          type="button"
          className="btn btn--primary btn--big"
          onClick={openAddRound}
        >
          ＋ Aggiungi manche
        </button>
      </div>

      <section className="section">
        <div className="section-head">
          <h2 className="section-title">Manche</h2>
          {match.rounds.length > 0 && (
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={handleUndo}
            >
              Annulla ultima
            </button>
          )}
        </div>
        {match.rounds.length === 0 ? (
          <p className="empty-state">
            Nessuna manche ancora. Aggiungi la prima per iniziare il conteggio.
          </p>
        ) : (
          <ul className="round-list">
            {[...match.rounds].reverse().map((round, i) => {
              const n = match.rounds.length - i;
              return (
                <li key={round.id} className="round-row">
                  <span className="round-row__num">Manche {n}</span>
                  {round.dealerId && (
                    <span className="round-row__dealer">
                      🂡 {findPlayer(match.players, round.dealerId)?.name ?? "?"}
                    </span>
                  )}
                  <div className="round-row__scores">
                    {match.teams.map((team) => (
                      <span
                        key={team.id}
                        className={`chip${(round.scores[team.id] ?? 0) < 0 ? " chip--neg" : ""}`}
                      >
                        {team.name}: {round.scores[team.id] ?? 0}
                      </span>
                    ))}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {adding && (
        <AddRoundModal
          teams={match.teams}
          roundNumber={match.rounds.length + 1}
          useBasePoints={game.id === "burraco"}
          players={match.players}
          suggestedDealerId={suggestedDealerId}
          onCancel={() => setAdding(false)}
          onSubmit={handleAddRound}
        />
      )}
    </div>
  );
}

export default GameScreen;
