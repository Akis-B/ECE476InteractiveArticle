import { useRef, useState, useEffect } from 'react'
import MatrixCanvas from './MatrixCanvas'
import TranscriptWindow from './TranscriptWindow'
import ArticleNarrative from './ArticleNarrative'
import BottomProgressBar from './BottomProgressBar'

const TOTAL_ROWS = 1313

export default function ScrollExperience({ rows }) {
  const containerRef = useRef(null)
  const [activeRowIndex, setActiveRowIndex] = useState(0)

  const canvasDrawRef      = useRef(null)
  const progressBarFillRef = useRef(null)
  const boxUpdateRef       = useRef(null)

  useEffect(() => {
    let rafId      = null
    let lastARF    = -1
    let lastRowIndex = -1

    const tick = () => {
      const container = containerRef.current
      if (container) {
        const rect      = container.getBoundingClientRect()
        const maxScroll = container.offsetHeight - window.innerHeight
        const scrolled  = Math.max(0, -rect.top)
        const progress  = Math.max(0, Math.min(1, scrolled / maxScroll))
        const arf       = progress * TOTAL_ROWS

        if (Math.abs(arf - lastARF) > 0.0005) {
          lastARF = arf

          canvasDrawRef.current?.(arf)

          if (progressBarFillRef.current) {
            progressBarFillRef.current.style.width = `${progress * 100}%`
          }

          boxUpdateRef.current?.(progress)

          const rowIndex = Math.min(Math.floor(arf), rows.length - 1)
          if (rowIndex !== lastRowIndex) {
            lastRowIndex = rowIndex
            setActiveRowIndex(rowIndex)
          }
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [rows.length])

  return (
    <>
      <div
        ref={containerRef}
        style={{ position: 'relative', height: '1100vh', background: '#fff' }}
      >
        {/* Left panel — sticky, 62vw × 100vh, with outer margins */}
        <div style={{
          position:      'sticky',
          top:           0,
          left:          0,
          width:         '62vw',
          height:        '100vh',
          display:       'flex',
          flexDirection: 'column',
          background:    '#fff',
          borderRight:   '1px solid #ebebeb',
          boxSizing:     'border-box',
          padding:       '36px 28px 24px 48px',
          zIndex:        1,
        }}>
          <TranscriptWindow rows={rows} activeRowIndex={activeRowIndex} />
          {/* Visible gap between transcript and matrix */}
          <div style={{ height: '16px', flexShrink: 0 }} />
          <div style={{ flex: 1, minHeight: 0 }}>
            <MatrixCanvas rows={rows} drawRef={canvasDrawRef} />
          </div>
        </div>

        {/* Right panel — absolute, 38vw, full container height, with outer margins */}
        <div style={{
          position:   'absolute',
          top:        0,
          right:      0,
          width:      '38vw',
          height:     '100%',
          boxSizing:  'border-box',
          paddingLeft:'28px',
          paddingRight:'48px',
        }}>
          <ArticleNarrative updateRef={boxUpdateRef} />
        </div>
      </div>

      <BottomProgressBar fillRef={progressBarFillRef} />
    </>
  )
}
