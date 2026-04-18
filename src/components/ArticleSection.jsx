export default function ArticleSection({ heading, children }) {
  return (
    <section className="section-block">
      {heading && <h2 className="section-heading">{heading}</h2>}
      {children}
    </section>
  )
}
