'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Quality from "./quality";
import { Buoy } from "@/models";

export default function Home() {
  const [buoys, setBuoys] = useState<Buoy[]>([]);
  const [selectedBuoy, setSelectedBuoy] = useState<Required<Buoy> | undefined>(undefined);
  const colorMap: Map<string, string> = new Map();
  colorMap.set("001", `w-4 h-4 bg-teal-600 rounded-full shadow-md`);
  colorMap.set("002", `w-4 h-4 bg-green-600 rounded-full shadow-md`);
  colorMap.set("003", `w-4 h-4 bg-blue-600 rounded-full shadow-md`);
  colorMap.set("004", `w-4 h-4 bg-orange-600 rounded-full shadow-md`);

  useEffect(() => {
    fetch("https://tegueback.vercel.app/api/locations", {
      method: "GET"
    })
      .then((res) => res.json())
      .then((data) => setBuoys(data))
      .catch((err) => console.error("Error obteniendo boyas:", err));
  }, []);

  const fetchBuoyData = (id: string) => {
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
          {buoys.map(buoy => {
            return (
              <div key={buoy.id} className="flex items-center gap-2 text-gray-900">
                <div className={colorMap.get(buoy.id)}></div>
                <button onClick={() => fetchBuoyData(buoy.id)}>
                  <p className="text-sm font-bold hover:cursor-pointer">{buoy.name}</p>
                </button>
              </div>
            )
          }
          )}
        </ol>
      </div>

      <div className="bg-white rounded-xl shadow-lg mt-6 p-4 w-full max-w-sm flex flex-col items-center">
        {Quality("Calidad media", 7)}
      </div>
    </div>
  ) : (
    <div className="bg-[#F6F3EA] min-h-screen flex flex-col items-center p-6 sm:p-10 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-900">{selectedBuoy.name}</h1>

      <div className="bg-white rounded-xl shadow-lg mt-6 p-4 w-full max-w-sm flex flex-col items-center">
        {Quality("Calidad", 7)}
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

      <div className="bg-white rounded-xl shadow-lg mt-6 p-4 w-full max-w-sm text-gray-900">
        <h1 className="text-lg font-bold text-gray-700">Advanced Data</h1>
        <p className="mt-2"><strong>pH:</strong> {selectedBuoy.metrics.ph}</p>
        <p><strong>Temperatura:</strong> {selectedBuoy.metrics.temperature}°C</p>
        <p><strong>Conductividad:</strong> {selectedBuoy.metrics.conductivity} µS/cm</p>
        <p><strong>Salinidad:</strong> {selectedBuoy.metrics.salinity} g/l</p>
      </div>

      <button className="cursor-pointer mt-6 rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        onClick={() => setSelectedBuoy(undefined)}
      >
        Volver al mapa
      </button>
    </div>
  );
}