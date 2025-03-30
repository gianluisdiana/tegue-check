'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Quality from "./quality";
import { Buoy } from "@/models";
import Details from "./details";

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
    Details(selectedBuoy, setSelectedBuoy)
  );
}