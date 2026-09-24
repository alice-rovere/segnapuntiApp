# AGENTS.md

## Panoramica

Segnapunti per giochi di carte italiani (Burraco, Scala 40, Macchiavelli), pensato per l'uso su telefono.
SPA statica: React 19 + Vite, niente backend. UI in italiano. Stato della partita tenuto solo in memoria (`useReducer`): chiudendo la pagina la partita si perde.

## Comandi

Il package manager è **pnpm** (non npm).

- `pnpm dev` — server di sviluppo con HMR
- `pnpm build` — build di produzione in `dist/`
- `pnpm preview` — serve la build per verificarla localmente
- `pnpm lint` — ESLint (run obbligatorio dopo ogni modifica al codice)

## Architettura

- `src/main.jsx` — entry point, monta `<App />` con `<StrictMode>`
- `src/App.jsx` — sceglie la schermata in base allo stato della partita: setup → game → result
- `src/hooks/useMatch.js` — reducer della partita. Actions: `START_MATCH`, `ADD_ROUND`, `UNDO_ROUND`, `END_MATCH`, `RESET`
- `src/constants/games.js` — definizioni dei giochi (target, giocatori di default, `lowerScoreWins`)
- `src/utils/scoring.js` — totali per squadra, calcolo vincitore, dealer successivo
- `src/components/`
  - `SetupScreen.jsx` — scelta gioco, modalità/target, nomi giocatori e squadre
  - `GameScreen.jsx` — schermata di gioco, mostra totali e progresso verso il target
  - `AddRoundModal.jsx` — inserimento punteggi del round e scelta del dealer
  - `ResultScreen.jsx` — vincitore, ripartita (rematch) o nuova partita

## Convenzioni

- JSX senza TypeScript (`*.jsx`)
- Niente commenti nel codice salvo richiesto esplicitamente
- Logica dei punteggi in `src/utils/scoring.js`, niente calcoli dentro i componenti
- I giochi si aggiungono/modificano solo in `src/constants/games.js`
- Dopo le modifiche: `pnpm lint` e, se serve, `pnpm build`

## Deploy

GitHub Actions pubblica su GitHub Pages a ogni push su `main`:
`https://alice-rovere.github.io/segnapuntiApp/`

Workflow: `.github/workflows/deploy.yml`. Il `base` di Vite è configurato per il subpath del repo (`/segnapuntiApp/`): se il repo viene rinominato, aggiornare anche `vite.config.js`.