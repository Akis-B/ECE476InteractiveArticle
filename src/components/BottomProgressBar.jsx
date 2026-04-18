export default function BottomProgressBar({ fillRef }) {
  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '7px',
      background: 'rgba(0,0,0,0.07)',
      zIndex: 300,
    }}>
      <div
        ref={fillRef}
        style={{
          height: '100%',
          width: '0%',
          background: '#053888',
        }}
      />
    </div>
  )
}
