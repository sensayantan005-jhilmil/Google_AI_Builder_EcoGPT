/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Environmental Visual Plots & Graphical Analytics
 */

import React from 'react';
import {
  Wind,
  TrendingUp,
  Droplet,
  Car,
  Fuel,
  Zap,
  Info
} from 'lucide-react';
import { EnvironmentalAssessment } from '../lib/environmentalEngine';

interface VisualPlotsProps {
  assessment: EnvironmentalAssessment;
}

export const VisualPlots: React.FC<VisualPlotsProps> = ({ assessment }) => {
  const {
    location,
    aqi,
    carbonProjections,
    harvestLiters,
    householdCoveragePct,
    carEquivalents,
    treeTarget,
    roofArea
  } = assessment;

  // Max carbon cumulative value for scaling bars
  const maxCarbonTons = Math.max(...carbonProjections.map(p => p.cumulativeTons), 1);

  return (
    <div className="space-y-4">
      {/* Visual Section Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
            Environmental Impact Visual Analytics
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Biophysical Model: {location.city} ({location.climate_zone})
        </span>
      </div>

      {/* Grid of Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* PLOT 1: Air Pollutants vs WHO 2021 Safe Limits Visual Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Wind className="w-4 h-4 text-sky-400" />
                Air Pollutant Concentrations vs WHO Limits
              </span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${aqi.badgeBg}`}>
                AQI {aqi.score} • {aqi.category}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              Real-time atmospheric pollutants benchmarked against WHO 24-hour health guidelines.
            </p>

            {/* Pollutant Bars */}
            <div className="space-y-3.5">
              {aqi.benchmarks.map((p) => {
                // Ratio capped at 5x for bar visualization
                const barPct = Math.min(100, Math.max(12, Math.round((p.ratio / 4.0) * 100)));

                return (
                  <div key={p.name} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white font-mono w-12">{p.name}</span>
                        <span className="text-slate-400 text-[11px]">
                          Measured: <strong className="text-slate-200">{p.value} {p.unit}</strong>
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-slate-500">WHO: {p.whoLimit} {p.unit}</span>
                        <span
                          className="font-mono font-semibold px-1.5 py-0.2 rounded text-[10px]"
                          style={{
                            backgroundColor: `${p.color}20`,
                            color: p.color,
                            border: `1px solid ${p.color}40`
                          }}
                        >
                          {p.ratio}x limit
                        </span>
                      </div>
                    </div>

                    {/* Visual Progress Bar with Threshold Marker */}
                    <div className="relative w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                      {/* WHO Limit Guide Line (at 25% of bar) */}
                      <div className="absolute left-[25%] top-0 bottom-0 w-0.5 bg-white/40 z-10" title="WHO Safe Limit" />
                      
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{
                          width: `${barPct}%`,
                          backgroundColor: p.color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" /> White tick: WHO 24-hr threshold
            </span>
            <span className="font-medium text-slate-300">Stressor: {aqi.dominant}</span>
          </div>
        </div>

        {/* PLOT 2: Carbon Sequestration Trajectory Visual Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Carbon Sequestration Trajectory
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 font-semibold">
                {treeTarget.toLocaleString()} Trees
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              Projected biomass capture across 25 years with 85% sapling survival baseline.
            </p>

            {/* Visual Column / Bar Chart */}
            <div className="h-40 flex items-end justify-between gap-3 pt-2 pb-1 border-b border-slate-800">
              {carbonProjections.map((p) => {
                const heightPct = Math.max(10, Math.min(100, Math.round((p.cumulativeTons / maxCarbonTons) * 100)));

                return (
                  <div key={p.year} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[11px] font-mono font-bold text-emerald-400 mb-1 opacity-90 group-hover:opacity-100">
                      {p.cumulativeTons.toLocaleString()}t
                    </span>
                    <div className="w-full max-w-[42px] bg-slate-950 rounded-t-lg relative overflow-hidden flex items-end h-full border border-slate-800">
                      <div
                        className="w-full bg-gradient-to-t from-emerald-600 via-teal-500 to-emerald-400 rounded-t-lg transition-all duration-700 shadow-md shadow-emerald-500/20"
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-semibold text-slate-300 mt-2">{p.timeline}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Equivalencies Row */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                <Car className="w-3 h-3 text-emerald-400" />
                <span>Cars Offset</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">{carEquivalents}</span>
            </div>

            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                <Fuel className="w-3 h-3 text-amber-400" />
                <span>Oil Barrels</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {Math.round((carbonProjections[3]?.cumulativeTons || 100) * 2.3).toLocaleString()}
              </span>
            </div>

            <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800">
              <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Homes/Yr</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {Math.round((carbonProjections[3]?.cumulativeTons || 100) / 8.2)}
              </span>
            </div>
          </div>
        </div>

        {/* PLOT 3: Rainwater Harvesting Catchment & Demand Balance Visual */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Droplet className="w-4 h-4 text-cyan-400" />
                Rainwater Catchment &amp; Demand Balance
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-semibold">
                {location.rainfall} mm/yr
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mb-4">
              Annual capture from {roofArea} m² roof vs 5-person domestic standard consumption (246k L/yr).
            </p>

            {/* Visual Tank Gauge */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 flex items-center gap-4">
              <div className="relative w-14 h-28 bg-slate-900 rounded-lg border-2 border-cyan-500/30 overflow-hidden flex flex-col justify-end p-0.5 shrink-0">
                <div
                  className="w-full bg-gradient-to-t from-cyan-600 via-sky-500 to-cyan-400 rounded transition-all duration-700 shadow-inner"
                  style={{ height: `${Math.min(100, Math.max(10, householdCoveragePct))}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center text-xs font-extrabold text-white drop-shadow">
                  {householdCoveragePct}%
                </span>
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <span className="text-xs text-slate-400">Total Harvestable Volume:</span>
                  <div className="text-lg font-black text-cyan-300 font-mono flex items-baseline gap-1.5">
                    <span>{harvestLiters.toLocaleString()} <span className="text-xs text-slate-400 font-sans">L/year</span></span>
                    <span className="text-xs text-cyan-400 font-mono font-semibold">({Math.round(harvestLiters / 1000)} m³)</span>
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="bg-cyan-400 h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min(100, householdCoveragePct)}%` }}
                  />
                </div>

                <div className="text-[11px] text-slate-400 flex justify-between">
                  <span>~{Math.round(householdCoveragePct * 0.73)} days domestic supply</span>
                  <span className="font-semibold text-slate-200">{householdCoveragePct}% covered</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>0.8 runoff coeff. (concrete/metal roof standard).</span>
          </div>
        </div>
      </div>
    </div>
  );
};
