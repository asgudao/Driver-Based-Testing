/**
 * Shared radar / spider-chart renderer for Earth Online.
 * Used by ResultPage and ProfilePage so the visual language stays identical
 * across the product and the drawing logic lives in one place.
 *
 * Visual language:
 *  - deep-space translucent backdrop
 *  - glowing concentric grid rings
 *  - faint radial axis lines
 *  - gradient-filled data polygon with an outer glow
 *  - glowing vertex dots
 */

export interface RadarOptions {
  /** Override the normalisation ceiling. Defaults to max(raw + 1). */
  maxScore?: number
}

export function drawRadar(
  canvas: HTMLCanvasElement,
  labels: { name: string }[],
  rawScores: number[],
  options: RadarOptions = {}
): void {
  const ctx = canvas.getContext('2d')
  if (!ctx || labels.length === 0) return

  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return

  canvas.width = rect.width * dpr
  canvas.height = rect.height * dpr
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, rect.width, rect.height)

  const centerX = rect.width / 2
  const centerY = rect.height / 2
  const size = Math.min(rect.width, rect.height)
  const isSmallScreen = rect.width < 480
  const radius = size * (isSmallScreen ? 0.27 : 0.34)

  // Normalise: +1 keeps a zero score slightly above the centre (matches legacy).
  const scores = rawScores.map((s) => s + 1)
  const maxScore = options.maxScore ?? Math.max(...scores, 1)

  const count = labels.length
  const angleStep = (Math.PI * 2) / count

  // ── Concentric grid rings (Signal Cyan, glowing) ──
  for (let level = 5; level >= 1; level--) {
    const levelRadius = (radius / 5) * level
    ctx.beginPath()
    for (let i = 0; i < count; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + levelRadius * Math.cos(angle)
      const y = centerY + levelRadius * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = `rgba(52, 227, 230, ${0.04 + level * 0.03})`
    ctx.lineWidth = 1
    ctx.shadowColor = 'rgba(52, 227, 230, 0.3)'
    ctx.shadowBlur = level === 5 ? 8 : 0
    ctx.stroke()
    ctx.shadowBlur = 0
  }

  // ── Radial axis lines ──
  ctx.strokeStyle = 'rgba(52, 227, 230, 0.13)'
  ctx.lineWidth = 1
  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(x, y)
    ctx.stroke()
  }

  // ── Axis labels ──
  ctx.fillStyle = '#9fd9dc'
  const labelFontSize = rect.width < 480 ? '12px' : '13px'
  ctx.font = `500 ${labelFontSize} "Noto Sans SC", sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const labelRadius = radius + (isSmallScreen ? 30 : 38)
  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2
    const textWidth = ctx.measureText(labels[i].name).width
    const halfW = textWidth / 2 + 6
    let x = centerX + labelRadius * Math.cos(angle)
    let y = centerY + labelRadius * Math.sin(angle)

    if (x - halfW < 0) x = halfW
    if (x + halfW > rect.width) x = rect.width - halfW
    if (y - 12 < 0) y = 12
    if (y + 12 > rect.height) y = rect.height - 12

    ctx.fillText(labels[i].name, x, y)
  }

  // ── Data polygon ──
  ctx.beginPath()
  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2
    const normalized = (scores[i] / maxScore) * radius
    const x = centerX + normalized * Math.cos(angle)
    const y = centerY + normalized * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()

  const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius)
  gradient.addColorStop(0, 'rgba(52, 227, 230, 0.5)')
  gradient.addColorStop(0.6, 'rgba(14, 138, 153, 0.28)')
  gradient.addColorStop(1, 'rgba(52, 227, 230, 0.08)')
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.shadowColor = 'rgba(52, 227, 230, 0.7)'
  ctx.shadowBlur = 14
  ctx.strokeStyle = '#7fe9ec'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.shadowBlur = 0

  // ── Vertex dots ──
  for (let i = 0; i < count; i++) {
    const angle = i * angleStep - Math.PI / 2
    const normalized = (scores[i] / maxScore) * radius
    const x = centerX + normalized * Math.cos(angle)
    const y = centerY + normalized * Math.sin(angle)

    ctx.beginPath()
    ctx.arc(x, y, 3.5, 0, Math.PI * 2)
    ctx.fillStyle = '#d6fbFc'
    ctx.shadowColor = 'rgba(52, 227, 230, 0.9)'
    ctx.shadowBlur = 8
    ctx.fill()
    ctx.shadowBlur = 0
  }
}
