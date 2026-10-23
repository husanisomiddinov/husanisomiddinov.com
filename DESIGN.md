# Design philosophy

The rulebook for how this site looks, reads and moves. Read it before adding or changing anything visible: a page, a component, a diagram, a line of copy. If a change breaks a rule here, either fix the change or update this file in the same commit, so the file never lies.

Where this file and the code disagree, the code in `src/app/globals.css` is the source of truth for tokens, and this file is the source of truth for intent.

## Contents

1. [The idea](#1-the-idea)
2. [Principles](#2-principles)
3. [Hard rules (never do)](#3-hard-rules-never-do)
4. [Color](#4-color)
5. [Typography](#5-typography)
6. [Layout and spacing](#6-layout-and-spacing)
7. [Shape, borders and elevation](#7-shape-borders-and-elevation)
8. [Components](#8-components)
9. [Page patterns](#9-page-patterns)
10. [Motion](#10-motion)
11. [Diagrams](#11-diagrams)
12. [Imagery](#12-imagery)
13. [Voice and copy](#13-voice-and-copy)
14. [Accessibility](#14-accessibility)
15. [Responsive behavior](#15-responsive-behavior)
16. [Code conventions that protect the design](#16-code-conventions-that-protect-the-design)
17. [Adding something new: the checklist](#17-adding-something-new-the-checklist)
18. [Known inconsistencies](#18-known-inconsistencies)

---

## 1. The idea

A personal website that feels like a well-kept notebook: one narrow column, warm paper-green background, near-black ink, one olive accent, a serif for headings and the system sans for everything else. It is quiet on purpose. The content (essays, books, projects) is the design; the interface gets out of the way.

Three words to hold onto: **plain, warm, precise.**

- **Plain.** No decoration that does not carry meaning. No gradients on surfaces, no shadows on cards, no hero banners, no animated backgrounds.
- **Warm.** The page is a green-tinted off-white, never pure white or pure black. The heading serif has personality. Copy sounds like a person.
- **Precise.** Small, consistent scales for type, spacing and radius. Every value is one of a few allowed values, never a one-off.

The site descends from masonjwang.com and akbar.one (content column width, system sans stack). It is a derivative, not a copy: the olive palette and the serif headings are this site's own.

## 2. Principles

1. **One way to do each thing.** There is one page title, one button, one back link, one prose style. If something exists, use it. If a second variant seems needed, extend the existing component instead of forking it.
2. **Restraint beats flourish.** When unsure, remove. A section that is plainer than you think it should be is probably right. Before inventing a layout, open an existing page and match its level of effort.
3. **Hierarchy comes from ink and size, not from boxes.** Emphasis is near-black on muted gray, bold weight and size steps. Not borders, backgrounds or color.
4. **Color is rare, so it means something.** Olive marks "interactive" or "current". Everything else is gray ink on the page background.
5. **Motion explains, never decorates.** Animation shows data moving, state changing or content arriving. It is slow, soft and always has a reduced-motion fallback.
6. **Content first, then structure, then style.** Write the real content, choose the pattern that fits it, then style it with existing tokens.
7. **Every value is a token or a scale step.** If you type a hex color or a pixel size that is not in this file, stop and ask whether it should be.
8. **Accessible by default.** Contrast, focus rings, keyboard paths, semantic HTML and reduced motion are part of "done", not a polish pass.

## 3. Hard rules (never do)

These come from direct feedback and from what has already been judged to look generic or AI-made. They are not negotiable and they override taste.

- **No eyebrow labels.** No small label or kicker above a heading, in any style: not all-caps tracked text, not small mono tags, not "Platform" or "Reasoning" style tags above titles. Lead with the heading itself. Small mono or small text is for real data only (dates, counts, code, captions).
- **No all-caps styling and no wide letter-spacing** on labels, links, buttons or headers. Use sentence case. (Navigation labels are lowercase by design: `reading`, `writing`, `projects`, `idk`.)
- **No em dashes or en dashes** in copy, comments or content. Use a comma, a period, a colon, or a plain hyphen for label-style separators ("Merch - Agora Runs"). Number ranges use "to" or a hyphen.
- **No templated section formula.** Do not default to "big heading + one accent-colored word + two-column split + scroll reveal". Vary structure, and match the plainer native pages.
- **No new colors outside the palette** (section 4), including for charts and diagrams (section 11 has the only extra palette).
- **No box shadows on content.** The only shadow on the site is the mobile drawer.
- **No gradients on surfaces, no glassmorphism, no emoji as decoration, no stock illustration style.**
- **No decorative animation** (parallax, scroll-jacking, floating blobs, auto-playing carousels, typing effects).
- **No second webfont.** The heading serif is the only loaded face.
- **No pure `#000` or `#fff`** for page, text or surfaces. Use the tokens.
- **No hover-only information.** Anything revealed on hover must also be reachable by keyboard and touch.
- **No horizontal page scroll at any width.** Wide content scrolls inside its own container.

## 4. Color

Defined as `@theme` tokens in `src/app/globals.css`. Use the Tailwind utility names (`bg-brand-50`, `text-gray-600`), never raw hex in components.

### Surfaces

| Token | Value | Use |
| --- | --- | --- |
| `page-bg` | `#eff0e8` | The page, nav bars, the mobile drawer. Slightly lighter than masonjwang.com's. |
| `brand-50` | `#f6f7f4` | Raised surfaces: diagram figures, callout blocks, placeholder thumbnails, preview cards. One step lighter than the page. |
| `brand-100` | `#e8ebe0` | Soft olive tint: thumbnail borders, tinted fills. |

A raised surface is `bg-brand-50`, a half step lighter than the page. Never darker, never white.

### Accent (olive)

| Token | Value | Use |
| --- | --- | --- |
| `brand-200` | `#c2cb9c` | Progress fills, light accents. |
| `brand-300` | `#a8b47a` | Link underline color. |
| `brand-500` | `#5b6529` | The accent: active nav, hover color, primary button, list numerals, focus outline, text selection background. |
| `brand-600` | `#4d5628` | Hover state of `brand-500` surfaces. |

Body links use `#6a7637` (a touch more vivid than `brand-500`, so links stand out from near-black text). It is set once in `.prose a`; do not reuse the hex elsewhere.

### Ink (text grays)

All of these pass WCAG AA (4.5:1) on `page-bg`. Choose by role, not by feel.

| Token | Value | Role |
| --- | --- | --- |
| `gray-900` | `#111111` | Rare. Active-state fills (the dark tab, dark number badge). |
| `gray-800` / `gray-700` / `ink` | `#2a2925` | Reading ink: headings, body copy meant to be read, titles. |
| `gray-600` | `#4f4e49` | Secondary copy, nav links at rest, default body color. |
| `gray-500` | `#5f5e59` | Meta: captions, breadcrumbs, dates next to titles, tech lines. |
| `gray-400` | `#6b6a64` | Tertiary: small counts, current breadcrumb, short dates. Still AA. |
| `gray-300` | `#d9d9d7` | Hairlines: `hr`, nav underline, button outline, dividers. |
| `gray-200` | `#e9e9e7` | Faintest borders around images and cards. |

Note the inversion: `gray-400` is a darker value than its number suggests, chosen so that light-looking text still passes contrast. Do not "fix" it.

### Code

`code` = `#b5384e`, used only for inline code text. Inline code sits in a `bg-brand-50` chip with a `gray-200` border and `0.85em` size.

### Rules

- Default body text color is `gray-600`. Text meant to be read as sentences (`text-prose`) is `gray-800` or `gray-600` depending on its role: primary content gets `ink`, supporting descriptions get `gray-600`.
- Interactive and current states turn `brand-500`. Nothing else uses it for text.
- Use opacity steps of the ink color for subtle variants only when a token does not exist; prefer a token.
- Selection: olive background, `brand-50` text. Already global.
- The site is light only (`colorScheme: "light"` in `layout.tsx`). Do not add dark-mode variants piecemeal. If dark mode ever happens, it is a whole-site project with its own token pass.

## 5. Typography

Two faces. That is all.

| Role | Face | Where |
| --- | --- | --- |
| Headings | Averia Serif Libre (`font-heading`), then Iowan Old Style, Georgia, serif | Page titles, section headings, CTA titles, article headings. |
| Everything else | System sans stack (`font-sans`, `--font-body`): `-apple-system`, `system-ui`, Segoe UI, Inter, Helvetica, Arial | Body, nav, dates, labels, buttons, captions. |
| Data and code only | The platform monospace (`font-mono`) | Diagram labels, code, genuine data. Never as decorative tags. |

Headings always get `tracking-heading` (`-0.01em`). Italic is disabled globally (`em`, `i` render upright); emphasis is **bold**, not slant. Semibold maps to a true bold (700) because body stays at 400 and emphasis comes from ink contrast plus weight.

### Scale

Use these. Do not add sizes.

| Role | Classes | Notes |
| --- | --- | --- |
| Page title | `<PageTitle>`: `font-heading tracking-heading text-xl md:text-2xl leading-snug font-bold text-gray-800` | Every page `h1` goes through this component. |
| Project page title | `font-heading tracking-heading text-4xl leading-tight font-bold text-balance` | The one place a larger title is used, centered. |
| Article section heading (h2) | `font-heading tracking-heading text-3xl font-bold`, `pt-8` | Numbered ("3. Execution Flow") on project pages. |
| Article sub-heading (h3) | `font-heading tracking-heading text-xl font-bold`, `pt-3` | |
| CTA title | `font-heading tracking-heading text-2xl font-bold` | |
| Row title | `font-sans text-lg font-bold leading-snug` (projects, experiences) or `text-base font-bold` (essays) | Turns `brand-500` on group hover. |
| Reading text | `text-prose`: 1.0625rem (17px), line-height 1.7 | Sentences meant to be read. |
| Reading text, compact | `text-prose-sm`: 0.9375rem (15px), line-height 1.6 | Excerpts, tab panels. |
| UI default | 0.9375rem (15px), line-height 1.6 | The `body` default. |
| Nav (desktop) | `text-base` | |
| Nav (mobile drawer) | `text-lg` | |
| Meta | `text-sm` | Dates, roles, tech lines, breadcrumbs, captions. |
| Fine print | `text-xs` | Short dates, reading time, footer, legends. |

Weights in use: 400 (body), 500 (`font-medium` on tabs and numerals), 600/700 (`font-bold`, `font-semibold`). Do not use 300 or 800+.

Rules:
- Body copy never goes below 15px. Fine print (`text-xs`, 12px) is for data, never for sentences the reader needs.
- Use `text-balance` on centered headings and `text-wrap: pretty` (already in `.prose p`) on paragraphs.
- Line length is controlled by the 660px column. Never widen text beyond it.
- Truncate with `line-clamp-2` or `line-clamp-3` in list rows, never with JS.
- Sentence case everywhere. Proper nouns keep their capitals. Titles of things (projects, essays) are written as the author wrote them.

### Prose (MDX content)

Long-form content renders inside `<Prose>` (the `.prose` class). It is hand-authored, deliberately not `@tailwindcss/typography`.

- `h1` centered, 1.75rem. `h2` to `h6` 1.3125rem, `margin-top: 2.5rem`. The first heading in the article has a smaller top margin.
- Paragraphs: `text-prose`, `ink`, `margin-bottom: 1rem`.
- Links: `#6a7637`, weight 600, dotted underline in `brand-300` at 1.5px with 3px offset. Hover goes to `brand-600` with a `brand-500` underline.
- Lists: `text-prose`, 0.3rem between items.
- Code blocks scroll horizontally. `hr` uses `gray-300`.

### Links outside prose

Navigation and meta links are un-underlined `gray-500` or `gray-600` that turn `brand-500` on hover. Inline links inside sentences always use the prose link style (dotted underline). Never mix: a link in a paragraph looks like the prose link, a link in chrome looks like chrome.

## 6. Layout and spacing

### The column

Everything lives in one centered column, `max-w-content` = **41.25rem (660px)**. It is the most important layout decision on the site.

- Root wrapper (`layout.tsx`): `mx-auto w-full max-w-content px-4 pt-4 pb-8 mt-12 lg:mt-20 lg:px-0 lg:pt-6 md:pb-40`.
- Gutter is 16px (`px-4`) below `lg`; at `lg` and up the column is 660px with no padding.
- No page gets a second column or a sidebar. Nothing is wider than the column, except that diagram previews may flex within it.
- Pages are vertical stacks. Prefer `flex flex-col` with `gap-*` over margins on children.

### Navigation chrome

- Desktop (`lg+`): fixed top bar, `h-20`, `bg-page-bg`, a single `border-b border-gray-300` as wide as the column, logo left, links right with `gap-8`. `z-[100]`.
- Mobile: fixed top bar `h-12`, logo left, menu icon right. Menu opens a right-side drawer (`max-w-xs`, `bg-page-bg`, `shadow-xl`) over a `bg-black/30 backdrop-blur-sm` overlay. `z-50` for the bar, `z-[150]` overlay, `z-[200]` drawer.
- The logo is the word "Husan" in `text-xl font-semibold text-brand-500`. No logomark.

### Spacing scale

Use Tailwind's 4px scale and stay on these steps. Spacing communicates grouping: closer means related.

| Step | Use |
| --- | --- |
| `gap-0.5` / `gap-1` | Tight stacks: title + date, role + date. |
| `gap-2` to `gap-3` | Items inside one block: row title, summary, tags. |
| `gap-4` to `gap-5` | Between rows in a list, inside a card. |
| `gap-6` | Between a toolbar and its list, between a CTA's text and image. |
| `gap-8` | Between page-level groups. |
| `mt-6` / `mt-8` / `mt-12` | Between home page sections. Sections are separated by a `border-t border-gray-300` plus `pt-2` to `pt-8`. |
| `py-3` to `py-5` | Vertical padding inside a list row. |

Sections on the home page follow one rhythm: a hairline, some space, the content, a button. Do not give a section its own background band.

### Dividers

Hairlines (`border-gray-300`, 1px) separate rows and sections. They are the primary structural device, in place of cards. A list is rows with `<hr>` between them, not a stack of bordered boxes. Do not draw a hairline after the last row.

### Grids

Rare. Where used, they are small, content-sized and aligned to the column: the legend grid (`grid-cols-1 sm:grid-cols-2`), the experience row (`36px 1fr`). Do not build 3 or 4 column card grids.

## 7. Shape, borders and elevation

| Element | Radius |
| --- | --- |
| Buttons, thumbnails, image frames, preview cards | `rounded-lg` (8px) |
| Callout blocks, diagram figures, small chips | `rounded-md` (6px) |
| Inline code, icon buttons | `rounded` (4px) |
| Progress bars, range tracks | fully rounded |

Three radii, used by size: bigger objects get the bigger radius. Do not use `rounded-xl` or larger on content. Do not mix radii inside a single component.

Borders are 1px. `gray-300` for structure, `gray-200` for the faintest frame (around images and preview cards), `brand-100` for tinted frames. No double borders, no thick borders on content (the only 2px strokes are focus outlines and diagram strokes).

Elevation: **none.** Surfaces are separated by tone (`page-bg` vs `brand-50`) and hairlines. The only shadow is `shadow-xl` on the mobile drawer, which genuinely floats. Do not add `shadow-sm`, `shadow-md` or hover-lift effects.

## 8. Components

Each of these exists. Reuse it. If it almost fits, extend its props rather than copying its markup. Exports are re-exported from `src/components/index.ts`.

### `PageTitle`
The only page `h1` (except the project page, which has its own larger centered title). Never write a raw `h1` for a page.

### `Button`
The only button style. Olive filled (`primary`) or outlined (`secondary`). Sizes `md`, `sm`, `icon`. Renders a `Link` when given `href`.
- Shape `rounded-lg`, bold sans, `text-sm`, `transition-colors duration-200`.
- Primary: `bg-brand-500 text-brand-50`, hover `bg-brand-600`.
- Secondary: `border-gray-300`, hover border and text `brand-500`.
- Focus: 2px `brand-500` outline with 2px offset.
- One primary button per view. Labels are sentence case, short and specific ("Read about me", "For a coffee chat", "All projects →"). The arrow is the `&rarr;` entity, placed after the label, only for "go to the full list" buttons.

### `BackLink`
The one "back to X" link: `text-sm text-gray-500`, no underline, hover `brand-500`. Sits at the top of detail pages. Not a button.

### `Breadcrumbs`
`text-sm`, `gray-500` links, `gray-400` for the current page, `/` separators with `mx-1.5`. Always emits `BreadcrumbList` JSON-LD. Used on project pages.

### `CtaSection`
Optional serif title, one short paragraph, one primary button, optional illustration on the right (`w-28 sm:w-36`, 500x500 source, `sizes` set). Text left, image right, `gap-6`. Closing CTAs get `border-t border-gray-300 pt-8`.

### `EssayRow`
A row for writing: 52/60px thumbnail (cover image, or a first-letter placeholder on `brand-50`), bold title with date at the right, a two-line excerpt, reading time. The whole row is a link; title turns `brand-500` on group hover.

### `ProjectRow` / `ProjectsBrowser` / `FeaturedProjects`
A row with bold title, month-year date, three-line summary, optional live diagram previews, then the tech line joined with ` · `. The whole row is clickable through an `after:absolute after:inset-0` overlay on the title link. Rows fade up on entry (`.project-enter`), staggered 80ms per index. Filter tabs above the list are underline tabs (`border-b`), `brand-500` when active, with a muted count.

### `Experiences` / `ExperienceRow`
A 36px logo column and a content column. Name (bold `text-lg`) and date on one baseline, role in `text-sm gray-500`, description in `text-prose`. Optional photo gallery in a `rounded-lg` frame with `gray-200` border.

### `NumberedList`
Zero-padded index in `brand-500` (`01`, `02`), then the text in `text-prose gray-600`, hairlines between items. Used for facts and heuristics. Reuse it for any ranked or enumerated plain list instead of writing a new one.

### `Prose`
Wrapper for MDX. Never put `.prose` styles on arbitrary blocks.

### `MDXImage`
Images in MDX. Local images go through `next/image` (quality 85, full width, auto height). External images fall back to a plain `img`.

### `SocialIcons`, `icons.tsx`
Icons are small inline SVG components, monochrome, currentColor, sized by the parent. Do not add an icon font or an icon library for one or two glyphs.

### `ProjectProgressBar`
Segmented reading-progress bar pinned under the nav on project pages, one segment per article section, weighted by content length. Fill is `brand-200`, track `gray-200`. Desktop only (`lg+`), and only for long articles with numbered sections.

### Diagrams and previews
See section 11.

### Bookshelf and globe (3D)
Three.js scenes (`Bookshelf`, `VisitGlobe`). They use the site's tokens through CSS variables, respect reduced motion, stop rendering when idle or offscreen, dispose their GPU resources on unmount, and provide a non-WebGL fallback with working controls. New 3D work follows the same contract (see `README.md`).

### Adding a new component
1. Check the list above and the `components/` folder. Reuse before creating.
2. One responsibility, named for what it is, props that describe content not styling.
3. Style with tokens and the scales in this file. No inline hex.
4. Server component by default; `"use client"` only when it needs state, effects or browser APIs.
5. Handle empty, long, loading and reduced-motion states.
6. Export it from `components/index.ts` if pages use it.
7. Add it to this section if it introduces a new pattern.

## 9. Page patterns

### Home
Intro prose, a CTA with illustration, social icons, a hairline, then featured sections (experiences, projects, writing, books) separated by hairlines, a closing CTA and a footer. Each featured section ends in one button to its full page.

### Index pages (writing, projects, reading)
No decorative header. Optional filter tabs or year headings (`text-sm font-semibold gray-500`), then the list of rows. Writing is grouped by year. Projects are filterable by kind.

### Detail pages (essay, book, project)
BackLink or Breadcrumbs, the title, a meta line (date, links, tech) in `text-sm gray-500`, then the article. Project pages add a `brand-50` summary block with a numbered table of contents, numbered `h2` sections, diagrams inline, and the progress bar.

### Utility pages (facts, heuristics, quotes, arsenal, places, studio, about)
`PageTitle`, one line of context if needed, then a plain list (`NumberedList`) or a simple stack. Keep them as quiet as the index pages.

### 404
Home plus the primary nav links, in plain text. No illustration.

### Empty states
One plain sentence in `gray-500` ("This project hasn't started yet. Check back soon."). No icons, no illustrations.

## 10. Motion

Motion is slow, soft and meaningful. If you cannot say what an animation communicates, delete it.

### Timing and easing

| Purpose | Duration | Easing |
| --- | --- | --- |
| Color, border, opacity changes (hover, active) | `duration-200` | default |
| Drawers, overlays | `duration-300` | default |
| Content entering (`project-enter`) | 500ms | `ease-out`, from `opacity 0, translateY(10px)` |
| List stagger | 80ms per item | |
| Diagram flow stream | 1.4s | linear, infinite |
| Diagram pulse | 2.8s | ease-in-out, infinite |
| Diagram icon loops | 2.4s to 3.2s | |

Rules:
- Animate `opacity`, `transform` and color only. Never animate layout properties (`width`, `height`, `top`) on content; use `transform` or SVG attributes.
- Hover is a color change to `brand-500`. No scale-up, no lift, no shadow.
- Page scroll is smooth (`scroll-behavior: smooth`).
- Loading uses reserved space (set `width`/`height` or aspect ratio), not spinners, so nothing jumps.
- Infinite animations are allowed only in diagrams and only at low amplitude. They must not run offscreen when avoidable (3D scenes stop when offscreen; CSS loops are cheap enough to leave).

### Reduced motion (required)

Every animation has a fallback.
- CSS animations: add the class to the `@media (prefers-reduced-motion: reduce)` block in `globals.css` so it becomes `animation: none`. The static state must still read correctly (arrows still point, tiles still highlighted).
- JS-driven animation: use `useAnimationsEnabled()` from `components/diagrams/motion.ts` and render the resting state when it is false.
- 3D scenes: disable interpolation and render on demand.

## 11. Diagrams

Diagrams are first-class content on project pages. They follow the Pi (pi.website) approach: a **static layout with ambient motion**, not an interactive widget. The reader should understand it at a glance, and the motion should only show direction and life.

Code lives in `src/components/diagrams/`. Shared pieces are in `FlowKit.tsx`, hooks in `motion.ts`, the registry in `index.tsx`.

### Anatomy of the standard flow diagram
- A faint dot grid behind everything (`DiagramSvg`).
- Rounded **tiles** (`Tile`) for steps: bold mono title, muted mono subtitle.
- Thick **arrows** (`FlowArrow`, `HArrow`) with a light dash stream moving along them.
- A dashed **group box** (`Group`) for a boundary (a container, a service), with its title breaking the line.
- Bold **end labels** (`EndLabel`) above icons at the start and end of the flow.
- One **hot tile** per diagram: the step the story is about. It is yellow and pulses softly.
- An optional **return loop** in green for "repeat" or "feedback" paths, with its label sitting in a gap in the line.
- A caption below in the figure (`DiagramFigure`), `text-sm gray-600`, with the key phrase in bold.

### Diagram palette
Diagrams are the one place with extra colors. They stay within this set.

| Role | Value |
| --- | --- |
| Figure background | `brand-50` (via the figure), dots `#d9dccf` |
| Tile fill / edge | `#ecede6` / `#d3d5c8` |
| Hot tile fill / edge | `#f5d56f` / `#c9a93a` |
| Flow arrow | `#e3b341` |
| Return loop | `#9bb06a` |
| Group dashed edge | `#bfc2b2` |
| Ink / muted | `#2a2925` / `#6b6a64` |
| Spatial schematics (robot, laser, sampled data) | scan teal `#2f9e8f`, olive `#5b6529`, robot wedge blue `#5b84b8`, plus crop-condition colors for sample cards |

Use color to mean something: yellow is "the data in motion" and "the step that matters", green is "the loop back", olive is "reached or done". Do not add a new hue to a diagram without a meaning.

### Rules
1. **Static layout.** Nothing moves position except what the story needs to move (a robot driving, a scan line, flow dashes). Boxes never shift.
2. **One idea per diagram.** If it needs a legend of more than six items, split it.
3. **Mono for labels, sentence case, short.** Titles are the thing's name (`POST /predict`, `colcon build`), subtitles are one small fact (`224x224x3`). Mono is acceptable here because these are data labels, not decorative tags. No all-caps.
4. **Direction is always visible.** Every arrow has a head and a flow stream.
5. **Labels never collide.** Give arrow labels a clear gap, or leave the arrow unlabeled. If a label touches a tile, drop it.
6. **Gaps in loop lines are for their label**, and the label is bold title plus a mono subtitle, centered in the gap.
7. **Responsive.** Diagrams use `viewBox`, `h-auto w-full`, and a `min-w-[560px]` on the full-size version inside an `overflow-x-auto` figure so they scroll sideways on phones instead of shrinking to illegibility.
8. **Hydration safe.** Round computed coordinates (`Math.round(n * 10) / 10`) so server and client print identical digits.
9. **Accessible.** The `svg` has `role="img"` and an `aria-label` that states what the diagram shows in one sentence. Previews on cards are `aria-hidden`.
10. **Reduced motion** collapses flow, pulse, sweep and scan animations (global CSS) and stops timer loops (`useAnimationsEnabled`).
11. **Numbers come from the real work.** Spatial and metric diagrams use real coordinates, times and errors, and the caption says which parts are schematic.

### Adding a diagram
1. Create `FooDiagram.tsx` in `src/components/diagrams/`. Export `FooDiagram` (the full figure) and `FooPreview` (the card version, same scene without the figure chrome).
2. Build it from `FlowKit` primitives. Add a primitive to `FlowKit` if you need the same thing twice.
3. Register it in `index.tsx`: `DIAGRAMS` for the page embed, `DIAGRAM_PREVIEWS` with the correct `aspect` (width / height of the viewBox). Use `bare: true` only for small still images that keep a compact slot.
4. Embed it in a project description with a line `[[diagram:name]]` on its own.
5. Add its name to the project's `previews` array in `content/data/portfolio/projects.json` to show it on the projects index.
6. Check it at phone width, with reduced motion on, and in the card preview.

### Keyframes
Defined once in `globals.css`: `diagram-flow` (dash offset, period 22 to match `strokeDasharray="6 16"`), `diagram-pulse`, `diagram-sweep`, `diagram-scan`, `diagram-bar`. Reuse them. If you change a dash pattern, keep its period equal to the `diagram-flow` offset or the stream will stutter.

## 12. Imagery

- **Style of illustration:** small, soft 3D-rendered objects on transparent backgrounds (`rover.webp`, `plant.webp`, `coffee-cup.png`, `retro-computer.png`). They are objects, not scenes, shown small (`w-28 sm:w-36`).
- **Photos:** shown at their true aspect ratio in a `rounded-lg` frame with a `gray-200` border. Never cropped to a decorative shape. Galleries solve for equal heights so nothing is cropped (see `Experiences`).
- **Covers and thumbnails:** square 52/60px, `rounded-lg`, `gray-200` border. Without a cover, a first-letter placeholder on `brand-50` with a `brand-100` border.
- **Format and loading:** use `next/image` with explicit `width`/`height` and a correct `sizes`. Prefer `webp`. Optimize with `yarn optimize-images`. Lazy by default; `loading="eager"` only for above-the-fold logos.
- **Alt text:** meaningful for content images, empty (`alt=""`) for decorative ones, and `aria-hidden` on repeated gallery thumbnails.
- **Logos:** shown in a 36px square, `object-contain`, with an optional `logoScale` to fix optical size.
- **No stock photography, no AI-looking hero art, no background images behind text.**

## 13. Voice and copy

The site speaks in first person, plainly, with dry humor and honesty. It reads like the author talking.

- **Plain words, short sentences.** Say what the thing is and what it does. Avoid hype ("revolutionary", "seamless", "cutting-edge"), and avoid filler openers.
- **First person, present tense** for projects and about text. "I drive with keyboard teleop until the room is covered."
- **Concrete over abstract.** Numbers, names, results: "5 out of 5 goals, arrival error 0.03 to 0.11 m."
- **No em dashes or en dashes.** Use commas, periods, colons or a hyphen (section 3).
- **Sentence case** for headings, buttons, tabs and captions.
- **Be honest about limits.** Say when something is a schematic, a demo, or a planned project.
- **Buttons and links:** verb or destination, three words or fewer where possible. "Read about me", "For a coffee chat".
- **Lists:** parallel structure, no trailing periods on short fragments, periods on full sentences.
- **Dates:** `May 2026` on lists, `May 12, 2026` on detail pages, `May 12` on essay rows. Always through the existing `formatDate` helpers, never hand-typed.
- **Tech lists:** joined with ` · ` (middle dot with spaces).
- **Metadata:** every page has a title and a one-sentence description through `buildMetadata`.
- **Writing for the site's content files:** project descriptions use `##` for numbered sections, `###` for sub-sections, `- ` lists, backticks for code, `**bold**` for emphasis, and `[[diagram:name]]` for diagrams. Nothing else is parsed.

## 14. Accessibility

Required, not optional.

- **Contrast:** use only the ink tokens in section 4; they are AA on `page-bg`. Check any new color pair.
- **Focus:** every interactive element has a visible focus style, a 2px `brand-500` outline with 2px offset (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500`). Never `outline: none` without a replacement.
- **Keyboard:** everything reachable and operable by keyboard. Tabs support arrow keys. Drawers trap focus (Radix Dialog does). The 3D shelf has a slider and keys.
- **Semantics:** one `h1` per page, headings in order, `nav` with `aria-label`, `aria-current="page"` on the active nav link, lists as `ul`/`ol`, buttons as `button`, links as `a`.
- **Whole-row links** use an `after:absolute after:inset-0` overlay on the single real link, so there is one link per row for screen readers.
- **Images and diagrams:** alt text or `aria-label` as in sections 11 and 12. Decorative previews are `aria-hidden`.
- **Motion:** reduced-motion respected (section 10).
- **Touch targets:** at least 32px (`size-8`) for icon buttons, comfortable padding on text controls.
- **Linting:** `eslint-plugin-jsx-a11y` runs the full recommended set with zero warnings. Fix, do not disable. Any `eslint-disable` needs a one-line reason after `--`.
- **Language and structure:** `lang="en"`, `colorScheme: light`, meaningful `title` on every page.

## 15. Responsive behavior

Mobile first. Tailwind defaults: `sm` 640, `md` 768, `lg` 1024.

- Below `lg`: 16px gutters, fixed 48px mobile bar with drawer menu, 660px column becomes full width.
- At `lg`: 80px desktop bar with inline nav, column locks to 660px, outer margin `lg:mt-20`.
- Row titles stack above their dates on narrow screens and sit on one baseline from `sm` up.
- Thumbnails shrink from 60px to 52px.
- Illustrations shrink from `w-36` to `w-28`.
- Wide content (diagrams, code, tables) scrolls inside its own container; the page itself never scrolls sideways.
- Test at 360px, 768px and 1280px before calling anything done.
- Do not hide primary content on mobile. Secondary, decorative or duplicate controls may collapse.

## 16. Code conventions that protect the design

- **Tailwind v4**, tokens in `@theme` inside `globals.css`. Add a token there if a value will be used more than once. Use `@utility` for text styles that bundle several properties (like `text-prose`).
- **Class order:** layout, box, typography, color, state. Keep long class strings readable; extract a component before extracting a class constant.
- **No inline `style` for design values**, only for genuinely dynamic numbers (an animation delay, a computed width, a transform origin).
- **No CSS modules** except where Tailwind cannot express it (the 3D stage and native range pseudo-elements in `Bookshelf.module.css`).
- **Hand-authored prose styles** stay in `.prose`. Do not adopt a typography plugin.
- **Data in `content/`**, not hard-coded in components. Projects, quotes, facts, heuristics, arsenal and places are JSON; pages and essays are MDX.
- **Server components by default.** Client components only for state, effects and browser APIs. Keep `"use client"` files small.
- **Comments** explain why, not what. Comments follow the same voice rules (no em dashes).
- **Match the surrounding code:** naming, comment density and idiom. Doc comments (`/** ... */`) on exported components say what they are for in one sentence.
- **Next.js here is not the Next.js you know.** Read `node_modules/next/dist/docs/` before using framework APIs (see `AGENTS.md`).
- **Verify before done:** `npx tsc --noEmit`, `yarn lint`, then look at it in the browser at phone and desktop widths.

## 17. Adding something new: the checklist

Run this before you commit anything visible.

**Fit**
- [ ] Is there an existing component or pattern for this? Used it or extended it.
- [ ] Does it sit inside the 660px column?
- [ ] Is it plainer than my first instinct? Could I remove a border, a color or a label?

**Hard rules**
- [ ] No eyebrow label above a heading.
- [ ] No all-caps, no wide tracking.
- [ ] No em or en dashes in copy or comments.
- [ ] Not the "big heading + accent word + two columns" formula.
- [ ] No shadow, gradient or new color.

**Tokens**
- [ ] Colors are tokens, by role (section 4).
- [ ] Type uses the scale (section 5), headings use `font-heading tracking-heading`.
- [ ] Spacing is on the scale (section 6), grouped by closeness.
- [ ] Radius matches the object's size (section 7).

**Behavior**
- [ ] Hover is a color change to `brand-500` with `duration-200`.
- [ ] Focus is visible, keyboard path works.
- [ ] Reduced motion handled, and the static state still makes sense.
- [ ] Empty, long and loading states handled.

**Content**
- [ ] Copy is plain, first person, concrete, sentence case.
- [ ] Alt text or `aria-label` written.
- [ ] Metadata set for new pages.

**Verification**
- [ ] Typecheck and lint pass.
- [ ] Looked at it in the browser at 360, 768 and 1280.
- [ ] This file updated if a new pattern was introduced.

## 18. Known inconsistencies

Honest notes so nobody copies the wrong thing. Fix these opportunistically, and delete the entry when fixed.

- The comment above `text-prose` in `globals.css` says "Mono (the body default) is reserved for nav, dates and labels". The body default is now the system sans. The comment is stale; the rule it states (UI text vs reading text) still applies as described in section 5.
- Diagram colors (section 11) are hex values in `FlowKit.tsx` and the older spatial diagrams rather than `@theme` tokens. If a second place needs them, promote them to tokens first.
- `FlowKit.tsx` and the spatial diagrams repeat a few hex values (`#e3b341`, `#2a2925`). Consolidate into `FlowKit` exports when next touched.
- Project page titles use `text-4xl` while every other page uses `PageTitle` (`text-xl md:text-2xl`). The larger centered title is intentional for articles but is the one exception; do not spread it.
- Class strings for the `bg-brand-50` raised surface are repeated across figures, callouts and preview cards. A shared surface component would remove the duplication.
