/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, Globe2, ShieldCheck, Cpu } from 'lucide-react';

interface HeaderProps {
  audience: string;
  setAudience: (aud: string) => void;
  selectedCity: string;
  onSelectCity: (cityName: string) => void;
  isGenerating: boolean;
}

const POPULAR_CITIES = [
  { name: 'Kolkata', flag: '🇮🇳' },
  { name: 'Delhi', flag: '🇮🇳' },
  { name: 'Mumbai', flag: '🇮🇳' },
  { name: 'London', flag: '🇬🇧' },
  { name: 'Nairobi', flag: '🇰🇪' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'Dubai', flag: '🇦🇪' },
  { name: 'New York', flag: '🇺🇸' },
  { name: 'Tokyo', flag: '🇯🇵' },
];

export const Header: React.FC<HeaderProps> = ({
  audience,
  setAudience,
  selectedCity,
  onSelectCity,
  isGenerating
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Brand & Identity */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl">🌿</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  EcoGPT
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    v2.5 Hybrid
                  </span>
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
                  <Cpu className="w-3 h-3 text-emerald-400" />
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                AI Geospatial Environmental Advisory &amp; Decarbonization Intelligence
              </p>
            </div>
          </div>

          {/* Quick presets & Persona selector */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-slate-800 text-xs text-slate-300">
              <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Advisory Lens:
              </span>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                disabled={isGenerating}
                className="bg-slate-900 text-slate-200 text-xs rounded-md px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="Government / Municipal Authority">Government / Municipal</option>
                <option value="NGO / Community Forestry">NGO / Community</option>
                <option value="Urban Planner & Architect">Urban Planner</option>
                <option value="Corporate / ESG Investor">Corporate / ESG</option>
                <option value="Default Environmental Scientist">Default Scientific</option>
              </select>
            </div>
          </div>
        </div>

        {/* City Quick-Pills */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 text-[11px] whitespace-nowrap flex items-center gap-1 mr-1">
            <Globe2 className="w-3 h-3 text-cyan-400" />
            Quick Biomes:
          </span>
          {POPULAR_CITIES.map((c) => {
            const isSelected = selectedCity.toLowerCase() === c.name.toLowerCase();
            return (
              <button
                key={c.name}
                onClick={() => onSelectCity(c.name)}
                disabled={isGenerating}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1 ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm shadow-emerald-500/30'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700/50'
                }`}
              >
                <span>{c.flag}</span>
                <span>{c.name}</span>
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
};
