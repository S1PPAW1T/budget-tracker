---
version: alpha
name: PandaBudget
description: A quiet ledger for personal budgeting, with friendly panda branding and clear financial figures.
colors:
  background: "#F3F6F4"
  surface: "#FFFFFF"
  ink: "#192E25"
  evergreen: "#15392D"
  primary: "#1A7554"
  accent: "#E2EEE7"
  border: "#D8E4DB"
  muted: "#5E736A"
  danger: "#B32F29"
typography:
  display:
    fontFamily: "Manrope, Noto Sans Thai, sans-serif"
  body:
    fontFamily: "DM Sans, Noto Sans Thai, system-ui, sans-serif"
  utility:
    fontFamily: "IBM Plex Mono, monospace"
rounded:
  control: "0.75rem"
  card: "1rem"
  feature: "2rem"
omitted:
  - section: spacing
    reason: "Layout uses the existing Tailwind spacing scale; no separate runtime spacing tokens are maintained."
---

## Overview

PandaBudget is a personal finance workspace for people checking their money frequently on desktop or phone. The visual reference is a well-kept ledger: the current balance is prominent, supporting figures align cleanly, and surfaces leave room for scanning. The panda is a small identity cue, not a decorative wallpaper.

## Colors

The product uses a light canvas, white cards, and an evergreen navigation rail. Jade marks primary actions and positive money movement. Warm coral marks expenses and destructive actions. The dark balance card is the single large contrast moment on the dashboard. Chart series can use muted secondary hues so the primary jade remains recognizable.

The runtime owner is `frontend/src/index.css`. Its `:root` HSL variables implement the semantic roles above and Tailwind's `@theme` maps them to utilities. The evergreen navigation and balance card use `#15392D` directly because that is their documented signature surface. Components consume semantic utilities for controls, card surfaces, borders, and focus.

## Typography

Manrope is used for page headings and financial totals, with tabular numerals on money values. DM Sans handles controls and body copy. IBM Plex Mono appears only in small labels and navigation context. Noto Sans Thai is the fallback for Thai text. Keep utility labels short and let data values stay readable without hover.

## Layout

The desktop app uses a fixed width navigation rail and a fluid content area capped at 1480px. Each route begins with a shared page rhythm: small context label, clear title, one sentence of help, and actions aligned to the right. On phones, navigation moves to a bottom bar and cards stack. Tables can scroll horizontally within their own card.

## Elevation & Depth

Use a thin border and a very soft shadow for cards. Reserve the stronger shadow for dialogs. Avoid glowing accents, glass surfaces, and hover lifts; status and hierarchy come from type, spacing, and contrast.

## Shapes

Controls use a 12px radius, regular cards 16px, and the welcome feature panel 32px. The balance card uses a quiet set of concentric rings as its one signature detail.

## Components

Shared `Card`, `Button`, `Input`, `Select`, and `Dialog` components own their base appearance. `Sidebar` and `BottomNav` use the same `navigation.ts` items. Native select and date popups are accepted as platform owned interactions; the product styles their closed state. Focus uses the semantic jade ring and reduced motion users receive near instant transitions.

## Do's and Don'ts

- Show money with tabular numerals and a clear label.
- Keep category funding, base limit, and available amount visually distinct.
- Use white space and dividers to group activity.
- Avoid neon green, full page gradients, frosted glass, and decorative motion.
