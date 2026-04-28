import { useEffect, useRef } from 'react'

export default function BottomProgressBar() {
  const fillRef = useRef(null)

  useEffect(() => {
    const update = () => {
      const scrolled = window.scrollY
      const total    = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrolled / total : 0
      if (fillRef.current) {
        fillRef.current.style.width = `${progress * 100}%`
      }
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  return (
    <div style={{
      position:   'fixed',
      bottom:     0,
      left:       0,
      right:      0,
      height:     '3px',
      background: 'rgba(0,0,0,0.06)',
      zIndex:     300,
    }}>
      <div
        ref={fillRef}
        style={{
          height:     '100%',
          width:      '0%',
          background: '#1D2CF3',
        }}
      />
    </div>
  )
}
