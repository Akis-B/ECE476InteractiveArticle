import { useRef, useState, useEffect } from 'react'
import Papa from 'papaparse'
import IMessageOverlay from './src/components/IMessageOverlay'
import ScrollExperience from './src/components/ScrollExperience'
import './src/styles/global.css'

function normalizeStatus(raw) {
  if (!raw || typeof raw !== 'string') return 'unknown'
  const s = raw.toLowerCase().trim()
  if (s === 'inconclusive') return 'inconclusive'
  if (s === 'pending') return 'pending'
  if (s === 'no claim') return 'no claim'
  if (import.meta.env.DEV) console.warn(`Unknown status: "${raw}"`)
  return 'unknown'
}

function getStatusColor(normalized) {
  switch (normalized) {
    case 'inconclusive': return '#898989'
    case 'pending':      return '#B10000'
    case 'no claim':     return '#1D2CF3'
    default:             return '#BCBCBC'
  }
}

function normalizeRow(row) {
  const statusNormalized = normalizeStatus(row.Status)
  return {
    address:          row.Address || '',
    statusRaw:        row.Status || '',
    statusNormalized,
    statusColor:      getStatusColor(statusNormalized),
    transcriptRaw:    row.Transcript || '',
  }
}

export default function ArticleFramework() {
  const spacerRef = useRef(null)
  const [rows, setRows] = useState([])
  const [overlayDone, setOverlayDone] = useState(false)

  useEffect(() => {
    Papa.parse('/CleanedData.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (import.meta.env.DEV && result.data.length !== 1313) {
          console.warn(`Expected 1313 rows, got ${result.data.length}`)
        }
        setRows(result.data.map(normalizeRow))
      },
    })
  }, [])

  return (
    <div style={{ background: '#fff' }}>
      <IMessageOverlay spacerRef={spacerRef} onDone={() => setOverlayDone(true)} />
      <div ref={spacerRef} style={{ height: '250vh', position: 'relative' }} />
      <div style={{ visibility: overlayDone ? 'visible' : 'hidden' }}>
        {rows.length > 0 && <ScrollExperience rows={rows} />}
      </div>
    </div>
  )
}
