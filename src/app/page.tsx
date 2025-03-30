'use client';

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const customIcon = new L.Icon({
  iconUrl: "/pin.png",
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

interface Coordenate {
  lat: number;
  long: number;
}

interface Metrics {
  temperature: number;
  ph: number;
  conductivity: number;
  oxigen: number;
  salinity: number;
  bio_activity: number;
}

interface Buoy {
  id: number;
  coords: Coordenate;
  name: string;
  metrics?: Metrics;
}

export default function Home() {
  const [buoys, setBuoys] = useState<Buoy[]>([]);
  const [selectedBuoy, setSelectedBuoy] = useState<Required<Buoy> | undefined>(undefined);

  useEffect(() => {
    fetch("https://tegueback.vercel.app/api/locations")
      .then((res) => res.json())
      .then((data) => setBuoys(data))
      .catch((err) => console.error("Error obteniendo boyas:", err));
  }, []);

  const fetchBuoyData = (id: number) => {
    fetch(`https://tegueback.vercel.app/api/buoy?id=${id}`)
      .then((res) => res.json())
      .then((data: Required<Buoy>) => setSelectedBuoy(data))
      .catch((err) => console.error("Error obteniendo datos de boya:", err));
  };

  return (
    <div className="bg-[#F6F3EA] min-h-screen flex flex-col items-center p-6 sm:p-10 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-900">Calidad del agua</h1>
      <div className="relative w-full max-w-2xl h-96 mt-4">
        <MapContainer center={[28.2916, -16.6291]} zoom={10} className="w-full h-full rounded-lg shadow-md">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {buoys.map(buoy => (
            <Marker 
              key={buoy.id} 
              position={[buoy.coords.lat, buoy.coords.long]} 
              icon={customIcon}
              eventHandlers={{ click: () => fetchBuoyData(buoy.id) }}
            >
              <Popup>{buoy.name}</Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
      {selectedBuoy && (
        <div className="bg-white rounded-xl shadow-lg mt-6 p-4 w-full max-w-sm">
          <h2 className="text-lg font-medium text-gray-700">{selectedBuoy.name}</h2>
          <p><strong>pH:</strong> {selectedBuoy.metrics.ph}</p>
          <p><strong>Temperatura:</strong> {selectedBuoy.metrics.temperature}°C</p>
          <p><strong>Conductividad:</strong> {selectedBuoy.metrics.conductivity} µS/cm</p>
          <p><strong>Salinidad:</strong> {selectedBuoy.metrics.salinity} g/l</p>
          <button className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg" onClick={() => setSelectedBuoy(undefined)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
