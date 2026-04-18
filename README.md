## Project structure

```
article_framework.jsx       # root component — article content and layout
src/
  components/
    IMessageOverlay.jsx     # scroll-triggered iMessage conversation
    ArticleHero.jsx         # sticky hero with title, byline, deck
    ArticleSection.jsx      # reusable prose section wrapper
    FindingBox.jsx          # pull-quote / callout block
    StatRow.jsx             # three-up stat cards
    scrolly/
      ScrollySection.jsx    # two-column scrollytelling layout (IntersectionObserver)
      StepBlock.jsx         # individual narrative step
    graphics/
      PlatformMapGraphic.jsx  # sticky graphic that reacts to active step
  styles/
    global.css              # design tokens, typography, layout
  assets/
    fonts/                  # Proxima Nova, Univers LT
    icons/
    illustrations/
```

## Getting started

```bash
npm install
npm run dev
```

Then open `http://localhost:5173`.

## Build

```bash
npm run build   # outputs to dist/
npm run preview # preview the production build locally
```

## Tech stack

- React 19
- Vite 8
- Tailwind CSS 4
- Vanilla CSS for component-level styles (`global.css`)


