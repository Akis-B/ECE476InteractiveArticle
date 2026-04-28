import { useRef, useEffect, useCallback } from 'react'

const SQ    = 7   // square size in px
const GAP   = 2   // gap between squares
const PITCH = SQ + GAP

// Weighted toward the same accent blue that's used throughout the article
const PALETTE = [
  '#1D2CF3', '#1D2CF3', '#1D2CF3', '#1D2CF3',
  '#082060', '#082060',
  '#6B7280',
  '#B10000',
]
const INACTIVE = '#E8E4DA'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// progressRef: a ref whose .current holds a 0–1 scroll progress value.
// The component polls it via rAF so scroll events stay off the render path.
export default function SideMatrix({ progressRef }) {
  const canvasRef      = useRef(null)
  const gridRef        = useRef(null)
  const rafRef         = useRef(null)
  const lastProgressRef = useRef(-1)

  const setup = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return
    const w   = parent.offsetWidth
    const h   = parent.offsetHeight
    if (w === 0 || h === 0) return

    const dpr = window.devicePixelRatio || 1
    canvas.width  = w * dpr
    canvas.height = h * dpr
    canvas.style.width  = w + 'px'
    canvas.style.height = h + 'px'
    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)

    const cols  = Math.floor(w / PITCH)
    const rows  = Math.floor(h / PITCH)
    const total = cols * rows

    const order  = shuffle(Array.from({ length: total }, (_, i) => i))
    const ranks  = new Uint32Array(total)
    order.forEach((sq, step) => { ranks[sq] = step })
    const colors = Array.from({ length: total }, () =>
      PALETTE[Math.floor(Math.random() * PALETTE.length)]
    )

    gridRef.current       = { cols, rows, total, ranks, colors, w, h }
    lastProgressRef.current = -1
  }, [])

  const drawFrame = useCallback(() => {
    const progress = progressRef.current ?? 0
    const grid     = gridRef.current

    if (grid && Math.abs(progress - lastProgressRef.current) >= 0.001) {
      lastProgressRef.current = progress
      const { cols, total, ranks, colors, w, h } = grid
      const canvas = canvasRef.current
      if (canvas) {
        const ctx         = canvas.getContext('2d')
        const activeCount = Math.floor(progress * total)
        ctx.clearRect(0, 0, w, h)
        for (let i = 0; i < total; i++) {
          const col = i % cols
          const row = Math.floor(i / cols)
          ctx.fillStyle = ranks[i] < activeCount ? colors[i] : INACTIVE
          ctx.globalAlpha = ranks[i] < activeCount ? 0.9 : 1
          ctx.fillRect(col * PITCH, row * PITCH, SQ, SQ)
        }
        ctx.globalAlpha = 1
      }
    }

    rafRef.current = requestAnimationFrame(drawFrame)
  }, [progressRef])

  useEffect(() => {
    setup()

    const ro = new ResizeObserver(() => { setup() })
    const parent = canvasRef.current?.parentElement
    if (parent) ro.observe(parent)

    rafRef.current = requestAnimationFrame(drawFrame)
    return () => {
      ro.disconnect()
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [setup, drawFrame])

  return (
    <canvas
      ref={canvasRef}
      style={{ display: 'block', position: 'absolute', inset: 0 }}
    />
  )
}
