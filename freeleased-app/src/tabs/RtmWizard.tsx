import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Check,
  X,
  ArrowRight,
  Building2,
  Users,
  FileText,
  ExternalLink,
  Trophy,
} from 'lucide-react';
import { STATUTES } from '../lib/data';
import { cn } from '../lib/cn';

interface Question {
  id: string;
  prompt: string;
  help: string;
  yesMeans: 'eligible' | 'ineligible' | 'depends';
  stat?: { ref: string; url: string };
}

const QUESTIONS: Question[] = [
  {
    id: 'building_type',
    prompt: 'Is the building a self-contained block of flats with at least 2 flats?',
    help: 'RTM only applies to buildings containing flats. Houses and commercial-only buildings do not qualify.',
    yesMeans: 'eligible',
  },
  {
    id: 'residential_qualifies',
    prompt: 'Are at least 50% of the flats let on long residential leases (21+ years)?',
    help: 'Per LFRA 2024 s.49, the non-residential limit was raised from 25% → 50%. If 50%+ of flats are residential long leases, the building qualifies.',
    yesMeans: 'eligible',
    stat: { ref: 'LFRA 2024 s.49 (non-residential limit)', url: 'https://www.legislation.gov.uk/uksi/2025/131/made' },
  },
  {
    id: 'not_excluded',
    prompt: 'Is the building NOT a registered charity, almshouse, or co-operative (within the meaning of the Act)?',
    help: 'Statutory exclusions apply. RTM is not available to certain charity / co-op / almshouse structures.',
    yesMeans: 'eligible',
  },
  {
    id: 'participants',
    prompt: 'Do the leaseholders proposing RTM together hold at least 50% of the total flats (qualifying tenants)?',
    help: 'You need at least half of the qualifying tenants to participate. Form an RTM company limited by guarantee before serving the claim notice.',
    yesMeans: 'eligible',
    stat: { ref: 'LFRA 2024 s.99 / CLRA 2002 s.79(3)', url: 'https://www.legislation.gov.uk/ukpga/2002/15/contents' },
  },
  {
    id: 'no_pending_petition',
    prompt: 'Is there no pending court petition to wind up the landlord?',
    help: 'A pending winding-up petition disqualifies the RTM claim until it is resolved.',
    yesMeans: 'eligible',
  },
  {
    id: 'building_has_part_2_appointment',
    prompt: 'Has a Part 2 appointment (exempted from RTM) NOT been made?',
    help: 'A Part 2 manager appointment under the Landlord and Tenant Act 1987 bars RTM for the period of the appointment.',
    yesMeans: 'eligible',
  },
];

export default function RtmWizard() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const total = QUESTIONS.length;
  const current = QUESTIONS[step];
  const progress = (step / total) * 100;
  const isLast = step === total - 1;
  const allAnswered = Object.keys(answers).length === total;

  const eligibleCount = QUESTIONS.filter((q) => answers[q.id] === true).length;
  const ineligibleCount = QUESTIONS.filter((q) => answers[q.id] === false).length;
  const blocked = ineligibleCount > 0;

  const verdict = allAnswered
    ? blocked
      ? 'unlikely'
      : eligibleCount === total
      ? 'eligible'
      : 'review'
    : 'pending';

  function answer(v: boolean) {
    setAnswers((a) => ({ ...a, [current.id]: v }));
    setStep((s) => Math.min(s + 1, total - 1));
  }

  function reset() {
    setAnswers({});
    setStep(0);
  }

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <Compass className="w-7 h-7 text-emerald-700 shrink-0 mt-1" />
          <div className="flex-1">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-emerald-700 mb-1">
              FreeLeased · RTM Wizard
            </p>
            <h2 className="text-2xl font-bold text-slate-900">
              UK s.99 Right to Manage — eligibility check.
            </h2>
            <p className="text-slate-600 mt-2 max-w-3xl">
              Right to Manage lets leaseholders take over the management of their building <em>without proving fault</em>.
              This wizard walks the LFRA 2024 / CLRA 2002 eligibility questions. Answer the 6 prompts to see whether your building qualifies.
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-mono uppercase tracking-widest text-slate-500 mb-1">
            <span>step {Math.min(step + 1, total)} / {total}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-emerald-600"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {current && !allAnswered && (
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 sm:p-6"
          >
            <p className="text-[11px] font-mono uppercase tracking-widest text-emerald-700 mb-2">question {step + 1}</p>
            <h3 className="text-xl font-bold text-slate-900 leading-snug">{current.prompt}</h3>
            <p className="text-sm text-slate-600 mt-3 leading-relaxed">{current.help}</p>
            {current.stat && (
              <p className="mt-3 text-[11px] font-mono">
                <a href={current.stat.url} target="_blank" rel="noreferrer" className="text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-0.5">
                  {current.stat.ref} <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            )}
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                onClick={() => answer(true)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-sm shadow-sm"
              >
                <Check className="w-4 h-4" /> Yes
              </button>
              <button
                onClick={() => answer(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-sm"
              >
                <X className="w-4 h-4" /> No
              </button>
            </div>
          </motion.div>
        )}

        {allAnswered && (
          <motion.div
            key="verdict"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div
              className={cn(
                'rounded-xl shadow-sm p-6 text-center text-white',
                verdict === 'eligible' && 'bg-gradient-to-br from-emerald-600 to-emerald-800',
                verdict === 'review' && 'bg-gradient-to-br from-amber-500 to-amber-700',
                verdict === 'unlikely' && 'bg-gradient-to-br from-rose-600 to-rose-800',
              )}
            >
              <Trophy className="w-10 h-10 mx-auto opacity-90" />
              <h3 className="text-3xl font-bold mt-2">
                {verdict === 'eligible' && 'Likely eligible'}
                {verdict === 'review' && 'Likely eligible — verify specifics'}
                {verdict === 'unlikely' && 'Likely NOT eligible'}
              </h3>
              <p className="mt-2 text-white/90 max-w-xl mx-auto">
                {verdict === 'eligible' &&
                  'Your building appears to meet the statutory tests. Form an RTM company limited by guarantee and serve a claim notice on the landlord.'}
                {verdict === 'review' &&
                  'All YES answers given, but at least one answer had nuance. Read the statute and consider taking advice.'}
                {verdict === 'unlikely' &&
                  'At least one NO answer points to a statutory bar. RTM is unlikely to succeed without resolving it.'}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-3">
                Your answers
              </p>
              <ul className="divide-y divide-slate-100">
                {QUESTIONS.map((q, i) => {
                  const v = answers[q.id];
                  return (
                    <li key={q.id} className="py-3 flex items-start gap-3">
                      <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                        #{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-slate-800">{q.prompt}</p>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-mono px-2 py-0.5 rounded border shrink-0',
                          v === true && 'bg-emerald-100 text-emerald-800 border-emerald-300',
                          v === false && 'bg-rose-100 text-rose-800 border-rose-300',
                        )}
                      >
                        {v === true ? 'YES' : 'NO'}
                      </span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={reset}
                  className="text-xs px-3 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Restart
                </button>
                <p className="text-xs text-slate-500">
                  Disclaimer · not legal advice · verify against legislation.gov.uk
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
              <div className="flex items-start gap-3">
                <Users className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 mb-1">Next steps</p>
                  <ol className="text-sm text-slate-700 list-decimal pl-5 space-y-1.5">
                    <li>Form an RTM company limited by guarantee (Companies House).</li>
                    <li>Collect signatures from qualifying tenants (≥50% of flats).</li>
                    <li>Serve a <strong>Claim Notice</strong> on the landlord (LFRA 2024 s.99).</li>
                    <li>If the landlord does not acknowledge within the statutory window, apply to the First-tier Tribunal (Property Chamber) for a determination.</li>
                    <li>On a positive determination, the RTM company takes over the management contract on the appointed day.</li>
                  </ol>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {STATUTES.filter((s) => s.id.startsWith('uk-')).slice(0, 6).map((s) => (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            className="block bg-white border border-slate-200 rounded-lg p-4 hover:border-emerald-400 transition"
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
                UK statute
              </p>
            </div>
            <h4 className="font-semibold text-slate-900 text-sm">{s.shortTitle}</h4>
            <p className="text-xs font-mono text-slate-500">{s.citation}</p>
            <p className="text-xs text-slate-700 mt-1.5">{s.covers}</p>
          </a>
        ))}
      </div>
    </div>
  );
}