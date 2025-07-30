import React from 'react'
import { getPlanetData } from '../data/planets'
import { calculateSimpleTransit, getScaleInfo } from '../utils/transitMathSimple'

interface OrbitVisualizerProps {
  selectedPlanet: string
  currentTime: number
}

const OrbitVisualizer: React.FC<OrbitVisualizerProps> = ({
  selectedPlanet,
  currentTime
}) => {
  // Get planet data and calculate current state
  const planetData = selectedPlanet ? getPlanetData(selectedPlanet) : null
  
  let transitInfo = null
  let scaleInfo = null
  
  if (planetData) {
    transitInfo = calculateSimpleTransit(planetData, currentTime)
    scaleInfo = getScaleInfo(planetData)
  }
  
  return (
    <div className="orbit-visualizer">
      <h3 className="orbit-title">
        {selectedPlanet ? getPlanetData(selectedPlanet)?.name : 'Select a planet'}
      </h3>
      <div className="orbit-canvas">
        {planetData && transitInfo && scaleInfo ? (
          <div style={{ padding: '20px', color: '#ccc', fontSize: '0.9rem' }}>
            <div><strong>Time:</strong> {currentTime.toFixed(2)} days</div>
            <div><strong>Position:</strong> x={transitInfo.position.x.toFixed(4)} AU, y={transitInfo.position.y.toFixed(4)} AU</div>
            <div><strong>Angle:</strong> {transitInfo.angle.toFixed(1)}°</div>
            <div><strong>Flux:</strong> {transitInfo.flux.toFixed(6)}</div>
            <div><strong>Transit:</strong> {transitInfo.isTransiting ? '🌑 YES' : '⭐ NO'}</div>
            
            {/* SCALE CALCULATIONS */}
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#3a1a1a', borderRadius: '6px', fontSize: '0.75rem' }}>
              <div style={{ color: '#ff6b6b', marginBottom: '5px' }}><strong>🔍 ACTUAL SCALE:</strong></div>
              <div>Star radius: {scaleInfo.starRadiusKM.toLocaleString()} km = {scaleInfo.starRadiusAU.toFixed(8)} AU</div>
              <div>Planet radius: {scaleInfo.planetRadiusKM.toLocaleString()} km = {scaleInfo.planetRadiusAU.toFixed(8)} AU</div>
              <div>Orbit radius: {scaleInfo.orbitRadiusAU.toFixed(3)} AU</div>
              <div style={{ color: '#ffaa00', marginTop: '5px' }}>
                <strong>Scale problem:</strong> Orbit is {scaleInfo.scaleRatio.toFixed(0)}x larger than combined radii!
              </div>
              <div style={{ color: '#64b5f6', marginTop: '5px' }}>
                <strong>Solution:</strong> Using angle-based transit detection (±10° around 90°)
              </div>
            </div>
            
            {/* SIMPLE TRANSIT HINTS */}
            <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#2a2a2a', borderRadius: '6px', fontSize: '0.8rem' }}>
              <div style={{ color: '#64b5f6', marginBottom: '5px' }}><strong>🎯 Simple Transit Rules:</strong></div>
              <div>Transit occurs: <strong>80° - 100°</strong> (±10° around 90°)</div>
              <div>Try angles: <strong>90°, 450°, 810°</strong> (90° + 360°n)</div>
              <div>Period: <strong>{planetData.period.toFixed(2)} days</strong></div>
              <div>Transit depth: <strong>{(Math.pow(planetData.radiusPlanet / planetData.radiusStar, 2) * 100).toFixed(3)}%</strong></div>
            </div>
            
            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#888' }}>
              Rp/Rs: {(planetData.radiusPlanet/planetData.radiusStar).toFixed(3)} | 
              Expected flux drop: {(Math.pow(planetData.radiusPlanet / planetData.radiusStar, 2) * 100).toFixed(3)}%
            </div>
          </div>
        ) : (
          <p style={{ padding: '20px', color: '#666' }}>
            Select a planet to see orbit calculations
          </p>
        )}
      </div>
    </div>
  )
}

export default OrbitVisualizer
