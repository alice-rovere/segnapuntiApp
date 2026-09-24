# Segnapunti

Segnapunti per giochi di carte italiani, pensato per l'uso su telefono. SPA statica senza backend: lo stato della partita vive solo nella memoria del browser.

## Giochi supportati

- **Burraco** — target di default 1500 punti
- **Scala 40** — target 151 punti, vince chi ha meno punti
- **Macchiavelli** — target 500 punti, vince chi ha meno punti

Per ogni partita si possono scegliere modalità a squadre o singoli, il target e i nomi di giocatori e squadre. Si registrano i punteggi di ogni round, con il dealer, fino a raggiungere il target.

## Sviluppo locale

Il package manager è **pnpm** (non npm).

```bash
pnpm install
pnpm dev
```

Build di produzione:

```bash
pnpm build
pnpm preview
```

Lint:

```bash
pnpm lint
```

## Deploy

A ogni push su `main` un workflow GitHub Actions (`.github/workflows/deploy.yml`) compila e pubblica l'app su GitHub Pages:

**https://alice-rovere.github.io/segnapuntiApp/**

Nota: `vite.config.js` imposta `base: '/segnapuntiApp/'` per il subpath del repo. Se il repo viene rinominato, aggiornare anche il `base`.