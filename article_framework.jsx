import { useRef, useState, useEffect } from 'react'
import Papa from 'papaparse'
import IMessageOverlay from './src/components/IMessageOverlay'
import ScrollExperience from './src/components/ScrollExperience'
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
    maxWidth: '800px',
    margin: '0 auto',
    padding: '80px 24px',
    fontFamily: "'ABeeZee', sans-serif",
    lineHeight: '1.6',
    color: '#333'
  }}>
    <section style={{ marginBottom: '60px' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#1D2CF3', marginBottom: '24px' }}>Who are we?</h2>
      <p style={{ fontSize: '18px', color: '#222' }}>
       The Housing Rights Initiative (<a href="https://www.housingrightsus.org/" target="_blank" rel="noreferrer" style={LINK}>HRI</a>) is a national non-profit watchdog group that investigates real estate fraud, connects tenants to legal services, and protects fair and affordable housing. HRI conducts undercover testing of landlords and brokers to verify compliance with fair housing laws.
      </p>
    </section>

    <section style={{ marginBottom: '60px' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#1D2CF3', marginBottom: '24px' }}>What is a Section 8 Voucher?</h2>
      <p style={{ fontSize: '18px', color: '#222' }}>
        Section 8 Housing Vouchers, a part of the Housing Choice Voucher Program, is a federal rental assistance program managed by the U.S. Department of Housing and Urban Development (<a href="https://www.hud.gov/helping-americans/public-housing#:~:text=HAs%20use%20income%20limits%20developed,limits%20here%20on%20the%20internet." target="_blank" rel="noreferrer" style={LINK}>HUD</a>). It assists low-income families, seniors, and people with disabilities to afford safe, private-market housing.
      </p>
    </section>

    <section style={{ marginBottom: '60px' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#1D2CF3', marginBottom: '24px' }}>Who can be a voucher holder?</h2>
      <p style={{ fontSize: '18px', color: '#222', marginBottom: '24px' }}>
        Section 8 eligibility requires a &ldquo;Very Low&rdquo; annual income, defined as below 50% of the local Area Median Income (<a href="https://www.hud.gov/helping-americans/public-housing#:~:text=HAs%20use%20income%20limits%20developed,limits%20here%20on%20the%20internet." target="_blank" rel="noreferrer" style={LINK}>HUD</a>).
      </p>
      <div style={{ background: '#f5f5f5', padding: '40px', borderRadius: '8px', textAlign: 'center' }}>
        <img src={whoSec8} alt="Who can be a Section 8 voucher holder" style={{ maxWidth: '100%', height: 'auto' }} />
        <p style={{ fontSize: '13px', marginTop: '16px', opacity: 0.7 }}>National Profile (<a href="https://vcresearch.berkeley.edu/news/who-served-housing-choice-voucher-program" target="_blank" rel="noreferrer" style={LINK}>UC Berkeley</a>).</p>
      </div>
    </section>

    <section style={{ marginBottom: '60px' }}>
      <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#1D2CF3', marginBottom: '24px' }}>Our investigation:</h2>
      <p style={{ fontSize: '18px', color: '#222', marginBottom: '24px' }}>
        While explicit refusals are now illegal in many states (via source of income protections), our data reveals that voucher-holders are frequently met with a pattern of silence and evasion. These investigations were done in Los Angeles and San Francisco, CA, organized by specific zip codes within each city. Our data pinpoints the specific interactions between testers and landlords, which primarily take place over text messaging.
      </p>
    </section>

  </div>
)

const CityHeader = ({ title }) => (
  <div style={{
    padding: '100px 48px 40px 48px',
    background: '#fff',
    borderBottom: '1px solid #ebebeb'
  }}>
    <h2 style={{ fontSize: '42px', fontWeight: 800, fontFamily: "'ABeeZee', sans-serif", color: '#000' }}>
      {title}
    </h2>
    <p style={{ fontSize: '18px', color: '#666', marginTop: '12px', maxWidth: '600px' }}>
      Investigating housing voucher discrimination in the {title} area through undercover text-based testing.
    </p>
  </div>
)

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
    <div style={{ background: '#fff' }}>
      <IMessageOverlay spacerRef={spacerRef} onDone={() => setOverlayDone(true)} />
      
      <div ref={spacerRef} style={{ height: '250vh', position: 'relative' }} />
      
      <div style={{ 
        visibility: overlayDone ? 'visible' : 'hidden',
        opacity: overlayDone ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out'
      }}>
        <IntroSection />
        
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

        <div style={{ height: '40vh' }} />
      </div>
    </div>
  )
}
