export interface PlanetData {
  name: string
  radiusPlanet: number   // Earth radii
  radiusStar: number     // Solar radii
  period: number         // Days
  semiMajorAxis: number  // AU
  description?: string
}

export const planetData: Record<string, PlanetData> = {
  "kepler-10b": {
    name: "Kepler-10b",
    radiusPlanet: 1.47,
    radiusStar: 1.0,
    period: 0.837,
    semiMajorAxis: 0.017,
    description: "A rocky super-Earth with an extremely short period"
  },
  "hd-209458b": {
    name: "HD 209458b",
    radiusPlanet: 1.38,
    radiusStar: 1.2,
    period: 3.5247,
    semiMajorAxis: 0.047,
    description: "The first exoplanet discovered via transit method"
  },
  "kepler-7b": {
    name: "Kepler-7b",
    radiusPlanet: 1.48,
    radiusStar: 1.84,
    period: 4.886,
    semiMajorAxis: 0.06,
    description: "A hot Jupiter with very low density"
  },
  "wasp-96b": {
    name: "WASP-96b",
    radiusPlanet: 1.2,
    radiusStar: 1.06,
    period: 3.43,
    semiMajorAxis: 0.045,
    description: "A hot Jupiter observed by James Webb Space Telescope"
  },
  "tres-2b": {
    name: "TrES-2b",
    radiusPlanet: 1.27,
    radiusStar: 0.98,
    period: 2.47,
    semiMajorAxis: 0.036,
    description: "The darkest known exoplanet, reflecting less than 1% of light"
  },
  "gj-1214b": {
    name: "GJ 1214b",
    radiusPlanet: 2.68,
    radiusStar: 0.21,
    period: 1.58,
    semiMajorAxis: 0.014,
    description: "A super-Earth around a red dwarf star"
  }
}

export const getPlanetList = (): string[] => {
  return Object.keys(planetData)
}

export const getPlanetData = (planetKey: string): PlanetData | null => {
  return planetData[planetKey] || null
}
