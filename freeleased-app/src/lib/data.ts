// Re-export the workspace data spine so the tab components can render
// against the V229 v3 dataset. The actual files live at ../src/data/
// and are imported via the @workspace alias defined in vite.config.ts
// (which points at the parent directory, i.e. the FreeLeased-Global/workspace root).

export { HIDDEN_RIGHTS, JURISDICTIONS, STATUTES, SOURCES } from '@workspace/src/data/spine.ts';
export type { HiddenRight, Statute, Jurisdiction, Conviction, JurisdictionCode } from '@workspace/src/data/spine.ts';