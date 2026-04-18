import { useEffect, useRef } from 'react'

const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis.'

const BOXES = [
  { id: 1,  title: 'One',   activation: 0.05 },
  { id: 2,  title: 'Two',   activation: 0.15 },
  { id: 3,  title: 'Three', activation: 0.25 },
  { id: 4,  title: 'Four',  activation: 0.35 },
  { id: 5,  title: 'Five',  activation: 0.45 },
  { id: 6,  title: 'Six',   activation: 0.55 },
  { id: 7,  title: 'Seven', activation: 0.65 },
  { id: 8,  title: 'Eight', activation: 0.75 },
  { id: 9,  title: 'Nine',  activation: 0.85 },
  { id: 10, title: 'Ten',   activation: 0.95 },
]

// Container is 1100vh tall, viewport is 100vh → maxScroll = 1000vh.
// At progress P the viewport top sits at P * 1000vh inside the container.
// Place each box at (P * 1000 + 20)vh so it appears 20vh from the viewport top.
export default function ArticleNarrative({ updateRef }) {
  const boxRefs = useRef([])

  useEffect(() => {
    updateRef.current = (progress) => {
      BOXES.forEach((box, idx) => {
        const el = boxRefs.current[idx]
        if (!el) return
        const fadeFrac = Math.max(0, Math.min(1, (progress - (box.activation - 0.04)) / 0.05))
        el.style.opacity = fadeFrac
        el.style.transform = `translateY(${(1 - fadeFrac) * 20}px)`
      })
    }
  }, [updateRef])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {BOXES.map((box, idx) => {
        const topVh = box.activation * 1000 + 20
        return (
          <div
            key={box.id}
            ref={el => { boxRefs.current[idx] = el }}
            style={{
              position: 'absolute',
              top: `${topVh}vh`,
              left: '16px',
              right: '24px',
              opacity: 0,
              transform: 'translateY(20px)',
            }}
          >
            <div style={{
              background: '#1D2CF3',
              color: '#fff',
              borderRadius: '0',
              padding: '20px 22px',
              fontFamily: "'ABeeZee', sans-serif",
              maxWidth: '92%',
            }}>
              <h3 style={{
                fontSize: '18px',
                fontWeight: 700,
                marginBottom: '10px',
                lineHeight: 1.2,
                fontFamily: "'ABeeZee', sans-serif",
              }}>
                {box.title}
              </h3>
              <p style={{ fontSize: '17px', lineHeight: 1.55 }}>
                {LOREM}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
