# src/assets/

Drop Figma exports here. Vite handles everything — no config needed.

## Folder structure

```
src/assets/
├── icons/          ← small SVG icons (broker avatar, UI icons, etc.)
├── illustrations/  ← larger SVG or PNG illustrations from Figma
├── maps/           ← map graphics, zip-code overlays, shapefiles
└── photos/         ← photos (JPG/WebP). Prefer WebP for performance.
```

## How to export from Figma

1. Select the frame or component in Figma
2. In the right panel → Export → choose SVG (for graphics/icons) or PNG/WebP (for photos)
3. Click Export and drop the file into the right folder here

**Tip:** For icons, export at 1× as SVG.
**Tip:** For illustrations, export as SVG if they are vector, PNG/WebP at 2× if they contain raster effects.
**Tip:** For photos, export as WebP at 80% quality for smallest file size.

## How to use in React

### As an `<img>` tag (simplest — works for PNG, WebP, SVG)
```jsx
import housingGraphic from '../assets/illustrations/housing-graphic.svg'

<img src={housingGraphic} alt="Housing illustration" />
```

### As an inline SVG component (lets you style with CSS / animate)
```jsx
import { ReactComponent as BrokerAvatar } from '../assets/icons/broker-avatar.svg'

<BrokerAvatar className="broker-avatar" width={56} height={56} />
```
> Note: the `ReactComponent` import requires the `vite-plugin-svgr` plugin.
> Run: `npm install -D vite-plugin-svgr`
> Then add to vite.config.js:
> ```js
> import svgr from 'vite-plugin-svgr'
> plugins: [react(), svgr()]
> ```

### Referencing in CSS (for backgrounds)
```css
.hero-bg {
  background-image: url('/src/assets/illustrations/housing-graphic.svg');
}
```
