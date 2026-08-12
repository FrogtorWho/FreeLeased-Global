import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, ComposedChart } from 'recharts';
import { ARBITRAGE_DATA, HOUSING_DATA, DEFICIT_DATA } from '../data';

export const ChartsView: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Chart 1: Margin Arbitrage */}
      <div className="p-6 border border-border bg-surface rounded-lg">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Public Sector Resourcing: Margin Arbitrage</h3>
        <p className="text-xs text-slate-600 mb-6 max-w-2xl">
          Comparison of daily rates paid to independent subcontractors (T&M) vs. premium rates charged by Prime Consultancies to the state. Illustrates up to 72% gross margin extraction under "Statement of Work" contracts.
        </p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ARBITRAGE_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="role" stroke="#94a3b8" fontSize={10} tick={{fontFamily: 'monospace'}} />
              <YAxis stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `£${val}`} tick={{fontFamily: 'monospace'}} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#27272a', fontSize: '12px', fontFamily: 'monospace' }}
                itemStyle={{ color: '#0f172a' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '10px' }} />
              <Bar dataKey="subRate" name="Subcontractor Rate (£)" fill="#27272a" />
              <Bar dataKey="primeRate" name="Prime Consultancy Rate (£)" fill="#0d9488" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 2: Housing Delivery Gap */}
      <div className="p-6 border border-border bg-surface rounded-lg">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Housing Delivery vs. Statutory Targets</h3>
        <p className="text-xs text-slate-600 mb-6 max-w-2xl">
          Historical performance of UK housing starts and completions tracked against the government's aggressive 370k annual target, highlighting the mathematical impossibility of current Grey Belt unviability.
        </p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={HOUSING_DATA} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#94a3b8" fontSize={10} tick={{fontFamily: 'monospace'}} />
              <YAxis stroke="#94a3b8" fontSize={10} tick={{fontFamily: 'monospace'}} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#27272a', fontSize: '12px', fontFamily: 'monospace' }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', paddingTop: '10px' }} />
              <Bar dataKey="starts" name="Housing Starts" fill="#27272a" />
              <Bar dataKey="completions" name="Completions" fill="#52525b" />
              <Line type="monotone" dataKey="target" name="Annual Target" stroke="#0d9488" strokeWidth={2} strokeDasharray="5 5" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Chart 3: The £22Bn Black Hole Breakdown */}
      <div className="p-6 border border-border bg-surface rounded-lg">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Anatomy of the £21.9Bn Fiscal Deficit (2024/25)</h3>
        <p className="text-xs text-slate-600 mb-6 max-w-2xl">
          Deconstruction of the structural forecasting failure within Whitehall. Driven by internal capability deficits, predictable operational costs were hidden or unmodeled, resulting in emergency tax rectifications.
        </p>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={DEFICIT_DATA} layout="vertical" margin={{ top: 0, right: 30, left: 40, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={true} vertical={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={10} tickFormatter={(val) => `£${val}B`} tick={{fontFamily: 'monospace'}} />
              <YAxis dataKey="category" type="category" stroke="#94a3b8" fontSize={10} tick={{fontFamily: 'monospace'}} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#27272a', fontSize: '12px', fontFamily: 'monospace' }}
                formatter={(value) => [`£${value} Billion`, 'Deficit Amount']}
              />
              <Bar dataKey="amount" name="Billion (£)" fill="#0d9488" barSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
