import {
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Leaf,
  ExternalLink,
  FileWarning,
} from 'lucide-react';
import { HIDDEN_RIGHTS, STATUTES, JURISDICTIONS, SOURCES } from '../lib/data';

const VERIFIED = [
  {
    title: '20 hidden-rights patterns loaded from V229 v3 dataset',
    detail: 'All 20 patterns from src/data/patterns.ts are wired into the Lease Reader regex matcher and the Rights Checker.',
  },
  {
    title: '9-jurisdiction spine (BB, JM, KY, TT, BS, GY, BZ, VG, UK)',
    detail: 'Jurisdiction metadata (registry, capital, climate, in-pilot flag) renders in the Statute Atlas.',
  },
  {
    title: '4 jurisdiction framework JSONs (BB, JM, KY, UK) load inline',
    detail: 'Loaded via Vite ?raw imports — no API, no CORS, deploys to any static host.',
  },
  {
    title: '25 statutes with citation + source URL',
    detail: 'Every statute row links to legislation.gov.uk / Caribbean law portals where the statute is public.',
  },
  {
    title: 'Lease Reader regex matches + 4-engine DS-gauge',
    detail: 'Real pattern matching against the 20 hidden-rights patterns; recharts radar + bar chart visualisation.',
  },
];

const UNVERIFIED = [
  {
    title: 'LongT5 NLI engine (Giotto.ai copy) — NOT wired into this static build',
    detail: 'The Python V238 prototype has the model. The browser app uses lexical regex matching. The 4-engine DS-gauge verdict is computed locally, not via the actual NLI model.',
  },
  {
    title: 'Caribbean / UK tribunal decisions — schema only, no real cases',
    detail: 'The schema exists; the real decision feed (per jurisdiction) is not yet ingested into this build.',
  },
  {
    title: 'CCRIF parametric insurance data — not live',
    detail: 'Source listed in SOURCES (CCRIF SPC) but live country-level payouts are not pulled in the static build.',
  },
  {
    title: 'A.U.R.I cover-letter generator — not bundled here',
    detail: 'The cover-letter flow described in the docs site is not wired into this static React app. The FreeLeased Carib Lease Reader is the utility.',
  },
  {
    title: 'Beneficial-ownership trace (CIMA) — not bundled',
    detail: 'Source listed, manual lookup is the workflow today.',
  },
];

const MISSING = [
  {
    title: 'Real-time sea-level-rise / hurricane overlay on a map',
    detail: 'GIS data in src/data/climate/sealevel-rise-gis.json is not yet rendered on a Leaflet/Mapbox map. The Statute Atlas shows source lists but no map.',
  },
  {
    title: 'Per-jurisdiction counter-evidence (exploitation pattern bank)',
    detail: 'The HIDDEN_RIGHTS has exploitationCounterpart fields (e.g. "Statutory consultation bypass") but the explicit catalog of exploitation patterns is not displayed.',
  },
  {
    title: 'OCR pipeline for scanned leases',
    detail: 'tesseract.js is in the workspace package.json but not wired into the Lease Reader. Today, text must be paste-ready.',
  },
  {
    title: 'Pseudonymous resident records for the pilot',
    detail: 'src/data/fixtures.ts has pilot fixtures; they are not surfaced in this build.',
  },
  {
    title: 'Live deployment to a stable public URL',
    detail: 'dist/ is built; a stable Cloudflare Pages / GitHub Pages URL is the next deployment step.',
  },
];

function ItemList({ items, color, Icon }: { items: { title: string; detail: string }[]; color: string; Icon: any }) {
  return (
    <ul className="space-y-3">
      {items.map((it, i) => (
        <li key={i} className="bg-white border border-slate-200 rounded-lg p-4">
          <div className="flex items-start gap-2.5">
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${color}`} />
            <div className="min-w-0">
              <h4 className="font-semibold text-slate-900 text-sm leading-snug">{it.title}</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{it.detail}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function HonestGaps() {
  const verifiedCount = VERIFIED.length;
  const unverifiedCount = UNVERIFIED.length;
  const missingCount = MISSING.length;
  const total = verifiedCount + unverifiedCount + missingCount;
  const honestScore = Math.round((verifiedCount / total) * 100);

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Leaf className="w-7 h-7 text-emerald-700 shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 mb-1">
              FreeLeased · Honest Gaps
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              What's verified, what's unverified, what's missing.
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl">
              The FreeLeased Caribbean Lease Reader is a static build over the V229 v3 dataset.{' '}
              <strong>{HIDDEN_RIGHTS.length}</strong> hidden-rights patterns, <strong>{STATUTES.length}</strong> statutes,{' '}
              <strong>{JURISDICTIONS.length}</strong> jurisdictions, <strong>{SOURCES.length}</strong> data sources. Be honest about what runs in the browser today.
            </p>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-emerald-700">verified</p>
            <p className="text-3xl font-bold text-emerald-700 tabular-nums">{verifiedCount}</p>
          </div>
          <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-amber-700">unverified</p>
            <p className="text-3xl font-bold text-amber-700 tabular-nums">{unverifiedCount}</p>
          </div>
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-center">
            <p className="text-[10px] font-mono uppercase tracking-widest text-rose-700">missing</p>
            <p className="text-3xl font-bold text-rose-700 tabular-nums">{missingCount}</p>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          honest coverage score · {honestScore}% verified of {total} items inventoried
        </p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700">
            Verified — actually working in the live app
          </p>
        </div>
        <ItemList items={VERIFIED} color="text-emerald-600" Icon={CheckCircle2} />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-4 h-4 text-amber-600" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-amber-700">
            Unverified — schema/source listed, not yet live
          </p>
        </div>
        <ItemList items={UNVERIFIED} color="text-amber-600" Icon={AlertCircle} />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <FileWarning className="w-4 h-4 text-rose-600" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-rose-700">
            Missing — known gap, buildable, not built
          </p>
        </div>
        <ItemList items={MISSING} color="text-rose-600" Icon={FileWarning} />
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <HelpCircle className="w-4 h-4 text-slate-600" />
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-700">
            Want to fix one of these?
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
          The repo is open-source Apache-2.0. The fastest first-PR items are{' '}
          <strong>OCR pipeline for scanned leases</strong> and{' '}
          <strong>leaflet map for the climate overlay</strong> — both have dependencies already in
          the workspace <code className="text-xs bg-white px-1 rounded">package.json</code>.
          See <a className="text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-0.5" href="https://github.com/sam-peacock/FreeLeased-Global/blob/main/CONTRIBUTING.md" target="_blank" rel="noreferrer">CONTRIBUTING.md<ExternalLink className="w-3 h-3 ml-0.5" /></a>.
        </div>
      </section>
    </div>
  );
}