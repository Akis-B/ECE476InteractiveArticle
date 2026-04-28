import { useEffect, useRef, useCallback, useState } from 'react'

const H_PAD    = 10
const V_PAD    = 10
const MAX_SPEED = 680

// Zip code centroids (refined for accuracy)
const ZIP_COORDINATES = {
  // SF
  "94110": [-122.415, 37.756], "94122": [-122.483, 37.759], "94118": [-122.463, 37.781],
  "94109": [-122.422, 37.792], "94121": [-122.497, 37.779], "94117": [-122.446, 37.771],
  "94123": [-122.436, 37.801], "94114": [-122.436, 37.757], "94112": [-122.441, 37.721],
  "94107": [-122.394, 37.762], "94133": [-122.409, 37.800], "94115": [-122.437, 37.786],
  "94116": [-122.484, 37.743], "94103": [-122.411, 37.773], "94131": [-122.442, 37.741],
  "94108": [-122.408, 37.792], "94134": [-122.409, 37.719], "94102": [-122.420, 37.778],
  "94124": [-122.390, 37.730], "94158": [-122.391, 37.771], "94127": [-122.461, 37.735],
  "94111": [-122.400, 37.795], "94105": [-122.390, 37.788], "94132": [-122.485, 37.718],

  // LA
  "90026": [-118.260, 34.070], "90004": [-118.307, 34.076], "90019": [-118.340, 34.050],
  "90044": [-118.290, 33.950], "90046": [-118.360, 34.100], "90034": [-118.390, 34.030],
  "90033": [-118.210, 34.050], "90042": [-118.190, 34.110], "90006": [-118.293, 34.048],
  "90011": [-118.257, 34.007], "90035": [-118.380, 34.050], "90018": [-118.320, 34.030],
  "90066": [-118.430, 34.000], "91601": [-118.370, 34.170], "90022": [-118.150, 34.020],
  "90016": [-118.350, 34.030], "91401": [-118.440, 34.180], "90020": [-118.300, 34.060],
  "91607": [-118.390, 34.160], "90027": [-118.290, 34.110], "90005": [-118.300, 34.060],
  "90003": [-118.270, 33.960], "91405": [-118.440, 34.200], "91406": [-118.490, 34.200],
  "90029": [-118.290, 34.080], "90012": [-118.243, 34.062], "91335": [-118.530, 34.200],
  "90028": [-118.320, 34.100], "91411": [-118.440, 34.180], "91344": [-118.500, 34.270],
  "90047": [-118.310, 33.960], "90037": [-118.290, 34.000], "90008": [-118.340, 34.010],
  "91604": [-118.390, 34.140], "91306": [-118.570, 34.210], "91042": [-118.280, 34.250],
  "90057": [-118.270, 34.060], "90041": [-118.210, 34.130], "91606": [-118.380, 34.190],
  "91605": [-118.390, 34.210], "91402": [-118.440, 34.220], "91367": [-118.600, 34.170],
  "90061": [-118.270, 33.920], "90038": [-118.320, 34.090], "91356": [-118.530, 34.160],
  "91325": [-118.510, 34.230], "91316": [-118.500, 34.160], "90043": [-118.330, 33.980],
  "90039": [-118.260, 34.110], "90032": [-118.180, 34.080], "90024": [-118.430, 34.060],
  "90068": [-118.330, 34.120], "90001": [-118.246, 33.974], "91304": [-118.610, 34.220],
  "90501": [-118.300, 33.830], "90065": [-118.230, 34.100], "90048": [-118.370, 34.070],
  "90007": [-118.285, 34.027], "91602": [-118.360, 34.150], "91403": [-118.460, 34.150],
  "91324": [-118.540, 34.240], "90731": [-118.290, 33.740], "90710": [-118.300, 33.790],
  "90291": [-118.450, 33.990], "90069": [-118.380, 34.090], "90063": [-118.180, 34.040],
  "90015": [-118.267, 34.041], "90002": [-118.240, 33.940], "91364": [-118.600, 34.150],
  "91345": [-118.460, 34.270], "91343": [-118.470, 34.240], "91311": [-118.600, 34.260],
  "91307": [-118.650, 34.200], "90744": [-118.240, 33.780], "90732": [-118.320, 33.740],
  "90248": [-118.280, 33.870], "90232": [-118.390, 34.020], "90062": [-118.300, 34.000],
  "90045": [-118.400, 33.950], "90013": [-118.242, 34.044]
}

const CITY_CONFIGS = {
  SF: {
    label: "San Francisco",
    file: "/sf_neighborhoods.geojson"
  },
  LA: {
    label: "Los Angeles",
    file: "/la_neighborhoods.geojson"
  }
}

function getFullBounds(features, rows) {
  let minLon = Infinity, minLat = Infinity, maxLon = -Infinity, maxLat = -Infinity
  
  features.forEach(f => {
    const coords = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
    coords.forEach(poly => {
      poly.forEach(ring => {
        ring.forEach(c => {
          if (c[0] < minLon) minLon = c[0]
          if (c[1] < minLat) minLat = c[1]
          if (c[0] > maxLon) maxLon = c[0]
          if (c[1] > maxLat) maxLat = c[1]
        })
      })
    })
  })

  rows.forEach(r => {
    const c = ZIP_COORDINATES[r.zip]
    if (c) {
      if (c[0] < minLon) minLon = c[0]
      if (c[1] < minLat) minLat = c[1]
      if (c[0] > maxLon) maxLon = c[0]
      if (c[1] > maxLat) maxLat = c[1]
    }
  })

  const padLon = (maxLon - minLon) * 0.05
  const padLat = (maxLat - minLat) * 0.05
  return [[minLon - padLon, minLat - padLat], [maxLon + padLon, maxLat + padLat]]
}

function project(lon, lat, bounds, width, height, transform = { x: 0, y: 0, k: 1 }) {
  const [[lonMin, latMin], [lonMax, latMax]] = bounds
  const geoW = lonMax - lonMin
  const geoH = latMax - latMin
  const availW = width - H_PAD * 2
  const availH = height - V_PAD * 2
  const latMid = (latMin + latMax) / 2
  const aspectCorrection = Math.cos(latMid * Math.PI / 180)
  
  const scaleX = availW / geoW
  const scaleY = availH / geoH
  const baseScale = Math.min(scaleX, scaleY / aspectCorrection)
  
  const centerX = H_PAD + availW / 2
  const centerY = V_PAD + availH / 2
  const geoCenterX = (lonMin + lonMax) / 2
  const geoCenterY = (latMin + latMax) / 2
  
  // Apply transform
  const x = centerX + transform.x + (lon - geoCenterX) * baseScale * transform.k
  const y = centerY + transform.y - (lat - geoCenterY) * baseScale * aspectCorrection * transform.k
  return { x, y }
}

function inverseProject(x, y, bounds, width, height, transform = { x: 0, y: 0, k: 1 }) {
    const [[lonMin, latMin], [lonMax, latMax]] = bounds
    const geoW = lonMax - lonMin
    const geoH = latMax - latMin
    const availW = width - H_PAD * 2
    const availH = height - V_PAD * 2
    const latMid = (latMin + latMax) / 2
    const aspectCorrection = Math.cos(latMid * Math.PI / 180)
    const baseScale = Math.min(availW / geoW, (availH / geoH) / aspectCorrection)
    
    const centerX = H_PAD + availW / 2
    const centerY = V_PAD + availH / 2
    const geoCenterX = (lonMin + lonMax) / 2
    const geoCenterY = (latMin + latMax) / 2

    const lon = geoCenterX + (x - centerX - transform.x) / (baseScale * transform.k)
    const lat = geoCenterY - (y - centerY - transform.y) / (baseScale * aspectCorrection * transform.k)
    return [lon, lat]
}

function isPointInPoly(pt, poly) {
  const x = pt[0], y = pt[1]
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], yi = poly[i][1]
    const xj = poly[j][0], yj = poly[j][1]
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

function getTooltipText(status) {
  switch (status) {
    case 'no claim':     return 'There was no Claim for HRI to report this as discrimination'
    case 'inconclusive': return 'HRI could not determine if this was proper discrimination'
    case 'pending':      return 'This is classified as discrimination'
    default:             return null
  }
}

const MagnifyingGlassIcon = ({ active }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
    {active && <line x1="8" y1="11" x2="14" y2="11" />}
  </svg>
)

export default function MatrixCanvas({ rows, drawRef, city }) {
  const canvasRef      = useRef(null)
  const metaRef        = useRef(null)
  const tooltipRef     = useRef(null)
  const tooltipAddrRef = useRef(null)
  const tooltipTextRef = useRef(null)
  const tooltipZipRef  = useRef(null)
  
  const [geoData, setGeoData] = useState(null)
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [zoomEnabled, setZoomEnabled] = useState(false)

  useEffect(() => {
    if (zoomEnabled) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [zoomEnabled])

  const targetARFRef = useRef(0)
  const posXRef      = useRef(null)
  const posYRef      = useRef(null)
  const stateRef     = useRef(null)
  const rafRef       = useRef(null)
  const lastTRef     = useRef(null)

  // Zoom and Drag state
  const transformRef = useRef({ x: 0, y: 0, k: 1 })
  const isDraggingRef = useRef(false)
  const lastMousePosRef = useRef({ x: 0, y: 0 })

  const initAnimState = useCallback((count) => {
    posXRef.current  = new Float32Array(count)
    posYRef.current  = new Float32Array(count)
    stateRef.current = new Uint8Array(count)
  }, [])

  useEffect(() => {
    const config = CITY_CONFIGS[city]
    if (!config) return
    fetch(config.file)
      .then(res => res.json())
      .then(data => {
          setGeoData(data)
          // Reset transform when city changes
          transformRef.current = { x: 0, y: 0, k: 1 }
      })
  }, [city])

  const animTick = useCallback((now) => {
    const meta = metaRef.current
    if (!meta || !geoData) { rafRef.current = requestAnimationFrame(animTick); return }

    const delta   = lastTRef.current == null ? 0 : Math.min((now - lastTRef.current) / 1000, 0.1)
    lastTRef.current = now

    const { targets, spawns, dotRadius, w, h, bounds } = meta
    const maxStep  = MAX_SPEED * delta
    const targetARF = targetARFRef.current
    const total     = rows.length
    const activated = Math.floor(targetARF)
    
    const posX      = posXRef.current
    const posY      = posYRef.current
    const st        = stateRef.current
    const transform = transformRef.current
    if (!posX || !posY || !st) { rafRef.current = requestAnimationFrame(animTick); return }

    for (let i = 0; i < total; i++) {
      const isTargetActive = i <= activated
      if (st[i] === 0 && !isTargetActive) continue
      
      // If we are just starting to show this dot
      if (st[i] === 0 && isTargetActive) {
        posX[i] = spawns[i].x
        posY[i] = spawns[i].y
        st[i] = 1
      }

      // Calculate where the target IS right now based on map transform
      const p = project(targets[i].lon, targets[i].lat, bounds, w, h, transform)
      
      // If zoom is enabled, we 'freeze' the animation state and just stick them to their map targets
      if (zoomEnabled) {
          if (st[i] !== 0) {
              posX[i] = p.x
              posY[i] = p.y
              st[i] = 2 // Lock to target
          }
          continue
      }

      const tx = isTargetActive ? p.x : spawns[i].x
      const ty = isTargetActive ? p.y : spawns[i].y

      const dx = tx - posX[i]
      const dy = ty - posY[i]
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist <= maxStep || dist < 0.5) {
        posX[i] = tx
        posY[i] = ty
        st[i] = isTargetActive ? 2 : 0
      } else {
        st[i] = 1
        posX[i] += (dx / dist) * maxStep
        posY[i] += (dy / dist) * maxStep
      }
    }

    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      ctx.clearRect(0, 0, w, h)
      
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, w, h)

      geoData.features.forEach(f => {
        const type = f.geometry.type
        const coords = type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
        const isHovered = hoveredFeature === f
        
        ctx.save()
        if (isHovered) {
          let cX = 0, cY = 0, count = 0
          coords.forEach(poly => poly[0].forEach(c => {
             const p = project(c[0], c[1], bounds, w, h, transform)
             cX += p.x; cY += p.y; count++
          }))
          ctx.translate(cX/count, cY/count)
          ctx.scale(1.03, 1.03)
          ctx.translate(-cX/count, -cY/count)
          ctx.fillStyle = '#e0e0e0'
          ctx.strokeStyle = '#a0a0a0'
        } else {
          ctx.fillStyle = '#f0f0f0'
          ctx.strokeStyle = '#d0d0d0'
        }
        
        ctx.lineWidth = isHovered ? 1.0 : 0.5
        
        ctx.beginPath()
        coords.forEach(poly => {
          poly.forEach(ring => {
            ring.forEach((c, idx) => {
              const p = project(c[0], c[1], bounds, w, h, transform)
              if (idx === 0) ctx.moveTo(p.x, p.y)
              else ctx.lineTo(p.x, p.y)
            })
          })
        })
        ctx.fill()
        ctx.stroke()
        ctx.restore()
      })

      ctx.fillStyle = '#94a3b8'
      ctx.font = "bold 12px system-ui"
      ctx.textAlign = "left"
      ctx.fillText(city === 'SF' ? "SAN FRANCISCO" : "LOS ANGELES", H_PAD + 10, V_PAD + 20)

      // 3. Draw dots
      ctx.save()
      ctx.globalAlpha = 0.8
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 0.5
      let lastColor = null
      for (let i = 0; i < total; i++) {
        if (st[i] === 0) continue
        const isActiveRow = (i === activated)
        let color = st[i] === 2 ? rows[i].statusColor : '#BCBCBC'
        if (isActiveRow && st[i] === 1) color = rows[i].statusColor

        if (color !== lastColor) { ctx.fillStyle = color; lastColor = color }
        const r = (isActiveRow ? dotRadius * 2.5 : dotRadius) * transform.k
        ctx.beginPath()
        ctx.arc(posX[i], posY[i], Math.max(0.5, r), 0, Math.PI * 2)
        ctx.fill()
        if (transform.k > 1.5) ctx.stroke()
      }
      ctx.restore()
    }

    rafRef.current = requestAnimationFrame(animTick)
  }, [rows, city, geoData, hoveredFeature])

  const setup = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas || !rows.length || !geoData) return
    const w   = canvas.offsetWidth
    const h   = canvas.offsetHeight
    const dpr = window.devicePixelRatio || 1
    canvas.width  = w * dpr
    canvas.height = h * dpr
    const ctx = canvas.getContext('2d')
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    
    const bounds = getFullBounds(geoData.features, rows)
    
    const targets = rows.map((row) => {
        const coords = ZIP_COORDINATES[row.zip] || (city === 'SF' ? [-122.419, 37.774] : [-118.243, 34.052])
        const jitterX = (Math.random() - 0.5) * 0.005 // Jitter in degrees now
        const jitterY = (Math.random() - 0.5) * 0.005
        return { lon: coords[0] + jitterX, lat: coords[1] + jitterY }
    })

    const spawns = rows.map(() => ({ 
      x: H_PAD + Math.random() * (w - H_PAD * 2), 
      y: h + 20 
    }))

    metaRef.current = { dotRadius: 2.5, targets, spawns, w, h, bounds }
    initAnimState(rows.length)
    if (stateRef.current) stateRef.current.fill(0)
  }, [rows, initAnimState, city, geoData])

  useEffect(() => { drawRef.current = (arf) => { targetARFRef.current = arf } }, [drawRef])

  useEffect(() => {
    lastTRef.current = null
    rafRef.current = requestAnimationFrame(animTick)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [animTick])

  useEffect(() => {
    setup()
    const parent = canvasRef.current?.parentElement
    if (!parent) return
    let timer
    const ro = new ResizeObserver(() => { clearTimeout(timer); timer = setTimeout(setup, 50) })
    ro.observe(parent)
    return () => { ro.disconnect(); clearTimeout(timer) }
  }, [setup])

  const onWheel = useCallback((e) => {
      if (!zoomEnabled) return
      e.preventDefault()
      const t = transformRef.current
      const zoomSpeed = 0.001
      const newK = Math.max(0.5, Math.min(10, t.k - e.deltaY * zoomSpeed * t.k))
      
      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top
      
      // Zoom toward mouse
      const factor = newK / t.k
      t.x = mx - (mx - t.x) * factor
      t.y = my - (my - t.y) * factor
      t.k = newK
  }, [zoomEnabled])

  const onMouseDown = useCallback((e) => {
      if (!zoomEnabled) return
      isDraggingRef.current = true
      lastMousePosRef.current = { x: e.clientX, y: e.clientY }
  }, [zoomEnabled])

  const onMouseMove = useCallback((e) => {
    const meta = metaRef.current
    if (!meta || !geoData) return
    
    if (isDraggingRef.current && zoomEnabled) {
        const dx = e.clientX - lastMousePosRef.current.x
        const dy = e.clientY - lastMousePosRef.current.y
        transformRef.current.x += dx
        transformRef.current.y += dy
        lastMousePosRef.current = { x: e.clientX, y: e.clientY }
        return
    }

    const canvas = canvasRef.current
    const rect   = canvas.getBoundingClientRect()
    const mx     = e.clientX - rect.left
    const my     = e.clientY - rect.top
    const { dotRadius, w, h, bounds } = meta
    const transform = transformRef.current
    
    const [mLon, mLat] = inverseProject(mx, my, bounds, w, h, transform)

    const hitR   = (dotRadius + 6) * transform.k
    const st     = stateRef.current
    if (!st) return

    let foundDot = false
    const posX = posXRef.current
    const posY = posYRef.current
    for (let i = rows.length - 1; i >= 0; i--) {
      if (st[i] !== 2) continue
      const dx = mx - posX[i]
      const dy = my - posY[i]
      if (dx * dx + dy * dy <= hitR * hitR) {
        const text = getTooltipText(rows[i].statusNormalized)
        if (!text) break
        const el   = tooltipRef.current
        el.style.display    = 'block'
        el.style.left       = `${mx + 10}px`
        el.style.top        = `${my - 20}px`
        tooltipAddrRef.current.textContent = rows[i].streetName
        tooltipTextRef.current.textContent = text
        tooltipZipRef.current.textContent = rows[i].zip ? `ZIP: ${rows[i].zip}` : ''
        foundDot = true
        break
      }
    }

    let foundFeat = null
    for (const f of geoData.features) {
      const coords = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates
      let inside = false
      for (const poly of coords) {
        if (isPointInPoly([mLon, mLat], poly[0])) { inside = true; break }
      }
      if (inside) { foundFeat = f; break }
    }
    setHoveredFeature(foundFeat)

    if (!foundDot) {
      if (foundFeat) {
        const el = tooltipRef.current
        el.style.display = 'block'
        el.style.left = `${mx + 10}px`
        el.style.top = `${my - 20}px`
        tooltipAddrRef.current.textContent = foundFeat.properties.name.toUpperCase()
        tooltipTextRef.current.textContent = ""
        
        let nearestZip = null
        let minDist = Infinity
        Object.entries(ZIP_COORDINATES).forEach(([zip, coords]) => {
            const dLon = coords[0] - mLon
            const dLat = coords[1] - mLat
            const dist = dLon*dLon + dLat*dLat
            if (dist < minDist) { minDist = dist; nearestZip = zip }
        })
        tooltipZipRef.current.textContent = nearestZip ? `ZIP: ${nearestZip}` : ''
      } else {
        if (tooltipRef.current) tooltipRef.current.style.display = 'none'
      }
    }
  }, [rows, geoData, zoomEnabled])

  const onMouseUp = useCallback(() => {
      isDraggingRef.current = false
  }, [])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <button
        onClick={() => setZoomEnabled(!zoomEnabled)}
        title={zoomEnabled ? "Lock Zoom" : "Enable Zoom & Pan"}
        style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          zIndex: 30,
          background: zoomEnabled ? '#1D2CF3' : '#fff',
          color: zoomEnabled ? '#fff' : '#1D2CF3',
          border: '1.5px solid #1D2CF3',
          borderRadius: '50%',
          width: '36px',
          height: '36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.2s ease',
          padding: 0
        }}
      >
        <MagnifyingGlassIcon active={zoomEnabled} />
      </button>
      <canvas
        ref={canvasRef}
        style={{ 
          display: 'block', 
          width: '100%', 
          height: '100%', 
          cursor: !zoomEnabled ? 'default' : (isDraggingRef.current ? 'grabbing' : 'grab') 
        }}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={() => { 
            if(tooltipRef.current) tooltipRef.current.style.display = 'none';
            setHoveredFeature(null);
            isDraggingRef.current = false;
        }}
      />
      <div
        ref={tooltipRef}
        style={{
          display:       'none',
          position:      'absolute',
          pointerEvents: 'none',
          background:    '#fff',
          border:        '1px solid #e0e0e0',
          borderRadius:  '4px',
          padding:       '7px 11px',
          maxWidth:      '210px',
          boxShadow:     '0 2px 10px rgba(0,0,0,0.10)',
          zIndex:        20,
        }}
      >
        <div ref={tooltipAddrRef} style={{ fontSize: '13px', color: '#000', marginBottom: '2px', textTransform: 'uppercase', fontWeight: 800 }} />
        <div ref={tooltipZipRef} style={{ fontSize: '10px', color: '#666', marginBottom: '4px', fontWeight: 600 }} />
        <div ref={tooltipTextRef} style={{ fontSize: '11px', color: '#333', lineHeight: 1.4 }} />
      </div>
    </div>
  )
}
