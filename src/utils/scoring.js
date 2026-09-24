export function computeTotals(teams, rounds) {
  const totals = {}
  for (const team of teams) {
    totals[team.id] = 0
  }
  for (const round of rounds) {
    for (const team of teams) {
      totals[team.id] += round.scores[team.id] ?? 0
    }
  }
  return totals
}

export function findWinner(teams, totals, target, { lowerScoreWins = false } = {}) {
  if (lowerScoreWins) {
    const overTarget = teams.filter((team) => totals[team.id] >= target)
    if (overTarget.length === 0) return null
    const pool = teams.filter((team) => totals[team.id] < target)
    return (pool.length > 0 ? pool : overTarget).reduce((best, team) =>
      totals[team.id] < totals[best.id] ? team : best,
    )
  }
  const qualified = teams.filter((team) => totals[team.id] >= target)
  if (qualified.length === 0) return null
  return qualified.reduce((best, team) =>
    totals[team.id] > totals[best.id] ? team : best,
  )
}

export function hasReachedTarget(teams, totals, target) {
  return teams.some((team) => totals[team.id] >= target)
}

export function leadingTeam(teams, totals) {
  return teams.reduce((best, team) =>
    totals[team.id] > totals[best.id] ? team : best,
  )
}

export function nextDealerId(players, rounds) {
  if (players.length === 0) return null
  const last = rounds[rounds.length - 1]
  if (!last?.dealerId) return players[0].id
  const index = players.findIndex((p) => p.id === last.dealerId)
  return players[(index + 1) % players.length].id
}

export function findPlayer(players, dealerId) {
  return players.find((p) => p.id === dealerId)
}