import { useState, useEffect } from 'react'
import PlanetSelector from './components/PlanetSelector'
import Controls from './components/Controls'
import OrbitVisualizer from './components/OrbitVisualizer'
import LightCurvePlot from './components/LightCurvePlot'

interface SimulationState {
  isPlaying: boolean
  currentTime: number
  speed: number
}

function App() {
  const [selectedPlanet1, setSelectedPlanet1] = useState<string>('')
  const [selectedPlanet2, setSelectedPlanet2] = useState<string>('')
  const [simulationState, setSimulationState] = useState<SimulationState>({
    isPlaying: false,
    currentTime: 0,
    speed: 1
  })

  // Automatic time progression when playing
  useEffect(() => {
    if (!simulationState.isPlaying) return

    const interval = setInterval(() => {
      setSimulationState(prevState => ({
        ...prevState,
        currentTime: prevState.currentTime + (prevState.speed * 0.1) // 0.1 days per tick
      }))
    }, 50) // 20 FPS for smooth animation

    return () => clearInterval(interval)
  }, [simulationState.isPlaying, simulationState.speed])

  return (
    <div className="container">
      <header className="app-header">
        <h1 className="app-title">Exoplanet Transit Visualizer</h1>
        <p className="app-subtitle">
          Explore how planets block starlight during transits
        </p>
      </header>

      <section className="planet-selector-section">
        <PlanetSelector
          planetId={1}
          selectedPlanet={selectedPlanet1}
          onPlanetChange={setSelectedPlanet1}
        />
        <span className="vs-text">vs</span>
        <PlanetSelector
          planetId={2}
          selectedPlanet={selectedPlanet2}
          onPlanetChange={setSelectedPlanet2}
        />
      </section>

      <Controls
        simulationState={simulationState}
        onSimulationStateChange={setSimulationState}
      />

      <section className="visualization-section">
        <OrbitVisualizer
          selectedPlanet={selectedPlanet1}
          currentTime={simulationState.currentTime}
        />
        <OrbitVisualizer
          selectedPlanet={selectedPlanet2}
          currentTime={simulationState.currentTime}
        />
      </section>

      <section className="light-curve-section">
        <h2 className="light-curve-title">Light Curves</h2>
        <div className="light-curves-container">
          <div className="light-curve-plot">
            <h3>Planet 1</h3>
            <LightCurvePlot
              planet={selectedPlanet1}
              currentTime={simulationState.currentTime}
              title="Planet 1"
            />
          </div>
          <div className="light-curve-plot">
            <h3>Planet 2</h3>
            <LightCurvePlot
              planet={selectedPlanet2}
              currentTime={simulationState.currentTime}
              title="Planet 2"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default App
