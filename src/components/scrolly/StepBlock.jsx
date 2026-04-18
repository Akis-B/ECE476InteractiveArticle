// step — integer passed to IntersectionObserver; must match graphic's logic
export default function StepBlock({ step, children }) {
  return (
    <div className="scrolly-step" data-step={step}>
      <div className="scrolly-step-inner">{children}</div>
    </div>
  )
}
