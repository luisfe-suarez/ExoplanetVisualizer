import React, { useRef, useEffect } from 'react'
import { getPlanetData } from '../data/planets'
import { generateLightCurve } from '../utils/transitMathSimple'

interface LightCurvePlotProps {
  planet1: string
  planet2: string
  currentTime: number
  overlayMode: boolean
}

const LightCurvePlot: React.FC<LightCurvePlotProps> = ({
  planet1,
  planet2,
  currentTime,
  overlayMode
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
    const planetData1 = planet1 ? getPlanetData(planet1) : null
    const planetData2 = planet2 ? getPlanetData(planet2) : null
    
    if (!planetData1 && !planetData2) {
      // Show placeholder text
      ctx.fillStyle = '#666'
      ctx.font = '16px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('Select planets to see light curves', rect.width / 2, rect.height / 2)
      return
    }
    
    // Plot settings
    const padding = 40
    const plotWidth = rect.width - 2 * padding
    const plotHeight = rect.height - 2 * padding
    const plotX = padding
    const plotY = padding
    
    // Time range - extreme zoom for maximum transit detail
    const maxPeriod = Math.max(
      planetData1?.period || 0,
      planetData2?.period || 0
    )
    const timeRange = Math.max(1, maxPeriod * 0.1) // Show only 10% of a period for extreme detail
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
    
    // Calculate appropriate flux range based on actual transit depths
    let fluxMin = 1.0
    let fluxMax = 1.0
    
    if (planetData1 || planetData2) {
      // Find the deepest transit to set appropriate Y-axis range
      const depths = []
      if (planetData1) {
        depths.push(Math.pow(planetData1.radiusPlanet / planetData1.radiusStar, 2))
      }
      if (planetData2) {
        depths.push(Math.pow(planetData2.radiusPlanet / planetData2.radiusStar, 2))
      }
      
      const maxDepth = Math.max(...depths)
      // Set flux range to show transits clearly with some margin
      fluxMin = 1.0 - (maxDepth * 1.5) // 50% extra space below deepest transit
      fluxMax = 1.0 + (maxDepth * 0.2)  // Small margin above 1.0
      
      // Ensure minimum visible range
      if ((fluxMax - fluxMin) < 0.01) {
        const center = (fluxMin + fluxMax) / 2
        fluxMin = center - 0.005
        fluxMax = center + 0.005
      }
    }
    
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
    
    // Plot function with support for side-by-side mode
    const plotFluxCurve = (planetData: any, color: string, label: string, plotOffset: number = 0, plotHeightScale: number = 1) => {
      const lightCurve = generateLightCurve(planetData, startTime, endTime, 0.01)
      
      const adjustedPlotHeight = plotHeight * plotHeightScale
      const adjustedPlotY = plotY + plotOffset
      
      // Draw the curve
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.beginPath()
      
      let firstPoint = true
      lightCurve.forEach((point) => {
        const x = plotX + ((point.time - startTime) / timeRange) * plotWidth
        // Scale flux to show transit dips clearly
        const normalizedFlux = (point.flux - fluxMin) / (fluxMax - fluxMin)
        const y = adjustedPlotY + adjustedPlotHeight - (normalizedFlux * adjustedPlotHeight)
        
        if (firstPoint) {
          ctx.moveTo(x, y)
          firstPoint = false
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.stroke()
      
      // Draw legend
      const legendY = adjustedPlotY + 20
      ctx.fillStyle = color
      ctx.fillRect(plotX + plotWidth - 150, legendY - 5, 20, 2)
      ctx.fillText(label, plotX + plotWidth - 120, legendY)
    }
    
    // Plot light curves based on mode
    if (overlayMode) {
      // Overlay mode: both curves on same plot
      if (planetData1) {
        plotFluxCurve(planetData1, '#64b5f6', planetData1.name)
      }
      if (planetData2) {
        plotFluxCurve(planetData2, '#ff6b6b', planetData2.name)
      }
    } else {
      // Side-by-side mode: split the plot vertically
      if (planetData1) {
        plotFluxCurve(planetData1, '#64b5f6', planetData1.name, 0, 0.4)
      }
      if (planetData2) {
        plotFluxCurve(planetData2, '#ff6b6b', planetData2.name, plotHeight / 2 + 10, 0.4)
      }
      
      // Draw dividing line for side-by-side mode
      if (planetData1 && planetData2) {
        ctx.strokeStyle = '#333'
        ctx.lineWidth = 1
        ctx.setLineDash([2, 2])
        ctx.beginPath()
        ctx.moveTo(plotX, plotY + plotHeight / 2)
        ctx.lineTo(plotX + plotWidth, plotY + plotHeight / 2)
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
    
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
    
  }, [planet1, planet2, currentTime, overlayMode])
  
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
