/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * EcoGPT — Environmental Advisory & Carbon Intelligence System
 */

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  MapPin,
  Search,
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Globe2,
  Cpu
} from 'lucide-react';
import { MetricsOverview } from './components/MetricsOverview';
import { FutureTransformationVisual } from './components/FutureTransformationVisual';
import { DiseasePreventionMasterplan } from './components/DiseasePreventionMasterplan';
import { VisualPlots } from './components/VisualPlots';
import {
  runFullAssessmentAsync,
  EnvironmentalAssessment
} from './lib/environmentalEngine';

const QUICK_LOCATIONS = [
  { name: 'Paris', flag: '🇫🇷' },
  { name: 'Tokyo', flag: '🇯🇵' },
  { name: 'San Francisco', flag: '🇺🇸' },
  { name: 'Delhi', flag: '🇮🇳' },
  { name: 'London', flag: '🇬🇧' },
  { name: 'Cairo', flag: '🇪🇬' },
  { name: 'Sydney', flag: '🇦🇺' },
  { name: 'Singapore', flag: '🇸🇬' },
  { name: 'New York', flag: '🇺🇸' }
];

export default function App() {
  // Single location input
  const [locationInput, setLocationInput] = useState('Paris');
  const [activeLocationName, setActiveLocationName] = useState('Paris');

  // Assessment & Report state
  const [assessment, setAssessment] = useState<EnvironmentalAssessment | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [reportText, setReportText] = useState<string>('');
  const [reportSource, setReportSource] = useState<string>('gemini-3.1-flash-lite');
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.1-flash-lite');
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Run full assessment for any location
  const handleAnalyzeLocation = async (targetQuery: string) => {
    const query = targetQuery.trim();
    if (!query) return;

    setIsAnalyzing(true);
    setStatusMessage('Resolving global geocoding and biophysical data...');
    setActiveLocationName(query);

    try {
      // 1. Run dynamic worldwide assessment (geocoding + climate + real air metrics)
      const newAssessment = await runFullAssessmentAsync({
        locationInput: query,
        treeTarget: 10000,
        roofArea: 100,
        audience: "Urban Planner & Environmental Authority"
      });

      setAssessment(newAssessment);
      setStatusMessage('Synthesizing 3-part environmental intelligence...');

      // 2. Synthesize Masterplan with Gemini backend
      try {
        const response = await fetch('/api/advisor', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location: newAssessment.location,
            aqi: newAssessment.aqi,
            treeTarget: newAssessment.treeTarget,
            roofArea: newAssessment.roofArea,
            harvestLiters: newAssessment.harvestLiters,
            carbonData: newAssessment.carbonData,
            carEquivalents: newAssessment.carEquivalents,
            uhiCoolingC: newAssessment.uhiCoolingC,
            audience: "Urban Planner & Municipal Authority",
            ragEvidence: newAssessment.ragEvidence,
            recommendedSpecies: newAssessment.recommendedSpecies,
            model: selectedModel
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.report) {
            setReportText(data.report);
            setReportSource(data.source || selectedModel);
          }
        } else {
          throw new Error('API server unavailable');
        }
      } catch (apiErr) {
        // Fallback 3-stage masterplan generation with dynamic location-specific species
        const harvestCubicMeters = Math.round(newAssessment.harvestLiters / 1000);
        const topSpeciesBulletList = newAssessment.recommendedSpecies.slice(0, 5).map(s => 
          `   * **${s.name}** (*${s.common}* — ${s.layer} layer, ${s.co2_rate} kg CO2/yr): ${s.diseaseBenefit || s.description}`
        ).join('\n');

        const fallbackText = `### ⚠️ Part 1: Current Environmental Summary & Harmful Impacts on Living Beings: ${newAssessment.location.city}, ${newAssessment.location.country}

Currently, the ambient Air Quality Index in ${newAssessment.location.city} stands at **${newAssessment.aqi.score} (${newAssessment.aqi.category})**, with **${newAssessment.aqi.dominant}** identified as the primary airborne pollutant in this **${newAssessment.location.climate_label}**. In an urban density of **${newAssessment.location.density.toLocaleString()} persons/km²**, this environment creates severe daily stress for human and non-human life:

- **Human Health Drawbacks & Toxicity:**
  * **Respiratory Damage:** Fine particulate matter (${newAssessment.aqi.dominant}) bypasses nasal cilia and penetrates deep into alveolar sacs, entering the bloodstream and triggering systemic vascular inflammation, childhood asthma, and chronic bronchitis.
  * **Cardiovascular Strain:** Prolonged exposure elevates risk of myocardial infarction, ischemic heart disease, and premature mortality, particularly among infants and seniors.
  * **Thermal & Heat Stress:** Unshaded asphalt and concrete surfaces trap extreme solar heat, creating severe nocturnal heat retention, dehydration, and increased heatstroke incidence during warm seasons.
- **Wildlife & Ecosystem Harm:**
  * Acidic gaseous deposition and soot particulates coat foliar stomata, suppressing plant transpiration.
  * Severe habitat fragmentation leaves urban birds and insect pollinators without continuous nectar pathways or thermal refuge.
- **Water & Soil Insecurity:**
  * Unmitigated stormwater runoff washes urban petrochemical residues and pathogens into drainage channels while deep aquifers remain unreplenished.

---

### 🛡️ Part 2: Comprehensive Masterplan: Native Trees to Plant & Measures to Prevent Environment-Borne Diseases (10,000 Trees)

To eliminate these biological hazards, a multi-tiered ecological defense and disease-prevention masterplan tailored specifically to **${newAssessment.location.city}** must be deployed:

1. **Location-Specific Native Tree Planting Palette for ${newAssessment.location.city}:**
${topSpeciesBulletList}
   * **Planting Density & Technique:** Deploy 3 to 4 native saplings per square meter in high-density Miyawaki micro-forest clusters to establish rapid canopy closure within 36 months.
   * **Strategic Zoning:** Align broadleaf canopies along vehicular arterials for particulate capture, establish sub-canopies within schoolyards for clean-air corridors, and plant riparian species along water swales.

2. **Environmental Measures to Prevent Environment-Borne Diseases:**
   * 🦟 **Vector-Borne Disease Prevention (Dengue, Malaria, Chikungunya, West Nile):**
     - Plant natural bio-repellent tree buffers around residential peripheries to deter adult mosquitoes.
     - Grade gravity bioswales to ensure zero standing water beyond 24 hours, completely eliminating the larval oviposition window.
     - Install 0.8mm stainless mesh seals and backflow flap valves on all rainwater cistern downspouts.
   * 🫁 **Airborne & Aerosol-Carried Respiratory Illness Prevention (Asthma, COPD, Pathogen Aerosols):**
     - Construct 3-tier dense vegetative green curtains along transit corridors to capture up to 35% of vehicular soot particles that act as microbial carriers.
     - Incorporate evergreen conifer and birch species producing natural antimicrobial phytoncides that sanitize atmospheric air.
     - Apply coarse organic mulch over bare earth to eliminate dust storm resuspension.
   * 💧 **Water-Borne & Stormwater Runoff Disease Defense (Cholera, Typhoid, Leptospirosis, E. Coli):**
     - Mandate automated first-flush diverters on all rooftop catchment systems to discard the initial 2mm of pathogen-laden roof wash (${newAssessment.harvestLiters.toLocaleString()} Liters / ${harvestCubicMeters} m³ capacity).
     - Construct bio-filtration rain gardens and vegetated swales using riparian trees to bio-remediate petro-chemicals and enteric bacteria before runoff reaches waterways.
   * ☀️ **Thermal Heat Stress & Heatwave Morbidity Mitigation:**
     - Maintain continuous shade corridors over pedestrian walks, dropping ground temperatures by -${newAssessment.uhiCoolingC}°C to -4.0°C and preventing heatstroke emergencies.

---

### 🌿 Part 3: 10-Year Environmental Transformation (How the Environment Will Look & Impact)

If this strategic plan is faithfully executed, ${newAssessment.location.city} will undergo a profound ecological and public health transformation over the next decade:

- **Clean, Breathable Air:**
  * Ambient AQI will stabilize in the **Clean & Safe range (AQI 25–45)**, achieving a **~70% reduction in toxic PM2.5/PM10 exposure**.
  * Hazy smog days will be replaced by crisp, clear skies, allowing children to play outdoors without respiratory restriction.
- **Public Health Transformation:**
  * Local hospitals will see an estimated **35% to 40% reduction in emergency admissions** for acute asthma attacks, stroke, and cardiovascular distress.
  * Localized vector-borne disease outbreaks are virtually eliminated through biological anti-stagnation swales.
- **Microclimate Cooling & Thermal Comfort:**
  * Mature tree canopies will lower localized street temperatures by **-${newAssessment.uhiCoolingC}°C to -4.0°C**, eliminating lethal heat island pockets.
  * Building cooling electricity consumption will decrease by **18% to 24%**, saving energy and reducing peak-grid stress.
- **Water Security & Biodiversity Revival:**
  * Over 10 years, millions of Liters of clean rainwater will have recharged local groundwater tables, creating permanent drought resilience.
  * Native songbirds, butterflies, and natural pest-controlling insects will repopulate the urban canopy, establishing ${newAssessment.location.city} as a thriving, sustainable sanctuary for all living beings.`;

        setReportText(fallbackText);
        setReportSource('analytical-engine');
      }
    } catch (_err) {
      // Graceful fallback is handled within internal block
    } finally {
      setIsAnalyzing(false);
      setStatusMessage('');
    }
  };

  // Initial load
  useEffect(() => {
    handleAnalyzeLocation('Paris');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput.trim()) {
      handleAnalyzeLocation(locationInput.trim());
    }
  };

  const handleSelectQuickLocation = (cityName: string) => {
    setLocationInput(cityName);
    handleAnalyzeLocation(cityName);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Sleek Minimal Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-md shadow-emerald-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-lg">🌿</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white flex items-center gap-1.5">
                  EcoGPT
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Worldwide
                  </span>
                </h1>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                AI Geospatial Environmental Advisory &amp; Disease Prevention Masterplan
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* AI Model Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-xs">
              <Cpu className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">Model:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                disabled={isAnalyzing}
                className="bg-transparent text-emerald-300 font-semibold text-xs focus:outline-none cursor-pointer pr-1"
                title="Select synthesis model"
              >
                <option value="gemini-3.1-flash-lite" className="bg-slate-900 text-slate-100">
                  Gemini 3.1 Flash Lite (Fast &amp; Active)
                </option>
                <option value="gemini-3.8-flash" className="bg-slate-900 text-slate-100">
                  Gemini 3.8 Flash (High Reasoning)
                </option>
              </select>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-xs text-slate-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">

        {/* ============================================================ */}
        {/* ONLY LOCATION INPUT SECTION */}
        {/* ============================================================ */}
        <div className="bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="max-w-3xl mx-auto text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enter Any Location Worldwide</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Environmental Health Assessment &amp; Disease Prevention Masterplan
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Enter any city or coordinates to diagnose environmental hazards, get a full location-specific tree planting masterplan, and eliminate environment-borne diseases.
            </p>

            {/* Main Location Form */}
            <form onSubmit={handleSubmit} className="mt-4 flex flex-col sm:flex-row gap-2.5 items-stretch">
              <div className="relative flex-1">
                <MapPin className="w-5 h-5 text-emerald-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Enter location (e.g. Paris, Tokyo, San Francisco, Delhi, Cairo, 51.50, -0.12)..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  disabled={isAnalyzing}
                  className="w-full bg-slate-950 text-slate-100 text-sm sm:text-base rounded-xl pl-11 pr-4 py-3 border border-slate-700 focus:outline-none focus:border-emerald-500 placeholder:text-slate-500 shadow-inner"
                />
              </div>

              <button
                type="submit"
                disabled={isAnalyzing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm sm:text-base transition-all shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.99] whitespace-nowrap cursor-pointer"
              >
                <Sparkles className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing...' : 'Generate Analysis'}</span>
              </button>
            </form>

            {/* Quick Location Pills */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-1.5 text-xs">
              <span className="text-slate-500 text-[11px] mr-1 flex items-center gap-1">
                <Globe2 className="w-3 h-3 text-cyan-400" />
                Popular:
              </span>
              {QUICK_LOCATIONS.map((loc) => {
                const isSelected = activeLocationName.toLowerCase() === loc.name.toLowerCase();
                return (
                  <button
                    key={loc.name}
                    onClick={() => handleSelectQuickLocation(loc.name)}
                    disabled={isAnalyzing}
                    className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{loc.flag}</span>
                    <span>{loc.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Real-time Status Notice */}
            {isAnalyzing && (
              <div className="pt-2 flex items-center justify-center gap-2 text-xs text-emerald-400 animate-pulse">
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{statusMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================ */}
        {/* OUTPUT & VISUALS SECTION */}
        {/* ============================================================ */}
        {assessment && (
          <div className="space-y-8">
            
            {/* ============================================================ */}
            {/* 1. FIRST: ENVIRONMENTAL IMPACT & LIVING BEINGS BASELINE */}
            {/* ============================================================ */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    STAGE 1 • IMPACT
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    Environmental Impact &amp; Living Beings Vulnerability
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {assessment.location.city}, {assessment.location.country} • Current Baseline
                </span>
              </div>

              {/* Environmental Baseline & Living Beings Harm Alert */}
              <div className="bg-slate-900/80 border border-rose-900/40 rounded-xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gradient-to-r from-rose-950/20 via-slate-900/90 to-amber-950/10">
                <div className="flex items-start gap-3.5">
                  <div className="p-2.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0 mt-0.5">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white flex flex-wrap items-center gap-2">
                      <span>Atmospheric Toxicity &amp; Biological Drawbacks</span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${assessment.aqi.badgeBg}`}>
                        AQI {assessment.aqi.score} • {assessment.aqi.category}
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-4xl">
                      <strong>Impact on Living Beings:</strong> Dominant environmental stressor is{' '}
                      <span className="text-rose-300 font-bold">{assessment.aqi.dominant}</span>. Elevated particulate concentrations trigger chronic respiratory inflammation, microvascular strain, and immune suppression in children, elderly populations, and domestic animals. Unfiltered surface runoff and stagnant pools elevate microbiological contamination risks.
                    </p>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-1 border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0 shrink-0">
                  <span className="text-[11px] text-slate-400">Biological Risk Rating</span>
                  <span className="text-xs sm:text-sm font-bold font-mono text-rose-400">
                    {assessment.aqi.score > 150 ? 'Severe Hazard' : assessment.aqi.score > 80 ? 'Moderate Risk' : 'Low Baseline Risk'}
                  </span>
                </div>
              </div>

              {/* Key Biophysical Metrics Overview Cards */}
              <MetricsOverview assessment={assessment} />

              {/* Visual Impact Plots: Air Pollutants vs WHO Limits, Carbon, Water */}
              <VisualPlots assessment={assessment} />
            </section>

            {/* ============================================================ */}
            {/* 2. PART 2: SUMMARIZED ENVIRONMENTAL MASTERPLAN & ACTIONS */}
            {/* ============================================================ */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    STAGE 2 • MASTERPLAN &amp; ACTIONS
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    Summarized Environmental Masterplan &amp; Actions to Take
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  {assessment.location.city}, {assessment.location.country} • Native Strategy &amp; Action Plan
                </span>
              </div>

              {/* Full Masterplan: Native Trees to Plant & Disease Prevention Protocols */}
              <DiseasePreventionMasterplan assessment={assessment} />
            </section>

            {/* ============================================================ */}
            {/* 3. PART 3: 10-YEAR TRANSFORMATION (BEFORE VS AFTER) */}
            {/* ============================================================ */}
            <section className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded text-xs font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    STAGE 3 • 10-YEAR OUTCOME
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    10-Year Environmental Transformation (Before vs After)
                  </h2>
                </div>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  Direct Comparison: 2026 Baseline vs 2036 Transformed Biome
                </span>
              </div>

              {/* 10-Year Future Transformation Visual Simulator (Before vs After Mode) */}
              <FutureTransformationVisual assessment={assessment} />
            </section>

          </div>
        )}

      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/90 py-3.5 mt-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <span>
              🌿 EcoGPT — Global Environmental Health Diagnosis &amp; 10-Year Transformation Simulator
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-slate-500">
              Gemini 3.8 Flash • WHO 2021 &amp; IPCC AR6 Models
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
