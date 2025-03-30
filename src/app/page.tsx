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
      <div className="relative w-full max-w-sm sm:max-w-md">
        <Image
          className="rounded-lg shadow-md bg-white"
          src="/tenerife.svg"
          alt="Island map"
          width={500}
          height={400}
        />
        <div className="bg-white rounded-xl shadow-lg mt-6 p-4 w-full max-w-sm flex flex-col items-start">
          <ol>
            {buoys.map(buoy => (
              <div key={buoy.id} className="flex items-center gap-2 text-gray-900 mt-2">
                <div className={colorMap.get(buoy.id)}></div>
                <button onClick={() => fetchBuoyData(buoy.id)}>
                  <p className="text-sm font-bold hover:cursor-pointer">{buoy.name}</p>
                </button>
              </div>
            ))}
          </ol>
        </div>
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
        <h1 className="text-lg font-bold text-gray-700">Datos avancados</h1>
        <table className="w-full mt-4 text-sm text-left text-gray-500">
          <thead className="hidden">
            <tr>
              <th className="px-4 py-2 text-left">Parámetro</th>
              <th className="px-4 py-2 text-left">Valor</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2 font-semibold">pH</td>
              <td className="px-4 py-2">{selectedBuoy.metrics.ph}</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2 font-semibold">Temperatura</td>
              <td className="px-4 py-2">{selectedBuoy.metrics.temperature} °C</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2 font-semibold">Conductividad</td>
              <td className="px-4 py-2">{selectedBuoy.metrics.conductivity} µS/cm</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2 font-semibold">Salinidad</td>
              <td className="px-4 py-2">{selectedBuoy.metrics.salinity} g/l</td>
            </tr>
          </tbody>
        </table>
      </div>

      <button className="cursor-pointer mt-6 rounded-full border border-solid border-gray-800 transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        onClick={() => setSelectedBuoy(undefined)}
      >
        Volver al mapa
      </button>
    </div>
  );
}