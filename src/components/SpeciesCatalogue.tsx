/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Native Agroforestry Species Catalogue with Dynamic Location Adaptation & Disease Prevention Filters
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Sprout,
  Droplets,
  Wind,
  ShieldCheck,
  Sparkles,
  Filter,
  MapPin,
  Bug,
  HeartPulse,
  Trees
} from 'lucide-react';
import { TreeSpecies, SPECIES_DB } from '../lib/environmentalEngine';

interface SpeciesCatalogueProps {
  currentClimateZone: string;
  cityName?: string;
  countryName?: string;
  recommendedSpecies?: TreeSpecies[];
}

export const SpeciesCatalogue: React.FC<SpeciesCatalogueProps> = ({
  currentClimateZone,
  cityName = 'Selected Location',
  countryName = '',
  recommendedSpecies = []
}) => {
  const [search, setSearch] = useState('');
  const [scopeMode, setScopeMode] = useState<'recommended' | 'all'>('recommended');
  const [layerFilter, setLayerFilter] = useState<string>('all');
  const [diseaseFilter, setDiseaseFilter] = useState<string>('all');
  const [onlyMiyawaki, setOnlyMiyawaki] = useState(false);

  // Automatically reset to 'recommended' whenever the location changes
  useEffect(() => {
    setScopeMode('recommended');
    setSearch('');
  }, [cityName, currentClimateZone]);

  // Determine the base pool of species
  const basePool = useMemo(() => {
    if (scopeMode === 'recommended' && recommendedSpecies.length > 0) {
      return recommendedSpecies;
    }
    return SPECIES_DB;
  }, [scopeMode, recommendedSpecies]);

  // Apply filters
  const filteredSpecies = useMemo(() => {
    return basePool.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.common.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        (s.diseaseBenefit && s.diseaseBenefit.toLowerCase().includes(search.toLowerCase())) ||
        (s.nativeCities && s.nativeCities.some(c => c.toLowerCase().includes(search.toLowerCase())));

      const matchesLayer = layerFilter === 'all' || s.layer === layerFilter;
      const matchesMiyawaki = !onlyMiyawaki || s.miyawaki;

      let matchesDisease = true;
      if (diseaseFilter !== 'all') {
        matchesDisease = (s.diseasePreventionRoles || []).some(role =>
          role.toLowerCase().includes(diseaseFilter.toLowerCase())
        );
      }

      return matchesSearch && matchesLayer && matchesMiyawaki && matchesDisease;
    });
  }, [basePool, search, layerFilter, onlyMiyawaki, diseaseFilter]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col h-full space-y-4">
      
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-800 gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-400" />
              Native Agroforestry &amp; Disease-Preventing Species Palette
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Dynamically filtered for <strong className="text-emerald-300">{cityName}</strong> ({currentClimateZone})
          </p>
        </div>

        {/* Scope Toggle: Recommended vs Global Database */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs self-start sm:self-auto">
          <button
            onClick={() => setScopeMode('recommended')}
            className={`px-3 py-1 rounded-md font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              scopeMode === 'recommended'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3 h-3 text-slate-950" />
            <span>Native to {cityName} ({recommendedSpecies.length})</span>
          </button>

          <button
            onClick={() => setScopeMode('all')}
            className={`px-3 py-1 rounded-md font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              scopeMode === 'all'
                ? 'bg-emerald-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trees className="w-3 h-3 text-slate-400" />
            <span>All Biomes ({SPECIES_DB.length})</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row gap-2.5 items-stretch lg:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder={`Search trees (e.g. ${recommendedSpecies[0]?.common || 'Neem'}, Oak, Birch)...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-800 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500"
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Disease Prevention Filter */}
          <select
            value={diseaseFilter}
            onChange={(e) => setDiseaseFilter(e.target.value)}
            className="bg-slate-950 text-slate-300 rounded-lg px-2.5 py-1.5 border border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Disease Roles</option>
            <option value="vector">🦟 Vector / Mosquito Repellent</option>
            <option value="phytoncide">🫁 Phytoncide Antimicrobial</option>
            <option value="particulate">💨 PM2.5 Pathogen Trap</option>
            <option value="runoff">💧 Runoff Phytoremediation</option>
            <option value="thermal">☀️ Thermal Stress Buffer</option>
          </select>

          {/* Canopy Layer Filter */}
          <select
            value={layerFilter}
            onChange={(e) => setLayerFilter(e.target.value)}
            className="bg-slate-950 text-slate-300 rounded-lg px-2.5 py-1.5 border border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">All Canopy Layers</option>
            <option value="Canopy">Canopy (Upper)</option>
            <option value="Sub-Canopy">Sub-Canopy</option>
            <option value="Understory">Understory</option>
            <option value="Riparian">Riparian / Wetland</option>
          </select>

          {/* Miyawaki Toggle */}
          <button
            onClick={() => setOnlyMiyawaki(!onlyMiyawaki)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
              onlyMiyawaki
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            Miyawaki Dense
          </button>
        </div>
      </div>

      {/* Grid of Species */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 overflow-y-auto max-h-[540px] pr-1 custom-scrollbar">
        {filteredSpecies.map((s) => {
          const isNativeToCity = (s.nativeCities || []).some(
            c => cityName.toLowerCase().includes(c.toLowerCase())
          );

          return (
            <div
              key={s.id}
              className={`bg-slate-950/80 border rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/40 transition-all group ${
                isNativeToCity ? 'border-emerald-500/30 ring-1 ring-emerald-500/10' : 'border-slate-800/90'
              }`}
            >
              <div className="space-y-2">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {s.common}
                      </h4>
                      {isNativeToCity && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                          Native
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 italic font-serif">
                      {s.name}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    {s.layer}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>

                {/* Disease Prevention Callout */}
                {s.diseaseBenefit && (
                  <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-800/80 text-[11px] text-slate-300 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
                      <ShieldCheck className="w-3 h-3" />
                      Disease Defense:
                    </span>
                    <p className="line-clamp-2 text-slate-300">
                      {s.diseaseBenefit}
                    </p>
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {(s.diseasePreventionRoles || []).map(r => (
                        <span key={r} className="text-[9px] px-1.5 py-0.2 rounded bg-slate-950 text-emerald-300 border border-emerald-500/20 font-mono">
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Optimal Site */}
                {s.optimalPlacement && (
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                    <span className="truncate">Site: <strong className="text-slate-300">{s.optimalPlacement}</strong></span>
                  </div>
                )}
              </div>

              {/* Badges footer */}
              <div className="mt-3.5 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1 text-emerald-400 font-mono font-semibold">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>{s.co2_rate} kg/yr</span>
                </div>

                <div className="flex items-center gap-1 text-sky-400">
                  <Droplets className="w-3.5 h-3.5" />
                  <span className="text-slate-400 text-[10px]">Water:</span>
                  <span className="font-medium text-slate-300">{s.water}</span>
                </div>

                <div className="flex items-center gap-1 text-purple-400">
                  <Wind className="w-3.5 h-3.5" />
                  <span className="text-slate-400 text-[10px]">Filter:</span>
                  <span className="font-medium text-slate-300">{s.airPurification}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSpecies.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 text-xs space-y-2">
            <p>No native species matching filter criteria.</p>
            <button
              onClick={() => {
                setSearch('');
                setLayerFilter('all');
                setDiseaseFilter('all');
                setOnlyMiyawaki(false);
              }}
              className="text-xs text-emerald-400 hover:underline"
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
