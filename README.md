# Exoplanet Transit Visualizer

Visualization tool of Transit Method, a common method for Exoplanet discovert. The simulation models the change in brigthness of a star over time, as an orbiting planet passes in front of it.

## What is the Transit Method?

The **transit method** detects exoplanets by observing periodic dips in the brightness of a star. These dips occur when a planet passes (“transits”) in front of its host star, blocking a small fraction of the starlight. Similar to the decrease in brightness of a light bulb when an object covers it

For a transit to occur:

- The planet’s **orbital plane** must be nearly edge-on (inclination ~ 90°) from our perspective.
- The **light curve** of the star will show a small, temporary drop in brightness.

## Physics & Math Behind the Simulation

This project simplifies the transit detection problem using basic orbital mechanics and geometry.

### 1. Orbital Position Calculation

I decided to assume a circular orbit (look at pylightcurve repo for more detailed orbits) and calculate the planet’s position using:

`ω = 2π / P (angular velocity)`

`θ = ω × t (orbital angle)`

`x = a × cos(θ) (x-axis position)`

`y = a × sin(θ) (y-axis position)`

Where:

- `P`: Orbital period (in days)
- `a`: Semi-major axis (in AU)
- `t`: Time (in days)
- `θ`: Orbital angle (in radians)

### 2. Transit Detection

A transit is assumed to occur when the planet is between 80° and 100° in orbital angle (i.e., near the line of sight). The decision to include a treshold is to simplify possible mathematical errors and to more easily update the curve in real time.

Transit occurs if |θ(deg) − 90°| < transit window

### 3. Flux Drop Calculation

When a transit occurs, I model the star’s brightness drop based on the relative sizes of the planet and star. Normal m:

`Transit Depth = (Rp / Rs)^2`

Where:

- `Rp`: Planet radius
- `Rs`: Star radius

I ran into some errors due to scaling of the planets and the actual dip in flux so I decided to use cosine interpolation to give more of a "u-shaped" curve instead of a sharp decrease that produced a "v-shaped" curve.

`Flux = 1 − Transit Depth × (cos(π × n) + 1) / 2`

Where `n` is the normalized distance from the transit center (`n = 0` at center, `n = 1` at edges).

### 4. Real-World Scaling

As I mentioned before, the light curves made no sense when I was using actual radii sizes from the planets, so I converted planet and star sizes into astronomical units (AU) using:

- 1 AU = 149,597,870.7 km
- Planet radius in Earth radii
- Star radius in Solar radii

## Key Functions

`calculateSimpleTransit()` Determines position, orbital angle, and flux at a given time

`generateLightCurve()` Generates flux data over a range of times 

`getScaleInfo()` Converts planet/star radii to AU and KM for display and understanding

## Built With

- TypeScript
- React (frontend)
- Real exoplanet data from https://exoplanetarchive.ipac.caltech.edu/

## 📈 Future Enhancements

- Compare multiple planets side by side
- Simulate partial or grazing transits
- Add realistic star limb darkening
- Integrate real exoplanet/star data
- Animate planet orbits in 2D

## Educational Purpose

This project is designed for educational use to help students:

- Understand orbital geometry
- Learn how light curves reveal exoplanets
- Explore simplified transit modeling and data visualization

AST010 Wanderers in Space - Prof. Jana Grcevich
Tufts University
