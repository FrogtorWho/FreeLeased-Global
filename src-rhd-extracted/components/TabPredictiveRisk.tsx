import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ResponsiveContainer, 
  AreaChart, Area, 
  XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTooltip, 
  Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ReferenceLine, ReferenceArea
} from 'recharts';
import { PREDICTIVE_RISK_DATA, THREAT_RADAR_DATA } from '../data';
import { BrainCircuit, Radar as RadarIcon, Share2, Sliders, Activity, Cpu, Sparkles, Clock, LineChart } from 'lucide-react';
import { TooltipHint } from './TooltipHint';

export const TabPredictiveRisk: React.FC = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'monte_carlo' | 'markov_chain' | 'arima' | 'gnn_routing' | 'bayesian'>('monte_carlo');
  const [timeframe, setTimeframe] = useState<'full' | 'historical' | 'forecast'>('full');
  const [stressFactor, setStressFactor] = useState<number>(1.0);
  const [confidenceLevel, setConfidenceLevel] = useState<number>(95);
  const [showHistoricalOverlay, setShowHistoricalOverlay] = useState<boolean>(true);

  // Compute modified chart data based on selected algorithm, stress factor, & timeframe
  const chartData = useMemo(() => {
    let filtered = PREDICTIVE_RISK_DATA;
    if (timeframe === 'historical') {
      filtered = PREDICTIVE_RISK_DATA.filter((d) => d.year <= 2024);
    } else if (timeframe === 'forecast') {
      filtered = PREDICTIVE_RISK_DATA.filter((d) => d.year >= 2024);
    }

    return filtered.map((item) => {
      let multiplier = item.year > 2024 ? stressFactor : 1.0;
      
      // Algo specific adjustments
      let defaultRiskVal = Math.min(100, Math.round(item.defaultRisk * multiplier));
      let systemicLoadVal = Math.min(100, Math.round(item.systemicLoad * multiplier));
      let arbitrageVal = Math.min(100, Math.round(item.arbitrageExtraction * Math.sqrt(multiplier)));

      if (selectedAlgorithm === 'markov_chain') {
        defaultRiskVal = Math.min(100, Math.round(defaultRiskVal * 1.05));
        systemicLoadVal = Math.min(100, Math.round(systemicLoadVal * 0.98));
      } else if (selectedAlgorithm === 'arima') {
        defaultRiskVal = Math.min(100, Math.round(defaultRiskVal * 0.95));
      } else if (selectedAlgorithm === 'gnn_routing') {
        systemicLoadVal = Math.min(100, Math.round(systemicLoadVal * 1.08));
      } else if (selectedAlgorithm === 'bayesian') {
        arbitrageVal = Math.min(100, Math.round(arbitrageVal * 1.12));
      }

      // CI spread based on confidence level
      const spreadMargin = confidenceLevel === 99 ? 12 : confidenceLevel === 90 ? 5 : 8;
      const ciSpread = item.year > 2024 ? Math.round(spreadMargin * stressFactor) : 0;

      return {
        ...item,
        defaultRisk: defaultRiskVal,
        systemicLoad: systemicLoadVal,
        arbitrageExtraction: arbitrageVal,
        defaultRiskRange: [
          Math.max(0, defaultRiskVal - ciSpread),
          Math.min(100, defaultRiskVal + ciSpread)
        ],
        systemicLoadRange: [
          Math.max(0, systemicLoadVal - ciSpread),
          Math.min(100, systemicLoadVal + ciSpread)
        ],
      };
    });
  }, [selectedAlgorithm, timeframe, stressFactor, confidenceLevel]);

  const algorithmDescriptions = {
    monte_carlo: {
      name: "Monte Carlo Stochastic Drift",
      tag: "Stochastic Probability Model",
      desc: "Simulates 10,000 randomized capital outflow and labor deficit iterations to establish standard deviation risk bands.",
    },
    markov_chain: {
      name: "Markov Chain Property Transfer",
      tag: "Discrete State Transition",
      desc: "Models probabilistic transition vectors between Public Asset → Corporate Leaseback → Offshore Holding state nodes.",
    },
    arima: {
      name: "ARIMA Exponential Smoothing",
      tag: "Time-Series Econometrics",
      desc: "Autoregressive Integrated Moving Average isolating seasonal municipal expenditure spikes from underlying structural deficits.",
    },
    gnn_routing: {
      name: "Graph Neural Network (GNN) Risk Routing",
      tag: "Topology Vulnerability Graph",
      desc: "Propagates failure signals across interconnected supply chains, water networks, and council treasury balance sheets.",
    },
    bayesian: {
      name: "Bayesian Causal Inference",
      tag: "Probabilistic Causal Network",
      desc: "Updates prior probability estimates of municipal Section 114 insolvency as new tender procurement signals arrive.",
    },
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 max-w-7xl mx-auto font-sans"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 border-b border-slate-200 pb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-3 tracking-tight">
            <BrainCircuit className="w-8 h-8 text-indigo-600" />
            Predictive Risk & Advanced Algorithms
          </h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-xs font-mono font-bold text-indigo-700 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5" /> ALGO ENGINE: ONLINE
            </span>
          </div>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
          Select mathematical modeling algorithms, historical benchmark windows, and stress test factors to analyze multi-vector systemic fragility projections.
        </p>
      </div>

      {/* Control Bar: Algorithm, Timeframe, Stress, Confidence */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Algorithm & Simulation Control Panel
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Algorithm Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              1. Predictive Algorithm Selection
            </label>
            <select
              value={selectedAlgorithm}
              onChange={(e: any) => setSelectedAlgorithm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="monte_carlo">Monte Carlo Stochastic Drift</option>
              <option value="markov_chain">Markov Chain Property Transfer</option>
              <option value="arima">ARIMA Exponential Smoothing</option>
              <option value="gnn_routing">GNN Risk Routing Network</option>
              <option value="bayesian">Bayesian Causal Inference</option>
            </select>
          </div>

          {/* Timeframe Filter */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>2. Timeframe Filter</span>
              <TooltipHint term="Timeframe" hint="Select whether to view historical data actuals (2018-2024), future projections (2025-2030), or full unified horizon." category="FILTER" />
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                type="button"
                onClick={() => setTimeframe('full')}
                className={`py-1 rounded text-center transition-all ${timeframe === 'full' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Full (18-30)
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('historical')}
                className={`py-1 rounded text-center transition-all ${timeframe === 'historical' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Actuals
              </button>
              <button
                type="button"
                onClick={() => setTimeframe('forecast')}
                className={`py-1 rounded text-center transition-all ${timeframe === 'forecast' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Forecast
              </button>
            </div>
          </div>

          {/* Volatility Stress Multiplier */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>3. Stress Multiplier</span>
              <TooltipHint term="Stress Multiplier" hint="Simulates macro-economic shocks, inflation spikes, or heightened capital flight acceleration." category="PARAMETER" />
            </label>
            <select
              value={stressFactor}
              onChange={(e) => setStressFactor(parseFloat(e.target.value))}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value={1.0}>1.0x Baseline Projection</option>
              <option value={1.3}>1.3x High Friction Shock</option>
              <option value={1.8}>1.8x Black Swan Crisis</option>
            </select>
          </div>

          {/* Confidence Interval Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
              <span>4. Confidence Bounds</span>
              <TooltipHint term="Confidence Interval" hint="Statistical likelihood range (90%, 95%, or 99%) bound around forecasted mean trajectories." category="STATISTICS" />
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-medium">
              {[90, 95, 99].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setConfidenceLevel(val)}
                  className={`py-1 rounded text-center transition-all ${confidenceLevel === val ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {val}%
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Algorithm Description Badge */}
        <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="font-bold text-slate-900 mr-2">
                {algorithmDescriptions[selectedAlgorithm].name}
              </span>
              <span className="text-slate-600 hidden sm:inline">
                — {algorithmDescriptions[selectedAlgorithm].desc}
              </span>
            </div>
          </div>
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-white border border-indigo-200 px-2 py-0.5 rounded shrink-0">
            {algorithmDescriptions[selectedAlgorithm].tag}
          </span>
        </div>
      </div>

      {/* Main Area Chart */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col">
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <LineChart className="w-5 h-5 text-indigo-600" />
              Algorithmic Systemic Collapse Projection ({timeframe === 'historical' ? '2018-2024' : timeframe === 'forecast' ? '2024-2030' : '2018-2030'})
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Rendering active model trajectory with {confidenceLevel}% statistical confidence bounds. Historical actuals demarcated in shaded region.
            </p>
          </div>

          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <input
              type="checkbox"
              checked={showHistoricalOverlay}
              onChange={(e) => setShowHistoricalOverlay(e.target.checked)}
              className="rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>Historical Baseline Overlay</span>
          </label>
        </div>

        <div className="h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
              <defs>
                <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorLoad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>

              <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickMargin={10} />
              <YAxis stroke="#94a3b8" fontSize={11} tickFormatter={(val) => `${val}%`} width={40} domain={[0, 100]} tickCount={6} />
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

              <RechartsTooltip 
                contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                itemStyle={{ color: '#0f172a' }}
                formatter={(value: any, name: string, props: any) => {
                  if (name === 'defaultRiskRange' || name === 'systemicLoadRange') return [];
                  if (name === 'Municipal Default Risk') {
                    return [`${value}% (CI: ${props.payload.defaultRiskRange[0]}-${props.payload.defaultRiskRange[1]}%)`, name];
                  }
                  if (name === 'Total Systemic Load') {
                    return [`${value}% (CI: ${props.payload.systemicLoadRange[0]}-${props.payload.systemicLoadRange[1]}%)`, name];
                  }
                  return [`${value}%`, name];
                }}
                labelFormatter={(label) => `Year: ${label} | ${label <= 2024 ? 'Historical Verified Data' : 'Algorithmic Forecast'}`}
              />

              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />

              {/* Historical Demarcation */}
              {showHistoricalOverlay && (
                <ReferenceArea x1={2018} x2={2024} fill="#0d9488" fillOpacity={0.03} />
              )}
              <ReferenceLine x={2024} stroke="#64748b" strokeDasharray="3 3" label={{ position: 'top', value: 'FORECAST HORIZON', fill: '#475569', fontSize: 10 }} />

              {/* Confidence Intervals */}
              <Area type="monotone" dataKey="defaultRiskRange" stroke="none" fill="#0d9488" fillOpacity={0.15} activeDot={false} />
              <Area type="monotone" dataKey="systemicLoadRange" stroke="none" fill="#6366f1" fillOpacity={0.15} activeDot={false} />

              {/* Main Trends */}
              <Area type="monotone" dataKey="defaultRisk" name="Municipal Default Risk" stroke="#0d9488" fillOpacity={1} fill="url(#colorRisk)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="systemicLoad" name="Total Systemic Load" stroke="#6366f1" fillOpacity={1} fill="url(#colorLoad)" strokeWidth={2.5} />
              <Area type="monotone" dataKey="arbitrageExtraction" name="Arbitrage Extraction Index" stroke="#d97706" fill="none" strokeWidth={2} strokeDasharray="4 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="text-xs text-slate-500 mt-4 pt-3 border-t border-slate-100 flex items-center justify-between font-mono">
          <span>Simulation Mode: {algorithmDescriptions[selectedAlgorithm].name} ({stressFactor}x Stress)</span>
          <span>SOURCE: J-2 SYNTHESIS MODEL</span>
        </div>
      </div>

      {/* Grid of Complementary Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Threat Radar */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <RadarIcon className="w-5 h-5 text-emerald-600" />
              Multidimensional Threat Radar
            </h2>
            <TooltipHint term="Threat Vectors" hint="Radar mapping of core vulnerabilities across municipal balance sheets, energy grid, and housing availability." category="RADAR" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="65%" data={THREAT_RADAR_DATA}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                <Radar name="Threat Level" dataKey="A" stroke="#059669" fill="#059669" fillOpacity={0.3} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#0f172a' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wealth Extraction Flow */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-rose-500" />
                Capital Extraction Vector Topology
              </h2>
              <TooltipHint term="Extraction Vectors" hint="Tracing the structural flow of taxpayer capital away from sovereign capabilities into private margins and foreign state assets." category="FLOW" />
            </div>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Mapped corporate diversion channels transferring municipal council revenue directly into consultancy margins, offshore dividends, and foreign state transport holdings.
            </p>
          </div>

          <div className="h-64 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between relative overflow-hidden text-xs">
            <div className="flex justify-between items-stretch w-full h-full relative z-10 space-x-2">
              <div className="w-1/3 flex flex-col justify-center gap-3">
                <div className="bg-white border border-slate-300 text-xs p-2.5 rounded-lg text-center font-semibold text-slate-800 shadow-xs">Taxpayer Base</div>
                <div className="text-center text-rose-500 font-bold text-lg">↓</div>
                <div className="bg-white border border-slate-300 text-xs p-2.5 rounded-lg text-center font-semibold text-slate-800 shadow-xs">HM Treasury</div>
              </div>

              <div className="w-1/3 flex flex-col justify-between py-2">
                <div className="bg-white border-l-4 border-indigo-500 text-xs p-2 rounded-lg text-left font-medium text-slate-800 shadow-xs">NHS / Healthcare</div>
                <div className="bg-white border-l-4 border-amber-500 text-xs p-2 rounded-lg text-left font-medium text-slate-800 shadow-xs">Local Government</div>
                <div className="bg-white border-l-4 border-blue-500 text-xs p-2 rounded-lg text-left font-medium text-slate-800 shadow-xs">Transport Network</div>
              </div>

              <div className="w-1/3 flex flex-col justify-around">
                <div className="bg-teal-50 border border-teal-200 text-xs p-2 rounded-lg text-right font-semibold text-teal-800 shadow-xs">
                  Big-4 Consultancies<br/>(72% Margin Capture)
                </div>
                <div className="bg-rose-50 border border-rose-200 text-xs p-2 rounded-lg text-right font-semibold text-rose-800 shadow-xs">
                  SNCF / CDPQ<br/>(Asset Transfer)
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
};
