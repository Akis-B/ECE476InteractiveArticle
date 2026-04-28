import { useRef, useState, useEffect } from 'react'
import MatrixCanvas from './MatrixCanvas'
import TranscriptWindow from './TranscriptWindow'
import ArticleNarrative from './ArticleNarrative'

export default function ScrollExperience({ rows, city }) {
  const containerRef = useRef(null)
  const [activeRowIndex, setActiveRowIndex] = useState(0)

  const canvasDrawRef = useRef(null)
  const boxUpdateRef  = useRef(null)

  const totalCount = rows.length

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

        const startData = 0.00
        const endData   = 0.95
        let arf = 0
        if (progress >= startData) {
          const dataProgress = Math.min(1, (progress - startData) / (endData - startData))
          arf = dataProgress * totalCount
        }

        if (Math.abs(arf - lastARF) > 0.0005) {
          lastARF = arf

          canvasDrawRef.current?.(arf)
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
  }, [rows.length, totalCount])

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', height: '1100vh', background: '#FAFAF8' }}
    >
        <div style={{
          position:      'sticky',
          top:           0,
          left:          0,
          width:         '62vw',
          height:        '100vh',
          display:       'flex',
          flexDirection: 'column',
          background:    '#FAFAF8',
          borderRight:   '0.5px solid #E2DFD7',
          boxSizing:     'border-box',
          padding:       '24px 16px 16px 24px',
          zIndex:        1,
        }}>
          <TranscriptWindow rows={rows} activeRowIndex={activeRowIndex} />
          <div style={{ height: '16px', flexShrink: 0 }} />
          <div style={{ flex: 1, minHeight: 0 }}>
            <MatrixCanvas rows={rows} drawRef={canvasDrawRef} city={city} />
          </div>
        </div>

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
          <ArticleNarrative updateRef={boxUpdateRef} rows={rows} />
        </div>
    </div>
  )
}
