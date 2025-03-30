'use client';

import { useState, useEffect } from "react";
import Image from "next/image";

interface Coordenate {
  lat: number,
  long: number
}

interface Metrics {
  temperature: number,
  ph: number,
  conductivity: number,
  oxigen: number,
  salinity: number,
  bio_activity: number
}

interface Buoy {
  id: number,
  coords: Coordenate,
  name: string
  metrics?: Metrics
}

export default function Home() {
  const [buoys, setBuoys] = useState<Buoy[]>([]);
  const [selectedBuoy, setSelectedBuoy] = useState<Required<Buoy> | undefined>(undefined);

  useEffect(() => {
    fetch("https://tegueback.vercel.app/api/locations", {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => setBuoys(data))
      .catch((err) => console.error("Error obteniendo boyas:", err));
  }, []);

  const fetchBuoyData = (id: number) => {
    fetch(`https://tegueback.vercel.app/api/buoy?id=${id}`, {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data: Required<Buoy>) => {
        setSelectedBuoy(data);
      })
      .catch((err) => console.error("Error obteniendo datos de boya:", err));
  };

  return selectedBuoy === undefined ? (

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
        <ol className="flex flex-col gap-2">
          {buoys.map(buoy =>
            <div key={buoy.id} className="text-gray-900">
              <div className="w-4 h-4 bg-teal-600 rounded-full shadow-md"></div>
              <button onClick={() => fetchBuoyData(buoy.id)}>
                <p className="text-sm font-bold hover:cursor-pointer">{buoy.name}</p>
                <p className="text-xs">{buoy.coords.lat}, {buoy.coords.long}</p>
              </button>
            </div>
          )}
        </ol>
      </div>

      <div className="bg-white rounded-xl shadow-lg mt-6 p-4 w-full max-w-sm flex flex-col items-center">
        <h2 className="text-lg font-medium text-gray-700">Calidad general</h2>
        <div className="relative w-12 h-20 mt-2">
          <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
          <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
            7
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="bg-[#F6F3EA] min-h-screen flex flex-col items-center p-6 sm:p-10 rounded-lg shadow-lg">
      {/* Header */}
      <button className="cursor-pointer self-start text-xl" onClick={() => setSelectedBuoy(undefined)}>
        ←
      </button>
      <h1 className="text-2xl font-semibold text-gray-900">{selectedBuoy.name}</h1>

      {/* General Quality Section */}

      <div className="bg-white rounded-xl shadow-lg mt-6 p-4 w-full max-w-sm flex flex-col items-center">
        <h2 className="text-lg font-medium text-gray-700">Calidad</h2>
        <div className="relative w-12 h-20 mt-2">
          <div className="absolute bottom-0 w-full h-16 bg-gradient-to-t from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
          <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg">
            7
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            <p className="text-xl text-gray-900">Bacteria</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            <p className="text-xl text-gray-900">pH</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-green-600 rounded-full"></span>
            <p className="text-xl text-gray-900">Turbidity</p>
          </div>
        </div>
      </div>

      {/* Advanced Data Section */}
      <div className="bg-white rounded-xl shadow-lg mt-6 p-4 w-full max-w-sm text-gray-900">
        <h1 className="text-lg font-bold text-gray-700">Advanced Data</h1>
        <p className="mt-2"><strong>pH:</strong> {selectedBuoy.metrics.ph}</p>
        <p><strong>Temperatura:</strong> {selectedBuoy.metrics.temperature}°C</p>
        <p><strong>Conductividad:</strong> {selectedBuoy.metrics.conductivity} µS/cm</p>
        <p><strong>Salinidad:</strong> {selectedBuoy.metrics.salinity} g/l</p>
      </div>

      <button className="mt-6 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        onClick={() => setSelectedBuoy(undefined)}
      >
        Volver al mapa
      </button>
    </div>
  );
}