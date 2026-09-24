export const GAMES = [
  {
    id: 'burraco',
    name: 'Burraco',
    emoji: '🃏',
    defaultTarget: 1500,
    defaultPlayers: 4,
    description: 'A coppie, 1500 punti',
  },
  {
    id: 'scala40',
    name: 'Scala 40',
    emoji: '🂡',
    defaultTarget: 151,
    defaultPlayers: 4,
    description: 'Singoli o a squadre, 151 punti',
  },
  {
    id: 'macchiavelli',
    name: 'Macchiavelli',
    emoji: '🂭',
    defaultTarget: 500,
    defaultPlayers: 4,
    description: 'Singoli o a squadre, 500 punti',
  },
]

export function getGame(id) {
  return GAMES.find((game) => game.id === id) ?? GAMES[0]
}