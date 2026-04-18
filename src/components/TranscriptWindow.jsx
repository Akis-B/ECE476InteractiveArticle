import { useState, useMemo, useEffect } from 'react'

function parseTranscript(raw) {
  if (!raw || typeof raw !== 'string' || !raw.trim()) return []
  const lines  = raw.split('\n').map(l => l.trim()).filter(Boolean)
  const result = []
  for (const line of lines) {
    const m = line.match(/^"(.+?)"\s+([VL])\s*$/)
    if (m) { result.push({ text: m[1], speaker: m[2] }); continue }
    const m2 = line.match(/^(.+?)\s+([VL])\s*$/)
    if (m2) {
      const text = m2[1].replace(/^"|"$/g, '').trim()
      if (text) result.push({ text, speaker: m2[2] })
      continue
    }
    if (/^[VLA]$/.test(line)) continue
    const text = line.replace(/^"|"$/g, '').trim()
    if (text) result.push({ text, speaker: 'UNKNOWN' })
  }
  return result
}

export default function TranscriptWindow({ rows, activeRowIndex }) {
  const [expanded, setExpanded] = useState(false)
  useEffect(() => { setExpanded(false) }, [activeRowIndex])

  const activeRow  = rows?.[activeRowIndex]
  const lines      = useMemo(() => activeRow ? parseTranscript(activeRow.transcriptRaw) : [], [activeRow])
  const visibleLines = expanded ? lines : lines.slice(0, 6)
  const hasMore    = lines.length > 6

  return (
    <div style={{
      flexShrink:    0,
      height:        '160px',
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'flex-start',
      justifyContent:'flex-start',
      paddingBottom: '8px',
      overflow:      'hidden',
    }}>
      {activeRow?.address && (
        <div style={{
          color:          '#bbb',
          fontSize:       '9px',
          marginBottom:   '6px',
          fontFamily:     'system-ui, sans-serif',
          letterSpacing:  '0.09em',
          textTransform:  'uppercase',
        }}>
          {activeRow.address}
        </div>
      )}

      <div style={{
        width:         '100%',
        display:       'flex',
        flexDirection: 'column',
        gap:           '2px',
      }}>
        {visibleLines.map((line, idx) => (
          <div
            key={idx}
            style={{
              textAlign:  line.speaker === 'V' ? 'right' : 'left',
              color:      line.speaker === 'V' ? '#1D2CF3' : line.speaker === 'L' ? '#767676' : '#999',
              fontSize:   '14px',
              lineHeight: 1.4,
              fontFamily: "'Funnel Display', sans-serif",
            }}
          >
            {line.text}
          </div>
        ))}

        {hasMore && !expanded && (
          <button
            onClick={() => setExpanded(true)}
            style={{
              alignSelf:  'flex-start',
              background: 'none',
              border:     'none',
              color:      '#bbb',
              fontSize:   '11px',
              cursor:     'pointer',
              padding:    '2px 0',
              fontFamily: 'system-ui, sans-serif',
              letterSpacing: '0.03em',
            }}
          >
            Show more ↓
          </button>
        )}
      </div>
    </div>
  )
}
