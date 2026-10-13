/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Wind, CloudRain, TreePine, Droplet, ThermometerSnowflake, Activity } from 'lucide-react';
import { EnvironmentalAssessment } from '../lib/environmentalEngine';

interface MetricsOverviewProps {
  assessment: EnvironmentalAssessment;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({ assessment }) => {
  const { aqi, location, harvestLiters, householdCoveragePct, carbonData, carEquivalents, uhiCoolingC } = assessment;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
      
      {/* 1. AQI Metric Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-slate-700 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              Air Quality Index
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {aqi.score}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">AQI</span>
            </div>
          </div>
          <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${aqi.badgeBg}`}>
            {aqi.category}
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px]">
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Dominant Pollutant:</span>
            <span className="font-mono font-semibold text-sky-300">{aqi.dominant}</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex gap-0.5">
            <div
              className="bg-sky-400 h-full transition-all"
              style={{ width: `${Math.min(100, (aqi.pm_sub / 300) * 100)}%` }}
              title={`PM2.5: ${aqi.pm_sub}`}
            />
            <div
              className="bg-amber-400 h-full transition-all"
              style={{ width: `${Math.min(100, (aqi.co_sub / 300) * 100)}%` }}
              title={`CO: ${aqi.co_sub}`}
            />
            <div
              className="bg-purple-400 h-full transition-all"
              style={{ width: `${Math.min(100, (aqi.no2_sub / 300) * 100)}%` }}
              title={`NO2: ${aqi.no2_sub}`}
            />
          </div>
        </div>
      </div>

      {/* 2. Climate & Precipitation */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <CloudRain className="w-3.5 h-3.5 text-blue-400" />
              Climate &amp; Rainfall
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {location.rainfall.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-mono">mm/yr</span>
            </div>
          </div>
          <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30">
            {location.climate_zone}
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400">
          <p className="truncate text-slate-300 font-medium">{location.climate_label}</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Density: {location.density.toLocaleString()} pop/km²
          </p>
        </div>
      </div>

      {/* 3. Rainwater Harvesting Potential */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Droplet className="w-3.5 h-3.5 text-cyan-400" />
              Rainwater Yield
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-white tracking-tight">
                {(harvestLiters / 1000).toFixed(1)}k
              </span>
              <span className="text-xs text-slate-400 font-mono">L/yr ({Math.round(harvestLiters / 1000)} m³)</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
            {assessment.roofArea} m² Catchment
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px]">
          <div className="flex justify-between text-slate-400 mb-1">
            <span>Domestic Coverage:</span>
            <span className="font-semibold text-cyan-300">{householdCoveragePct}% of 5-person</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-cyan-400 h-full rounded-full transition-all"
              style={{ width: `${Math.min(100, householdCoveragePct)}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4. Carbon Sequestration Trajectory */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <TreePine className="w-3.5 h-3.5 text-emerald-400" />
              Decarbonization (Yr 10)
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-emerald-400 tracking-tight">
                {carbonData['Year 10']?.toLocaleString() || 0}
              </span>
              <span className="text-xs text-slate-400 font-mono">tCO2e</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            85% survival
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between items-center">
          <span>Vehicle Offset:</span>
          <span className="font-semibold text-emerald-300">~{carEquivalents} cars/yr</span>
        </div>
      </div>

      {/* 5. UHI Heat Mitigation */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-all">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <ThermometerSnowflake className="w-3.5 h-3.5 text-teal-400" />
              Thermal Cooling
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-2xl font-extrabold text-teal-300 tracking-tight">
                -{uhiCoolingC}°C
              </span>
              <span className="text-xs text-slate-400 font-mono">ambient</span>
            </div>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30">
            Canopy Shading
          </span>
        </div>

        <div className="mt-3 pt-2.5 border-t border-slate-800/80 text-[11px] text-slate-400 flex justify-between items-center">
          <span>AC Power Savings:</span>
          <span className="font-semibold text-teal-300">~15% - 22%</span>
        </div>
      </div>

    </div>
  );
};
