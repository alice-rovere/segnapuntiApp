import { useMemo, useState } from "react";
import { GAMES, getGame } from "../constants/games";

function GamePicker({ value, onChange }) {
  return (
    <section className="section">
      <h2 className="section-title">Scegli il gioco</h2>
      <div className="game-grid">
        {GAMES.map((game) => {
          const selected = value === game.id;
          return (
            <button
              key={game.id}
              type="button"
              className={`game-card${selected ? " game-card--selected" : ""}`}
              onClick={() => onChange(game.id)}
            >
              <span className="game-card__emoji">{game.emoji}</span>
              <span className="game-card__name">{game.name}</span>
              <span className="game-card__desc">{game.description}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function Stepper({ label, value, min, max, onChange }) {
  return (
    <div className="stepper">
      <span className="stepper__label">{label}</span>
      <div className="stepper__controls">
        <button
          type="button"
          className="stepper__btn"
          disabled={value <= min}
          onClick={() => onChange(value - 1)}
        >
          −
        </button>
        <span className="stepper__value">{value}</span>
        <button
          type="button"
          className="stepper__btn"
          disabled={value >= max}
          onClick={() => onChange(value + 1)}
        >
          +
        </button>
      </div>
    </div>
  );
}

function SetupScreen({ onStart }) {
  const [gameId, setGameId] = useState("burraco");
  const [players, setPlayers] = useState(4);
  const [mode, setMode] = useState("teams");
  const [names, setNames] = useState({});
  const game = getGame(gameId);
  const [target, setTarget] = useState(game.defaultTarget);

  const teamsMode = mode === "teams";
  const oddPlayers = players % 2 !== 0;

  const slots = useMemo(() => {
    if (teamsMode) {
      return Array.from({ length: players / 2 }, (_, i) => ({
        id: `t${i + 1}`,
        label: `Squadra ${i + 1}`,
      }));
    }
    return Array.from({ length: players }, (_, i) => ({
      id: `p${i + 1}`,
      label: `Giocatore ${i + 1}`,
    }));
  }, [teamsMode, players]);

  function slug(label, fallback) {
    const clean = label
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "");
    return clean || fallback;
  }

  const canStart = players >= 2 && !(teamsMode && oddPlayers) && target > 0;

  function handleStart() {
    let teams;
    if (teamsMode) {
      teams = slots.map((slot, i) => ({
        id: slot.id,
        name: names[slug(slot.label)]?.trim() || slot.label,
        players: [i * 2 + 1, i * 2 + 2].map(
          (n) => names[`player${n}`]?.trim() || `Giocatore ${n}`,
        ),
      }));
    } else {
      teams = slots.map((slot) => ({
        id: slot.id,
        name: names[slug(slot.label)]?.trim() || slot.label,
        players: [names[slug(slot.label)]?.trim() || slot.label],
      }));
    }
    onStart({ gameId, mode, teams, target });
  }

  function updateName(slotId, value) {
    setNames((prev) => ({ ...prev, [slotId]: value }));
  }

  return (
    <div className="screen">
      <header className="screen__header">
        <h1 className="screen__title">♠️ Segnapunti</h1>
        <p className="screen__subtitle">Le tue partite a carte</p>
      </header>

      <GamePicker value={gameId} onChange={setGameId} />

      <section className="section">
        <h2 className="section-title">Giocatori</h2>
        <Stepper
          label="Numero di giocatori"
          value={players}
          min={2}
          max={8}
          onChange={setPlayers}
        />
      </section>

      <section className="section">
        <h2 className="section-title">Modalità</h2>
        <div className="segmented">
          <button
            type="button"
            className={
              !teamsMode
                ? "segmented__btn segmented__btn--active"
                : "segmented__btn"
            }
            onClick={() => setMode("singles")}
          >
            Singoli
          </button>
          <button
            type="button"
            className={
              teamsMode
                ? "segmented__btn segmented__btn--active"
                : "segmented__btn"
            }
            onClick={() => setMode("teams")}
          >
            Coppie / Squadre
          </button>
        </div>
        {teamsMode && oddPlayers && (
          <p className="form-hint form-hint--warn">
            Con {players} giocatori le squadre non sono bilanciate: usa un
            numero pari o scegli “Singoli”.
          </p>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Nomi</h2>
        {slots.map((slot) => (
          <input
            key={slot.id}
            className="text-input"
            type="text"
            placeholder={slot.label}
            value={names[slug(slot.label)] ?? ""}
            onChange={(e) => updateName(slug(slot.label), e.target.value)}
            maxLength={24}
          />
        ))}
        {teamsMode && (
          <p className="form-hint">I punti verranno accumulati per squadra.</p>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Punteggio obiettivo</h2>
        <input
          className="text-input text-input--number"
          type="number"
          inputMode="numeric"
          min={1}
          value={target}
          onChange={(e) => setTarget(Number(e.target.value))}
        />
      </section>

      <div className="section-actions">
        <button
          type="button"
          className="btn btn--primary btn--big"
          disabled={!canStart}
          onClick={handleStart}
        >
          Inizia partita
        </button>
      </div>
    </div>
  );
}

export default SetupScreen;
