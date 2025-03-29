import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

const buoyIcon = new Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
});

const App = () => {
  const [buoys, setBuoys] = useState([]);
  const [selectedBuoy, setSelectedBuoy] = useState(null);
  const [buoyData, setBuoyData] = useState(null);

  // Simulación de petición al backend para obtener boyas disponibles
  useEffect(() => {
    fetch("https://api.example.com/buoys") // Reemplazar con la URL real del backend
      .then((res) => res.json())
      .then((data) => setBuoys(data))
      .catch((err) => console.error("Error obteniendo boyas:", err));
  }, []);

  // Función para obtener datos de una boya específica
  const fetchBuoyData = (id) => {
    fetch(`https://api.example.com/buoy/${id}`) // Reemplazar con la URL real
      .then((res) => res.json())
      .then((data) => {
        setBuoyData(data);
        setSelectedBuoy(id);
      })
      .catch((err) => console.error("Error obteniendo datos de boya:", err));
  };

  return (
    <div className="h-screen w-full bg-gray-100 p-4">
      {selectedBuoy ? (
        // Pantalla de datos de la boya
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Datos de la Boya {selectedBuoy}</h2>
          <p><strong>Temperatura:</strong> {buoyData?.temperature}°C</p>
          <p><strong>pH:</strong> {buoyData?.ph}</p>
          <p><strong>Conductividad:</strong> {buoyData?.conductivity} µS/cm</p>
          <button
            onClick={() => setSelectedBuoy(null)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Volver al Mapa
          </button>
        </div>
      ) : (
        // Pantalla con el mapa y las boyas
        <MapContainer center={[28.4682, -16.2546]} zoom={10} className="h-[80vh] w-full rounded-lg shadow-lg">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {buoys.map((buoy) => (
            <Marker
              key={buoy.id}
              position={[buoy.lat, buoy.lng]}
              icon={buoyIcon}
              eventHandlers={{ click: () => fetchBuoyData(buoy.id) }}
            >
              <Popup>Boya {buoy.id}</Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default App;