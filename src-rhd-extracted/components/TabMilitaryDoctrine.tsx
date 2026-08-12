import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Search, Shield, Sword, Map, Target, AlertTriangle, ArrowRight } from 'lucide-react';

// Doctrine data
const DOCTRINES = [
  {
    id: 'gerasimov',
    name: 'Gerasimov Doctrine (Non-Linear War)',
    origin: 'Modern Russian Military Strategy',
    icon: <Target className="w-5 h-5" />,
    militaryContext: 'The blending of conventional and asymmetrical tactics, emphasizing information warfare, economic subversion, and the deployment of unacknowledged actors to achieve strategic goals without triggering a formal military response.',
    civilianTranslation: 'Utilization of shadow shell companies and unacknowledged corporate proxies (e.g., tertiary subcontractors) to rapidly acquire and restructure municipal housing stock. Local authorities are unable to pinpoint the ultimate beneficial owner, preventing coordinated legal defense.',
    tacticalResponse: 'Implement extreme KYC/AML graph analysis on all property acquisitions; map beneficial ownership networks before allowing asset transfers.'
  },
  {
    id: 'siege',
    name: 'Siege Warfare / Attrition',
    origin: 'Historical / Universal',
    icon: <Shield className="w-5 h-5" />,
    militaryContext: 'Surrounding a target, cutting off supply lines, and waiting for the defenders to exhaust their resources and surrender due to starvation or disease.',
    civilianTranslation: '"Constructive Eviction" tactics. Landlords or developers deliberately neglect maintenance, cut off essential utilities (heating, water), and allow properties to become uninhabitable to force out entrenched tenants without formal legal eviction processes.',
    tacticalResponse: 'Deploy rapid municipal strike teams for emergency repairs, billing costs directly to the property title as a senior lien.'
  },
  {
    id: 'reflexive',
    name: 'Reflexive Control',
    origin: 'Soviet Psychological Warfare',
    icon: <Sword className="w-5 h-5" />,
    militaryContext: 'Manipulating an adversary into making decisions that ultimately favor the attacker, often by feeding them specifically crafted information that alters their perception of the situation.',
    civilianTranslation: 'Burying tenants and local councils in complex, contradictory legal notices and bureaucratic red tape. The goal is to induce "legal fatigue" and fear, causing tenants to self-evict or councils to abandon enforcement actions out of perceived resource exhaustion.',
    tacticalResponse: 'Automate legal defense document generation via LLMs; simplify tenant rights communication into highly actionable, one-page directives.'
  },
  {
    id: 'coin',
    name: 'Counter-Insurgency (COIN)',
    origin: 'Modern US/UK Doctrine',
    icon: <Map className="w-5 h-5" />,
    militaryContext: 'Comprehensive civilian and military efforts taken to simultaneously defeat and contain insurgency and address its root causes, often through "Clear, Hold, Build" strategies.',
    civilianTranslation: 'Gentrification as "Clear, Hold, Build". Aggressively pricing out existing communities ("Clear"), establishing high-end corporate retail anchors to lock in new property values ("Hold"), and developing luxury housing ("Build") while actively suppressing local grassroots organization.',
    tacticalResponse: 'Establish community land trusts and preemptive tenant unions in at-risk post-industrial zones before the "Clear" phase can initiate.'
  },
  {
    id: 'unrestricted',
    name: 'Unrestricted Warfare',
    origin: 'Chinese Military Strategy (Qiao Liang / Wang Xiangsui)',
    icon: <AlertTriangle className="w-5 h-5" />,
    militaryContext: 'The use of any means necessary, including economic, political, and civilian avenues, to defeat a superior military opponent. Erasing the boundary between civilian and military domains.',
    civilianTranslation: 'Weaponization of municipal debt. Predatory financial entities cornering municipal bond markets or exploiting PFI (Private Finance Initiative) contracts to force local governments into austerity, subsequently acquiring public housing assets at distressed prices.',
    tacticalResponse: 'Establish sovereign wealth defense funds to buy out distressed municipal debt; cap secondary market trading of critical infrastructure bonds.'
  },
  {
    id: 'managed_decline',
    name: 'Managed Decline (Scorched Earth)',
    origin: 'Strategic Retreat / Demolition',
    icon: <AlertTriangle className="w-5 h-5" />,
    militaryContext: 'A deliberate, controlled withdrawal from a territory or position while extracting maximum remaining value or destroying infrastructure to deny its use to the adversary.',
    civilianTranslation: 'Local authorities or housing associations deliberately withdrawing investment, maintenance, and services from specific estates. The ensuing planned dilapidation justifies demolition and the sell-off of public land to private developers (often referred to as "Social Cleansing" by groups like the Social Housing Action Campaign).',
    tacticalResponse: 'Implement strict statutory maintenance audits. Empower tenant management organizations (TMOs) with the Right to Manage, allowing them to legally seize maintenance budgets if SLAs consistently fail.'
  },
  {
    id: 'salami_slicing',
    name: 'Salami-Slicing Strategy',
    origin: 'Cold War Expansionism / Hybrid War',
    icon: <Sword className="w-5 h-5" />,
    militaryContext: 'A divide and conquer process of threats and alliances used to overcome opposition. With it, an aggressor can influence and eventually dominate a landscape, piece by piece, without triggering a major retaliation.',
    civilianTranslation: 'Gradual, piecemeal privatization of housing services. First outsourcing repairs, then property management, then cleaning, until the entire public housing infrastructure is controlled by opaque, profit-driven private entities, obscuring accountability and making wholesale resistance difficult.',
    tacticalResponse: 'Enforce "Whole-of-Estate" public ownership covenants. Ban the fragmentation of service contracts and mandate open-book accounting for all municipal subcontractors.'
  },
  {
    id: 'psyops',
    name: 'Psychological Operations (PSYOPS)',
    origin: 'Information Warfare',
    icon: <Target className="w-5 h-5" />,
    militaryContext: 'Operations to convey selected information and indicators to audiences to influence their emotions, motives, objective reasoning, and ultimately the behavior of governments, organizations, groups, and individuals.',
    civilianTranslation: 'Stigmatization of social housing tenants through media narratives ("sink estates", "anti-social hotbeds") to manufacture public consent for estate demolition and redevelopment. Creating an atmosphere of inevitability to demoralize tenant resistance.',
    tacticalResponse: 'Deploy counter-narrative intelligence campaigns highlighting community cohesion and structural underfunding. Create transparency dashboards exposing the profit margins and political lobbying of redevelopers.'
  },
  {
    id: 'shock_and_awe',
    name: 'Shock and Awe (Rapid Dominance)',
    origin: 'Modern US Military Doctrine',
    icon: <AlertTriangle className="w-5 h-5" />,
    militaryContext: 'A military doctrine based on the use of overwhelming power and spectacular displays of force to paralyze the enemy\'s perception of the battlefield and destroy their will to fight.',
    civilianTranslation: 'Sudden, massive issuance of Section 21 (no-fault) eviction notices across an entire block or portfolio following an acquisition. The simultaneous mass displacement overwhelms local authority housing teams and legal aid services, preventing any coordinated defense.',
    tacticalResponse: 'Pre-emptive legal injunctions on portfolio-wide evictions. Triggering automatic municipal investigations into the acquirer\'s financial structuring and financing covenants.'
  }

];

export const TabMilitaryDoctrine: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctrine, setSelectedDoctrine] = useState(DOCTRINES[0].id);

  const filteredDoctrines = DOCTRINES.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    d.civilianTranslation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeDoctrine = DOCTRINES.find(d => d.id === selectedDoctrine) || DOCTRINES[0];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 pb-12"
    >
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6 mb-6">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-indigo-600" />
          MILITARY DOCTRINE TRANSLATION
        </h1>
        <p className="text-sm text-slate-600">
          Mapping historical and modern kinetic warfare strategies to contemporary housing exploitation and human rights abuses.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar List */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search doctrines..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-sm text-sm focus:outline-none focus:border-indigo-500 bg-white"
            />
          </div>

          <div className="flex-1 overflow-y-auto max-h-[600px] space-y-2 pr-2 custom-scrollbar">
            {filteredDoctrines.map(doctrine => (
              <button
                key={doctrine.id}
                onClick={() => setSelectedDoctrine(doctrine.id)}
                className={`w-full text-left p-4 rounded-sm border transition-all flex items-start gap-3 ${
                  selectedDoctrine === doctrine.id 
                    ? 'bg-indigo-50 border-indigo-200 shadow-[inset_2px_0_0_rgba(79,70,229,1)]' 
                    : 'bg-white border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className={`mt-0.5 ${selectedDoctrine === doctrine.id ? 'text-indigo-600' : 'text-slate-400'}`}>
                  {doctrine.icon}
                </div>
                <div>
                  <h3 className={`text-sm font-bold ${selectedDoctrine === doctrine.id ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {doctrine.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">{doctrine.origin}</p>
                </div>
              </button>
            ))}
            {filteredDoctrines.length === 0 && (
              <div className="text-center p-4 text-slate-500 text-sm">
                No doctrines found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* Main Content Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDoctrine.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="bg-indigo-900 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                  {React.cloneElement(activeDoctrine.icon, { className: 'w-32 h-32' })}
                </div>
                <h2 className="text-2xl font-bold mb-2 relative z-10">{activeDoctrine.name}</h2>
                <div className="inline-block border border-indigo-400/30 bg-indigo-800/50 px-3 py-1 text-xs text-indigo-100 rounded-sm backdrop-blur-sm relative z-10">
                  ORIGIN: {activeDoctrine.origin}
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* Military Context */}
                <section>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-sm"></span>
                    Original Military Context
                  </h3>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-sm">
                    {activeDoctrine.militaryContext}
                  </p>
                </section>

                <div className="flex justify-center">
                  <div className="bg-slate-100 p-2 rounded-full">
                    <ArrowRight className="w-5 h-5 text-slate-400 rotate-90 lg:rotate-0" />
                  </div>
                </div>

                {/* Civilian Translation */}
                <section>
                  <h3 className="text-xs font-bold text-rose-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-rose-600 rounded-sm animate-pulse"></span>
                    Housing & Human Rights Translation
                  </h3>
                  <p className="text-sm text-slate-800 leading-relaxed font-medium bg-rose-50 p-4 border border-rose-100 rounded-sm shadow-sm">
                    {activeDoctrine.civilianTranslation}
                  </p>
                </section>

                {/* Tactical Response */}
                <section>
                  <h3 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-teal-600 rounded-sm"></span>
                    Strategic Counter-Measures
                  </h3>
                  <div className="flex items-start gap-3 bg-teal-50 p-4 border border-teal-100 rounded-sm shadow-sm">
                    <Shield className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-teal-900 leading-relaxed font-medium">
                      {activeDoctrine.tacticalResponse}
                    </p>
                  </div>
                </section>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};
