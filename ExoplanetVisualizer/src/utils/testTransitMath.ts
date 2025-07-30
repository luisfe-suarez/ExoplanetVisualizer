import { calculateTransit, generateLightCurve, getTransitDuration } from './transitMath'
import { getPlanetData } from '../data/planets'

// Test the math with HD 209458b (well-known exoplanet)
export function testTransitMath() {
  const planet = getPlanetData('hd-209458b')
  if (!planet) {
    console.error('Planet not found')
    return
  }

  console.log('=== Testing Transit Math for HD 209458b ===')
  console.log('Planet data:', planet)
  
  // Test transit duration
  const duration = getTransitDuration(planet)
  console.log(`Transit duration: ${duration.toFixed(4)} days (${(duration * 24).toFixed(2)} hours)`)
  
  // Test a few specific times
  console.log('\n=== Transit calculations at specific times ===')
  for (let time = 0; time < planet.period; time += planet.period / 8) {
    const transit = calculateTransit(planet, time)
    console.log(`Time: ${time.toFixed(2)}d, Flux: ${transit.flux.toFixed(4)}, Transit: ${transit.isTransiting}`)
  }
  
  // Generate a light curve for one period
  console.log('\n=== Light curve generation ===')
  const lightCurve = generateLightCurve(planet, 0, planet.period, 0.1)
  const transitPoints = lightCurve.filter(point => point.isTransiting)
  console.log(`Generated ${lightCurve.length} points, ${transitPoints.length} in transit`)
  
  // Find minimum flux (deepest transit)
  const minFlux = Math.min(...lightCurve.map(p => p.flux))
  console.log(`Minimum flux: ${minFlux.toFixed(4)} (transit depth: ${(1 - minFlux).toFixed(4)})`)
  
  return lightCurve
}

// Test with multiple planets
export function compareTransits() {
  const planets = ['hd-209458b', 'kepler-10b', 'kepler-7b']
  
  console.log('\n=== Comparing Transits ===')
  planets.forEach(planetKey => {
    const planet = getPlanetData(planetKey)
    if (planet) {
      const duration = getTransitDuration(planet)
      const transitDepth = Math.pow(planet.radiusPlanet / planet.radiusStar, 2)
      console.log(`${planet.name}:`)
      console.log(`  Period: ${planet.period.toFixed(2)}d`)
      console.log(`  Transit duration: ${(duration * 24).toFixed(2)}h`)
      console.log(`  Transit depth: ${(transitDepth * 100).toFixed(3)}%`)
      console.log()
    }
  })
}
