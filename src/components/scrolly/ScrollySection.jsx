import { useState, useEffect, useRef } from 'react'

// graphic — component reference (not element), receives activeStep prop
// flip   — put graphic on the left, text on the right
export default function ScrollySection({ graphic: Graphic, children, flip = false }) {
  const [activeStep, setActiveStep] = useState(0)
  const stepsRef = useRef(null)

  useEffect(() => {
    const steps = stepsRef.current?.querySelectorAll('[data-step]')
    if (!steps?.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most-visible intersecting step
        const intersecting = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (intersecting.length > 0) {
          setActiveStep(Number(intersecting[0].target.dataset.step))
        }
      },
      // fire when a step occupies the middle band of the viewport
      { rootMargin: '-35% 0px -35% 0px', threshold: 0 },
    )

    steps.forEach(s => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <div className={`scrolly-section ${flip ? 'scrolly-flip' : ''}`}>
      <div className="scrolly-steps" ref={stepsRef}>
        {children}
      </div>
      <div className="scrolly-graphic-pane">
        <Graphic activeStep={activeStep} />
      </div>
    </div>
  )
}
