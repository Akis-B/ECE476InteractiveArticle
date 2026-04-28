import bannerBg from '../assets/banner.png'

const GOTHAMIST_URL = 'https://gothamist.com/news/new-york-judges-add-new-obstacle-for-low-income-tenants-with-housing-vouchers'

export default function ClosingBanner() {
  return (
    <div style={{
      position:           'relative',
      width:              '100%',
      minHeight:          '420px',
      display:            'flex',
      alignItems:         'center',
      backgroundImage:    `url(${bannerBg})`,
      backgroundSize:     'cover',
      backgroundPosition: 'center 40%',
      backgroundRepeat:   'no-repeat',
      backgroundColor:    '#121927',
      overflow:           'hidden',
    }}>

      {/* Dark overlay */}
      <div style={{
        position:   'absolute',
        inset:      0,
        background: 'rgba(8, 18, 40, 0.65)',
      }} />

      {/* Centered content column */}
      <div style={{
        position:  'relative',
        zIndex:    1,
        width:     '100%',
        maxWidth:  '900px',
        margin:    '0 auto',
        padding:   '60px 48px',
      }}>

        <h2 style={{
          fontFamily:   "'Instrument Sans', system-ui, sans-serif",
          fontSize:     '26px',
          fontWeight:   700,
          color:        '#FFFFFF',
          lineHeight:   1.25,
          marginBottom: '10px',
        }}>
          From CA to NYC: Different Coasts, Same Barrier
        </h2>

        <p style={{
          fontFamily:   "'Instrument Sans', system-ui, sans-serif",
          fontSize:     '13px',
          color:        'rgba(255,255,255,0.70)',
          marginBottom: '22px',
          letterSpacing: '0.01em',
        }}>
          [Source:{' '}
          <a
            href={GOTHAMIST_URL}
            target="_blank"
            rel="noreferrer"
            style={{
              color:               'rgba(255,255,255,0.85)',
              textDecoration:      'underline',
              textDecorationColor: 'rgba(255,255,255,0.45)',
              textUnderlineOffset: '3px',
            }}
          >
            Gothamist
          </a>
          ]
        </p>

        <p style={{
          fontFamily:   "'Instrument Sans', system-ui, sans-serif",
          fontSize:     '17px',
          color:        'rgba(255,255,255,0.92)',
          lineHeight:   1.7,
          marginBottom: '20px',
        }}>
          In March 2026, a New York court struck down the state's 2019 "source of income" protection
          law as unconstitutional. It ruled that forcing landlords to accept Section 8 vouchers
          violates their Fourth Amendment rights by "forcing" them to consent to government property
          inspections.
        </p>

        <p style={{
          fontFamily: "'Instrument Sans', system-ui, sans-serif",
          fontSize:   '17px',
          color:      'rgba(255,255,255,0.92)',
          lineHeight: 1.7,
        }}>
          <span style={{ fontWeight: 700 }}>The California Connection: </span>
          Our California data serves as a warning: even in a state where these protections remain
          legally active, landlords still bypass the law through ghosting. As New York's legal doors
          begin to close, the "silence" we documented in the West becomes the inevitable future for
          the East — proving that without aggressive enforcement, a voucher holder's right to housing
          exists only on paper.
        </p>

      </div>
    </div>
  )
}
