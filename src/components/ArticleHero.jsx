export default function ArticleHero({ tag, title, deck, author, date, readTime, initials }) {
  return (
    <div className="article-hero-sticky">
      <div className="art-wrap">
        <span className="tag">{tag}</span>
        <h1 className="article-title" dangerouslySetInnerHTML={{ __html: title }} />
        <p className="body-text hero-deck">{deck}</p>
        <div className="byline">
          <div className="avatar">{initials}</div>
          <div>
            <div className="byline-name">{author}</div>
            <div className="byline-meta">{date} · {readTime}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
