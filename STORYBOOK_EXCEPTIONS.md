# Storbook Exceptions Components Manifest

This file lists intentionally allowed demo or placeholder components that are exempt from the "docs-as-you-go" requirement (Storybook story + TSDoc + unit tests) temporarily. Each entry should include a short reason and a migration target/owner and must be migrated to full coverage before Phase 9.

Template (use as a guide when adding entries):

- `path`: `src/app/features/.../component-file.ts`
  - name: `ComponentName`
  - reason: short reason why it's a demo placeholder
  - owner: GitHub handle or team responsible
  - migrate-by: e.g. `Phase 3` or a date

Current demo placeholders (scan results pre-filled, update if inaccurate):

- `src/app/features/case-studies/case-studies.component.ts`

  - name: `CaseStudiesComponent` (placeholder card image element used for visual placeholder)
  - reason: layout placeholder used while content is authored
  - owner: @MoodyJW
  - migrate-by: Phase 3

- `src/app/docs/template-playground/*` (generated sample components used by Compodoc template playground)

  - name: `TemplatePlaygroundComponent` and helpers
  - reason: documentation playground artifacts included for demoing Compodoc templates
  - owner: @MoodyJW
  - migrate-by: Phase 9

- `docs/compodoc/template-playground/*` (generated Compodoc template playground files)

  - name: `TemplatePlaygroundComponent` (generated)
  - reason: generated demo artifacts from Compodoc; not part of authored app sources
  - owner: @MoodyJW
  - migrate-by: Phase 9

- `docs/compodoc/template-playground/template-playground.component.ts`

  - name: `TemplatePlaygroundComponent (generated source)`
  - reason: Compodoc emits a generated TypeScript copy for the template playground; skip checks
  - owner: @MoodyJW
  - migrate-by: Phase 9

- `dist/moodyjw-portfolio/browser/docs/compodoc/template-playground/*` (packaged Compodoc output copied into `dist` during Pages deploy)

  - name: `TemplatePlaygroundComponent` (packaged)
  - reason: generated/artifact files created at build time and copied to `dist` for GH Pages
  - owner: @MoodyJW
  - migrate-by: Phase 9

- `src/app/shared/constants/*` (placeholder constants listed in README)

  - name: `Constants placeholders`
  - reason: placeholder values for external links and future content
  - owner: @MoodyJW
  - migrate-by: Phase 4

- `src/app/shared/components/tabs/tab` (single tab used by tabs component)

  - name: `TabComponent`
  - reason: internal helper component used by Tabs; not intended for standalone use
  - owner: @MoodyJW
  - migrate-by: Never?

- `src/app/core/layout/*` (layout components with minimal logic)

  - name: `MainLayoutComponent` and children
  - reason: layout components with minimal logic; primarily structural
  - owner: @MoodyJW
  - migrate-by: Phase 5

- `src/app/features/home/*` (home page components with minimal logic)
  - name: `HomePageComponent` and children
  - reason: primarily structural components for home page layout
  - owner: @MoodyJW
  - migrate-by: Phase 5

Notes

- If you add a new demo component, add it here with the template fields and a short justification. Keep the list minimal — demo exceptions are temporary and should be migrated to full documentation and tests.
