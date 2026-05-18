import React, { useEffect, useState, useRef } from 'react';
import { MapPin, Globe2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Premium Marker
const orangeIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div style="background-color: #F97316; width: 14px; height: 14px; border-radius: 50%; border: 2.5px solid white; box-shadow: 0 0 15px rgba(249, 115, 22, 0.8);"></div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7]
});

const COUNTRY_COORDS = {
  "USA": [39.8, -98.5], "United States": [39.8, -98.5],
  "UK": [55.3, -3.4], "United Kingdom": [55.3, -3.4],
  "India": [20.5, 78.9],
  "Canada": [56.1, -106.3],
  "Australia": [-25.2, 133.7],
  "Germany": [51.1, 10.4],
  "France": [46.2, 2.2],
  "Japan": [36.2, 138.2],
  "Brazil": [-14.2, -51.9],
  "Mexico": [23.6, -102.5],
  "UAE": [23.4, 53.8], "United Arab Emirates": [23.4, 53.8],
  "Singapore": [1.3, 103.8],
  "China": [35.8, 104.1],
  "Spain": [40.4, -3.7],
  "Italy": [41.8, 12.5],
  "Unknown": [20.5, 78.9] // Default to India instead of Africa
};

// Precise coordinates LRU Cache (Pre-filled with known cities)
const geocodeCache = {
  "Bengaluru": [12.9716, 77.5946],
  "Nellore": [14.4426, 79.9865],
  "Tirupati": [13.6288, 79.4192],
  "Tirupathi": [13.6288, 79.4192],
  "Hyderabad": [17.3850, 78.4867],
  "Chennai": [13.0827, 80.2707],
  "Mumbai": [19.0760, 72.8777],
  "Delhi": [28.7041, 77.1025],
  "Vijayawada": [16.5062, 80.6480]
};

// DSA Logic: Dynamic Geocoding with Memoization
const fetchGeocode = async (cityName, countryName) => {
  const cacheKey = `${cityName}-${countryName}`;
  if (geocodeCache[cacheKey]) return geocodeCache[cacheKey];
  if (geocodeCache[cityName]) return geocodeCache[cityName];
  
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}&format=json&limit=1`);
    const data = await res.json();
    if (data && data.length > 0) {
      const coords = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      geocodeCache[cacheKey] = coords; // Store in cache for O(1) future lookups
      return coords;
    }
  } catch (err) {
    console.error("Geocoding failed for:", cityName, err);
  }
  return null;
};

const MapController = ({ cities, setMarkers }) => {
  const map = useMap();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!cities || cities.length === 0) return;
    let isMounted = true;

    const runSequence = async () => {
      const city = cities[currentIndex];
      const baseCoords = COUNTRY_COORDS[city.country] || [20.5, 78.9]; // Focus on India/target country initially
      
      // Attempt to get exact coordinates via cache or Nominatim API
      let streetCoords = await fetchGeocode(city.city, city.country);
      
      // Fallback offset if Geocoding fails
      if (!streetCoords) {
        streetCoords = [baseCoords[0] + 0.15, baseCoords[1] + 0.15];
      }

      if (!isMounted) return;

      // Update markers state so it renders accurately
      setMarkers(prev => ({ ...prev, [city.city]: streetCoords }));

      // 1. Regional View (Zoom 3.5 - Prevents going all the way to Africa)
      map.flyTo(baseCoords, 3.5, { duration: 1.5, easeLinearity: 0.25 });
      await new Promise(r => setTimeout(r, 2500));
      if (!isMounted) return;

      // 2. Country View (Zoom 5)
      map.flyTo(baseCoords, 5, { duration: 2, easeLinearity: 0.25 });
      await new Promise(r => setTimeout(r, 2500));
      if (!isMounted) return;

      // 3. District / State View (Zoom 10)
      map.flyTo(streetCoords, 10, { duration: 2, easeLinearity: 0.25 });
      await new Promise(r => setTimeout(r, 2500));
      if (!isMounted) return;

      // 4. Street Level / City View (Zoom 14)
      map.flyTo(streetCoords, 14, { duration: 2.5, easeLinearity: 0.25 });
      await new Promise(r => setTimeout(r, 4000));
      if (!isMounted) return;

      // Move to next city
      setCurrentIndex((prev) => (prev + 1) % cities.length);
    };

    runSequence();

    return () => { isMounted = false; };
  }, [cities, currentIndex, map, setMarkers]);

  return null;
};

export default function CityCard({ topCities = [], totalCities = 0 }) {
  const [animated, setAnimated] = useState(topCities.map(() => 0));
  const [dynamicMarkers, setDynamicMarkers] = useState({}); // Stores accurate coords

  useEffect(() => {
    const start = performance.now();
    const dur = 700;
    const animate = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setAnimated(topCities.map(c => c.barPct * eased));
      if (t < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [topCities]);

  return (
    <div className="vibe-card" style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 'var(--r)', padding: '24px', height: '100%',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>
          Deep Map Intelligence
        </span>
        <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 12, color: 'var(--muted)' }}>
          {totalCities} {totalCities === 1 ? 'city' : 'cities'}
        </span>
      </div>

      {/* Cinematic Leaflet Map Container */}
      <div style={{ height: 180, marginBottom: 24, position: 'relative', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border2)' }}>
        {topCities.length === 0 ? (
           <div className="w-full h-full flex flex-col items-center justify-center opacity-30 bg-neutral-100">
             <Globe2 size={32} className="text-neutral-400 mb-2" />
             <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Awaiting Signals</span>
           </div>
        ) : (
          <MapContainer 
            center={[20.5, 78.9]} // Default to India center
            zoom={3.5} 
            zoomControl={false} 
            scrollWheelZoom={false} 
            doubleClickZoom={false}
            dragging={false}
            style={{ height: '100%', width: '100%', background: '#E2E8F0' }}
          >
            {/* Full-color OpenStreetMap Tiles */}
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            />

            <MapController cities={topCities} setMarkers={setDynamicMarkers} />
            
            {/* Draw dynamic markers */}
            {topCities.map((city, i) => {
              const coords = dynamicMarkers[city.city] || COUNTRY_COORDS[city.country] || [20.5, 78.9];
              return (
                <Marker key={i} position={coords} icon={orangeIcon}>
                   <Popup className="premium-popup">
                      <div className="text-center font-sans">
                        <p className="font-black text-xs text-neutral-900">{city.city}</p>
                        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">{city.country}</p>
                      </div>
                   </Popup>
                </Marker>
              )
            })}
          </MapContainer>
        )}
      </div>

      {/* City list */}
      {topCities.length === 0 ? (
        <p style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, color: 'var(--muted)', textAlign: 'center', padding: '12px 0' }}>
          🌍 No scans yet — your first could come from anywhere
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {topCities.map((city, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="hover:translate-x-1 transition-transform cursor-pointer group">
              <span style={{ fontSize: 18, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>{city.flag}</span>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                  {city.city}
                </span>
                <div style={{ width: '100%', height: 4, borderRadius: 2, background: 'var(--surface2)', marginTop: 6, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 2, background: 'var(--teal)',
                    width: `${animated[i] || 0}%`, transition: 'none',
                  }} />
                </div>
              </div>
              <span style={{ fontFamily: 'DM Sans, sans-serif', fontSize: 14, fontWeight: 800, color: 'var(--text)', minWidth: 32, textAlign: 'right' }}>
                {city.count}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
