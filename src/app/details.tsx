import { Buoy } from "@/models";
import Quality from "./quality";

const Description = (buoy : Required<Buoy>): string => {
  const quality = CalculateQuality(buoy);
  if (quality >= 9) {
    return "La calidad del agua no podría ser mejor.";
  } else if (quality >= 7) {
    return "La calidad del agua es buena.";
  } else if (quality >= 5) {
    return "La calidad del agua no es tan buena como debería.";
  } else {
    return "La calidad del agua es demasiado baja para ser segura.";
  }
}

const CalculateQuality = (buoy: Required<Buoy>): number => {
  let quality: number = 0;
  const unity: number = 2;
  if (buoy.metrics.ph >= 6.99 && buoy.metrics.ph <= 7.01) {
    quality += unity;
  }
  if (buoy.metrics.temperature >= 24 && buoy.metrics.temperature <= 27) {
    quality += unity;
  }
  if (buoy.metrics.conductivity >= 100 && buoy.metrics.conductivity <= 1000) {
    quality += unity;
  }
  if (buoy.metrics.salinity >= 33 && buoy.metrics.salinity <= 36) {
    quality += unity;
  }
  if (buoy.metrics.oxigen >= 7.2 && buoy.metrics.oxigen <= 7.8) {
    quality += unity;
  }
  return Math.round(quality);
}

export default function Details(
  selectedBuoy: Required<Buoy>,
  setSelectedBuoy: (buoy: Required<Buoy> | undefined) => void) {
  const quality = CalculateQuality(selectedBuoy);
  return (
    <div className="bg-[#F6F3EA] min-h-screen flex flex-col items-center p-6 sm:p-10 rounded-lg shadow-lg">
      <h1 className="text-2xl font-semibold text-gray-900">{selectedBuoy.name}</h1>

      <div className="bg-white rounded-xl shadow-lg mt-6 p-4 w-full max-w-sm flex flex-col items-center">
        {Quality("Calidad", quality)}
        <p className="text-s text-gray-700">
          {Description(selectedBuoy)}
        </p>
      </div>
      <div className="bg-white rounded-xl shadow-lg mt-6 p-4 w-full max-w-sm text-gray-900">
        <h1 className="text-lg font-bold text-gray-700">Datos avanzados</h1>
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
              <td className="px-4 py-2">{selectedBuoy.metrics.salinity} g/L</td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="px-4 py-2 font-semibold">Oxigen</td>
              <td className="px-4 py-2">{selectedBuoy.metrics.oxigen} mg/L</td>
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