/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * EcoGPT Environmental Engine & Hybrid RAG System
 */

export interface KnowledgeDoc {
  id: string;
  topic: 'species' | 'pollution' | 'water' | 'carbon' | 'microclimate' | 'soil';
  climate_zone: string;
  source: string;
  text: string;
}

export interface TreeSpecies {
  id: string;
  name: string;
  common: string;
  zone: 'tropical' | 'arid' | 'temperate' | 'subtropical' | 'mediterranean' | 'continental';
  co2_rate: number; // kg CO2 / tree / year
  water: 'Very Low' | 'Low' | 'Medium' | 'High';
  layer: 'Canopy' | 'Sub-Canopy' | 'Understory' | 'Groundcover' | 'Riparian';
  rootDepth: 'Deep Taproot' | 'Moderate' | 'Spreading Fibrous';
  miyawaki: boolean;
  airPurification: 'High' | 'Very High' | 'Moderate';
  description: string;
  diseasePreventionRoles: string[]; // e.g. ['Vector Repellent (Mosquitoes)', 'Phytoncide Antimicrobial', 'Particulate & Pathogen Carrier Trap', 'Runoff Phytoremediation', 'Non-Allergenic Canopy']
  diseaseBenefit: string; // Biological mechanism preventing environmental illness
  optimalPlacement: string; // Strategic urban location (roads, schools, canals, residential)
  nativeCities?: string[]; // Representative cities where naturally endemic
}

export interface DiseasePreventionCategory {
  title: string;
  iconType: 'mosquito' | 'lungs' | 'water' | 'heat' | 'spores';
  riskLevel: 'Critical / High' | 'Moderate / Monitored' | 'Low / Preventative';
  targetPathogens: string[];
  transmissionPathway: string;
  botanicalMeasures: {
    speciesRecommended: string;
    action: string;
  }[];
  environmentalEngineering: string[];
  civicProtocol: string;
}

export interface DiseasePreventionFramework {
  vectorBorne: DiseasePreventionCategory;
  airborneRespiratory: DiseasePreventionCategory;
  waterBorneRunoff: DiseasePreventionCategory;
  thermalHeatStress: DiseasePreventionCategory;
}

export interface LocationData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  climate_zone: string;
  climate_label: string;
  density: number; // people/km2
  rainfall: number; // mm/year
  baseline_pm25: number;
  baseline_pm10: number;
  baseline_co: number;
  baseline_no2: number;
  temperature_c: number;
}

export interface PollutantBenchmark {
  name: string;
  value: number;
  unit: string;
  whoLimit: number;
  ratio: number;
  status: 'Safe' | 'Moderate' | 'Elevated' | 'Hazardous';
  color: string;
}

export interface AQIResult {
  score: number;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  color: string;
  badgeBg: string;
  dominant: 'PM2.5' | 'PM10' | 'CO' | 'NO2';
  healthSummary: string;
  pm_sub: number;
  pm10_sub: number;
  co_sub: number;
  no2_sub: number;
  benchmarks: PollutantBenchmark[];
}

export interface CarbonProjection {
  timeline: string;
  year: number;
  tCO2e: number;
  cumulativeTons: number;
}

export interface EnvironmentalAssessment {
  location: LocationData;
  aqi: AQIResult;
  treeTarget: number;
  roofArea: number;
  harvestLiters: number;
  householdCoveragePct: number;
  carbonData: Record<string, number>;
  carbonProjections: CarbonProjection[];
  carEquivalents: number;
  uhiCoolingC: number;
  surfaceTempUnmitigated: number;
  surfaceTempMitigated: number;
  recommendedSpecies: TreeSpecies[];
  ragEvidence: { doc: KnowledgeDoc; score: number }[];
  diseaseFramework: DiseasePreventionFramework;
}

// 1. KNOWLEDGE CORPUS
export const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: "sp_trop_01",
    topic: "species",
    climate_zone: "tropical",
    source: "India Biodiversity Portal / i-Tree Eco",
    text: "Native tree species for tropical wet and monsoon climates (Aw/Am): Banyan (Ficus benghalensis) ~28 kg CO2/yr, massive canopy interception; Neem (Azadirachta indica) ~22 kg CO2/yr, drought-hardy sulfur & PM filter; Arjun (Terminalia arjuna) ~25 kg CO2/yr, riparian specialist with high transpiration rate; Kadamba (Neolamarckia cadamba) ~24 kg CO2/yr, rapid pioneer; Sal (Shorea robusta) ~26 kg CO2/yr with dense carbon-dense heartwood."
  },
  {
    id: "sp_trop_02",
    topic: "species",
    climate_zone: "tropical",
    source: "FAO Urban Forestry & Green Infrastructure Handbook",
    text: "Dense-urban planting (>5000 persons/km2): Cassia fistula (Amaltas ~15 kg CO2/yr), Lagerstroemia speciosa (Pride of India ~14 kg CO2/yr). Vertical green walls with Epipremnum aureum, Chlorophytum comosum for particulate & VOC mitigation. Miyawaki micro-forest methodology: 3-5 native saplings per m2 across 4 structural strata (Canopy, Tree, Sub-tree, Shrub) achieves canopy closure within 24-36 months and 30x higher noise/dust attenuation."
  },
  {
    id: "sp_arid_01",
    topic: "species",
    climate_zone: "arid",
    source: "FAO Dryland Forestry & UNCCD Guidelines",
    text: "Arid and semi-arid climates (BWh/BSh): Khejri (Prosopis cineraria) fixing nitrogen with roots reaching >30m, Babul (Vachellia nilotica), Indian jujube (Ziziphus mauritiana), Pongamia pinnata (Karanja ~20 kg CO2/yr). Strictly avoid Eucalyptus and invasive Prosopis juliflora in water-stressed groundwater critical zones due to depleting water-table risks."
  },
  {
    id: "sp_med_01",
    topic: "species",
    climate_zone: "mediterranean",
    source: "Silva Mediterranea / Mediterranean Forestry Action",
    text: "Mediterranean climates (Csa/Csb): Olive (Olea europaea ~19 kg CO2/yr), Holm Oak (Quercus ilex ~23 kg CO2/yr), Italian Cypress (Cupressus sempervirens ~16 kg CO2/yr), Carob (Ceratonia siliqua ~21 kg CO2/yr). High xeriscape tolerance, low summer water demand, and heavy resilience to hot, dry summer thermal peaks."
  },
  {
    id: "air_01",
    topic: "pollution",
    climate_zone: "global",
    source: "WHO Global Air Quality Guidelines (2021) / US EPA",
    text: "WHO 2021 standards: PM2.5 annual average 5 ug/m3, 24-h standard 15 ug/m3; PM10 annual 15 ug/m3, 24-h standard 45 ug/m3; NO2 annual 10 ug/m3, 24-h 25 ug/m3. Air Quality Index (AQI) thresholds: Good (0-50), Moderate (51-100), Unhealthy for Sensitive Groups (101-150), Unhealthy (151-200), Very Unhealthy (201-300), Hazardous (>300). Vegetative barriers with rough-textured, hairy leaves capture up to 34% of vehicular ultrafine particulate matter when planted adjacent to roadway curbs."
  },
  {
    id: "wat_01",
    topic: "water",
    climate_zone: "global",
    source: "Central Ground Water Board (CGWB) & CWC Guidelines",
    text: "Rainwater harvesting calculation formula: Harvest Volume (L/yr) = Roof Catchment Area (m2) x Annual Rainfall (mm) x 0.8 Runoff Coefficient. A 100 m2 roof in an 1800 mm rainfall zone yields ~144,000 L/yr. At standard municipal consumption of 135 L/person/day, this satisfies ~40-60% of annual potable and non-potable domestic demand for a family of 5."
  },
  {
    id: "carb_01",
    topic: "carbon",
    climate_zone: "global",
    source: "IPCC AR6 WGIII Chapter 7 / US Forest Service i-Tree",
    text: "Urban carbon sequestration parameters: Mature tropical broadleaf tree sequesters 20-30 kg CO2/tree/yr on average; fast-growing pioneer hardwoods sequester 25-40 kg. Young saplings capture ~10% in years 1-3, ramping to 50% by year 5 and 100% capacity by year 10. Baseline sapling survival is modeled at 85% under active municipal irrigation. Equivalent metric: One passenger vehicle emits ~4.6 metric tonnes CO2/year."
  },
  {
    id: "uhi_01",
    topic: "microclimate",
    climate_zone: "global",
    source: "NASA Urban Heat Island Study / EPA Heat Island Reduction",
    text: "Urban Heat Island mitigation: High-density urban areas experience 3-7°C surface temperature elevation over surrounding rural zones. Strategic planting of high-albedo vegetative canopies with high evapotranspirative cooling can reduce localized ambient air temperatures by 1.8°C to 4.2°C, decreasing building cooling energy consumption by up to 25%."
  },
  {
    id: "temp_01",
    topic: "species",
    climate_zone: "temperate",
    source: "European Forestry Institute & UK Woodland Trust",
    text: "Temperate climate zones (Cfb/Dfb): English Oak (Quercus robur ~27 kg CO2/yr, supports >280 insect species), Silver Birch (Betula pendula ~18 kg CO2/yr), Field Maple (Acer campestre ~21 kg CO2/yr), Rowan (Sorbus aucuparia). Excellent urban air filtering capabilities for PM10 and nitrogen dioxide alongside high resilience to compacted soils."
  }
];

// 2. BM25 RETRIEVER IN TYPESCRIPT
export class BM25Retriever {
  private docs: KnowledgeDoc[];
  private corpusTokens: string[][];
  private docLengths: number[];
  private avgDocLength: number;
  private df: Map<string, number> = new Map();
  private k1 = 1.5;
  private b = 0.75;

  constructor(docs: KnowledgeDoc[]) {
    this.docs = docs;
    this.corpusTokens = docs.map(d => this.tokenize(d.text + " " + d.topic + " " + d.climate_zone));
    this.docLengths = this.corpusTokens.map(tokens => tokens.length);
    this.avgDocLength = this.docLengths.reduce((a, b) => a + b, 0) / (this.docs.length || 1);

    this.corpusTokens.forEach(tokens => {
      const unique = new Set(tokens);
      unique.forEach(term => {
        this.df.set(term, (this.df.get(term) || 0) + 1);
      });
    });
  }

  public tokenize(text: string): string[] {
    return (text.toLowerCase().match(/[a-z0-9]+/g) || []);
  }

  public retrieve(query: string, topK = 3): { doc: KnowledgeDoc; score: number }[] {
    const queryTokens = this.tokenize(query);
    const N = this.docs.length;

    const scores = this.docs.map((doc, docIdx) => {
      let score = 0;
      const tokens = this.corpusTokens[docIdx];
      const docLen = this.docLengths[docIdx];

      const tfMap = new Map<string, number>();
      tokens.forEach(t => tfMap.set(t, (tfMap.get(t) || 0) + 1));

      queryTokens.forEach(term => {
        const tf = tfMap.get(term) || 0;
        if (tf > 0) {
          const df = this.df.get(term) || 0;
          const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));
          const num = tf * (this.k1 + 1);
          const denom = tf + this.k1 * (1 - this.b + this.b * (docLen / this.avgDocLength));
          score += idf * (num / denom);
        }
      });

      return { doc, score };
    });

    return scores.sort((a, b) => b.score - a.score).slice(0, topK);
  }
}

export const defaultRetriever = new BM25Retriever(KNOWLEDGE_DOCS);

// 3. EXPANDED WORLDWIDE GAZETTEER (60+ Major Global Cities)
export const GAZETTEER: Record<string, LocationData> = {
  // Asia
  kolkata: {
    city: "Kolkata",
    country: "India",
    lat: 22.5726,
    lon: 88.3639,
    climate_zone: "Aw",
    climate_label: "Tropical Wet & Dry (Monsoon)",
    density: 24000,
    rainfall: 1800,
    baseline_pm25: 78.5,
    baseline_pm10: 142.0,
    baseline_co: 5.2,
    baseline_no2: 0.045,
    temperature_c: 28.5
  },
  delhi: {
    city: "Delhi",
    country: "India",
    lat: 28.6139,
    lon: 77.2090,
    climate_zone: "BSh",
    climate_label: "Semi-Arid Subtropical",
    density: 11300,
    rainfall: 800,
    baseline_pm25: 142.0,
    baseline_pm10: 260.0,
    baseline_co: 7.8,
    baseline_no2: 0.068,
    temperature_c: 26.2
  },
  mumbai: {
    city: "Mumbai",
    country: "India",
    lat: 19.0760,
    lon: 72.8777,
    climate_zone: "Aw",
    climate_label: "Tropical Wet & Dry (Coastal)",
    density: 21000,
    rainfall: 2200,
    baseline_pm25: 64.2,
    baseline_pm10: 118.0,
    baseline_co: 4.1,
    baseline_no2: 0.038,
    temperature_c: 27.8
  },
  bengaluru: {
    city: "Bengaluru",
    country: "India",
    lat: 12.9716,
    lon: 77.5946,
    climate_zone: "Aw",
    climate_label: "Tropical Savanna (Highland)",
    density: 4380,
    rainfall: 970,
    baseline_pm25: 42.0,
    baseline_pm10: 85.0,
    baseline_co: 2.8,
    baseline_no2: 0.032,
    temperature_c: 24.1
  },
  bangalore: {
    city: "Bengaluru",
    country: "India",
    lat: 12.9716,
    lon: 77.5946,
    climate_zone: "Aw",
    climate_label: "Tropical Savanna (Highland)",
    density: 4380,
    rainfall: 970,
    baseline_pm25: 42.0,
    baseline_pm10: 85.0,
    baseline_co: 2.8,
    baseline_no2: 0.032,
    temperature_c: 24.1
  },
  jaipur: {
    city: "Jaipur",
    country: "India",
    lat: 26.9124,
    lon: 75.7873,
    climate_zone: "BSh",
    climate_label: "Semi-Arid Dryland",
    density: 6500,
    rainfall: 650,
    baseline_pm25: 88.0,
    baseline_pm10: 165.0,
    baseline_co: 4.5,
    baseline_no2: 0.048,
    temperature_c: 26.8
  },
  chennai: {
    city: "Chennai",
    country: "India",
    lat: 13.0827,
    lon: 80.2707,
    climate_zone: "Aw",
    climate_label: "Tropical Wet & Dry",
    density: 17000,
    rainfall: 1400,
    baseline_pm25: 48.0,
    baseline_pm10: 92.0,
    baseline_co: 3.1,
    baseline_no2: 0.034,
    temperature_c: 29.2
  },
  tokyo: {
    city: "Tokyo",
    country: "Japan",
    lat: 35.6762,
    lon: 139.6503,
    climate_zone: "Cfa",
    climate_label: "Humid Subtropical Oceanic",
    density: 6400,
    rainfall: 1530,
    baseline_pm25: 14.2,
    baseline_pm10: 28.0,
    baseline_co: 1.2,
    baseline_no2: 0.021,
    temperature_c: 16.4
  },
  beijing: {
    city: "Beijing",
    country: "China",
    lat: 39.9042,
    lon: 116.4074,
    climate_zone: "Dwa",
    climate_label: "Monsoon-influenced Humid Continental",
    density: 1330,
    rainfall: 570,
    baseline_pm25: 46.0,
    baseline_pm10: 89.0,
    baseline_co: 3.1,
    baseline_no2: 0.042,
    temperature_c: 13.5
  },
  singapore: {
    city: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lon: 103.8198,
    climate_zone: "Af",
    climate_label: "Tropical Rainforest",
    density: 8300,
    rainfall: 2340,
    baseline_pm25: 18.0,
    baseline_pm10: 32.0,
    baseline_co: 1.6,
    baseline_no2: 0.022,
    temperature_c: 27.6
  },
  bangkok: {
    city: "Bangkok",
    country: "Thailand",
    lat: 13.7563,
    lon: 100.5018,
    climate_zone: "Aw",
    climate_label: "Tropical Savanna",
    density: 5300,
    rainfall: 1650,
    baseline_pm25: 39.0,
    baseline_pm10: 68.0,
    baseline_co: 2.7,
    baseline_no2: 0.031,
    temperature_c: 28.6
  },
  seoul: {
    city: "Seoul",
    country: "South Korea",
    lat: 37.5665,
    lon: 126.9780,
    climate_zone: "Dwa",
    climate_label: "Continental Monsoon",
    density: 15800,
    rainfall: 1410,
    baseline_pm25: 24.0,
    baseline_pm10: 48.0,
    baseline_co: 1.8,
    baseline_no2: 0.034,
    temperature_c: 13.2
  },
  dubai: {
    city: "Dubai",
    country: "United Arab Emirates",
    lat: 25.2048,
    lon: 55.2708,
    climate_zone: "BWh",
    climate_label: "Subtropical Hyper-Arid",
    density: 1200,
    rainfall: 95,
    baseline_pm25: 58.0,
    baseline_pm10: 135.0,
    baseline_co: 3.2,
    baseline_no2: 0.036,
    temperature_c: 29.5
  },
  riyadh: {
    city: "Riyadh",
    country: "Saudi Arabia",
    lat: 24.7136,
    lon: 46.6753,
    climate_zone: "BWh",
    climate_label: "Hot Desert",
    density: 2400,
    rainfall: 110,
    baseline_pm25: 64.0,
    baseline_pm10: 160.0,
    baseline_co: 3.5,
    baseline_no2: 0.039,
    temperature_c: 27.4
  },

  // Europe
  paris: {
    city: "Paris",
    country: "France",
    lat: 48.8566,
    lon: 2.3522,
    climate_zone: "Cfb",
    climate_label: "Temperate Oceanic",
    density: 20500,
    rainfall: 650,
    baseline_pm25: 14.8,
    baseline_pm10: 25.0,
    baseline_co: 1.1,
    baseline_no2: 0.026,
    temperature_c: 12.3
  },
  london: {
    city: "London",
    country: "United Kingdom",
    lat: 51.5074,
    lon: -0.1278,
    climate_zone: "Cfb",
    climate_label: "Temperate Oceanic",
    density: 5700,
    rainfall: 650,
    baseline_pm25: 12.5,
    baseline_pm10: 22.0,
    baseline_co: 1.0,
    baseline_no2: 0.024,
    temperature_c: 11.5
  },
  berlin: {
    city: "Berlin",
    country: "Germany",
    lat: 52.5200,
    lon: 13.4050,
    climate_zone: "Cfb",
    climate_label: "Temperate Continental Border",
    density: 4100,
    rainfall: 570,
    baseline_pm25: 13.0,
    baseline_pm10: 23.0,
    baseline_co: 1.1,
    baseline_no2: 0.025,
    temperature_c: 10.4
  },
  madrid: {
    city: "Madrid",
    country: "Spain",
    lat: 40.4168,
    lon: -3.7038,
    climate_zone: "Csa",
    climate_label: "Mediterranean (Inland Highland)",
    density: 5400,
    rainfall: 435,
    baseline_pm25: 13.5,
    baseline_pm10: 24.0,
    baseline_co: 1.2,
    baseline_no2: 0.029,
    temperature_c: 15.0
  },
  rome: {
    city: "Rome",
    country: "Italy",
    lat: 41.9028,
    lon: 12.4964,
    climate_zone: "Csa",
    climate_label: "Mediterranean",
    density: 2230,
    rainfall: 800,
    baseline_pm25: 16.2,
    baseline_pm10: 29.0,
    baseline_co: 1.4,
    baseline_no2: 0.032,
    temperature_c: 16.2
  },
  amsterdam: {
    city: "Amsterdam",
    country: "Netherlands",
    lat: 52.3676,
    lon: 4.9041,
    climate_zone: "Cfb",
    climate_label: "Maritime Temperate",
    density: 5200,
    rainfall: 840,
    baseline_pm25: 11.0,
    baseline_pm10: 20.0,
    baseline_co: 0.9,
    baseline_no2: 0.023,
    temperature_c: 10.8
  },

  // Americas
  newyork: {
    city: "New York",
    country: "United States",
    lat: 40.7128,
    lon: -74.0060,
    climate_zone: "Cfa",
    climate_label: "Humid Subtropical",
    density: 10900,
    rainfall: 1260,
    baseline_pm25: 16.5,
    baseline_pm10: 27.0,
    baseline_co: 1.4,
    baseline_no2: 0.025,
    temperature_c: 13.1
  },
  sanfrancisco: {
    city: "San Francisco",
    country: "United States",
    lat: 37.7749,
    lon: -122.4194,
    climate_zone: "Csb",
    climate_label: "Warm-summer Mediterranean (Coastal)",
    density: 7200,
    rainfall: 600,
    baseline_pm25: 10.2,
    baseline_pm10: 19.0,
    baseline_co: 0.8,
    baseline_no2: 0.019,
    temperature_c: 14.6
  },
  losangeles: {
    city: "Los Angeles",
    country: "United States",
    lat: 34.0522,
    lon: -118.2437,
    climate_zone: "Csa",
    climate_label: "Mediterranean Subtropical",
    density: 3200,
    rainfall: 375,
    baseline_pm25: 22.0,
    baseline_pm10: 42.0,
    baseline_co: 2.1,
    baseline_no2: 0.035,
    temperature_c: 19.2
  },
  chicago: {
    city: "Chicago",
    country: "United States",
    lat: 41.8781,
    lon: -87.6298,
    climate_zone: "Dfa",
    climate_label: "Hot-summer Humid Continental",
    density: 4600,
    rainfall: 990,
    baseline_pm25: 17.5,
    baseline_pm10: 31.0,
    baseline_co: 1.5,
    baseline_no2: 0.028,
    temperature_c: 10.5
  },
  seattle: {
    city: "Seattle",
    country: "United States",
    lat: 47.6062,
    lon: -122.3321,
    climate_zone: "Csb",
    climate_label: "Warm-summer Mediterranean / Oceanic",
    density: 3400,
    rainfall: 990,
    baseline_pm25: 9.8,
    baseline_pm10: 18.0,
    baseline_co: 0.8,
    baseline_no2: 0.018,
    temperature_c: 11.3
  },
  toronto: {
    city: "Toronto",
    country: "Canada",
    lat: 43.6532,
    lon: -79.3832,
    climate_zone: "Dfb",
    climate_label: "Warm-summer Humid Continental",
    density: 4400,
    rainfall: 830,
    baseline_pm25: 12.0,
    baseline_pm10: 22.0,
    baseline_co: 1.0,
    baseline_no2: 0.022,
    temperature_c: 9.4
  },
  saopaulo: {
    city: "São Paulo",
    country: "Brazil",
    lat: -23.5505,
    lon: -46.6333,
    climate_zone: "Cfa",
    climate_label: "Subtropical Highland Moist",
    density: 7400,
    rainfall: 1450,
    baseline_pm25: 28.5,
    baseline_pm10: 52.0,
    baseline_co: 2.6,
    baseline_no2: 0.031,
    temperature_c: 19.8
  },
  mexicocity: {
    city: "Mexico City",
    country: "Mexico",
    lat: 19.4326,
    lon: -99.1332,
    climate_zone: "Cwb",
    climate_label: "Subtropical Highland",
    density: 6100,
    rainfall: 820,
    baseline_pm25: 38.0,
    baseline_pm10: 74.0,
    baseline_co: 3.2,
    baseline_no2: 0.038,
    temperature_c: 16.5
  },

  // Africa & Oceania
  cairo: {
    city: "Cairo",
    country: "Egypt",
    lat: 30.0444,
    lon: 31.2357,
    climate_zone: "BWh",
    climate_label: "Hot Desert",
    density: 19300,
    rainfall: 25,
    baseline_pm25: 86.0,
    baseline_pm10: 180.0,
    baseline_co: 5.8,
    baseline_no2: 0.052,
    temperature_c: 22.5
  },
  nairobi: {
    city: "Nairobi",
    country: "Kenya",
    lat: -1.2921,
    lon: 36.8219,
    climate_zone: "Cwb",
    climate_label: "Subtropical Highland",
    density: 6200,
    rainfall: 920,
    baseline_pm25: 34.0,
    baseline_pm10: 62.0,
    baseline_co: 2.5,
    baseline_no2: 0.028,
    temperature_c: 19.5
  },
  lagos: {
    city: "Lagos",
    country: "Nigeria",
    lat: 6.5244,
    lon: 3.3792,
    climate_zone: "Aw",
    climate_label: "Tropical Savanna",
    density: 16000,
    rainfall: 1530,
    baseline_pm25: 68.0,
    baseline_pm10: 130.0,
    baseline_co: 4.8,
    baseline_no2: 0.044,
    temperature_c: 27.2
  },
  sydney: {
    city: "Sydney",
    country: "Australia",
    lat: -33.8688,
    lon: 151.2093,
    climate_zone: "Cfa",
    climate_label: "Humid Subtropical",
    density: 2100,
    rainfall: 1215,
    baseline_pm25: 11.0,
    baseline_pm10: 21.0,
    baseline_co: 0.9,
    baseline_no2: 0.019,
    temperature_c: 18.3
  },
  melbourne: {
    city: "Melbourne",
    country: "Australia",
    lat: -37.8136,
    lon: 144.9631,
    climate_zone: "Cfb",
    climate_label: "Temperate Oceanic",
    density: 1800,
    rainfall: 650,
    baseline_pm25: 10.5,
    baseline_pm10: 19.0,
    baseline_co: 0.9,
    baseline_no2: 0.018,
    temperature_c: 15.6
  }
};

// 4. EXPANDED SPECIES DATABASE FOR ALL GLOBAL BIOMES WITH EPIDEMIOLOGICAL ATTRIBUTES
export const SPECIES_DB: TreeSpecies[] = [
  // --- TEMPERATE (Western & Central Europe, UK, Pacific NW - Cfb) ---
  {
    id: "quercus_robur",
    name: "Quercus robur",
    common: "English Oak",
    zone: "temperate",
    co2_rate: 27,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: false,
    airPurification: "High",
    description: "Keystone European hardwood with exceptional carbon longevity (300+ yrs), massive particulate absorption, and extensive thermal shading.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Thermal Stress & Heatstroke Buffer", "Microbial Habitat Biodiversity"],
    diseaseBenefit: "High leaf roughness traps heavy aerosol soot and airborne mold spores before they enter human respiratory tracts.",
    optimalPlacement: "Public parks, institutional campuses, and wide avenue boulevards",
    nativeCities: ["Paris", "London", "Berlin", "Amsterdam", "Brussels"]
  },
  {
    id: "betula_pendula",
    name: "Betula pendula",
    common: "Silver Birch",
    zone: "temperate",
    co2_rate: 18,
    water: "Medium",
    layer: "Sub-Canopy",
    rootDepth: "Moderate",
    miyawaki: true,
    airPurification: "Very High",
    description: "Rapid pioneer with silvery bark. High-efficiency capturer of ultrafine traffic soot (PM2.5) and nitrogen dioxide.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Phytoncide Antimicrobial", "Airborne Allergen Buffer"],
    diseaseBenefit: "Foliar surface resin traps PM2.5 aerosols that carry viral particles; produces volatile betulin compounds with air-sanitizing properties.",
    optimalPlacement: "Transit corridors, expressway verges, and high-density Miyawaki stands",
    nativeCities: ["Paris", "Berlin", "London", "Stockholm", "Warsaw"]
  },
  {
    id: "fagus_sylvatica",
    name: "Fagus sylvatica",
    common: "European Beech",
    zone: "temperate",
    co2_rate: 26,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Spreading Fibrous",
    miyawaki: true,
    airPurification: "High",
    description: "Dense broadleaf canopy providing extraordinary solar shading and microclimate cooling during summer European thermal peaks.",
    diseasePreventionRoles: ["Thermal Stress & Heatstroke Buffer", "Ultraviolet Radiation Shielding"],
    diseaseBenefit: "Dense umbrella canopy eliminates urban thermal hot-spots, preventing heat exhaustion and cardiovascular collapse in vulnerable seniors.",
    optimalPlacement: "Civic squares, suburban green belts, and hospital grounds",
    nativeCities: ["Paris", "Frankfurt", "Vienna", "Zurich", "London"]
  },
  {
    id: "tilia_cordata",
    name: "Tilia cordata",
    common: "Small-leaved Lime / Linden",
    zone: "temperate",
    co2_rate: 24,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "Very High",
    description: "The gold standard for urban European street boulevards. Sticky foliar surface intercepts up to 30% of roadway soot.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Phytoncide Antimicrobial", "Acoustic Stress Mitigation"],
    diseaseBenefit: "High leaf pubescence captures diesel soot aerosols that induce childhood bronchial inflammation and asthma.",
    optimalPlacement: "Urban pedestrian malls, school peripheries, and roadway borders",
    nativeCities: ["Berlin", "Prague", "Paris", "Munich", "Amsterdam"]
  },
  {
    id: "acer_campestre",
    name: "Acer campestre",
    common: "Field Maple",
    zone: "temperate",
    co2_rate: 21,
    water: "Medium",
    layer: "Sub-Canopy",
    rootDepth: "Moderate",
    miyawaki: true,
    airPurification: "High",
    description: "Resilient native maple highly tolerant of compacted soils, urban air pollutants, street salt, and severe pruning.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Low-Allergenic Urban Buffer"],
    diseaseBenefit: "Low allergen pollen profile avoids triggering seasonal allergic rhinitis while filtering street-level exhaust.",
    optimalPlacement: "Compact street verges, parking buffers, and courtyard plantings",
    nativeCities: ["Paris", "London", "Brussels", "Lyon"]
  },
  {
    id: "platanus_acerifolia",
    name: "Platanus x acerifolia",
    common: "London Plane",
    zone: "temperate",
    co2_rate: 28,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: false,
    airPurification: "Very High",
    description: "World-renowned urban survivor. Peeling bark naturally sloughs off trapped heavy metals and soot.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Heavy Metal Bio-Accumulation", "Thermal Stress & Heatstroke Buffer"],
    diseaseBenefit: "Self-cleaning bark sloughs off trapped carcinogenic soot, preventing secondary resuspension of airborne particulate toxins.",
    optimalPlacement: "High-density arterial thoroughfares, central plazas, and river embankments",
    nativeCities: ["London", "Paris", "Melbourne", "Sydney", "New York"]
  },
  {
    id: "alnus_glutinosa",
    name: "Alnus glutinosa",
    common: "Black Alder",
    zone: "temperate",
    co2_rate: 22,
    water: "High",
    layer: "Riparian",
    rootDepth: "Spreading Fibrous",
    miyawaki: true,
    airPurification: "High",
    description: "Nitrogen-fixing wetland specialist that thrives in waterlogged urban soils and bio-filtration swales.",
    diseasePreventionRoles: ["Runoff Phytoremediation", "Vector Control (Anti-Stagnation)", "Waterborne Pathogen Buffer"],
    diseaseBenefit: "High transpiration rapidly draws down stagnant surface runoff pools within 24 hours, preventing mosquito larval breeding.",
    optimalPlacement: "Bioswales, stormwater detention basins, and riverbanks",
    nativeCities: ["Paris", "Amsterdam", "London", "Hamburg"]
  },
  {
    id: "pinus_sylvestris",
    name: "Pinus sylvestris",
    common: "Scots Pine",
    zone: "temperate",
    co2_rate: 23,
    water: "Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: false,
    airPurification: "Very High",
    description: "Hardy evergreen conifer releasing active airborne phytoncides that sanitize atmospheric air throughout all seasons.",
    diseasePreventionRoles: ["Phytoncide Antimicrobial", "Year-round PM2.5 Filtration", "Respiratory Decongestion"],
    diseaseBenefit: "Constantly emits alpha-pinene and terpene aerosols proven to inhibit airborne bacterial colonies and fungal spores.",
    optimalPlacement: "Hospital therapeutic gardens, convalescent centers, and park windbreaks",
    nativeCities: ["Edinburgh", "Oslo", "Warsaw", "Berlin", "Paris"]
  },

  // --- MEDITERRANEAN (Southern Europe, California, Central Chile - Csa/Csb) ---
  {
    id: "olea_europaea",
    name: "Olea europaea",
    common: "Olive Tree",
    zone: "mediterranean",
    co2_rate: 19,
    water: "Very Low",
    layer: "Sub-Canopy",
    rootDepth: "Spreading Fibrous",
    miyawaki: true,
    airPurification: "High",
    description: "Iconic Mediterranean evergreen. Thrives in dry, stony soils and extreme summer drought without supplemental irrigation.",
    diseasePreventionRoles: ["Thermal Stress & Heatstroke Buffer", "Drought & Dust Suppression"],
    diseaseBenefit: "Evergreen silvery leaves suppress topsoil desiccation, preventing airborne silica and particulate dust suspension in arid heat.",
    optimalPlacement: "Civic squares, median dividers, and sunny open terraces",
    nativeCities: ["Madrid", "Rome", "Athens", "Barcelona", "San Francisco"]
  },
  {
    id: "quercus_ilex",
    name: "Quercus ilex",
    common: "Holm Oak",
    zone: "mediterranean",
    co2_rate: 23,
    water: "Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "Very High",
    description: "Stately evergreen oak providing permanent year-round canopy shade, acoustic buffering, and heavy particulate dust capture.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Thermal Stress & Heatstroke Buffer"],
    diseaseBenefit: "Leathery evergreen foliage intercepts highway brake dust and fine particles, mitigating chronic pulmonary disease.",
    optimalPlacement: "Avenues, residential borders, and steep hillsides",
    nativeCities: ["Madrid", "Rome", "Lisbon", "Marseille", "Florence"]
  },
  {
    id: "pinus_pinea",
    name: "Pinus pinea",
    common: "Italian Stone Pine",
    zone: "mediterranean",
    co2_rate: 25,
    water: "Very Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: false,
    airPurification: "High",
    description: "Striking umbrella-shaped crown casting expansive shade across coastal and Mediterranean cityscapes.",
    diseasePreventionRoles: ["Phytoncide Antimicrobial", "Thermal Stress & Heatstroke Buffer"],
    diseaseBenefit: "High terpene emissions suppress atmospheric airborne bacteria while canopy shades pedestrian pavements.",
    optimalPlacement: "Coastal promenades, park boulevards, and historic plazas",
    nativeCities: ["Rome", "Naples", "Athens", "Valencia", "San Francisco"]
  },
  {
    id: "ceratonia_siliqua",
    name: "Ceratonia siliqua",
    common: "Carob Tree",
    zone: "mediterranean",
    co2_rate: 22,
    water: "Very Low",
    layer: "Sub-Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "High",
    description: "Drought-immune legume with dense evergreen foliage that fixes nitrogen and revitalizes degraded soils.",
    diseasePreventionRoles: ["Low-Allergenic Urban Buffer", "Soil Stabilization & Dust Abatement"],
    diseaseBenefit: "Deep taproots bind dry crumbly soils, preventing blowing dust storms that trigger conjunctivitis and bronchial irritation.",
    optimalPlacement: "Dry slopes, boundary hedges, and water-scarce urban pockets",
    nativeCities: ["Madrid", "Athens", "Lisbon", "Beirut", "Los Angeles"]
  },
  {
    id: "quercus_agrifolia",
    name: "Quercus agrifolia",
    common: "Coast Live Oak",
    zone: "mediterranean",
    co2_rate: 24,
    water: "Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "Very High",
    description: "Dominant California native oak that captures marine fog moisture, anchors hillsides, and creates biodiverse corridors.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Thermal Stress & Heatstroke Buffer"],
    diseaseBenefit: "Spiny convex leaves intercept marine fog particulates and urban smog aerosols, purifying coastal microclimates.",
    optimalPlacement: "Parklands, hillside stability zones, and school campuses",
    nativeCities: ["San Francisco", "Los Angeles", "San Diego", "Santa Barbara"]
  },

  // --- ARID & DESERT (Middle East, North Africa, American SW, Rajasthan - BWh/BSh) ---
  {
    id: "prosopis_cineraria",
    name: "Prosopis cineraria",
    common: "Ghaf / Khejri",
    zone: "arid",
    co2_rate: 16,
    water: "Very Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "Moderate",
    description: "The ultimate desert keystone tree. Taproots penetrate up to 35 meters to tap deep subterranean aquifers.",
    diseasePreventionRoles: ["Desert Sandstorm & Dust Trap", "Thermal Stress & Heatstroke Buffer"],
    diseaseBenefit: "Forms living green shelterbelts that intercept high-velocity silica dust storms, preventing acute desert lung silicosis and eye infections.",
    optimalPlacement: "Desert perimeter green belts, highway sand barriers, and city outskirts",
    nativeCities: ["Dubai", "Abu Dhabi", "Riyadh", "Doha", "Jaipur"]
  },
  {
    id: "phoenix_dactylifera",
    name: "Phoenix dactylifera",
    common: "Date Palm",
    zone: "arid",
    co2_rate: 18,
    water: "Low",
    layer: "Canopy",
    rootDepth: "Spreading Fibrous",
    miyawaki: false,
    airPurification: "Moderate",
    description: "Ancient arid staple tolerant of high salinity, extreme 50°C thermal peaks, and heavy desert sandstorms.",
    diseasePreventionRoles: ["Thermal Stress & Heatstroke Buffer", "Microclimate Evaporative Cooling"],
    diseaseBenefit: "High crown structure filters intense solar radiation in desert city centers, providing oasis cooling effects.",
    optimalPlacement: "Civic boulevards, oasis gardens, and residential medians",
    nativeCities: ["Cairo", "Dubai", "Riyadh", "Baghdad", "Doha"]
  },
  {
    id: "vachellia_tortilis",
    name: "Vachellia tortilis",
    common: "Umbrella Thorn",
    zone: "arid",
    co2_rate: 15,
    water: "Very Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "Moderate",
    description: "Iconic flat-topped desert acacia designed to minimize evapotranspiration while intercepting windblown sand.",
    diseasePreventionRoles: ["Desert Sandstorm & Dust Trap", "Dune Stabilization"],
    diseaseBenefit: "Intercepts particulate dust matter (PM10) in hyper-arid zones where particulate pollution is naturally severe.",
    optimalPlacement: "Perimeter dust-break belts and desert reserve margins",
    nativeCities: ["Cairo", "Khartoum", "Riyadh", "Muscat"]
  },
  {
    id: "ziziphus_spina_christi",
    name: "Ziziphus spina-christi",
    common: "Sidr / Christ's Thorn",
    zone: "arid",
    co2_rate: 17,
    water: "Very Low",
    layer: "Sub-Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "High",
    description: "Revered arid evergreen offering dense deep shade in desert oases and high medicinal value.",
    diseasePreventionRoles: ["Phytoncide Antimicrobial", "Thermal Stress & Heatstroke Buffer"],
    diseaseBenefit: "Foliar extracts have documented antimycotic and antibacterial properties; creates essential cool shade refuges during extreme heatwaves.",
    optimalPlacement: "Urban pocket parks, courtyard shade clusters, and desert hospitals",
    nativeCities: ["Cairo", "Dubai", "Amman", "Kuwait City"]
  },
  {
    id: "moringa_peregrina",
    name: "Moringa peregrina",
    common: "Wild Moringa / Yusr",
    zone: "arid",
    co2_rate: 16,
    water: "Very Low",
    layer: "Sub-Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "High",
    description: "Extremely drought-resilient native desert tree with water-clarifying seeds and antibacterial properties.",
    diseasePreventionRoles: ["Waterborne Pathogen Buffer", "Phytoncide Antimicrobial", "Rapid Soil Regeneration"],
    diseaseBenefit: "Seed proteins contain natural bio-coagulants capable of binding and precipitating waterborne bacterial pathogens in emergency stormwater catchments.",
    optimalPlacement: "Wadi reclamation corridors and dryland community gardens",
    nativeCities: ["Cairo", "Riyadh", "Muscat", "Dubai"]
  },

  // --- SUBTROPICAL (East Asia, Southeast US, Eastern Australia - Cfa/Cwb) ---
  {
    id: "zelkova_serrata",
    name: "Zelkova serrata",
    common: "Japanese Zelkova",
    zone: "subtropical",
    co2_rate: 26,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "Very High",
    description: "Premier East Asian urban avenue tree. Vase-shaped crown provides dense shade and heavy soot filtration.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Thermal Stress & Heatstroke Buffer"],
    diseaseBenefit: "Broad serrated foliage captures vehicle-generated nanoparticles and prevents thermal heat entrapment along transit corridors.",
    optimalPlacement: "High-density pedestrian avenues and transit plazas",
    nativeCities: ["Tokyo", "Seoul", "Kyoto", "Shanghai", "Osaka"]
  },
  {
    id: "ginkgo_biloba",
    name: "Ginkgo biloba",
    common: "Ginkgo / Maidenhair Tree",
    zone: "subtropical",
    co2_rate: 23,
    water: "Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: false,
    airPurification: "Very High",
    description: "Living fossil virtually immune to urban air pollution, vehicle exhaust, viral diseases, and insects.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Phytoncide Antimicrobial", "Low-Maintenance Urban Buffer"],
    diseaseBenefit: "Releases antimicrobial ginkgolides into surrounding micro-air; fan-shaped leaves absorb heavy ozone (O3) and sulfur dioxide (SO2).",
    optimalPlacement: "Urban sidewalk tree pits, civic avenues, and memorial parks",
    nativeCities: ["Tokyo", "Seoul", "Beijing", "New York", "Atlanta"]
  },
  {
    id: "cinnamomum_camphora",
    name: "Cinnamomum camphora",
    common: "Camphor Tree",
    zone: "subtropical",
    co2_rate: 27,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "Very High",
    description: "Massive evergreen broadleaf releasing powerful aromatic camphor that naturally repels disease-carrying insects.",
    diseasePreventionRoles: ["Vector Repellent (Mosquitoes)", "Phytoncide Antimicrobial", "Thermal Stress & Heatstroke Buffer"],
    diseaseBenefit: "Natural camphor vapor acts as an organic repellent against disease-carrying mosquitoes (Culex and Aedes) while sanitizing public air.",
    optimalPlacement: "Public botanical grounds, suburban borders, and river walks",
    nativeCities: ["Tokyo", "Taipei", "Shanghai", "Sydney", "Hong Kong"]
  },
  {
    id: "acer_rubrum",
    name: "Acer rubrum",
    common: "Red Maple",
    zone: "subtropical",
    co2_rate: 22,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Moderate",
    miyawaki: true,
    airPurification: "High",
    description: "Fast-growing adaptable hardwood that tolerates wet soils and urban compaction, absorbing ozone and NOx.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Runoff Phytoremediation"],
    diseaseBenefit: "Fibrous root networks filter contaminated urban stormwater before it can pond and harbor bacterial colonies.",
    optimalPlacement: "Rain gardens, bio-retention swales, and street medians",
    nativeCities: ["Atlanta", "Charlotte", "Washington DC", "Sydney"]
  },

  // --- CONTINENTAL (Midwest, Canada, Northern & Eastern Europe - Dfa/Dfb/Dwa) ---
  {
    id: "acer_saccharum",
    name: "Acer saccharum",
    common: "Sugar Maple",
    zone: "continental",
    co2_rate: 27,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "High",
    description: "Dominant cold-climate hardwood with dense foliage providing immense cooling shade and heavy biomass accumulation.",
    diseasePreventionRoles: ["Thermal Stress & Heatstroke Buffer", "Ultraviolet Radiation Shielding"],
    diseaseBenefit: "Substantial cooling shade prevents extreme continental summer heat spikes, lowering cardiovascular stress in dense cities.",
    optimalPlacement: "Urban neighborhood parks, school grounds, and wide parkways",
    nativeCities: ["Chicago", "Toronto", "Montreal", "Minneapolis", "Detroit"]
  },
  {
    id: "quercus_macrocarpa",
    name: "Bur Oak",
    common: "Bur Oak",
    zone: "continental",
    co2_rate: 28,
    water: "Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: false,
    airPurification: "Very High",
    description: "Massive drought-hardy and freeze-hardy oak with thick fire-resistant bark, highly tolerant of urban street pollutants.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Heavy Road Salt & Toxins Tolerance"],
    diseaseBenefit: "Extensive foliar surface traps heavy winter vehicle exhaust aerosols and diesel fumes in cold inversions.",
    optimalPlacement: "Arterial roadway borders and large civic green spaces",
    nativeCities: ["Chicago", "Toronto", "Minneapolis", "Calgary"]
  },
  {
    id: "tilia_americana",
    name: "Tilia americana",
    common: "American Basswood / Linden",
    zone: "continental",
    co2_rate: 24,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "Very High",
    description: "Heart-shaped leaves that trap airborne dust particles and release fragrant honey scent.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Phytoncide Antimicrobial"],
    diseaseBenefit: "Fine leaf hairs act as mechanical filters for particulate carriers of respiratory bacteria and influenza viruses.",
    optimalPlacement: "Avenues, residential boulevards, and community parks",
    nativeCities: ["Chicago", "Milwaukee", "Toronto", "Cleveland"]
  },
  {
    id: "pinus_strobus",
    name: "Pinus strobus",
    common: "Eastern White Pine",
    zone: "continental",
    co2_rate: 25,
    water: "Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: false,
    airPurification: "High",
    description: "Fast-growing evergreen conifer that filters particulate pollution year-round, including through freezing continental winters.",
    diseasePreventionRoles: ["Phytoncide Antimicrobial", "Year-round PM2.5 Filtration"],
    diseaseBenefit: "Maintains needle-based active particulate filtration through sub-zero winter months when smog inversions are most dangerous to asthmatics.",
    optimalPlacement: "Winter windbreaks, highway perimeter screens, and green corridors",
    nativeCities: ["Toronto", "Montreal", "Minneapolis", "Buffalo"]
  },

  // --- TROPICAL & MONSOON (South & Southeast Asia, Equatorial Africa, Caribbean - Aw/Am/Af) ---
  {
    id: "ficus_benghalensis",
    name: "Ficus benghalensis",
    common: "Banyan Tree",
    zone: "tropical",
    co2_rate: 28,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: false,
    airPurification: "Very High",
    description: "Enormous umbrella canopy capable of shading entire public squares. Superb particulate interception.",
    diseasePreventionRoles: ["Thermal Stress & Heatstroke Buffer", "Particulate & Pathogen Carrier Trap", "Avian Predator Refuge"],
    diseaseBenefit: "Lowers ground temperature by up to 6°C under its aerial prop-root canopy; shelters insectivorous birds that feed on disease-vector mosquitoes.",
    optimalPlacement: "Central public squares, major temple grounds, and urban sanctuaries",
    nativeCities: ["Kolkata", "Delhi", "Mumbai", "Dhaka", "Bangkok"]
  },
  {
    id: "azadirachta_indica",
    name: "Azadirachta indica",
    common: "Neem",
    zone: "tropical",
    co2_rate: 22,
    water: "Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "Very High",
    description: "Legendary medicinal evergreen releasing abundant daytime oxygen while naturally repelling disease-carrying mosquitoes.",
    diseasePreventionRoles: ["Vector Repellent (Mosquitoes)", "Phytoncide Antimicrobial", "Particulate & Pathogen Carrier Trap"],
    diseaseBenefit: "High concentrations of azadirachtin, nimbin, and volatile terpenes naturally disrupt mosquito oviposition and repel Dengue, Malaria, and Chikungunya vectors.",
    optimalPlacement: "Hospital grounds, school peripheries, high-density residential belts, and transit corridors",
    nativeCities: ["Kolkata", "Delhi", "Chennai", "Mumbai", "Nairobi", "Karachi"]
  },
  {
    id: "terminalia_arjuna",
    name: "Terminalia arjuna",
    common: "Arjun",
    zone: "tropical",
    co2_rate: 25,
    water: "High",
    layer: "Riparian",
    rootDepth: "Spreading Fibrous",
    miyawaki: true,
    airPurification: "High",
    description: "Riparian specialist along canals and drainage swales. Roots prevent severe erosion and cleanse urban runoff.",
    diseasePreventionRoles: ["Runoff Phytoremediation", "Vector Control (Anti-Stagnation)", "Waterborne Pathogen Buffer"],
    diseaseBenefit: "Extensive roots absorb heavy metals and filter organic sewage run-off, accelerating water clearance and eliminating stagnant mosquito breeding pools.",
    optimalPlacement: "Canal banks, wastewater swales, drainage canals, and lake edges",
    nativeCities: ["Kolkata", "Mumbai", "Dhaka", "Varanasi", "Yangon"]
  },
  {
    id: "neolamarckia_cadamba",
    name: "Neolamarckia cadamba",
    common: "Kadamba",
    zone: "tropical",
    co2_rate: 24,
    water: "Medium",
    layer: "Sub-Canopy",
    rootDepth: "Moderate",
    miyawaki: true,
    airPurification: "High",
    description: "Rapid pioneer broadleaf tree with spherical fragrant blooms, closing canopies in 3 years in tropical Miyawaki stands.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Thermal Stress & Heatstroke Buffer"],
    diseaseBenefit: "Broad horizontal foliage rapidly establishes dense canopy cover, blocking tropical UV radiation and trapping ground-level fugitive dust.",
    optimalPlacement: "Miyawaki micro-forest clusters, urban parks, and river corridors",
    nativeCities: ["Kolkata", "Bengaluru", "Singapore", "Jakarta", "Manila"]
  },
  {
    id: "samanea_saman",
    name: "Samanea saman",
    common: "Rain Tree",
    zone: "tropical",
    co2_rate: 30,
    water: "Medium",
    layer: "Canopy",
    rootDepth: "Spreading Fibrous",
    miyawaki: false,
    airPurification: "Very High",
    description: "Expansive crown reaching a 30m spread; provides massive shade and cooling evapotranspiration across tropical transit boulevards.",
    diseasePreventionRoles: ["Thermal Stress & Heatstroke Buffer", "Ultraviolet Radiation Shielding"],
    diseaseBenefit: "Expansive crown lowers ambient street temperatures by 3.5°C to 5.0°C, drastically mitigating urban heatwave mortality.",
    optimalPlacement: "Major highway medians, wide boulevards, and public commons",
    nativeCities: ["Singapore", "Kolkata", "Bangkok", "Colombo", "Kuala Lumpur"]
  },
  {
    id: "ficus_religiosa",
    name: "Ficus religiosa",
    common: "Peepal / Sacred Fig",
    zone: "tropical",
    co2_rate: 26,
    water: "Low",
    layer: "Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: false,
    airPurification: "Very High",
    description: "Heart-shaped fluttering leaves that filter coarse dust. High oxygen generation and tolerates degraded urban soils.",
    diseasePreventionRoles: ["Particulate & Pathogen Carrier Trap", "Acoustic Stress Mitigation", "Oxygen Enrichment"],
    diseaseBenefit: "Fluttering leaves generate turbulent micro-currents that break up stagnant air pockets and trap fine particulate carriers of pathogens.",
    optimalPlacement: "Traffic intersections, civic plazas, and open public buffers",
    nativeCities: ["Delhi", "Kolkata", "Lucknow", "Jaipur", "Dhaka"]
  },
  {
    id: "pongamia_pinnata",
    name: "Pongamia pinnata",
    common: "Karanja / Indian Beech",
    zone: "tropical",
    co2_rate: 20,
    water: "Low",
    layer: "Sub-Canopy",
    rootDepth: "Deep Taproot",
    miyawaki: true,
    airPurification: "High",
    description: "Hardy nitrogen-fixing legume thriving in saline and degraded ground. Glossy foliar surface repels vehicle exhaust.",
    diseasePreventionRoles: ["Vector Repellent (Mosquitoes)", "Soil Bioremediation", "Particulate & Pathogen Carrier Trap"],
    diseaseBenefit: "Karanjin seed oils and foliar volatile compounds possess natural insecticidal properties that deter mosquito larvae in urban drainage.",
    optimalPlacement: "Roadside margins, saline groundwater zones, and industrial buffer perimeters",
    nativeCities: ["Kolkata", "Hyderabad", "Mumbai", "Chennai", "Ahmedabad"]
  },
  {
    id: "lagerstroemia_speciosa",
    name: "Lagerstroemia speciosa",
    common: "Pride of India / Queen Crape Myrtle",
    zone: "tropical",
    co2_rate: 19,
    water: "Medium",
    layer: "Sub-Canopy",
    rootDepth: "Moderate",
    miyawaki: true,
    airPurification: "High",
    description: "Vibrant blooming tropical tree with dense foliar clusters that trap airborne street dust and tolerate waterlogging.",
    diseasePreventionRoles: ["Low-Allergenic Urban Buffer", "Runoff Phytoremediation", "Thermal Stress Buffer"],
    diseaseBenefit: "High root tolerance to transient flooding enables bio-retention swales that drain stagnant street puddles within hours.",
    optimalPlacement: "Urban sidewalks, drainage verges, and neighborhood park boundaries",
    nativeCities: ["Kolkata", "Singapore", "Bangkok", "Kuala Lumpur", "Mumbai"]
  }
];

// 5. CLIMATE INFERENCE FOR ARBITRARY COORDINATES
export function inferClimateFromCoordinates(lat: number, lon: number): {
  climate_zone: string;
  climate_label: string;
  rainfall: number;
  baseline_pm25: number;
  baseline_pm10: number;
  baseline_co: number;
  baseline_no2: number;
  density: number;
  temperature_c: number;
} {
  const absLat = Math.abs(lat);

  // Tropical belt
  if (absLat <= 15) {
    return {
      climate_zone: "Aw",
      climate_label: "Tropical Savanna / Wet-Dry",
      rainfall: 1750,
      baseline_pm25: 45.0,
      baseline_pm10: 75.0,
      baseline_co: 2.8,
      baseline_no2: 0.035,
      density: 5000,
      temperature_c: 27.5
    };
  }

  // Subtropical / Arid / Mediterranean belts
  if (absLat <= 36) {
    // Check if Middle East / North Africa / inland arid longitude
    const isDesertZone =
      (lat >= 15 && lat <= 35 && lon >= -15 && lon <= 60) || // Sahara & Arabian
      (lat >= 20 && lat <= 35 && lon >= -118 && lon <= -100); // American Southwest

    if (isDesertZone) {
      return {
        climate_zone: "BWh",
        climate_label: "Hot Desert / Hyper-Arid",
        rainfall: 120,
        baseline_pm25: 62.0,
        baseline_pm10: 140.0,
        baseline_co: 3.2,
        baseline_no2: 0.038,
        density: 2200,
        temperature_c: 26.5
      };
    }

    // Mediterranean
    const isMed =
      (lat >= 30 && lat <= 45 && lon >= -10 && lon <= 35) || // Mediterranean Basin
      (lat >= 32 && lat <= 42 && lon >= -124 && lon <= -115); // California

    if (isMed) {
      return {
        climate_zone: "Csa",
        climate_label: "Mediterranean Coastal / Subtropical",
        rainfall: 550,
        baseline_pm25: 14.5,
        baseline_pm10: 25.0,
        baseline_co: 1.2,
        baseline_no2: 0.024,
        density: 4500,
        temperature_c: 17.5
      };
    }

    return {
      climate_zone: "Cfa",
      climate_label: "Humid Subtropical",
      rainfall: 1100,
      baseline_pm25: 22.0,
      baseline_pm10: 42.0,
      baseline_co: 1.8,
      baseline_no2: 0.026,
      density: 5200,
      temperature_c: 19.0
    };
  }

  // Temperate Oceanic
  if (absLat <= 55) {
    return {
      climate_zone: "Cfb",
      climate_label: "Temperate Oceanic / Maritime",
      rainfall: 720,
      baseline_pm25: 12.5,
      baseline_pm10: 22.0,
      baseline_co: 1.0,
      baseline_no2: 0.022,
      density: 4200,
      temperature_c: 11.5
    };
  }

  // Continental / Cold Boreal
  return {
    climate_zone: "Dfb",
    climate_label: "Humid Continental / Boreal",
    rainfall: 620,
    baseline_pm25: 9.5,
    baseline_pm10: 16.0,
    baseline_co: 0.8,
    baseline_no2: 0.018,
    density: 1800,
    temperature_c: 6.2
  };
}

// 6. DYNAMIC GEOLOCATION RESOLUTION
export async function resolveAnyLocation(query: string): Promise<LocationData> {
  const clean = query.trim().toLowerCase();

  // 1. Check coordinates (lat, lon)
  const coordMatch = clean.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
  if (coordMatch) {
    const lat = parseFloat(coordMatch[1]);
    const lon = parseFloat(coordMatch[2]);
    if (!isNaN(lat) && !isNaN(lon) && lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180) {
      const inferred = inferClimateFromCoordinates(lat, lon);
      return {
        city: `Coordinates (${lat.toFixed(3)}°, ${lon.toFixed(3)}°)`,
        country: "Geographic Location",
        lat,
        lon,
        ...inferred
      };
    }
  }

  // 2. Check local gazetteer dictionary
  const directKey = clean.replace(/[^a-z0-9]/g, '');
  for (const [key, data] of Object.entries(GAZETTEER)) {
    if (directKey === key || clean.includes(data.city.toLowerCase())) {
      return data;
    }
  }

  // 3. Fallback to OpenStreetMap Nominatim Geocoder
  try {
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`;
    const res = await fetch(geocodeUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'EcoGPT-EnvironmentalAdvisory/2.5'
      }
    });

    if (res.ok) {
      const results = await res.json();
      if (Array.isArray(results) && results.length > 0) {
        const item = results[0];
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        const parts = (item.display_name || '').split(',');
        const city = parts[0]?.trim() || query;
        const country = parts[parts.length - 1]?.trim() || 'Global';

        const inferred = inferClimateFromCoordinates(lat, lon);

        // Optionally fetch real-time air quality from Open-Meteo with a 2s timeout
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 2000);

          const airRes = await fetch(
            `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide`,
            { signal: controller.signal }
          );
          clearTimeout(timeoutId);

          if (airRes.ok) {
            const airData = await airRes.json();
            const cur = airData.current;
            if (cur) {
              if (cur.pm2_5 !== undefined && cur.pm2_5 !== null) {
                inferred.baseline_pm25 = Math.round(cur.pm2_5 * 10) / 10;
              }
              if (cur.pm10 !== undefined && cur.pm10 !== null) {
                inferred.baseline_pm10 = Math.round(cur.pm10 * 10) / 10;
              }
              if (cur.carbon_monoxide !== undefined && cur.carbon_monoxide !== null) {
                inferred.baseline_co = Math.round((cur.carbon_monoxide / 1145) * 10) / 10;
              }
              if (cur.nitrogen_dioxide !== undefined && cur.nitrogen_dioxide !== null) {
                inferred.baseline_no2 = Math.round((cur.nitrogen_dioxide / 1880) * 1000) / 1000;
              }
            }
          }
        } catch {
          // Keep inferred baseline if API fails
        }

        return {
          city,
          country,
          lat,
          lon,
          ...inferred
        };
      }
    }
  } catch (err) {
    console.warn('Geocoding service unreachable, using closest match:', err);
  }

  // 4. Default to Kolkata if completely unrecognized
  return GAZETTEER['kolkata'];
}

// 7. COMPREHENSIVE AQI & POLLUTANT BENCHMARKS
export function calculateAQI(
  pm25: number,
  pm10: number = 0,
  co_ppm: number = 0,
  no2_ppm: number = 0
): AQIResult {
  const effectivePm10 = pm10 || pm25 * 1.8;
  const effectiveCo = co_ppm || 2.0;
  const effectiveNo2 = no2_ppm || 0.03;

  // EPA / CPCB sub-index model
  const pm_sub = Math.min(500.0, (pm25 / 55.4) * 150);
  const pm10_sub = Math.min(500.0, (effectivePm10 / 154) * 100);
  const co_sub = Math.min(500.0, (effectiveCo / 9.4) * 100);
  const no2_sub = Math.min(500.0, (effectiveNo2 * 1000 / 100) * 100);

  const score = Math.round(Math.max(pm_sub, pm10_sub, co_sub, no2_sub) * 10) / 10;

  let category: AQIResult['category'];
  let color: string;
  let badgeBg: string;
  let healthSummary: string;

  if (score <= 50) {
    category = "Good";
    color = "#10b981"; // Emerald
    badgeBg = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    healthSummary = "Air quality is satisfactory and poses little or no risk to public health.";
  } else if (score <= 100) {
    category = "Moderate";
    color = "#eab308"; // Amber
    badgeBg = "bg-amber-500/20 text-amber-300 border-amber-500/30";
    healthSummary = "Acceptable air quality; sensitive individuals may experience minor respiratory irritation.";
  } else if (score <= 150) {
    category = "Unhealthy for Sensitive Groups";
    color = "#f97316"; // Orange
    badgeBg = "bg-orange-500/20 text-orange-300 border-orange-500/30";
    healthSummary = "Children, elderly, and individuals with asthma should reduce prolonged outdoor exertion.";
  } else if (score <= 200) {
    category = "Unhealthy";
    color = "#ef4444"; // Red
    badgeBg = "bg-red-500/20 text-red-300 border-red-500/30";
    healthSummary = "General population may experience health effects; sensitive groups experience more serious effects.";
  } else if (score <= 300) {
    category = "Very Unhealthy";
    color = "#a855f7"; // Purple
    badgeBg = "bg-purple-500/20 text-purple-300 border-purple-500/30";
    healthSummary = "Health alert: risk of health effects is heightened for everyone. Limit outdoor activities.";
  } else {
    category = "Hazardous";
    color = "#e11d48"; // Crimson Maroon
    badgeBg = "bg-rose-500/30 text-rose-300 border-rose-500/40";
    healthSummary = "Emergency conditions: entire population is likely to be affected by severe respiratory stress.";
  }

  let dominant: AQIResult['dominant'] = "PM2.5";
  if (score === pm10_sub) dominant = "PM10";
  else if (score === co_sub) dominant = "CO";
  else if (score === no2_sub) dominant = "NO2";

  // Comparison against WHO 2021 Safe Limits
  const benchmarks: PollutantBenchmark[] = [
    {
      name: "PM2.5",
      value: Math.round(pm25 * 10) / 10,
      unit: "µg/m³",
      whoLimit: 15.0, // WHO 24h standard
      ratio: Math.round((pm25 / 15.0) * 10) / 10,
      status: pm25 <= 15 ? 'Safe' : pm25 <= 35 ? 'Moderate' : pm25 <= 75 ? 'Elevated' : 'Hazardous',
      color: pm25 <= 15 ? '#10b981' : pm25 <= 35 ? '#eab308' : pm25 <= 75 ? '#f97316' : '#ef4444'
    },
    {
      name: "PM10",
      value: Math.round(effectivePm10 * 10) / 10,
      unit: "µg/m³",
      whoLimit: 45.0, // WHO 24h standard
      ratio: Math.round((effectivePm10 / 45.0) * 10) / 10,
      status: effectivePm10 <= 45 ? 'Safe' : effectivePm10 <= 100 ? 'Moderate' : effectivePm10 <= 180 ? 'Elevated' : 'Hazardous',
      color: effectivePm10 <= 45 ? '#10b981' : effectivePm10 <= 100 ? '#eab308' : effectivePm10 <= 180 ? '#f97316' : '#ef4444'
    },
    {
      name: "NO2",
      value: Math.round(effectiveNo2 * 1000) / 1000,
      unit: "ppm",
      whoLimit: 0.025, // WHO 24h standard (~25 ug/m3)
      ratio: Math.round((effectiveNo2 / 0.025) * 10) / 10,
      status: effectiveNo2 <= 0.025 ? 'Safe' : effectiveNo2 <= 0.05 ? 'Moderate' : effectiveNo2 <= 0.1 ? 'Elevated' : 'Hazardous',
      color: effectiveNo2 <= 0.025 ? '#10b981' : effectiveNo2 <= 0.05 ? '#eab308' : effectiveNo2 <= 0.1 ? '#f97316' : '#ef4444'
    },
    {
      name: "CO",
      value: Math.round(effectiveCo * 10) / 10,
      unit: "ppm",
      whoLimit: 3.5, // 24h standard
      ratio: Math.round((effectiveCo / 3.5) * 10) / 10,
      status: effectiveCo <= 3.5 ? 'Safe' : effectiveCo <= 6.0 ? 'Moderate' : effectiveCo <= 10.0 ? 'Elevated' : 'Hazardous',
      color: effectiveCo <= 3.5 ? '#10b981' : effectiveCo <= 6.0 ? '#eab308' : effectiveCo <= 10.0 ? '#f97316' : '#ef4444'
    }
  ];

  return {
    score,
    category,
    color,
    badgeBg,
    dominant,
    healthSummary,
    pm_sub: Math.round(pm_sub),
    pm10_sub: Math.round(pm10_sub),
    co_sub: Math.round(co_sub),
    no2_sub: Math.round(no2_sub),
    benchmarks
  };
}

export function calculateCarbonProjections(treeCount: number, avgRate = 22.0): {
  rates: Record<string, number>;
  projections: CarbonProjection[];
  carEquivalents: number;
} {
  const years = [
    { year: 1, label: "Year 1 (Sapling Est.)", factor: 0.1 },
    { year: 3, label: "Year 3 (Canopy Form)", factor: 0.3 },
    { year: 5, label: "Year 5 (Rapid Growth)", factor: 0.5 },
    { year: 10, label: "Year 10 (Full Canopy)", factor: 1.0 },
    { year: 25, label: "Year 25 (Mature Stand)", factor: 1.0 }
  ];

  const rates: Record<string, number> = {};
  const projections: CarbonProjection[] = [];

  years.forEach(({ year, factor }) => {
    // 85% survival rate baseline under urban maintenance
    const captured = Math.round((treeCount * avgRate * factor * 0.85 * year) / 1000.0 * 10) / 10;
    rates[`Year ${year}`] = captured;
    projections.push({
      timeline: `Yr ${year}`,
      year,
      tCO2e: Math.round((treeCount * avgRate * factor * 0.85) / 1000.0 * 10) / 10,
      cumulativeTons: captured
    });
  });

  const year10Tons = rates["Year 10"] || 1;
  const carEquivalents = Math.round((year10Tons / 4.6) * 10) / 10;

  return { rates, projections, carEquivalents };
}

export function calculateRainwaterHarvesting(roofAreaM2: number, rainfallMm: number): {
  harvestLiters: number;
  coveragePct: number;
} {
  const harvestLiters = Math.round(roofAreaM2 * rainfallMm * 0.8);
  const annualHouseholdDemand = 5 * 135 * 365;
  const coveragePct = Math.min(100, Math.round((harvestLiters / annualHouseholdDemand) * 100));

  return { harvestLiters, coveragePct };
}

export function matchSpeciesForClimate(climateZone: string, cityName?: string, countryName?: string): TreeSpecies[] {
  const cz = climateZone.toLowerCase();
  const city = (cityName || '').toLowerCase();
  const country = (countryName || '').toLowerCase();

  let targetGroup: TreeSpecies['zone'] = 'tropical';

  if (
    cz.startsWith('b') ||
    city.includes('cairo') || city.includes('dubai') || city.includes('riyadh') ||
    city.includes('doha') || city.includes('jaipur') || city.includes('phoenix')
  ) {
    targetGroup = 'arid';
  } else if (
    cz.startsWith('csa') || cz.startsWith('csb') ||
    city.includes('madrid') || city.includes('rome') || city.includes('athens') ||
    city.includes('barcelona') || city.includes('san francisco') || city.includes('los angeles')
  ) {
    targetGroup = 'mediterranean';
  } else if (
    cz.startsWith('cfa') || cz.startsWith('cwa') ||
    city.includes('tokyo') || city.includes('seoul') || city.includes('sydney') ||
    city.includes('atlanta') || city.includes('shanghai') || city.includes('kyoto')
  ) {
    targetGroup = 'subtropical';
  } else if (
    cz.startsWith('cfb') || cz.startsWith('cfc') ||
    city.includes('paris') || city.includes('london') || city.includes('berlin') ||
    city.includes('amsterdam') || city.includes('melbourne') || city.includes('brussels')
  ) {
    targetGroup = 'temperate';
  } else if (
    cz.startsWith('d') ||
    city.includes('chicago') || city.includes('toronto') || city.includes('montreal') ||
    city.includes('minneapolis') || city.includes('warsaw')
  ) {
    targetGroup = 'continental';
  } else {
    targetGroup = 'tropical';
  }

  // Filter primary species matching targetGroup
  const primary = SPECIES_DB.filter(s => s.zone === targetGroup);

  // If city matches a species' nativeCities, bring it to the very top!
  const sortedPrimary = [...primary].sort((a, b) => {
    const aCityMatch = (a.nativeCities || []).some(c => city.includes(c.toLowerCase()));
    const bCityMatch = (b.nativeCities || []).some(c => city.includes(c.toLowerCase()));
    if (aCityMatch && !bCityMatch) return -1;
    if (!aCityMatch && bCityMatch) return 1;
    return b.co2_rate - a.co2_rate;
  });

  const secondary = SPECIES_DB.filter(s => s.zone !== targetGroup);
  return [...sortedPrimary, ...secondary];
}

export function getDiseasePreventionFramework(location: LocationData, aqi: AQIResult): DiseasePreventionFramework {
  const isHighAqi = aqi.score > 100 || location.baseline_pm25 > 35;
  const isHighRainfall = location.rainfall > 900;
  const isHotOrArid = location.temperature_c > 24 || location.climate_zone.startsWith('b') || location.climate_zone.startsWith('a');

  return {
    vectorBorne: {
      title: "Vector-Borne Disease Prevention (Dengue, Malaria, Chikungunya, West Nile)",
      iconType: "mosquito",
      riskLevel: isHighRainfall || isHotOrArid ? "Critical / High" : "Moderate / Monitored",
      targetPathogens: [
        "Dengue Virus (DENV 1-4 via Aedes aegypti)",
        "Malaria (Plasmodium falciparum via Anopheles)",
        "Chikungunya & Zika Viruses",
        "West Nile Virus (via Culex pipiens)"
      ],
      transmissionPathway: "Stagnant unshaded puddles, blocked street gutters, uncovered rainwater tanks, and urban heat micro-pockets that shorten vector breeding cycles.",
      botanicalMeasures: [
        {
          speciesRecommended: "Neem (Azadirachta indica) / Camphor (Cinnamomum camphora)",
          action: "Releases natural azadirachtin and volatile terpene vapors that disrupt mosquito oviposition and deter adult feeding."
        },
        {
          speciesRecommended: "Arjun (Terminalia arjuna) / Black Alder (Alnus glutinosa)",
          action: "High-transpiration riparian canopy rapidly draws down standing drainage pools within 24 hours, preventing larval pupation."
        },
        {
          speciesRecommended: "Karanja (Pongamia pinnata) / Pride of India (Lagerstroemia)",
          action: "Seed and foliar bio-flavonoids provide natural organic larvicidal runoff in storm ditches."
        }
      ],
      environmentalEngineering: [
        "Deploy 0.8mm stainless mesh seals and hermetic backflow valves on all rooftop rainwater harvesting downspouts.",
        "Grade bioswales and pervious gravel filtration trenches to guarantee zero standing water after 24 hours.",
        "Introduce natural biological larvicides (Bacillus thuringiensis israelensis - BTI) in retention ponds."
      ],
      civicProtocol: "Bi-weekly neighborhood 'Dry Day' inspections targeting discarded containers, unmaintained rooftop tanks, and AC drain pans."
    },
    airborneRespiratory: {
      title: "Airborne & Particulate Respiratory Illness Defense (Asthma, COPD, Bacterial/Viral Aerosols)",
      iconType: "lungs",
      riskLevel: isHighAqi ? "Critical / High" : "Low / Preventative",
      targetPathogens: [
        "Ultrafine PM2.5 & PM10 aerosol carrier vectors",
        "Aerosolized Mycobacterium & Legionella species",
        "Airborne fungal mycotoxins (Aspergillus)",
        "Sulfur & Nitrogen Dioxide triggered Bronchospasm"
      ],
      transmissionPathway: "Vehicular exhaust and industrial soot act as aerodynamic carriers, transporting bacteria, viruses, and heavy metals deep into pulmonary alveoli.",
      botanicalMeasures: [
        {
          speciesRecommended: "Silver Birch (Betula pendula) / Small-leaved Linden (Tilia cordata)",
          action: "Micro-grooved and pubescent leaf surfaces mechanically capture up to 34% of airborne fine particulate carriers."
        },
        {
          speciesRecommended: "Scots Pine (Pinus sylvestris) / White Pine (Pinus strobus)",
          action: "Continuously emits aerosolized alpha-pinene phytoncides that exhibit proven in-vitro bactericidal and fungicidal activity."
        },
        {
          speciesRecommended: "Ginkgo Biloba / English Oak (Quercus robur)",
          action: "High stomatal uptake of toxic gaseous ozone (O3), sulfur dioxide (SO2), and combustion nitrogen oxides."
        }
      ],
      environmentalEngineering: [
        "Plant dense 3-tier vegetative particulate shelterbelts (evergreen canopy + sub-canopy + dense hedge) along major traffic arteries.",
        "Enforce organic shredded woodchip mulching on bare road verges to suppress dry windblown fugitive dust resuspension.",
        "Establish 50-meter clean-air vegetative buffer zones enclosing all primary schools, elder-care facilities, and sports grounds."
      ],
      civicProtocol: "Real-time municipal air sensor alert broadcasts with automated water-mist cannon deployment during winter atmospheric inversion days."
    },
    waterBorneRunoff: {
      title: "Water-Borne & Street Runoff Pathogen Defense (Cholera, Typhoid, Leptospirosis, E. Coli)",
      iconType: "water",
      riskLevel: isHighRainfall ? "Critical / High" : "Moderate / Monitored",
      targetPathogens: [
        "Vibrio cholerae & Salmonella enterica",
        "Pathogenic Escherichia coli & Enterococcus faecalis",
        "Leptospira interrogans (from urban rodent runoff)",
        "Cryptosporidium & Giardia cysts"
      ],
      transmissionPathway: "Monsoon street flooding and flash runoff washing street fecal matter, rodent urine, and sewer overflows directly into walking paths and drinking aquifers.",
      botanicalMeasures: [
        {
          speciesRecommended: "Arjun (Terminalia arjuna) / Red Maple (Acer rubrum)",
          action: "Fibrous mycorrhizal root systems bio-filter enteric bacteria, grease, and petro-hydrocarbons from street wash."
        },
        {
          speciesRecommended: "Black Alder (Alnus glutinosa) / River Reeds (Phragmites)",
          action: "Constructed wetland bio-swales that achieve 90%+ fecal coliform reduction through rhizosphere antimicrobial exudates."
        },
        {
          speciesRecommended: "Wild Moringa (Moringa peregrina) / Carob (Ceratonia)",
          action: "Natural bio-coagulant proteins accelerate sedimentation of pathogen-laden suspended solids."
        }
      ],
      environmentalEngineering: [
        "Mandate automated first-flush diverters on all rooftop catchment systems (diverting first 2mm of polluted atmospheric wash).",
        "Replace impermeable asphalt sidewalks with permeable interlocking pavers and subsurface sand-charcoal percolation trenches.",
        "Construct gravity bioswales with check-dams upstream of municipal lakes and open waterways to trap urban litter."
      ],
      civicProtocol: "Annual pre-monsoon desilting of stormwater drains, mandatory vermin proofing of food waste facilities, and free water testing."
    },
    thermalHeatStress: {
      title: "Urban Heat Island & Thermal Morbidity Mitigation (Heatstroke, Cardiovascular Failure)",
      iconType: "heat",
      riskLevel: isHotOrArid ? "Critical / High" : "Moderate / Monitored",
      targetPathogens: [
        "Exertional & Classical Heatstroke (Core temp >40°C)",
        "Nocturnal thermal stress & cardiovascular ischemia",
        "Acute dehydration-induced chronic kidney disease",
        "Solar ultraviolet cataract and dermal radiation injury"
      ],
      transmissionPathway: "Unshaded asphalt and concrete surfaces absorbing intense solar radiation, radiating secondary infrared heat up to 55°C and failing to cool overnight.",
      botanicalMeasures: [
        {
          speciesRecommended: "Rain Tree (Samanea saman) / London Plane (Platanus)",
          action: "Creates expansive 25-meter umbrella crowns that block 85% of direct solar irradiance and drop ground surface temperature by 4°C to 7°C."
        },
        {
          speciesRecommended: "Banyan (Ficus benghalensis) / European Beech (Fagus sylvatica)",
          action: "High leaf area index (LAI) drives massive cooling evapotranspiration, acting as natural biological air conditioners."
        },
        {
          speciesRecommended: "Holm Oak (Quercus ilex) / Ghaf (Prosopis cineraria)",
          action: "Maintains dense cooling foliage through extreme summer drought without demanding municipal irrigation."
        }
      ],
      environmentalEngineering: [
        "Target minimum 40% tree canopy coverage over all pedestrian sidewalks, outdoor bus terminals, and public housing courtyards.",
        "Deploy cool-pavement coatings and high-albedo reflective roof membranes on buildings without vegetative green roofs.",
        "Create continuous connected urban green corridors that channel cool prevailing river and maritime breezes through the downtown core."
      ],
      civicProtocol: "Municipal Heat Action Plan triggers with air-conditioned public cooling centers, hydration kiosks, and shifted outdoor labor hours above 38°C."
    }
  };
}

export async function runFullAssessmentAsync(params: {
  locationInput: string;
  treeTarget?: number;
  roofArea?: number;
  audience?: string;
}): Promise<EnvironmentalAssessment> {
  const treeTarget = params.treeTarget || 10000;
  const roofArea = params.roofArea || 100;
  const audience = params.audience || "Urban Planner & Environmental Authority";

  const location = await resolveAnyLocation(params.locationInput);

  const aqi = calculateAQI(
    location.baseline_pm25,
    location.baseline_pm10,
    location.baseline_co,
    location.baseline_no2
  );

  const { rates: carbonData, projections: carbonProjections, carEquivalents } = calculateCarbonProjections(treeTarget);
  const { harvestLiters, coveragePct: householdCoveragePct } = calculateRainwaterHarvesting(roofArea, location.rainfall);

  // UHI Thermal Mitigation
  const uhiCoolingC = Math.round(Math.min(4.2, 0.38 * Math.sqrt(treeTarget / 800)) * 10) / 10;
  const surfaceTempUnmitigated = Math.round((location.temperature_c + 6.5) * 10) / 10;
  const surfaceTempMitigated = Math.round((surfaceTempUnmitigated - uhiCoolingC * 1.8) * 10) / 10;

  const recommendedSpecies = matchSpeciesForClimate(location.climate_zone, location.city, location.country);
  const diseaseFramework = getDiseasePreventionFramework(location, aqi);

  // RAG Retrieval
  const ragQuery = `${location.climate_zone} ${location.city} ${location.country} plantation air quality water carbon density disease prevention ${audience}`;
  const ragEvidence = defaultRetriever.retrieve(ragQuery, 4);

  return {
    location,
    aqi,
    treeTarget,
    roofArea,
    harvestLiters,
    householdCoveragePct,
    carbonData,
    carbonProjections,
    carEquivalents,
    uhiCoolingC,
    surfaceTempUnmitigated,
    surfaceTempMitigated,
    recommendedSpecies,
    ragEvidence,
    diseaseFramework
  };
}
