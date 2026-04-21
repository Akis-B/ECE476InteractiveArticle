import { useEffect, useRef } from 'react'
import whoSec8 from '../assets/illustrations/who_sec_8.svg'

const LINK = { color: '#fff', textDecoration: 'underline' }

const body_1 = <>The Housing Rights Initiative (HRI) is a national non-profit watchdog group that investigates real estate fraud, connects tenants to legal services, and protects fair and affordable housing. HRI conducts undercover testing of landlords and brokers to verify compliance with fair housing laws.</>

const body_2 = <>Section 8 Housing Vouchers, a part of the Housing Choice Voucher Program, is a federal rental assistance program managed by the U.S. Department of Housing and Urban Development (<a href="https://www.hud.gov/helping-americans/public-housing#:~:text=HAs%20use%20income%20limits%20developed,limits%20here%20on%20the%20internet." target="_blank" rel="noreferrer" style={LINK}>HUD</a>). It assists low-income families, seniors, and people with disabilities to afford safe, private-market housing.</>

const body_3 = <>Section 8 eligibility requires a &ldquo;Very Low&rdquo; annual income, defined as below 50% of the local Area Median Income (<a href="https://www.hud.gov/helping-americans/public-housing#:~:text=HAs%20use%20income%20limits%20developed,limits%20here%20on%20the%20internet." target="_blank" rel="noreferrer" style={LINK}>HUD</a>).</>


const body_4 = <>While explicit refusals are now illegal in many states, our data reveals that voucher holders are frequently met with a pattern of silence and evasion. These investigations were done in Los Angeles and San Francisco, CA, organized by specific zip codes within each city. Our data pinpoints the specific interactions between testers and landlords, which primarily take place over text messaging.</>


const body_5 = <>Through our text-based investigations, we have found various forms of discrimination against voucher-holders by landlords, both outright and implicit (&ldquo;soft discrimination&rdquo;).</>
const body_6 = <>Property owner limits prospective tenants to specific properties, or deny knowing what a section 8 voucher is.</>
const body_7 = <>Landlords/brokers stop responding to section 8 voucher holders requests.</>
const body_8 = <>Property owner outwardly says that they don’t accept housing vouchers.</>
const body_9 = <>Placeholder text for section nine.</>
const body_10 = <>Placeholder text for section ten.</>

const BOXES = [
  { id: 1,  title: 'Who are we?',   activation: 0.05, body: body_1 },

  { id: 2,  title: 'What is a Section 8 Voucher?',   activation: 0.15, body: body_2 },
  
  { id: 3,  title: 'Who can be a voucher holder?',  activation: 0.25, body: body_3,
    graphic: <img src={whoSec8} alt="Who can be a Section 8 voucher holder" style={{ width: '100%', marginTop: '12px', filter: 'brightness(0) invert(1)' }} />,
    note: <>National Profile (<a href="https://vcresearch.berkeley.edu/news/who-served-housing-choice-voucher-program" target="_blank" rel="noreferrer" style={LINK}>UC Berkeley</a>).</>
  },

  { id: 4,  title: 'Our investigation:', activation: 0.35, body: body_4 },

  { id: 5,  title: 'Types of discrimination:',  activation: 0.45, body: body_5 },
  { id: 6,  title: 'Steering',   activation: 0.55, body: body_6 },
  { id: 7,  title: 'Ghosting', activation: 0.65, body: body_7 },
  { id: 8,  title: 'Direct Rejection', activation: 0.75, body: body_8 },
  { id: 9,  title: 'Nine',  activation: 0.85, body: body_9 },
  { id: 10, title: 'Ten',   activation: 0.95, body: body_10 },
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
                {box.body}
              </p>
              {box.graphic && box.graphic}
              {box.note && <p style={{ fontSize: '13px', lineHeight: 1.45, marginTop: '10px', opacity: 0.85, textAlign: 'center' }}>{box.note}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
