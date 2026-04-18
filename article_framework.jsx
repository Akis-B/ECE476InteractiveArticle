import { useRef } from 'react'
import IMessageOverlay        from './src/components/IMessageOverlay'
import ArticleHero            from './src/components/ArticleHero'
import ArticleSection         from './src/components/ArticleSection'
import FindingBox             from './src/components/FindingBox'
import StatRow                from './src/components/StatRow'
import ScrollySection         from './src/components/scrolly/ScrollySection'
import StepBlock              from './src/components/scrolly/StepBlock'
import PlatformMapGraphic     from './src/components/graphics/PlatformMapGraphic'
import './src/styles/global.css'

// ── Article metadata ──────────────────────────────────────
const HERO = {
  tag:      'Feature · Housing',
  title:    'How Landlords Use Algorithms to <em>Filter Out</em> Section 8 Tenants',
  deck:     'Across dozens of rental platforms, voucher holders are screened out before a human ever reads their application — and the data makes it plain.',
  author:   'Sofia James',
  initials: 'SJ',
  date:     'April 18, 2026',
  readTime: '9 min read',
}

const STATS = [
  { value: '73%', label: 'of voucher applications receive no response within 48 hrs', color: 'var(--blue)' },
  { value: '41',  label: 'states still allow source-of-income discrimination',         color: 'var(--rust)' },
  { value: '2.3M',label: 'voucher holders compete for housing each year',              color: 'var(--teal)' },
]

// ─────────────────────────────────────────────────────────
export default function ArticleFramework() {
  const spacerRef = useRef(null)

  return (
    <div style={{ background: 'var(--bg)' }}>
      <IMessageOverlay spacerRef={spacerRef} />

      {/* Scroll zone — hero sticks here while overlay plays */}
      <div ref={spacerRef} style={{ height: '500vh', position: 'relative' }}>
        <ArticleHero {...HERO} />
      </div>

      {/* Article body */}
      <main>
        <div className="art-wrap">
          <hr className="section-divider" />

          <ArticleSection>
            <p className="body-text">
              When Darnell Richardson messaged a landlord on a popular rental app last spring,
              the exchange lasted under two minutes. He asked about a two-bedroom near his
              daughter's school. He mentioned, almost as an aside, that he held a Housing
              Choice Voucher — the federal subsidy commonly called Section 8. The landlord
              replied that they were "not familiar" with the program. Richardson sent a
              follow-up. No response came.
            </p>
            <p className="body-text">
              What Richardson didn't know was that the platform he was using had already
              flagged his application before that conversation even started. An automated
              scoring system had marked his inquiry as lower priority the moment it
              cross-referenced his income documentation type against the platform's default filters.
            </p>
          </ArticleSection>

          <FindingBox>
            "The discrimination isn't always a slammed door anymore. It's a quiet
            redirect — a form that never loads, a reply that never comes."
          </FindingBox>
        </div>

        <ScrollySection graphic={PlatformMapGraphic}>
          <StepBlock step={0}>
            <h2 className="section-heading">Before the Algorithm</h2>
            <p className="body-text">
              Before 2018, screening was largely manual. Landlords reviewed
              applications individually. Bias existed, but it required a deliberate
              choice — a phone call ignored, a showing cancelled.
            </p>
          </StepBlock>
          <StepBlock step={1}>
            <h2 className="section-heading">Platform-Assisted Filters</h2>
            <p className="body-text">
              Between 2019 and 2021, platforms introduced income-ratio checks and
              document classification. Section 8 income types began triggering
              automated flags — not rejections, just quiet deprioritization.
            </p>
          </StepBlock>
          <StepBlock step={2}>
            <h2 className="section-heading">Full Pre-Screening</h2>
            <p className="body-text">
              Today, risk-scoring pipelines run before any human sees the
              application. Voucher holders are routed to a lower queue. The landlord
              never decides — the system already did.
            </p>
          </StepBlock>
        </ScrollySection>

        <div className="art-wrap">
          <hr className="section-divider" />

          <ArticleSection heading="The Algorithmic Turn">
            <p className="body-text">
              Over the past decade, rental platforms have quietly integrated screening tools
              that go far beyond credit scores. Income-verification APIs, document
              classification models, and risk-scoring engines now sit between a prospective
              tenant's first message and a landlord's eyes. For voucher holders, these layers
              often create invisible barriers that are legally murky and practically insurmountable.
            </p>
            <p className="body-text">
              Fifteen states and dozens of cities have passed source-of-income
              anti-discrimination laws. Yet enforcement is patchy, and the algorithmic
              infrastructure many platforms use operates in a gray zone — automated enough
              to obscure intent, customizable enough to encode bias.
            </p>
            <StatRow stats={STATS} />
          </ArticleSection>

          <hr className="section-divider" />

          <ArticleSection heading="What the Platforms Say">
            <p className="body-text">
              Several major rental platforms declined to comment on specific screening
              criteria, citing proprietary algorithms. One spokesperson said their system
              "does not discriminate based on source of income" and that any filters reflect
              "landlord-configured preferences" — a distinction housing advocates say is
              legally meaningless when the platform enables those preferences at scale.
            </p>
            <p className="body-text">
              For Richardson, the distinction is academic. He's still looking.
            </p>
          </ArticleSection>

          <p className="art-footer">
            Data analysis by the ECE 476 Investigative Data Lab · April 2026
          </p>
        </div>
      </main>
    </div>
  )
}
