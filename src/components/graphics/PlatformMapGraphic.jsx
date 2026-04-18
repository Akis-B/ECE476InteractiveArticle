// Placeholder — replace with your real D3/canvas/SVG graphic.
// Receives activeStep (int) from ScrollySection.

const STEPS = [
  {
    label: 'Step 1',
    headline: 'Manual screening (pre-2018)',
    color: 'var(--teal)',
    description: 'Landlords reviewed applications individually. Bias existed but required deliberate action.',
  },
  {
    label: 'Step 2',
    headline: 'Platform-assisted filters (2019–2021)',
    color: 'var(--blue)',
    description: 'Platforms introduced income-ratio checks. Section 8 income classifications began triggering automated flags.',
  },
  {
    label: 'Step 3',
    headline: 'Algorithmic pre-screening (2022–present)',
    color: 'var(--rust)',
    description: 'Full risk-scoring pipelines now run before any human sees the application. Voucher holders are deprioritized silently.',
  },
]

export default function PlatformMapGraphic({ activeStep }) {
  const step = STEPS[activeStep] ?? STEPS[0]

  return (
    <div className="placeholder-graphic">
      <div
        className="placeholder-graphic-chip"
        style={{ background: step.color }}
      >
        {step.label}
      </div>
      <h3 className="placeholder-graphic-headline">{step.headline}</h3>
      <p className="placeholder-graphic-desc">{step.description}</p>

      {/* Step dots */}
      <div className="placeholder-graphic-dots">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`placeholder-dot ${i === activeStep ? 'active' : ''}`}
            style={{ background: i === activeStep ? step.color : 'var(--border)' }}
          />
        ))}
      </div>
    </div>
  )
}
