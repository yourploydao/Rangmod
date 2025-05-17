import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import Link from 'next/link';

const icon = new L.Icon({
  iconUrl: '/map-pin-icon.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

function LocationMarker({ onSelect }) {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position ? <Marker position={position} icon={icon} /> : null;
}

// 🆕 Component นี้จะจัดการ zoom ไปที่ตำแหน่งของผู้ใช้
function SetViewToCurrentLocation() {
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;

    const handleSuccess = (pos) => {
      const { latitude, longitude } = pos.coords;

      // 💡 เช็คว่า map._loaded แล้วจริง ๆ ก่อนเรียก setView
      if (map && map._loaded) {
        try {
          map.setView([latitude, longitude], 15);
        } catch (err) {
          console.error("Error setting map view:", err);
        }
      } else {
        // ถ้ายังไม่พร้อม ให้หน่วงเวลารอจนกว่าจะพร้อม
        map.whenReady(() => {
          try {
            map.setView([latitude, longitude], 15);
          } catch (err) {
            console.error("Error in fallback setView (whenReady):", err);
          }
        });
      }
    };

    const handleError = (err) => {
      console.warn(`Geolocation error (${err.code}): ${err.message}`);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError);
  }, [map]);

  return null;
}


const MapSelector = ({ onSelect }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <MapContainer
      center={[13.736717, 100.523186]} // fallback เผื่อ GPS ใช้ไม่ได้
      zoom={15}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <Link href="https://openstreetmap.org">OpenStreetMap</Link>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <SetViewToCurrentLocation /> {/* 🆕 ใส่ component นี้ */}
      <LocationMarker onSelect={onSelect} />
    </MapContainer>
  );
};

export default MapSelector;
