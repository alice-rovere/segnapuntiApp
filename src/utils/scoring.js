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

export function findWinner(teams, totals, target) {
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