import { useReducer } from 'react'
import { computeTotals, findWinner } from '../utils/scoring'

export function buildPlayers(teams) {
  const players = []
  teams.forEach((team) => {
    team.players.forEach((name, pi) => {
      players.push({
        id: `${team.id}-p${pi + 1}`,
        name,
        teamId: team.id,
      })
    })
  })
  return players
}

export function createMatch({ gameId, mode, teams, target }) {
  return {
    gameId,
    mode,
    target,
    teams,
    players: buildPlayers(teams),
    rounds: [],
    ended: false,
    winnerId: null,
  }
}

export function initialState() {
  return null
}

export function matchReducer(state, action) {
  switch (action.type) {
    case 'START_MATCH': {
      return createMatch(action.payload)
    }
    case 'ADD_ROUND': {
      if (!state) return state
      const round = {
        id: crypto.randomUUID(),
        scores: { ...action.payload.scores },
        dealerId: action.payload.dealerId,
      }
      return { ...state, rounds: [...state.rounds, round] }
    }
    case 'UNDO_ROUND': {
      if (!state) return state
      return { ...state, rounds: state.rounds.slice(0, -1) }
    }
    case 'END_MATCH': {
      if (!state) return state
      const totals = computeTotals(state.teams, state.rounds)
      const winnerId =
        action.payload?.winnerId ??
        findWinner(state.teams, totals, state.target)?.id ??
        null
      return { ...state, ended: true, winnerId }
    }
    case 'RESET': {
      return null
    }
    default:
      return state
  }
}

export function useMatch() {
  return useReducer(matchReducer, undefined, initialState)
}