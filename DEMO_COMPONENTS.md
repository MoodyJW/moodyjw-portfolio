# Demo Components Manifest

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

- `src/app/shared/constants/*` (placeholder constants listed in README)
  - name: `Constants placeholders`
  - reason: placeholder values for external links and future content
  - owner: @MoodyJW
  - migrate-by: Phase 4

Notes

- If you add a new demo component, add it here with the template fields and a short justification. Keep the list minimal — demo exceptions are temporary and should be migrated to full documentation and tests.
