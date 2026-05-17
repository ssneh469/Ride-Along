import React from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import markerIconUrl from "leaflet/dist/images/marker-icon.png";
import markerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl: markerIconUrl,
  iconRetinaUrl: markerIcon2xUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

type MapProps = {
  center?: [number, number];
  zoom?: number;
  markers?: [number, number][] | null;
  onSelect?: (latlng: [number, number]) => void;
  height?: string | number;
};

function ClickSelector({ onSelect }: { onSelect?: (latlng: [number, number]) => void }) {
  useMapEvents({
    click(e) {
      onSelect?.([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export const Map: React.FC<MapProps> = ({
  center = [23.0225, 72.5714], // Default to Ahmedabad
  zoom = 12,
  markers = null,
  onSelect,
  height = 400,
}) => {
  return (
    <div style={{ width: "100%", height }}>
      <MapContainer center={center} zoom={zoom} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers && markers.map((m, i) => (
          <Marker key={i} position={m}>
            <Popup>Selected location</Popup>
          </Marker>
        ))}
        {onSelect && <ClickSelector onSelect={onSelect} />}
      </MapContainer>
    </div>
  );
};

export default Map;
