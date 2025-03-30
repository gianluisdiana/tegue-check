'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

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
      <div className="relative w-full max-w-sm sm:max-w-md mt-4">
        <Image
          className="rounded-lg shadow-md"
          src="/tenerife.svg"
          alt="Island map"
          width={400}
          height={300}
        />
        <div className="absolute top-0 left-0 w-full h-full">
          {buoys.map(buoy => (
            <div
              key={buoy.id}
              className="absolute w-4 h-4 bg-teal-600 rounded-full shadow-md cursor-pointer"
              style={{
                top: `${buoy.coords.lat}%`,
                left: `${buoy.coords.long}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() => fetchBuoyData(buoy.id)}
            ></div>
          ))}
        </div>
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
