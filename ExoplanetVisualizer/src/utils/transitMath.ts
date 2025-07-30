import type { PlanetData } from '../data/planets'

// Constants
const EARTH_RADIUS_KM = 6371 // km
const SOLAR_RADIUS_KM = 695700 // km
const AU_TO_KM = 149597870.7 // km

export interface OrbitPosition {
  x: number // AU from star center
  y: number // AU from star center
  angle: number // radians
}

export interface TransitData {
  isTransiting: boolean
  flux: number // normalized flux (1 = no transit, <1 = in transit)
  transitDepth: number // maximum possible transit depth
  projectedDistance: number // projected distance from star center
}

/**
 * Calculate the angular velocity (radians per day) for a given orbital period
 */
export function getAngularVelocity(periodDays: number): number {
  return (2 * Math.PI) / periodDays
}

/**
 * Calculate the orbital position of a planet at a given time
 */
export function getOrbitPosition(
  semiMajorAxisAU: number,
  periodDays: number,
  timeInDays: number,
  phaseOffset: number = 0
): OrbitPosition {
  const omega = getAngularVelocity(periodDays)
  const angle = omega * timeInDays + phaseOffset
  
  // Circular orbit equations
  const x = semiMajorAxisAU * Math.cos(angle)
  const y = semiMajorAxisAU * Math.sin(angle)
  
  return { x, y, angle }
}

/**
 * Calculate transit properties at a given time
 * Educational version with scaling factor to make transits visible
 */
export function calculateTransit(
  planetData: PlanetData,
  timeInDays: number,
  phaseOffset: number = 0
): TransitData {
  // Get orbital position
  const position = getOrbitPosition(
    planetData.semiMajorAxis,
    planetData.period,
    timeInDays,
    phaseOffset
  )
  
  // Convert radii to AU
  const planetRadiusAU = (planetData.radiusPlanet * EARTH_RADIUS_KM) / AU_TO_KM
  const starRadiusAU = (planetData.radiusStar * SOLAR_RADIUS_KM) / AU_TO_KM
  
  // EDUCATIONAL SCALING: Make transits detectable by enlarging radii relative to orbit
  // Scale factor to make the combined radii about 1% of the orbital radius
  const orbitRadius = planetData.semiMajorAxis
  const realCombinedRadius = starRadiusAU + planetRadiusAU
  const scaleFactor = (orbitRadius * 0.01) / realCombinedRadius
  
  const scaledStarRadius = starRadiusAU * scaleFactor
  const scaledPlanetRadius = planetRadiusAU * scaleFactor
  
  // Impact parameter: distance from line of sight when planet crosses
  const impactParameter = Math.abs(position.y)
  
  // Transit occurs when:
  // 1. Planet is roughly crossing line of sight (small |x| relative to star size)
  // 2. Impact parameter allows for overlap
  const crossingMargin = scaledStarRadius * 2
  const isNearCrossing = Math.abs(position.x) <= crossingMargin
  const isOverlapping = impactParameter <= (scaledStarRadius + scaledPlanetRadius)
  const isTransiting = isNearCrossing && isOverlapping
  
  // Use real radii for transit depth calculation
  const transitDepth = Math.pow(planetData.radiusPlanet / planetData.radiusStar, 2)
  
  // Calculate flux
  let flux = 1.0
  if (isTransiting) {
    // Simple model: full transit depth when overlapping
    flux = 1 - transitDepth
  }
  
  return {
    isTransiting,
    flux,
    transitDepth,
    projectedDistance: impactParameter
  }
}

/**
 * Generate a light curve for a planet over a given time range
 */
export function generateLightCurve(
  planetData: PlanetData,
  startTime: number,
  endTime: number,
  timeStep: number = 0.01,
  phaseOffset: number = 0
): Array<{ time: number; flux: number; isTransiting: boolean }> {
  const lightCurve = []
  
  for (let time = startTime; time <= endTime; time += timeStep) {
    const transit = calculateTransit(planetData, time, phaseOffset)
    lightCurve.push({
      time,
      flux: transit.flux,
      isTransiting: transit.isTransiting
    })
  }
  
  return lightCurve
}

/**
 * Calculate the transit duration (in days) for a planet
 */
export function getTransitDuration(planetData: PlanetData): number {
  // Simplified calculation for circular orbits
  const starRadiusAU = (planetData.radiusStar * SOLAR_RADIUS_KM) / AU_TO_KM
  const planetRadiusAU = (planetData.radiusPlanet * EARTH_RADIUS_KM) / AU_TO_KM
  
  // Transit chord length
  const chordLength = 2 * (starRadiusAU + planetRadiusAU)
  
  // Orbital velocity at transit
  const orbitalVelocity = (2 * Math.PI * planetData.semiMajorAxis) / planetData.period
  
  // Transit duration
  return chordLength / orbitalVelocity
}

/**
 * Find the next transit time after a given time
 * Transit occurs when planet crosses in front of star (x ≈ 0, coming from positive x)
 */
export function getNextTransitTime(
  planetData: PlanetData,
  currentTime: number,
  phaseOffset: number = 0
): number {
  // For a circular orbit, transit occurs when x(t) = r*cos(ωt + φ) = 0
  // This happens when ωt + φ = π/2 + nπ (i.e., at 90° and 270°)
  // For an edge-on orbit viewed from Earth, we typically see transit at 270° (3π/2)
  
  const omega = getAngularVelocity(planetData.period)
  const currentAngle = (omega * currentTime + phaseOffset) % (2 * Math.PI)
  
  // Transit angle - planet crossing in front of star
  const transitAngle = Math.PI / 2 // 90 degrees - planet between observer and star
  
  let angleUntilTransit = transitAngle - currentAngle
  if (angleUntilTransit <= 0) {
    angleUntilTransit += 2 * Math.PI
  }
  
  return currentTime + (angleUntilTransit / omega)
}

/**
 * Get a default phase offset that puts the planet in a good position for viewing transits
 */
export function getTransitPhaseOffset(): number {
  // Offset so that at time t=0, we're approaching a transit
  // Transit occurs at angle = π/2, so let's start a bit before that
  return Math.PI / 4 // Start 45 degrees before transit (at 45°, transit at 90°)
}
