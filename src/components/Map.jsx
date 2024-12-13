import React, { useState, useEffect } from "react";
import { MapContainer, GeoJSON, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { useSession } from "../contexts/SessionContext";
import Loading from "./Loading";

const greeceStyle = {
  color: "#FFFFFF",
  weight: 1,
  opacity: 0.5,
  fillColor: "#1B2849",
  fillOpacity: 1,
};

const europeStyle = {
  color: "#FFFFFF",
  weight: 1,
  opacity: 0.5,
  fillColor: "#4A4F77",
  fillOpacity: 1,
  stroke: "TRUE",
};

const maxZoom = 18;
const zoomSnap = 0.7;
const maxBounds = [
  [31.80495018157633, 11.295994098331422],
  [44.71497750316861, 38.10433099539361],
];
const maxBoundsViscosity = 1.0;

const isMobile = /Mobi|Android|iPhone|iPad|Tablet/i.test(navigator.userAgent);
const defaultCenter = isMobile ? [37.6, 24.0] : [38.4, 24.8];
const defaultZoom = isMobile ? 5.8 : 6.5;
const minZoom = isMobile ? 5.8 : 6.5;

const MapEventHandler = ({ onMapChange }) => {
  useMapEvents({
    moveend: (event) => {
      const map = event.target;
      onMapChange(map.getCenter(), map.getZoom());
    },
    zoomend: (event) => {
      const map = event.target;
      onMapChange(map.getCenter(), map.getZoom());
    },
  });
  return null;
};

const SensorMarkers = ({ sensorStatuses }) => {
  return (
    <>
      {sensorStatuses.map((sensor, index) => {
        if (sensor.active) {
          return (
            <Marker
              key={index}
              position={[sensor.lat, sensor.lon]}
              icon={new L.Icon({
                iconUrl: `../assets/int-${sensor.data > 0 ? sensor.data > 11 ? 12 : Math.floor(sensor.data) + 1 : 0}.svg`,
                iconSize: [25, 25]
              })}
            >
              <Popup>
                {sensor.id}<br />PGA: {sensor.data}
              </Popup>
            </Marker>
          );
        } else {
          return null;
        }
      })}
    </>
  );
};

const Map = () => {
  
  const { sensorStatuses } = useSession();
  
  const [isGreeceLoading, setIsGreeceLoading] = useState(true);
  const [isEuropeLoading, setIsEuropeLoading] = useState(true);

  const [mapCenter, setMapCenter] = useState(() => {
    const savedCenter = sessionStorage.getItem("mapCenter");
    return savedCenter ? JSON.parse(savedCenter) : defaultCenter;
  });

  const [mapZoom, setMapZoom] = useState(() => {
    const savedZoom = sessionStorage.getItem("mapZoom");
    return savedZoom ? JSON.parse(savedZoom) : defaultZoom;
  });

  const [greeceData, setGreeceData] = useState(null);
  const [europeData, setEuropeData] = useState(null);

  useEffect(() => {
    fetch("../../assets/greece.geojson")
      .then((response) => response.json())
      .then((data) => 
      {
        setGreeceData(data);
        setIsGreeceLoading(false);
      })
      .catch((error) => console.error("Error loading Greece GeoJSON:", error));

    fetch("../../assets/europe.geojson")
      .then((response) => response.json())
      .then((data) => {
        setEuropeData(data);
        setIsEuropeLoading(false);
      })
      .catch((error) => console.error("Error loading Europe GeoJSON:", error));
  }, []);

  const handleMapChange = (center, zoom) => {
    setMapCenter(center);
    setMapZoom(zoom);
    sessionStorage.setItem("mapCenter", JSON.stringify(center));
    sessionStorage.setItem("mapZoom", JSON.stringify(zoom));
  };

  useEffect(() => {
    const savedCenter = sessionStorage.getItem("mapCenter");
    const savedZoom = sessionStorage.getItem("mapZoom");
    if (savedCenter && savedZoom) {
      setMapCenter(JSON.parse(savedCenter));
      setMapZoom(JSON.parse(savedZoom));
    }
  }, []);

  const onEachGreeceFeature = (feature, layer) => {
    layer.on("mouseover", function mouseover() {
      layer.setStyle({
        color: "#FFFFFF",
        weight: 3,
        opacity: 1,
        fillColor: "rgba(18, 31, 65, 0.9)",
        fillOpacity: 0.5,
      });
    });

    layer.on("mouseout", function mouseout() {
      layer.setStyle({
        color: "#FFFFFF",
        weight: 1,
        opacity: 0.5,
        fillColor: "#1B2849",
        fillOpacity: 1,
      });
    });
  };

  if (isGreeceLoading || isEuropeLoading) {
    return <Loading />;
  }

  return (
    <div className="map-container">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        minZoom={minZoom}
        style={{ height: "100%", width: "100%", background: "#808080" }} 
        maxZoom={maxZoom}
        zoomSnap={zoomSnap}
        maxBounds={maxBounds}
        maxBoundsViscosity={maxBoundsViscosity}
        zoomControl={false}
      >
        <MapEventHandler onMapChange={handleMapChange} />
        {greeceData && (
          <GeoJSON
            data={greeceData}
            style={greeceStyle}
            onEachFeature={onEachGreeceFeature}
          />
        )}
        {europeData && <GeoJSON data={europeData} style={europeStyle} />}
        <SensorMarkers sensorStatuses={sensorStatuses} />
      </MapContainer>
    </div>
  );
};

export default Map;
