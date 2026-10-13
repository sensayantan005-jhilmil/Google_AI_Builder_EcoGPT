/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TreePine, Car, Zap, Fuel, Info, TrendingUp } from 'lucide-react';
import { CarbonProjection } from '../lib/environmentalEngine';

interface CarbonTrajectoryChartProps {
  projections: CarbonProjection[];
  treeTarget: number;
  carEquivalents: number;
}

export const CarbonTrajectoryChart: React.FC<CarbonTrajectoryChartProps> = ({
  projections,
  treeTarget,
  carEquivalents
}) => {
  const [metricMode, setMetricMode] = useState<'cumulative' | 'annual'>('cumulative');

  const maxVal = Math.max(
    ...projections.map(p => (metricMode === 'cumulative' ? p.cumulativeTons : p.tCO2e)),
    1
  );

  const yr10Cumulative = projections.find(p => p.year === 10)?.cumulativeTons || 100;
  const barrelsOil = Math.round(yr10Cumulative * 2.3);
  const homeElectricityYears = Math.round(yr10Cumulative / 8.2);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full">
      {/* Header & Mode Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-800 gap-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Carbon Sequestration Trajectory
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            IPCC AR6 / i-Tree model based on {treeTarget.toLocaleString()} native saplings (85% survival rate)
          </p>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setMetricMode('cumulative')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              metricMode === 'cumulative'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cumulative Bank
          </button>
          <button
            onClick={() => setMetricMode('annual')}
            className={`px-3 py-1 rounded-md font-medium transition-all ${
              metricMode === 'annual'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Annual Rate
          </button>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="mt-6 flex-1 flex flex-col justify-end min-h-[220px]">
        <div className="flex items-end justify-between gap-3 sm:gap-6 h-48 pt-4 pb-2 border-b border-slate-800">
          {projections.map((p) => {
            const val = metricMode === 'cumulative' ? p.cumulativeTons : p.tCO2e;
            const pct = Math.max(8, Math.min(100, Math.round((val / maxVal) * 100)));

            return (
              <div key={p.year} className="flex-1 flex flex-col items-center h-full justify-end group">
                {/* Hover value tooltip */}
                <div className="mb-2 opacity-80 group-hover:opacity-100 transition-opacity text-center">
                  <span className="text-xs font-mono font-bold text-emerald-400 block">
                    {val.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">tCO2e</span>
                </div>

                {/* Bar */}
                <div className="w-full max-w-[48px] bg-slate-800/80 rounded-t-lg relative overflow-hidden flex items-end transition-all group-hover:bg-slate-700/80 h-full">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-400 rounded-t-lg transition-all duration-700 group-hover:brightness-110 shadow-lg shadow-emerald-500/10"
                    style={{ height: `${pct}%` }}
                  />
                </div>

                {/* X-axis label */}
                <div className="mt-2 text-center">
                  <span className="text-xs font-semibold text-slate-300 block">
                    Yr {p.year}
                  </span>
                  <span className="text-[10px] text-slate-500 hidden sm:block">
                    {p.year === 1 ? '10% cap' : p.year === 5 ? '50% cap' : '100% cap'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Ecological Equivalency Cards */}
      <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-3">
        
        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Car className="w-3.5 h-3.5 text-emerald-400" />
            <span>Vehicles Removed</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">
            {carEquivalents}
          </p>
          <span className="text-[10px] text-slate-500">annual cars offset</span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Fuel className="w-3.5 h-3.5 text-amber-400" />
            <span>Crude Oil Saved</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">
            {barrelsOil.toLocaleString()}
          </p>
          <span className="text-[10px] text-slate-500">barrels avoided</span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Home Energy</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">
            {homeElectricityYears}
          </p>
          <span className="text-[10px] text-slate-500">homes powered/yr</span>
        </div>

        <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1">
            <TreePine className="w-3.5 h-3.5 text-teal-400" />
            <span>Canopy Footprint</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">
            {(treeTarget * 0.025).toFixed(1)}k
          </p>
          <span className="text-[10px] text-slate-500">m² urban shade</span>
        </div>

      </div>

      {/* Methodology footnote */}
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
        <Info className="w-3 h-3 text-slate-400" />
        <span>Calculation assumes average baseline sequestration of 22 kg CO2/tree/yr, ramping from 10% in Year 1 to full capacity by Year 10.</span>
      </div>
    </div>
  );
};
