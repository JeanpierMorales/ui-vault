# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The owner of this UI collection, working at a desktop or laptop while looking for a reusable visual reference or a working interaction.

## Product Purpose

UI Vault is a visual workspace for independently built web components. It makes the collection searchable, runnable, individually composable, and reusable from one place.

## Positioning

Unlike a static gallery, every source document runs its original HTML, CSS, and JavaScript in isolation, and UI Vault can compose its individual pieces into a page.

## Operating Context

The user explores a growing filesystem collection of HTML/CSS/JavaScript component folders, chooses an individual button, card, form, or section, then composes and exports a working page preview.

## Capabilities and Constraints

- A single component registry generates discovery and navigation.
- Component source files are read-only: their markup, selectors, styles, scripts, routes, fonts, timing, colors, and behavior must remain unchanged.
- Components are isolated with iframes to prevent CSS, JavaScript, IDs, variables, and events from colliding with the catalog UI.
- Search is instant and runs in the browser across metadata.
- Source documents that contain multiple atomic pieces are discovered as individual selectable variants; adding one never adds its whole source document.
- A project saves its ordered blocks locally, opens as a clean preview, and exports to a portable static folder without changing original sources.

## Brand Commitments

The product is an editorial, sober, minimal work tool—not a conventional marketing landing page.

## Evidence on Hand

The repository currently contains 29 standalone index pages under `components/`, `sections/`, `pages/`, and `assets/`.

## Product Principles

1. The real component is the artifact; the builder stays visually quiet around it.
2. Discovery is structured by a configuration file, not hard-coded catalog markup.
3. Source is available to inspect and copy exactly, never transformed; isolation is applied only at runtime.
4. Adding an item must be limited to placing its original files and adding one registry entry; atomic variants are discovered from that document.
