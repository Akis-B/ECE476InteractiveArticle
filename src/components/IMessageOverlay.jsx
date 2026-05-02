import { useEffect, useRef, useState } from 'react'

export const MESSAGES = [
  { id: 0, type: 'sent',     text: 'Hello! This is Gemma, I saw your online listing. Is the two bedroom still available?' },
  { id: 1, type: 'received', text: 'Yes, it is! We can schedule a tour if you would like.' },
  { id: 2, type: 'sent',     text: 'That sounds great. BTW, do you take Section 8?' },
  { id: 3, type: 'sent',     text: 'Hi, I just wanted to confirm, do you take Section 8 housing vouchers??' },
  { id: 4, type: 'sent',     text: 'Hello?' },
  { id: 5, type: 'received', text: 'sorry, not familiar' },
  { id: 6, type: 'sent', text: 'Scroll down to learn more ↓' },
]

// spacerRef is owned by the parent — it points to the scroll-zone wrapper
export default function IMessageOverlay({ spacerRef, onDone }) {
  const [visible, setVisible]             = useState(new Set())
  const [overlayOpacity, setOverlayOpacity] = useState(1)
  const [done, setDone]                   = useState(false)
  const calledDone = useRef(false)

  useEffect(() => {
    const onScroll = () => {
      const spacer = spacerRef?.current
      if (!spacer) return

      const spacerTop  = spacer.getBoundingClientRect().top + window.scrollY
      const scrolled   = Math.max(0, window.scrollY - spacerTop)
      const total      = MESSAGES.length
      const revealZone = spacer.offsetHeight * 0.87
      const fadeZone   = spacer.offsetHeight * 0.05

      const next = new Set()
      MESSAGES.forEach((_, i) => {
        if (scrolled >= (i / total) * revealZone) next.add(i)
      })
      setVisible(next)

      if (scrolled >= revealZone) {
        const fadeProgress = Math.min(1, (scrolled - revealZone) / fadeZone)
        setOverlayOpacity(1 - fadeProgress)
        const isDone = fadeProgress >= 1
        setDone(isDone)
        if (isDone && !calledDone.current) {
          calledDone.current = true
          onDone?.()
        }
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
