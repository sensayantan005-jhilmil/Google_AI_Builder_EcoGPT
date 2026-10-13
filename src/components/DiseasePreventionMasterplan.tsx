/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Summarized Environmental Masterplan & Actions to Take
 */

import React, { useState } from 'react';
import {
  ShieldCheck,
  Sprout,
  Wind,
  Droplets,
  ThermometerSnowflake,
  AlertTriangle,
  CheckCircle2,
  Bug,
  Trees,
  Layers,
  MapPin,
  ChevronRight,
  Sparkles,
  Info,
  CheckSquare,
  Square,
  ArrowRight
} from 'lucide-react';
import { EnvironmentalAssessment, TreeSpecies } from '../lib/environmentalEngine';

interface DiseasePreventionMasterplanProps {
  assessment: EnvironmentalAssessment;
}

export const DiseasePreventionMasterplan: React.FC<DiseasePreventionMasterplanProps> = ({
  assessment
}) => {
  const { location, aqi, recommendedSpecies, diseaseFramework, treeTarget, harvestLiters, uhiCoolingC } = assessment;

  // Summarized View Switcher: Masterplan vs Actions to Take
  const [activeSection, setActiveSection] = useState<'masterplan' | 'actions' | 'both'>('masterplan');

  // Interactive Checklist State
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({
    'action-1': true,
    'action-2': true,
    'action-3': false,
    'action-4': false,
    'action-5': true,
    'action-6': false
  });

  const toggleAction = (id: string) => {
    setCheckedActions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleAll = (markAll: boolean) => {
    const updated: Record<string, boolean> = {};
    checklistItems.forEach(item => {
      updated[item.id] = markAll;
    });
    setCheckedActions(updated);
  };

  // Group native species into the 4 stratified tiers
  const canopySpecies = recommendedSpecies.filter(s => s.layer === 'Canopy').slice(0, 2);
  const subCanopySpecies = recommendedSpecies.filter(s => s.layer === 'Sub-Canopy').slice(0, 2);
  const understorySpecies = recommendedSpecies.filter(s => s.layer === 'Understory').slice(0, 2);
  const riparianSpecies = recommendedSpecies.filter(s => s.layer === 'Riparian').slice(0, 2);

  // Fallback fallbacks if specific layer not populated
  const tiers = [
    {
      tier: 'Tier 1: High Canopy Keystone',
      layer: 'Canopy',
      coverage: '40% of Target',
      targetCount: Math.round(treeTarget * 0.4),
      role: 'Macro-climate shading, CO2 sequestration & deep particulate absorption',
      species: canopySpecies.length > 0 ? canopySpecies : recommendedSpecies.slice(0, 2),
      color: 'emerald',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
    },
    {
      tier: 'Tier 2: Sub-Canopy Buffer',
      layer: 'Sub-Canopy',
      coverage: '30% of Target',
      targetCount: Math.round(treeTarget * 0.3),
      role: 'Aerosol pathogen capture, wind attenuation & evergreen shielding',
      species: subCanopySpecies.length > 0 ? subCanopySpecies : recommendedSpecies.slice(2, 4),
      color: 'sky',
      bgColor: 'bg-sky-500/10 border-sky-500/30 text-sky-400'
    },
    {
      tier: 'Tier 3: Understory & Bio-Repellent',
      layer: 'Understory',
      coverage: '15% of Target',
      targetCount: Math.round(treeTarget * 0.15),
      role: 'Phytoncide emission, natural mosquito deterrence & pedestrian air cleansing',
      species: understorySpecies.length > 0 ? understorySpecies : recommendedSpecies.slice(4, 6),
      color: 'amber',
      bgColor: 'bg-amber-500/10 border-amber-500/30 text-amber-400'
    },
    {
      tier: 'Tier 4: Riparian Bioswale Sentry',
      layer: 'Riparian',
      coverage: '15% of Target',
      targetCount: Math.round(treeTarget * 0.15),
      role: 'Stormwater biofiltration, eliminating stagnant puddles & pathogen runoff',
      species: riparianSpecies.length > 0 ? riparianSpecies : recommendedSpecies.slice(6, 8),
      color: 'teal',
      bgColor: 'bg-teal-500/10 border-teal-500/30 text-teal-400'
    }
  ];

  // Specific dynamic checklist items tailored for this location
  const checklistItems = [
    {
      id: 'action-1',
      category: 'Vector Control',
      priority: 'Immediate',
      title: `Hermetic Mesh Seals on Rainwater Catchment Downspouts`,
      desc: `Install 0.8mm stainless wire mesh on cistern downspouts across ${location.city} to stop Aedes & Anopheles mosquitoes from laying eggs in harvested runoff (${harvestLiters.toLocaleString()} L/yr yield).`,
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
    },
    {
      id: 'action-2',
      category: 'Airborne Defense',
      priority: 'High Priority',
      title: `3-Tier Evergreen Dust Barriers along Traffic Corridors`,
      desc: `Plant mixed canopy (${tiers[0].species.map(s => s.name).join(', ')}) and dense shrub curtains along major roadways to capture up to 35% of diesel soot and PM2.5 microbial carriers.`,
      badgeColor: 'bg-sky-500/15 text-sky-300 border-sky-500/30'
    },
    {
      id: 'action-3',
      category: 'Water Sanitation',
      priority: 'High Priority',
      title: `Grade Roadside Bioswales for 24-Hour Complete Runoff Clearance`,
      desc: `Engineer gravity bioswales and pervious gravel trenches to ensure zero standing puddles persist past 24 hours, preventing cholera and pathogenic E. coli propagation.`,
      badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/30'
    },
    {
      id: 'action-4',
      category: 'Thermal Protection',
      priority: 'Medium Priority',
      title: `Establish 40% Continuous Tree Canopy Shade over School Routes`,
      desc: `Prioritize broadleaf canopy cover along sidewalks to lower ground asphalt surface temperatures by ${uhiCoolingC}°C to 5°C, preventing heat exhaustion in vulnerable populations.`,
      badgeColor: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
    },
    {
      id: 'action-5',
      category: 'Botanical Planting',
      priority: 'Core Strategy',
      title: `Deploy ${treeTarget.toLocaleString()} Native Trees in 4-Tier Miyawaki Clusters`,
      desc: `Plant 3–4 native saplings/m² with mycorrhizal inoculants to achieve rapid 36-month canopy closure, soil moisture retention, and continuous atmospheric phytoncide release.`,
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'action-6',
      category: 'Civic Protocol',
      priority: 'Maintenance',
      title: `Enforce Automated First-Flush Diverters & Mulched Verges`,
      desc: `Mandate the diversion of the first 2mm of polluted rooftop wash and apply 8cm coarse organic woodchip mulch to bare urban soil to halt airborne dust resuspension.`,
      badgeColor: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
    }
  ];

  const completedCount = checklistItems.filter(item => checkedActions[item.id]).length;
  const progressPct = Math.round((completedCount / checklistItems.length) * 100);

  return (
    <div className="bg-gradient-to-b from-slate-900/95 via-slate-900/90 to-slate-950/95 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
              Summarized Environmental Masterplan &amp; Actions to Take
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Concise, location-specific roadmap: native planting strategy and concrete prevention measures for{' '}
            <strong className="text-emerald-300">{location.city}, {location.country}</strong>.
          </p>
        </div>

        {/* Location & Biome Tag */}
        <div className="flex items-center gap-2 text-xs bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 self-start md:self-auto font-mono">
          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="text-slate-300 font-medium">{location.city}</span>
          <span className="text-slate-600">•</span>
          <span className="text-emerald-400 font-semibold">{location.climate_label}</span>
        </div>
      </div>

      {/* Mode Switcher Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSection('masterplan')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'masterplan'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <Trees className="w-3.5 h-3.5" />
            <span>1. Summarized Masterplan</span>
          </button>

          <button
            onClick={() => setActiveSection('actions')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeSection === 'actions'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>2. Actions to Take ({completedCount}/{checklistItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('both')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer hidden sm:flex ${
              activeSection === 'both'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span>Combined View</span>
          </button>
        </div>

        {/* Adherence / Completion Badge */}
        <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-lg border border-slate-800 text-xs">
          <span className="text-[11px] text-slate-400">Action Adherence:</span>
          <span className={`font-mono font-bold ${progressPct === 100 ? 'text-emerald-400' : 'text-sky-400'}`}>
            {progressPct}%
          </span>
          <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: SUMMARIZED ENVIRONMENTAL MASTERPLAN               */}
      {/* ============================================================ */}
      {(activeSection === 'masterplan' || activeSection === 'both') && (
        <div className="space-y-4">
          
          {/* Quick Metrics Baseline Card */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Intervention Scale</span>
              <div className="text-sm sm:text-base font-bold text-emerald-400 font-mono">
                {treeTarget.toLocaleString()} Trees
              </div>
              <span className="text-[11px] text-slate-400">4-Tier Native Biome</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Thermal Cooling Target</span>
              <div className="text-sm sm:text-base font-bold text-sky-400 font-mono">
                -{uhiCoolingC}°C Ambient
              </div>
              <span className="text-[11px] text-slate-400">Canopy Shading Delta</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Rainwater Cleansing</span>
              <div className="text-sm sm:text-base font-bold text-teal-400 font-mono">
                {(harvestLiters / 1000).toFixed(0)} m³/year
              </div>
              <span className="text-[11px] text-slate-400">0.8mm Filtered Storage</span>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Pathogen Barrier</span>
              <div className="text-sm sm:text-base font-bold text-purple-400 font-mono">
                4 Defense Pillars
              </div>
              <span className="text-[11px] text-slate-400">Vector, Air, Water & Heat</span>
            </div>
          </div>

          {/* 4-Tier Native Tree Planting Matrix (Summarized) */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                4-Tier Stratified Native Planting Strategy ({location.city})
              </h4>
              <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
                High-Density Miyawaki Protocol (3-4 saplings/m²)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              {tiers.map((t, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 space-y-2 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      {t.tier}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${t.bgColor}`}>
                      {t.coverage} ({t.targetCount.toLocaleString()} trees)
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    {t.role}
                  </p>

                  <div className="pt-1.5 border-t border-slate-800/80 flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-semibold text-slate-400">Recommended Species:</span>
                    {t.species.map(s => (
                      <span
                        key={s.name}
                        className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-medium border border-slate-700/60"
                        title={`${s.common} • ${s.co2_rate} kg CO2/yr • ${s.diseaseBenefit}`}
                      >
                        {s.name} <span className="text-slate-400 text-[10px]">({s.common})</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Core Disease Prevention Pillars (Summarized) */}
          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              Environmental Disease Prevention Pillars
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Pillar 1: Vector-Borne */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                  <Bug className="w-3.5 h-3.5" />
                  <span>Vector-Borne Defense</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Plant bio-repellent trees (*Neem*, *Alder*); grade bioswales for complete drainage within 24 hours to eliminate mosquito larvae habitats.
                </p>
              </div>

              {/* Pillar 2: Airborne & Respiratory */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-sky-400 text-xs font-bold">
                  <Wind className="w-3.5 h-3.5" />
                  <span>Airborne &amp; Lungs Defense</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  3-tier evergreen dust screens filter up to 35% of diesel soot; conifer/birch phytoncides provide natural aerosol sanitization.
                </p>
              </div>

              {/* Pillar 3: Water-Borne */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-teal-400 text-xs font-bold">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Water Sanitation Defense</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Automated first-flush diversions discard polluted roof runoff; wetland bioswales bio-filter E. coli and street hydrocarbons.
                </p>
              </div>

              {/* Pillar 4: Thermal Mitigation */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold">
                  <ThermometerSnowflake className="w-3.5 h-3.5" />
                  <span>Thermal Heat Protection</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  40% continuous canopy cover over walking routes prevents heatstroke, lowering ground surface temperatures by up to 5°C.
                </p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION 2: ACTIONS TO TAKE (ACTION PLAN & CHECKLIST)         */}
      {/* ============================================================ */}
      {(activeSection === 'actions' || activeSection === 'both') && (
        <div className="space-y-4">
          
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
            
            {/* Header & Quick Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-800 gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Prioritized Environmental Actions to Take in {location.city}
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Click any action item to mark execution status and monitor implementation adherence:
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => handleToggleAll(true)}
                  className="text-[11px] font-medium text-emerald-400 hover:text-emerald-300 bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer"
                >
                  Select All
                </button>
                <button
                  onClick={() => handleToggleAll(false)}
                  className="text-[11px] font-medium text-slate-400 hover:text-slate-300 bg-slate-900 hover:bg-slate-850 px-2.5 py-1 rounded-lg border border-slate-800 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2.5">
              {checklistItems.map(item => {
                const isChecked = !!checkedActions[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleAction(item.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                      isChecked
                        ? 'bg-emerald-950/25 border-emerald-500/40'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Checkbox Icon */}
                    <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 bg-slate-950 text-transparent'
                    }`}>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border ${item.badgeColor}`}>
                          {item.category}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                          {item.priority}
                        </span>
                        <h5 className={`text-xs sm:text-sm font-bold transition-colors ${
                          isChecked ? 'text-emerald-200 line-through' : 'text-white'
                        }`}>
                          {item.title}
                        </h5>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Protocol Footer */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-3.5 flex items-start gap-3 text-xs text-slate-300">
              <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-slate-200">Execution Protocol for {location.city}:</span>
                <p>
                  Deploy actions in coordinated 12-month phases: Phase 1 prioritizes mosquito downspout mesh and roadside bioswale grading; Phase 2 executes the 4-tier Miyawaki planting matrix with mycorrhizal root inoculation; Phase 3 establishes continuous canopy shade corridors over pedestrian walks.
                </p>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
