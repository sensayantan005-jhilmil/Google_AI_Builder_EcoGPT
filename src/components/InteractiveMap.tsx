/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Layers, Crosshair, MapPin } from 'lucide-react';
import { LocationData, AQIResult } from '../lib/environmentalEngine';

interface InteractiveMapProps {
  location: LocationData;
  aqi: AQIResult;
  treeTarget: number;
  onSelectCoordinates: (lat: number, lon: number) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  location,
  aqi,
  treeTarget,
  onSelectCoordinates
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerGroupRef = useRef<L.LayerGroup | null>(null);
  const [mapStyle, setMapStyle] = useState<'dark' | 'street'>('dark');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [location.lat, location.lon],
        zoom: 11,
        zoomControl: true,
        attributionControl: false
      });

      mapInstanceRef.current = map;

      // Handle map click
      map.on('click', (e: L.LeafletMouseEvent) => {
        onSelectCoordinates(Number(e.latlng.lat.toFixed(4)), Number(e.latlng.lng.toFixed(4)));
      });

      const markerGroup = L.layerGroup().addTo(map);
      markerGroupRef.current = markerGroup;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Tile Layer when style changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const tileUrl =
      mapStyle === 'dark'
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
  }, [mapStyle]);

  // Update Markers and overlays when location or metrics change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // Pan map to new center
    map.setView([location.lat, location.lon], map.getZoom() || 11, { animate: true });

    // Center Main Intervention Marker
    const mainColor = aqi.score <= 50 ? '#10b981' : aqi.score <= 100 ? '#f59e0b' : aqi.score <= 150 ? '#f97316' : '#ef4444';

    // Forestry intervention radius (scaled with tree count)
    const radiusMeters = Math.max(800, Math.min(6000, Math.sqrt(treeTarget) * 25));

    const radiusCircle = L.circle([location.lat, location.lon], {
      color: mainColor,
      fillColor: '#10b981',
      fillOpacity: 0.15,
      weight: 2,
      dashArray: '4, 6',
      radius: radiusMeters
    }).addTo(group);

    radiusCircle.bindPopup(`
      <div style="font-size:12px; line-height:1.4;">
        <strong style="color:#34d399;">Canopy Intervention Zone</strong><br/>
        Planned Target: <strong>${treeTarget.toLocaleString()}</strong> trees<br/>
        Est. Coverage Radius: <strong>${(radiusMeters / 1000).toFixed(1)} km</strong>
      </div>
    `);

    // Target Pin Marker
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="position:relative; display:flex; align-items:center; justify-content:center; width:36px; height:36px;">
          <div style="position:absolute; width:32px; height:32px; border-radius:50%; background-color:${mainColor}; opacity:0.35; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <div style="width:20px; height:20px; border-radius:50%; background-color:${mainColor}; border:2.5px solid #ffffff; box-shadow:0 0 10px rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; color:#fff; font-size:10px; font-weight:bold;">
          </div>
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    const marker = L.marker([location.lat, location.lon], { icon: customIcon }).addTo(group);

    marker.bindPopup(`
      <div style="min-width:180px; font-size:12px;">
        <h4 style="font-weight:700; margin:0 0 4px 0; color:#f8fafc; font-size:14px;">${location.city}</h4>
        <div style="margin-bottom:6px; color:#94a3b8;">${location.country} • ${location.lat.toFixed(3)}°, ${location.lon.toFixed(3)}°</div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>Air Quality:</span>
          <span style="font-weight:700; color:${mainColor};">${aqi.score} (${aqi.category})</span>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span>Dominant:</span>
          <span style="font-weight:600; color:#38bdf8;">${aqi.dominant}</span>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span>Climate Zone:</span>
          <span style="font-weight:600; color:#cbd5e1;">${location.climate_zone}</span>
        </div>
      </div>
    `).openPopup();

    // Add surrounding mock ambient sensor nodes
    const sensorOffsets = [
      { dLat: 0.035, dLon: 0.04, label: 'Sensor Alpha (Transport Hub)', aqiAdj: +14 },
      { dLat: -0.04, dLon: -0.03, label: 'Sensor Beta (Green Park)', aqiAdj: -18 },
      { dLat: 0.02, dLon: -0.05, label: 'Sensor Gamma (Industrial Swale)', aqiAdj: +28 },
    ];

    sensorOffsets.forEach(s => {
      const sLat = location.lat + s.dLat;
      const sLon = location.lon + s.dLon;
      const sAqi = Math.max(15, Math.round(aqi.score + s.aqiAdj));
      const sColor = sAqi <= 50 ? '#10b981' : sAqi <= 100 ? '#f59e0b' : '#ef4444';

      const sensorMarker = L.circleMarker([sLat, sLon], {
        radius: 6,
        color: '#ffffff',
        weight: 1.5,
        fillColor: sColor,
        fillOpacity: 0.85
      }).addTo(group);

      sensorMarker.bindPopup(`
        <div style="font-size:11px;">
          <strong>${s.label}</strong><br/>
          AQI: <span style="font-weight:bold; color:${sColor};">${sAqi}</span>
        </div>
      `);
    });

  }, [location, aqi, treeTarget]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-inner">
      {/* Top Map Action Bar */}
      <div className="absolute top-3 left-3 z-[400] flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-300 shadow-md">
        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
        <span className="font-semibold text-white">{location.city}</span>
        <span className="text-slate-500 font-mono text-[11px]">
          ({location.lat.toFixed(3)}°, {location.lon.toFixed(3)}°)
        </span>
      </div>

      {/* Map Style & Recenter Controls */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5">
        <button
          onClick={() => setMapStyle(mapStyle === 'dark' ? 'street' : 'dark')}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md p-1.5 rounded-lg border border-slate-800 text-xs shadow-md transition-colors flex items-center gap-1 px-2.5"
          title="Toggle Dark / Street Map Tiles"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[11px] capitalize">{mapStyle}</span>
        </button>

        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setView([location.lat, location.lon], 11, { animate: true });
            }
          }}
          className="bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white backdrop-blur-md p-1.5 rounded-lg border border-slate-800 text-xs shadow-md transition-colors"
          title="Recenter Map"
        >
          <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
        </button>
      </div>

      {/* Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px]" />

      {/* Bottom Hint */}
      <div className="absolute bottom-2 left-3 z-[400] pointer-events-none">
        <span className="text-[10px] text-slate-400/90 bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded border border-slate-800/80">
          💡 Click anywhere on map to analyze custom coordinates
        </span>
      </div>
    </div>
  );
};
