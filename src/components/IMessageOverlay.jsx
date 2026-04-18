import { useEffect, useState } from 'react'

export const MESSAGES = [
  { id: 0, type: 'sent',     text: 'hi i want to rent a house' },
  { id: 1, type: 'received', text: 'ok lets do a tour' },
  { id: 2, type: 'sent',     text: 'nice, do you take section 8 btw' },
  { id: 3, type: 'sent',     text: 'hi, do you take section 8 pls?' },
  { id: 4, type: 'received', text: 'sorry not familiar' },
  { id: 5, type: 'sent',     text: 'WTF??' },
  { id: 6, type: 'received', text: 'scroll down to learn more ↓' },
]

// spacerRef is owned by the parent — it points to the scroll-zone wrapper
export default function IMessageOverlay({ spacerRef }) {
  const [visible, setVisible]             = useState(new Set())
  const [overlayOpacity, setOverlayOpacity] = useState(1)
  const [done, setDone]                   = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const spacer = spacerRef?.current
      if (!spacer) return

      const spacerTop  = spacer.getBoundingClientRect().top + window.scrollY
      const scrolled   = Math.max(0, window.scrollY - spacerTop)
      const total      = MESSAGES.length
      const revealZone = spacer.offsetHeight * 0.50
      const fadeZone   = spacer.offsetHeight * 0.18

      const next = new Set()
      MESSAGES.forEach((_, i) => {
        if (scrolled >= (i / total) * revealZone) next.add(i)
      })
      setVisible(next)

      if (scrolled >= revealZone) {
        const fadeProgress = Math.min(1, (scrolled - revealZone) / fadeZone)
        setOverlayOpacity(1 - fadeProgress)
        setDone(fadeProgress >= 1)
      } else {
        setOverlayOpacity(1)
        setDone(false)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [spacerRef])

  return (
    <div
      className="msg-overlay"
      style={{
        opacity: overlayOpacity,
        pointerEvents: done ? 'none' : 'all',
      }}
      aria-hidden={done}
    >
      <div className="msg-overlay-backdrop" />

      <div className="msg-overlay-thread">
        {MESSAGES.map((msg) => (
          <div
            key={msg.id}
            className={`msg-bubble-row ${msg.type} ${visible.has(msg.id) ? 'visible' : ''}`}
          >
            <div className={`msg-bubble ${msg.type}`}>{msg.text}</div>
          </div>
        ))}

        <div className={`msg-scroll-cue ${visible.size > 0 ? 'hidden' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 3v14M4 11l6 6 6-6"
              stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          scroll to reveal
        </div>
      </div>
    </div>
  )
}
