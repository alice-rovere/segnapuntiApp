import { useMemo, useState } from 'react'
import { useMatch } from './hooks/useMatch'
import SetupScreen from './components/SetupScreen'
import GameScreen from './components/GameScreen'
import ResultScreen from './components/ResultScreen'

function App() {
  const [match, dispatch] = useMatch()
  const [lastSetup, setLastSetup] = useState(null)

  function handleStart(setup) {
    setLastSetup(setup)
    dispatch({ type: 'START_MATCH', payload: setup })
  }

  function handleRematch() {
    if (lastSetup) {
      dispatch({ type: 'START_MATCH', payload: lastSetup })
    }
  }

  const screen = useMemo(() => {
    if (!match) return 'setup'
    if (match.ended) return 'result'
    return 'game'
  }, [match])

  if (screen === 'setup') {
    return <SetupScreen onStart={handleStart} />
  }

  if (screen === 'result') {
    return (
      <ResultScreen match={match} onRematch={handleRematch} onNewSetup={() => dispatch({ type: 'RESET' })} />
    )
  }

  return <GameScreen match={match} dispatch={dispatch} />
}

export default App