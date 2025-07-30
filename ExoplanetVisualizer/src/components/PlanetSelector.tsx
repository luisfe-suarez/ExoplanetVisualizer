import React from 'react'
import { getPlanetList, getPlanetData } from '../data/planets'

interface PlanetSelectorProps {
  planetId: number
  selectedPlanet: string
  onPlanetChange: (planetKey: string) => void
}

const PlanetSelector: React.FC<PlanetSelectorProps> = ({
  planetId,
  selectedPlanet,
  onPlanetChange
}) => {
  const planetList = getPlanetList()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onPlanetChange(event.target.value)
  }

  const selectedPlanetData = selectedPlanet ? getPlanetData(selectedPlanet) : null

  return (
    <div className="planet-selector">
      <label htmlFor={`planet-${planetId}`}>
        Planet {planetId}
      </label>
      
      <select
        id={`planet-${planetId}`}
        value={selectedPlanet}
        onChange={handleChange}
      >
        <option value="">Select a planet...</option>
        {planetList.map((planetKey) => {
          const planetData = getPlanetData(planetKey)
          return (
            <option key={planetKey} value={planetKey}>
              {planetData?.name}
            </option>
          )
        })}
      </select>

      {selectedPlanetData && (
        <div className="planet-info">
          <h4>{selectedPlanetData.name}</h4>
          <div className="planet-details">
            <div className="detail-item">
              <span className="detail-label">Planet Radius:</span>
              <span className="detail-value">{selectedPlanetData.radiusPlanet.toFixed(2)} R⊕</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Star Radius:</span>
              <span className="detail-value">{selectedPlanetData.radiusStar.toFixed(2)} R☉</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Period:</span>
              <span className="detail-value">{selectedPlanetData.period.toFixed(2)} days</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Distance:</span>
              <span className="detail-value">{selectedPlanetData.semiMajorAxis.toFixed(3)} AU</span>
            </div>
          </div>
          {selectedPlanetData.description && (
            <p className="planet-description">{selectedPlanetData.description}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default PlanetSelector
