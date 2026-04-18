import { useEffect, useRef, useCallback } from 'react'

const COLS     = 42
const GAP      = 2
const H_PAD    = 24
const V_PAD    = 16
const MAX_SPEED = 480  // px/s


function getTooltipText(status) {
  switch (status) {
    case 'no claim':     return 'There was no Claim for HRI to report this as discrimination'
    case 'inconclusive': return 'HRI could not determine if this was proper discrimination'
    case 'pending':      return 'This is classified as discrimination'
    default:             return null
  }
}

function computeMeta(rows, w, h) {
  const numRows      = Math.ceil(rows.length / COLS)
  const availW       = w - H_PAD * 2
  const availH       = h - V_PAD * 2 - 12
  const cellByWidth  = Math.floor((availW - GAP * (COLS - 1)) / COLS)
  const cellByHeight = Math.floor((availH + GAP) / numRows - GAP)
  const cellSize     = Math.max(4, Math.min(cellByWidth, cellByHeight))
  const dotRadius    = Math.max(2, Math.floor(cellSize * 0.26))

  const targets = rows.map((_, i) => ({
    x: H_PAD + (i % COLS) * (cellSize + GAP) + cellSize / 2,
    y: V_PAD + Math.floor(i / COLS) * (cellSize + GAP) + cellSize / 2,
  }))

  const spawnX = w - H_PAD
  const spawnY = h - V_PAD
  const spawns = rows.map(() => ({ x: spawnX, y: spawnY }))

  return { cellSize, dotRadius, targets, spawns, w, h }
}

export default function MatrixCanvas({ rows, drawRef }) {
  const canvasRef      = useRef(null)
  const metaRef        = useRef(null)
  const tooltipRef     = useRef(null)
  const tooltipAddrRef = useRef(null)
  const tooltipTextRef = useRef(null)

  // Velocity-capped animation state
  const targetARFRef = useRef(0)
  const posXRef      = useRef(null)
  const posYRef      = useRef(null)
  // 0 = pending, 1 = animating, 2 = placed
  const stateRef     = useRef(null)
  const rafRef       = useRef(null)
  const lastTRef     = useRef(null)

  const initAnimState = useCallback((count) => {
    posXRef.current  = new Float32Array(count)
    posYRef.current  = new Float32Array(count)
    stateRef.current = new Uint8Array(count)
  }, [])

  const animTick = useCallback((now) => {
    const meta = metaRef.current
    if (!meta) { rafRef.current = requestAnimationFrame(animTick); return }

    const delta   = lastTRef.current == null ? 0 : Math.min((now - lastTRef.current) / 1000, 0.1)
    lastTRef.current = now

    const { targets, spawns, dotRadius, w, h } = meta
    const maxStep  = MAX_SPEED * delta
    const targetARF = targetARFRef.current
    const total     = rows.length
    const activated = Math.floor(targetARF)
    const posX      = posXRef.current
    const posY      = posYRef.current
    const st        = stateRef.current
    if (!posX || !posY || !st) { rafRef.current = requestAnimationFrame(animTick); return }

    // Release newly activated dots
    for (let i = 0; i < Math.min(activated, total); i++) {
      if (st[i] === 0) {
        posX[i] = spawns[i].x
        posY[i] = spawns[i].y
        st[i]   = 1
      }
    }

    // Advance animating dots
    let anyMoving = false
    for (let i = 0; i < total; i++) {
      if (st[i] !== 1) continue
      anyMoving = true
      const tx = targets[i].x
      const ty = targets[i].y
      const dx = tx - posX[i]
      const dy = ty - posY[i]
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist <= maxStep || dist < 0.5) {
        posX[i] = tx
        posY[i] = ty
        st[i]   = 2
      } else {
        posX[i] += (dx / dist) * maxStep
        posY[i] += (dy / dist) * maxStep
      }
    }

    // Draw
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, w, h)
      let lastColor = null
      for (let i = 0; i < total; i++) {
        if (st[i] === 0) continue
        const color = st[i] === 2 ? rows[i].statusColor : '#BCBCBC'
        if (color !== lastColor) { ctx.fillStyle = color; lastColor = color }
        ctx.beginPath()
        ctx.arc(posX[i], posY[i], dotRadius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    rafRef.current = requestAnimationFrame(animTick)
  }, [rows])

  const setup = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !rows.length) return
    const w   = canvas.offsetWidth
    const h   = canvas.offsetHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width  = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    metaRef.current = computeMeta(rows, w, h)
    initAnimState(rows.length)
    // Re-place already-placed dots after resize
    const st   = stateRef.current
    const posX = posXRef.current
    const posY = posYRef.current
    const { targets } = metaRef.current
    for (let i = 0; i < rows.length; i++) {
      if (st[i] === 2) {
        posX[i] = targets[i].x
        posY[i] = targets[i].y
      } else if (st[i] === 1) {
        // re-spawn to new spawn positions
        posX[i] = metaRef.current.spawns[i].x
        posY[i] = metaRef.current.spawns[i].y
      }
    }
  }, [rows, initAnimState])

  // Exposed draw fn: just update targetARF
  const setTarget = useCallback((arf) => {
    targetARFRef.current = arf
  }, [])

  useEffect(() => { drawRef.current = setTarget }, [setTarget, drawRef])

  // Start/stop animation RAF
  useEffect(() => {
    lastTRef.current = null
    rafRef.current = requestAnimationFrame(animTick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [animTick])

  useEffect(() => {
    setup()
    const parent = canvasRef.current?.parentElement
    if (!parent) return
    let timer
    const ro = new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(setup, 50) })
    ro.observe(parent)
    return () => { ro.disconnect(); clearTimeout(timer) }
  }, [setup])

  const onMouseMove = useCallback((e) => {
    const meta = metaRef.current
    if (!meta) return
    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    const mx     = e.clientX - rect.left
    const my     = e.clientY - rect.top
    const { dotRadius, targets, w, h } = meta
    const hitR   = dotRadius + 6
    const st     = stateRef.current
    if (!st) return

    let found = false
    for (let i = rows.length - 1; i >= 0; i--) {
      if (st[i] !== 2) continue
      const dx = mx - targets[i].x
      const dy = my - targets[i].y
      if (dx * dx + dy * dy <= hitR * hitR) {
        const text = getTooltipText(rows[i].statusNormalized)
        if (!text) break
        const el   = tooltipRef.current
        const tipW = 210
        const tipH = 58
        let tx = mx + 14
        let ty = my - 28
        if (tx + tipW > w) tx = mx - tipW - 14
        if (ty < 0)         ty = 4
        if (ty + tipH > h)  ty = h - tipH - 4
        el.style.display    = 'block'
        el.style.left       = `${tx}px`
        el.style.top        = `${ty}px`
        tooltipAddrRef.current.textContent = rows[i].address
        tooltipTextRef.current.textContent = text
        found = true
        break
      }
    }
    if (!found && tooltipRef.current) tooltipRef.current.style.display = 'none'
  }, [rows])

  const onMouseLeave = useCallback(() => {
    if (tooltipRef.current) tooltipRef.current.style.display = 'none'
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', width: '100%', height: '100%', cursor: 'default' }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      />
      <div
        ref={tooltipRef}
        style={{
          display:       'none',
          position:      'absolute',
          pointerEvents: 'none',
          background:    '#fff',
          border:        '1px solid #e0e0e0',
          borderRadius:  '4px',
          padding:       '7px 11px',
          maxWidth:      '210px',
          boxShadow:     '0 2px 10px rgba(0,0,0,0.10)',
          zIndex:        20,
        }}
      >
        <div
          ref={tooltipAddrRef}
          style={{ fontSize: '9px', color: '#aaa', marginBottom: '3px', letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: 'system-ui, sans-serif' }}
        />
        <div
          ref={tooltipTextRef}
          style={{ fontSize: '11px', color: '#333', lineHeight: 1.4, fontFamily: "'Funnel Display', sans-serif" }}
        />
      </div>
    </div>
  )
}
