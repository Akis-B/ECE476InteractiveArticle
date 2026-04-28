import { useEffect, useRef } from 'react'

const body_no_claim = <><b style={{ fontWeight: 600 }}>"No Claim"</b> means that while the interaction occurred, there was no specific legal claim for HRI to report this as discrimination under the current testing criteria.</>
const body_inconclusive = <><b style={{ fontWeight: 600 }}>"Inconclusive"</b> indicates that HRI could not determine if this was proper discrimination. These cases often involve evasion, silence, or ambiguous responses from landlords. Two types of "soft" discrimination are:
<br /><br />
<b style={{ fontWeight: 600 }}>1. Steering</b>, where property owners limit prospective tenants to specific properties, or deny knowing what a Section 8 voucher is.
<br /><br />
<b style={{ fontWeight: 600 }}>2. Ghosting</b>, where landlords/brokers stop responding to Section 8 voucher-holders' messages.</>
const body_pending = <><b style={{ fontWeight: 600 }}>"Pending"</b> points are classified as clear instances of discrimination. These are interactions where vouchers were explicitly or implicitly refused, violating fair housing laws.</>
const body_tbd = <><b style={{ fontWeight: 600 }}>"TBD"</b> represents data points where the status is still to be determined based on the raw records from the investigation.</>

const body_final = <>Through our text-based investigations, we have found various forms of discrimination against voucher-holders by landlords, both outright and implicit ("soft discrimination"). Finding a property that accepts vouchers remains a significant hurdle for many.</>

const STATUS_ACCENT = {
  'cat-no-claim':    '#1D2CF3',
  'cat-inconclusive':'#6B7280',
  'cat-pending':     '#B10000',
  'cat-tbd':         '#A0A0A0',
  'final':           '#0F0F0E',
}

const BOXES = [
  { id: 'cat-no-claim',    title: 'Status: No Claim',    start: 0.00, end: 0.20, body: body_no_claim,    isSticky: true },
  { id: 'cat-inconclusive',title: 'Status: Inconclusive',start: 0.20, end: 0.70, body: body_inconclusive,isSticky: true },
  { id: 'cat-pending',     title: 'Status: Pending',     start: 0.70, end: 0.90, body: body_pending,     isSticky: true },
  { id: 'cat-tbd',         title: 'Status: TBD',         start: 0.90, end: 1.00, body: body_tbd,         isSticky: true },
  { id: 'final',           title: 'Our Findings',        start: 1.00, end: 1.08, body: body_final,       isSticky: true, isFinal: true },
]

export default function ArticleNarrative({ updateRef, rows }) {
  const boxRefs = useRef([])

  useEffect(() => {
    updateRef.current = (progress) => {
      BOXES.forEach((box, idx) => {
        const el = boxRefs.current[idx]
        if (!el) return

        const fadeIn  = 0.02
        const fadeOut = 0.02

        let opacity = 0
        if (progress >= box.start && progress <= box.end) {
          if (progress < box.start + fadeIn && box.start > 0) {
            opacity = (progress - box.start) / fadeIn
          } else if (progress > box.end - fadeOut) {
            opacity = (box.end - progress) / fadeOut
          } else {
            opacity = 1
          }
        }

        el.style.opacity = opacity
        el.style.pointerEvents = opacity > 0.1 ? 'all' : 'none'
      })
    }
  }, [updateRef])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {BOXES.map((box, idx) => {
        const accent = STATUS_ACCENT[box.id]
        return (
          <div
            key={box.id}
            ref={el => { boxRefs.current[idx] = el }}
            style={{
              position: 'absolute',
              top: `${box.start * 1000}vh`,
              height: `${(box.end - box.start) * 1000}vh`,
              left: '16px',
              right: '24px',
              opacity: box.start === 0 ? 1 : 0,
              zIndex: 10,
            }}
          >
            <div style={{
              position: 'sticky',
              top: '120px',
              background: box.isFinal ? '#F2F0EA' : '#FFFFFF',
              border: '0.5px solid #E2DFD7',
              borderLeft: `3px solid ${accent}`,
              borderRadius: '0 8px 8px 0',
              padding: '22px 24px',
              boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
            }}>
              <h3 style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                color: accent,
                fontFamily: "'Instrument Sans', system-ui, sans-serif",
                marginBottom: '10px',
              }}>
                {box.title}
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: 1.65,
                color: '#2A2928',
                fontFamily: "'Instrument Sans', system-ui, sans-serif",
              }}>
                {box.body}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
