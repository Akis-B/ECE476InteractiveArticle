import { useRef, useState, useEffect } from 'react'
import Papa from 'papaparse'
import IMessageOverlay from './src/components/IMessageOverlay'
import ScrollExperience from './src/components/ScrollExperience'
import SideMatrix from './src/components/SideMatrix'
import ClosingBanner from './src/components/ClosingBanner'
import BottomProgressBar from './src/components/BottomProgressBar'
import './src/styles/global.css'
import whoSec8 from './src/assets/illustrations/who_sec_8.svg'

function normalizeStatus(raw) {
  if (!raw || typeof raw !== 'string') return 'unknown'
  const s = raw.toLowerCase().trim()
  if (s === 'inconclusive') return 'inconclusive'
  if (s === 'pending') return 'pending'
  if (s === 'no claim') return 'no claim'
  if (s === 'tbd') return 'tbd'
  return 'unknown'
}

function getStatusColor(normalized) {
  switch (normalized) {
    case 'inconclusive': return '#898989' 
    case 'pending':      return '#B10000' 
    case 'no claim':     return '#1D2CF3' 
    case 'tbd':          return '#D1D1D1' 
    default:             return '#BCBCBC'
  }
}

const LINK = {
  color: '#1D2CF3',
  textDecoration: 'underline',
}

function normalizeRow(row) {
  const statusNormalized = normalizeStatus(row.Status)
  const address = row.Address || ''
  const isSF = address.toLowerCase().includes('san francisco')
  const isLA = address.toLowerCase().includes('los angeles')
  
  // Extract zip
  const zipMatch = address.match(/CA\s+(\d{5})/)
  const zip = zipMatch ? zipMatch[1] : null

  return {
    address,
    isSF,
    isLA,
    zip,
    statusRaw:        row.Status || '',
    statusNormalized,
    statusColor:      getStatusColor(statusNormalized),
    transcriptRaw:    row.Transcript || '',
  }
}

const IntroSection = () => (
  <div style={{
    maxWidth: '700px',
    margin: '0 auto',
    padding: '80px 24px 60px',
    fontFamily: "'Instrument Sans', system-ui, sans-serif",
    lineHeight: '1.7',
    color: '#0F0F0E',
  }}>
    <section style={{ marginBottom: '56px' }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 400,
        fontStyle: 'italic',
        fontFamily: "'Instrument Serif', Georgia, serif",
        color: '#0F0F0E',
        marginBottom: '20px',
        letterSpacing: '-0.01em',
        lineHeight: 1.15,
      }}>Who are we?</h2>
      <p style={{ fontSize: '18px', color: '#2A2928', lineHeight: 1.7 }}>
       The Housing Rights Initiative (<a href="https://www.housingrightsus.org/" target="_blank" rel="noreferrer" style={LINK}>HRI</a>) is a national non-profit watchdog group that investigates real estate fraud, connects tenants to legal services, and protects fair and affordable housing. HRI conducts undercover testing of landlords and brokers to verify compliance with fair housing laws.
      </p>
    </section>

    <section style={{ marginBottom: '56px' }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 400,
        fontStyle: 'italic',
        fontFamily: "'Instrument Serif', Georgia, serif",
        color: '#0F0F0E',
        marginBottom: '20px',
        letterSpacing: '-0.01em',
        lineHeight: 1.15,
      }}>What is a Section 8 Voucher?</h2>
      <p style={{ fontSize: '18px', color: '#2A2928', lineHeight: 1.7 }}>
        Section 8 Housing Vouchers, a part of the Housing Choice Voucher Program, is a federal rental assistance program managed by the U.S. Department of Housing and Urban Development (<a href="https://www.hud.gov/helping-americans/public-housing#:~:text=HAs%20use%20income%20limits%20developed,limits%20here%20on%20the%20internet." target="_blank" rel="noreferrer" style={LINK}>HUD</a>). It assists low-income families, seniors, and people with disabilities to afford safe, private-market housing.
      </p>
    </section>

    <section style={{ marginBottom: '56px' }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 400,
        fontStyle: 'italic',
        fontFamily: "'Instrument Serif', Georgia, serif",
        color: '#0F0F0E',
        marginBottom: '20px',
        letterSpacing: '-0.01em',
        lineHeight: 1.15,
      }}>Who can be a voucher holder?</h2>
      <p style={{ fontSize: '18px', color: '#2A2928', lineHeight: 1.7, marginBottom: '24px' }}>
        Section 8 eligibility requires a &ldquo;Very Low&rdquo; annual income, defined as below 50% of the local Area Median Income (<a href="https://www.hud.gov/helping-americans/public-housing#:~:text=HAs%20use%20income%20limits%20developed,limits%20here%20on%20the%20internet." target="_blank" rel="noreferrer" style={LINK}>HUD</a>).
      </p>
      <div style={{
        background: '#F2F0EA',
        border: '0.5px solid #E2DFD7',
        padding: '36px',
        borderRadius: '8px',
        textAlign: 'center',
      }}>
        <img src={whoSec8} alt="Who can be a Section 8 voucher holder" style={{ maxWidth: '100%', height: 'auto' }} />
        <p style={{
          fontSize: '12px',
          marginTop: '16px',
          color: '#6B7280',
          fontFamily: "'Instrument Sans', system-ui, sans-serif",
          letterSpacing: '0.02em',
        }}>National Profile (<a href="https://vcresearch.berkeley.edu/news/who-served-housing-choice-voucher-program" target="_blank" rel="noreferrer" style={LINK}>UC Berkeley</a>).</p>
      </div>
    </section>

    <section style={{ marginBottom: '56px' }}>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 400,
        fontStyle: 'italic',
        fontFamily: "'Instrument Serif', Georgia, serif",
        color: '#0F0F0E',
        marginBottom: '20px',
        letterSpacing: '-0.01em',
        lineHeight: 1.15,
      }}>Our investigation</h2>
      <p style={{ fontSize: '18px', color: '#2A2928', lineHeight: 1.7, marginBottom: '24px' }}>
        While explicit refusals are now illegal in many states (via source of income protections), our data reveals that voucher-holders are frequently met with a pattern of silence and evasion. These investigations were done in Los Angeles and San Francisco, CA, organized by specific zip codes within each city. Our data pinpoints the specific interactions between testers and landlords, which primarily take place over text messaging.
      </p>
    </section>

  </div>
)

const CityHeader = ({ title }) => (
  <div style={{
    padding: '80px 48px 36px 48px',
    background: '#FAFAF8',
    borderBottom: '0.5px solid #E2DFD7',
  }}>
    <div style={{
      maxWidth: '700px',
      margin: '0 auto',
    }}>
      <span style={{
        display: 'inline-block',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '.1em',
        textTransform: 'uppercase',
        color: '#6B7280',
        fontFamily: "'Instrument Sans', system-ui, sans-serif",
        marginBottom: '16px',
      }}>Investigation</span>
      <h2 style={{
        fontSize: '48px',
        fontWeight: 400,
        fontStyle: 'italic',
        fontFamily: "'Instrument Serif', Georgia, serif",
        color: '#0F0F0E',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        marginBottom: '16px',
      }}>
        {title}
      </h2>
      <p style={{
        fontSize: '18px',
        color: '#6B7280',
        maxWidth: '540px',
        lineHeight: 1.65,
        fontFamily: "'Instrument Sans', system-ui, sans-serif",
      }}>
        Investigating housing voucher discrimination in the {title} area through undercover text-based testing.
      </p>
    </div>
  </div>
)

function IntroWithMatrix() {
  const containerRef = useRef(null)
  const progressRef  = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const el = containerRef.current
      if (!el) return
      const rect   = el.getBoundingClientRect()
      const scrolled = -rect.top
      const total    = el.offsetHeight - window.innerHeight
      progressRef.current = Math.max(0, Math.min(1, scrolled / Math.max(1, total)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      ref={containerRef}
      style={{
        position:   'relative',
        display:    'flex',
        alignItems: 'stretch',
        background: '#FAFAF8',
        overflow:   'hidden',
      }}
    >
      {/* Left matrix column */}
      <div style={{
        width:    'clamp(60px, 12vw, 180px)',
        flexShrink: 0,
        position:  'relative',
        minHeight: '100%',
      }}>
        <SideMatrix progressRef={progressRef} />
      </div>

      {/* Center text — full IntroSection */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <IntroSection />
      </div>

      {/* Right matrix column */}
      <div style={{
        width:    'clamp(60px, 12vw, 180px)',
        flexShrink: 0,
        position:  'relative',
        minHeight: '100%',
      }}>
        <SideMatrix progressRef={progressRef} />
      </div>
    </div>
  )
}

export default function ArticleFramework() {
  const spacerRef = useRef(null)
  const [sfRows, setSfRows] = useState([])
  const [laRows, setLaRows] = useState([])
  const [overlayDone, setOverlayDone] = useState(false)

  useEffect(() => {
    Papa.parse('/CleanedData.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const rows = result.data.map(normalizeRow)

        const sortFn = (a, b) => {
          const order = { 'no claim': 0, 'inconclusive': 1, 'pending': 2, 'tbd': 3, 'unknown': 4 }
          return (order[a.statusNormalized] ?? 5) - (order[b.statusNormalized] ?? 5)
        }

        setSfRows(rows.filter(r => r.isSF).sort(sortFn))
        setLaRows(rows.filter(r => r.isLA).sort(sortFn))
      },
    })
  }, [])

  return (
    <div style={{ background: '#FAFAF8' }}>
      <BottomProgressBar />
      <IMessageOverlay spacerRef={spacerRef} onDone={() => setOverlayDone(true)} />

      <div ref={spacerRef} style={{ height: '250vh', position: 'relative' }} />

      <div style={{
        visibility: overlayDone ? 'visible' : 'hidden',
        opacity: overlayDone ? 1 : 0,
        transition: 'opacity 0.25s ease'
      }}>
        <IntroWithMatrix />
        
        {sfRows.length > 0 && (
          <>
            <CityHeader title="San Francisco" />
            <ScrollExperience rows={sfRows} city="SF" />
          </>
        )}

        {laRows.length > 0 && (
          <>
            <CityHeader title="Los Angeles" />
            <ScrollExperience rows={laRows} city="LA" />
          </>
        )}

        <ClosingBanner />
      </div>
    </div>
  )
}
