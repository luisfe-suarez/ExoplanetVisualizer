import type { PlanetData } from '../data/planets'

export interface SimpleTransitData {
  isTransiting: boolean
  flux: number
  angle: number
  position: { x: number; y: number }
}

/**
 * Completely simplified transit calculation for educational purposes
 * We'll ignore the tiny real radii and just use the orbital geometry
 */
export function calculateSimpleTransit(
  planetData: PlanetData,
  timeInDays: number
): SimpleTransitData {
  // Calculate orbital angle (start at 0 degrees at time 0)
  const angularVelocity = (2 * Math.PI) / planetData.period // radians per day
  const angle = angularVelocity * timeInDays
  
  // Calculate position (circular orbit)
  const x = planetData.semiMajorAxis * Math.cos(angle)
  const y = planetData.semiMajorAxis * Math.sin(angle)
  
  // Simple transit logic: transit occurs when angle is near 90° or 270°
  // (when planet crosses in front of star from our viewpoint)
  const angleDegrees = (angle * 180 / Math.PI) % 360
  
  // Transit occurs in a narrow window around 90° (planet between us and star)
  const transitCenterAngle = 90
  const transitWidth = 10 // degrees on each side
  
  const angleFromTransit = Math.abs(angleDegrees - transitCenterAngle)
  const isTransiting = angleFromTransit <= transitWidth
  
  // Calculate flux drop during transit
  const transitDepth = Math.pow(planetData.radiusPlanet / planetData.radiusStar, 2)
  let flux = 1.0
  
  if (isTransiting) {
    // Create a smooth U-shaped transit curve using cosine interpolation
    const normalizedPosition = angleFromTransit / transitWidth // 0 at center, 1 at edges
    
    // Use cosine function for smooth U-shape: cos(π * normalizedPosition) 
    // This gives: 1 at center (normalizedPosition=0), -1 at edges (normalizedPosition=1)
    const cosineSmoothing = Math.cos(Math.PI * normalizedPosition)
    
    // Convert to transit fraction: 1 at center, 0 at edges
    const transitFraction = (cosineSmoothing + 1) / 2
    
    flux = 1 - (transitDepth * transitFraction)
  }
  
  return {
    isTransiting,
    flux,
    angle: angleDegrees,
    position: { x, y }
  }
}

/**
 * Debug info showing actual scale calculations
 */
export function getScaleInfo(planetData: PlanetData) {
  const EARTH_RADIUS_KM = 6371
  const SOLAR_RADIUS_KM = 695700
  const AU_TO_KM = 149597870.7
  
  const starRadiusAU = (planetData.radiusStar * SOLAR_RADIUS_KM) / AU_TO_KM
  const planetRadiusAU = (planetData.radiusPlanet * EARTH_RADIUS_KM) / AU_TO_KM
  const orbitRadiusAU = planetData.semiMajorAxis
  
  return {
    starRadiusAU,
    planetRadiusAU,
    orbitRadiusAU,
    starRadiusKM: planetData.radiusStar * SOLAR_RADIUS_KM,
    planetRadiusKM: planetData.radiusPlanet * EARTH_RADIUS_KM,
    scaleRatio: orbitRadiusAU / (starRadiusAU + planetRadiusAU)
  }
}

/**
 * Generate light curve data over a time range
 */
export function generateLightCurve(
  planetData: PlanetData,
  startTime: number,
  endTime: number,
  timeStep: number = 0.01
): Array<{ time: number; flux: number; isTransiting: boolean; angle: number }> {
  const lightCurve = []
  
  for (let time = startTime; time <= endTime; time += timeStep) {
    const transit = calculateSimpleTransit(planetData, time)
    lightCurve.push({
      time,
      flux: transit.flux,
      isTransiting: transit.isTransiting,
      angle: transit.angle
    })
  }
  
  return lightCurve
}
