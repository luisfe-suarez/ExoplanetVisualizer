import React from 'react'

interface SimulationState {
  isPlaying: boolean
  currentTime: number
  speed: number
}

interface ControlsProps {
  simulationState: SimulationState
  onSimulationStateChange: (state: SimulationState) => void
}

const Controls: React.FC<ControlsProps> = ({
  simulationState,
  onSimulationStateChange
}) => {
  const handlePlay = () => {
    onSimulationStateChange({
      ...simulationState,
      isPlaying: true
    })
  }

  const handlePause = () => {
    onSimulationStateChange({
      ...simulationState,
      isPlaying: false
    })
  }

  const handleReset = () => {
    onSimulationStateChange({
      ...simulationState,
      isPlaying: false,
      currentTime: 0
    })
  }

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSimulationStateChange({
      ...simulationState,
      currentTime: parseFloat(event.target.value)
    })
  }

  const handleTimeInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(event.target.value) || 0
    onSimulationStateChange({
      ...simulationState,
      currentTime: newTime
    })
  }

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSimulationStateChange({
      ...simulationState,
      speed: parseFloat(event.target.value)
    })
  }

  return (
    <section className="controls-section">
      <button 
        className="control-button" 
        onClick={handlePlay}
        disabled={simulationState.isPlaying}
      >
        Play
      </button>
      <button 
        className="control-button" 
        onClick={handlePause}
        disabled={!simulationState.isPlaying}
      >
        Pause
      </button>
      <button 
        className="control-button" 
        onClick={handleReset}
      >
        Reset
      </button>
      
      <div className="time-control">
        <label htmlFor="time-slider">Time:</label>
        <input
          id="time-slider"
          type="range"
          min="0"
          max="10"
          step="0.1"
          value={simulationState.currentTime}
          onChange={handleTimeChange}
          className="time-slider"
        />
        <span>{simulationState.currentTime.toFixed(1)}d</span>
      </div>

      <div className="time-input-control">
        <label htmlFor="time-input">Exact Time:</label>
        <input
          id="time-input"
          type="number"
          min="0"
          max="100"
          step="0.01"
          value={simulationState.currentTime.toFixed(2)}
          onChange={handleTimeInputChange}
          className="time-input"
        />
        <span>days</span>
      </div>

      <div className="speed-control">
        <label htmlFor="speed-input">Speed:</label>
        <input
          id="speed-input"
          type="range"
          min="0.1"
          max="10"
          step="0.1"
          value={simulationState.speed}
          onChange={handleSpeedChange}
          className="speed-slider"
        />
        <span>{simulationState.speed.toFixed(1)}x</span>
      </div>
    </section>
  )
}

export default Controls
