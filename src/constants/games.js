export const GAMES = [
  {
    id: 'burraco',
    name: 'Burraco',
    emoji: '🃏',
    defaultTarget: 1500,
    defaultPlayers: 2,
    lowerScoreWins: false,
  },
  {
    id: 'scala40',
    name: 'Scala 40',
    emoji: '🂡',
    defaultTarget: 151,
    defaultPlayers: 2,
    lowerScoreWins: true,
  },
  {
    id: 'macchiavelli',
    name: 'Macchiavelli',
    emoji: '🂭',
    defaultTarget: 500,
    defaultPlayers: 4,
    lowerScoreWins: true,
  },
]

export function getGame(id) {
  return GAMES.find((game) => game.id === id) ?? GAMES[0]
}