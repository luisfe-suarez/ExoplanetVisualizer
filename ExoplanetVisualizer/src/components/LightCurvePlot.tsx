import React, { useRef, useEffect } from 'react'
import { getPlanetData } from '../data/planets'
import { generateLightCurve } from '../utils/transitMathSimple'

interface LightCurvePlotProps {
  planet: string
  currentTime: number
  title?: string
}

const LightCurvePlot: React.FC<LightCurvePlotProps> = ({
  planet,
  currentTime,
  title
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * window.devicePixelRatio
    canvas.height = rect.height * window.devicePixelRatio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    
    // Clear canvas
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, rect.width, rect.height)
    
    // Get planet data
    const planetData = planet ? getPlanetData(planet) : null
    
    if (!planetData) {
      // Show placeholder text
      ctx.fillStyle = '#666'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Select a planet to see light curve', rect.width / 2, rect.height / 2)
      return
    }
    
    // Plot settings
    const padding = 40
    const plotWidth = rect.width - 2 * padding
    const plotHeight = rect.height - 2 * padding
    const plotX = padding
    const plotY = padding
    
    // Draw plot area with more detail and "zoomed-in" time range
    const timeRange = Math.max(0.5, planetData.period * 0.05) 
    const startTime = Math.max(0, currentTime - timeRange / 2)
    const endTime = startTime + timeRange
    
    // Draw axes
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.beginPath()
    // X-axis
    ctx.moveTo(plotX, plotY + plotHeight)
    ctx.lineTo(plotX + plotWidth, plotY + plotHeight)
    // Y-axis
    ctx.moveTo(plotX, plotY)
    ctx.lineTo(plotX, plotY + plotHeight)
    ctx.stroke()
    
    // Draw axis labels
    ctx.fillStyle = '#888'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('Time (days)', plotX + plotWidth / 2, rect.height - 10)
    
    ctx.save()
    ctx.translate(15, plotY + plotHeight / 2)
    ctx.rotate(-Math.PI / 2)
    ctx.fillText('Relative Flux', 0, 0)
    ctx.restore()
    
    // Draw time labels
    ctx.textAlign = 'center'
    for (let i = 0; i <= 5; i++) {
      const time = startTime + (i / 5) * timeRange
      const x = plotX + (i / 5) * plotWidth
      ctx.fillText(time.toFixed(1), x, rect.height - 20)
    }
    
    // Calculate appropriate flux range based on transit depth
    const transitDepth = Math.pow(planetData.radiusPlanet / planetData.radiusStar, 2)
    // Set flux range to show transits clearly with some margin
    const fluxMin = 1.0 - (transitDepth * 1.5) // 50% extra space below transit
    const fluxMax = 1.0 + (transitDepth * 0.2)  // Small margin above 1.0
    
    // Draw flux labels with dynamic range
    ctx.textAlign = 'right'
    for (let i = 0; i <= 4; i++) {
      const flux = fluxMin + (i / 4) * (fluxMax - fluxMin)
      const y = plotY + plotHeight - (i / 4) * plotHeight
      ctx.fillText(flux.toFixed(4), plotX - 10, y + 3)
    }
    
    // Show flux range info for debugging
    ctx.fillStyle = '#888'
    ctx.font = '10px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(`Y-axis: ${fluxMin.toFixed(4)} to ${fluxMax.toFixed(4)}`, plotX, plotY - 5)
    
    // Plot single planet light curve
    const lightCurve = generateLightCurve(planetData, startTime, endTime, 0.01)
    
    // Draw the curve
    ctx.strokeStyle = '#64b5f6'
    ctx.lineWidth = 2
    ctx.beginPath()
    
    let firstPoint = true
    lightCurve.forEach((point) => {
      const x = plotX + ((point.time - startTime) / timeRange) * plotWidth
      // Scale flux to show transit dips clearly
      const normalizedFlux = (point.flux - fluxMin) / (fluxMax - fluxMin)
      const y = plotY + plotHeight - (normalizedFlux * plotHeight)
      
      if (firstPoint) {
        ctx.moveTo(x, y)
        firstPoint = false
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.stroke()
    
    // Draw legend
    ctx.fillStyle = '#64b5f6'
    ctx.fillRect(plotX + plotWidth - 150, plotY + 20 - 5, 20, 2)
    ctx.fillText(title || planetData.name, plotX + plotWidth - 120, plotY + 20)
    
    // Draw current time indicator
    const currentX = plotX + ((currentTime - startTime) / timeRange) * plotWidth
    if (currentX >= plotX && currentX <= plotX + plotWidth) {
      ctx.strokeStyle = '#ffaa00'
      ctx.lineWidth = 2
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      ctx.moveTo(currentX, plotY)
      ctx.lineTo(currentX, plotY + plotHeight)
      ctx.stroke()
      ctx.setLineDash([])
      
      // Current time label
      ctx.fillStyle = '#ffaa00'
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(`t=${currentTime.toFixed(2)}d`, currentX, plotY - 10)
    }
    
  }, [planet, currentTime])
  
  return (
    <div className="light-curve-canvas">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}

export default LightCurvePlot
