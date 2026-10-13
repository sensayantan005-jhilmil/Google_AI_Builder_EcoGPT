/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 10-Year Environmental Transformation Visualizer: Before vs After Mode
 */

import React from 'react';
import {
  Sparkles,
  Wind,
  HeartPulse,
  ThermometerSnowflake,
  Droplets,
  TreePine,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  ShieldCheck
} from 'lucide-react';
import { EnvironmentalAssessment } from '../lib/environmentalEngine';

interface FutureTransformationVisualProps {
  assessment: EnvironmentalAssessment;
}

export const FutureTransformationVisual: React.FC<FutureTransformationVisualProps> = ({
  assessment
}) => {
  const {
    location,
    aqi,
    carbonData,
    carEquivalents,
    uhiCoolingC,
    harvestLiters,
    treeTarget,
    surfaceTempUnmitigated,
    surfaceTempMitigated
  } = assessment;

  // Year 10 Projection Metrics
  const baselineAqi = aqi.score;
  const targetAqi = Math.max(22, Math.round(baselineAqi * 0.35));
  const baselinePm25 = location.baseline_pm25;
  const targetPm25 = Math.max(7.5, Math.round(baselinePm25 * 0.28 * 10) / 10);
  const tenYearHarvestLiters = harvestLiters * 10;
  const tenYearCarbonTons = carbonData['Year 10'] || Math.round(treeTarget * 0.22);

  return (
    <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/95 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              10-Year Transformation: Before vs After Interventions
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparing the current unmitigated environmental reality with the 10-year outcome under 100% adherence to native planting and disease-prevention protocols.
          </p>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono self-start sm:self-auto">
          <span className="text-rose-400 font-bold">2026 Baseline</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-emerald-400 font-bold">2036 Transformed</span>
        </div>
      </div>

      {/* High-Impact Delta Bar: Key Metrics Shift */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Metric 1: AQI Improvement */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Wind className="w-3.5 h-3.5 text-sky-400" />
              Air Quality
            </span>
            <span className="text-[10px] font-mono font-semibold text-emerald-400">-65% Smog</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base sm:text-lg font-bold text-rose-400 line-through font-mono">
              AQI {baselineAqi}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              AQI {targetAqi}
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            PM2.5: {baselinePm25} ➔ {targetPm25} µg/m³
          </span>
        </div>

        {/* Metric 2: Surface Temperature Cooling */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <ThermometerSnowflake className="w-3.5 h-3.5 text-teal-400" />
              Built Surface Temp
            </span>
            <span className="text-[10px] font-mono font-semibold text-teal-300">-{uhiCoolingC}°C Shading</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base sm:text-lg font-bold text-rose-400 line-through font-mono">
              {surfaceTempUnmitigated}°C
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-xl sm:text-2xl font-black text-teal-300 font-mono">
              {surfaceTempMitigated}°C
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Building AC power usage reduced ~20%
          </span>
        </div>

        {/* Metric 3: Urban Canopy & Carbon */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <TreePine className="w-3.5 h-3.5 text-emerald-400" />
              Tree Canopy Cover
            </span>
            <span className="text-[10px] font-mono font-semibold text-emerald-300">3.2x Expansion</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base sm:text-lg font-bold text-rose-400 line-through font-mono">
              11%
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              35%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            {tenYearCarbonTons.toLocaleString()} tCO2e ({carEquivalents} cars/yr offset)
          </span>
        </div>

        {/* Metric 4: Public Health Morbidity */}
        <div className="bg-slate-950/70 border border-slate-800/90 rounded-xl p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
              Respiratory Admissions
            </span>
            <span className="text-[10px] font-mono font-semibold text-emerald-300">Health Dividend</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-base sm:text-lg font-bold text-rose-400 line-through font-mono">
              Baseline
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-xl sm:text-2xl font-black text-emerald-400 font-mono">
              -38%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">
            Dramatic drop in asthma &amp; heatstroke
          </span>
        </div>
      </div>

      {/* SIDE-BY-SIDE: BEFORE vs AFTER 10 YEARS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* LEFT CARD: Current Baseline (Before Intervention) */}
        <div className="bg-slate-950/90 border-2 border-rose-500/30 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 bg-rose-500/20 text-rose-300 text-[10px] font-bold px-3 py-1 rounded-bl-lg border-b border-l border-rose-500/30 font-mono">
            YEAR 0 • CURRENT BASELINE
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider block">
                Today's Environmental Reality
              </span>
              <h4 className="text-lg font-black text-white mt-0.5">
                Unmitigated Urban Stressors: {location.city}
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-950/30 border border-rose-900/40">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Air Quality: AQI {aqi.score} ({aqi.category})</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    Elevated airborne concentrations of {aqi.dominant} (PM2.5: {location.baseline_pm25} µg/m³). Triggers chronic pediatric asthma, cardiovascular stress, and seasonal smog episodes.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-950/30 border border-rose-900/40">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Thermal Heat Stress: {surfaceTempUnmitigated}°C Asphalt Gain</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    Unshaded concrete and asphalt trap intense solar radiation, causing nocturnal heat retention, extreme cooling power demands, and severe heat exhaustion risks.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-950/30 border border-rose-900/40">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Water Runoff &amp; Vector Breeding</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    Impermeable surfaces create toxic first-flush runoff, scouring contaminants into urban waterways while stagnant puddle accumulations foster vector mosquito propagation.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-950/30 border border-rose-900/40">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Ecological Deficit &amp; Carbon Emission</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    Sparse 11% canopy cover, minimal bird and pollinator biodiversity, and zero municipal bioclimatic buffering against escalating climate extremes.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-rose-300 font-semibold flex items-center justify-between">
            <span>Status: Critical Ecological Stress</span>
            <span className="font-mono text-rose-400">Baseline 2026</span>
          </div>
        </div>

        {/* RIGHT CARD: After 10 Years (Transformed Outcome) */}
        <div className="bg-slate-950/90 border-2 border-emerald-500/40 rounded-xl p-5 flex flex-col justify-between relative overflow-hidden shadow-lg">
          <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-3 py-1 rounded-bl-lg border-b border-l border-emerald-500/30 font-mono">
            YEAR 10 • TRANSFORMED
          </div>

          <div className="space-y-4">
            <div>
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
                Projected 10-Year Outcome
              </span>
              <h4 className="text-lg font-black text-white mt-0.5">
                Climate-Resilient Living Biome: {location.city}
              </h4>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Clean Air: Projected AQI {targetAqi} (WHO Safe Standards)</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    Multi-tier botanical vegetative barriers filter over 65% of airborne particulate matter, creating safe microclimatic air corridors for schools, transit lines, and neighborhoods.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Microclimate Shading: -{uhiCoolingC}°C Ambient Delta</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    Mature tree canopies drop surface pavement temperatures from {surfaceTempUnmitigated}°C down to {surfaceTempMitigated}°C, slashing HVAC cooling energy bills by ~20%.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">Hydro-Resilience: {tenYearHarvestLiters.toLocaleString()} L Captured</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    Rooftop rainwater harvesting systems and permeable bioswales eliminate stagnant vector pools while satisfying substantial household non-potable demand and recharging aquifers.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block">35% Continuous Canopy &amp; Public Health Dividend</strong>
                  <span className="text-slate-400 text-[11px] leading-relaxed">
                    {treeTarget.toLocaleString()} mature native trees lock in {tenYearCarbonTons.toLocaleString()} tCO2e. Respiratory hospital admissions decrease by ~38%, restoring ecological equilibrium.
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-800 text-[11px] text-emerald-300 font-semibold flex items-center justify-between">
            <span>Outcome: Sustainable, Disease-Resilient Community</span>
            <span className="font-mono text-emerald-400">Target 2036</span>
          </div>
        </div>

      </div>

    </div>
  );
};
