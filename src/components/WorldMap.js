import React, { useState, useRef } from "react";
import { Map, TileLayer, Marker, Polyline } from "react-leaflet";
import L from "leaflet";
import { cities } from "../data/cities";
import greenMarkerIcon from "../assets/green-marker.png";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Create custom numbered marker icon with green marker image, configurable shadow, badge, and city label
const createNumberedIcon = (
  number,
  cityName,
  shadowConfig = {},
  badgeConfig = {}
) => {
  const {
    color = "rgba(0, 0, 0, 0.3)",
    blur = "4px",
    opacity = 0.3,
    offsetX = "0",
    offsetY = "2px",
  } = shadowConfig;

  const {
    show = true,
    color: badgeColor = "#ff4444",
    size = "8px",
  } = badgeConfig;

  const shadowStyle = `drop-shadow(${offsetX} ${offsetY} ${blur} ${
    color.includes("rgba") ? color : `rgba(0, 0, 0, ${opacity})`
  })`;

  return new L.DivIcon({
    html: `
      <div style="position: relative; width: 100px; height: 60px; display: flex; flex-direction: column; align-items: center;">
        <div style="position: relative; width: 25px; height: 41px;">
          <img src="${greenMarkerIcon}" style="
            width: 25px; 
            height: 41px;
            filter: ${shadowStyle};
          " />
          <div style="
            position: absolute;
            top: 6px;
            left: 50%;
            transform: translateX(-50%);
            color: black;
            font-weight: bold;
            font-size: 10px;
            font-family: Arial, sans-serif;
            min-width: 15px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
          ">${number}</div>
          ${
            show
              ? `
          <div style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: ${size};
            height: ${size};
            background-color: ${badgeColor};
            border: 1px solid white;
            border-radius: 50%;
            box-shadow: 0 1px 2px rgba(0,0,0,0.3);
          "></div>
          `
              : ""
          }
        </div>
        <div style="
          margin-top: 2px;
          color: black;
          font-size: 9px;
          font-family: Arial, sans-serif;
          font-weight: bold;
          padding: 1px 4px;
          white-space: nowrap;
          text-align: center;
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
        ">${cityName}</div>
      </div>
    `,
    className: "custom-numbered-marker",
    iconSize: [100, 60],
    iconAnchor: [50, 41],
  });
};

const WorldMap = () => {
  // Shadow configuration - can be modified to change marker shadows
  const [shadowConfig, setShadowConfig] = useState({
    color: "rgba(0, 0, 0, 0.3)",
    blur: "4px",
    opacity: 0.3,
    offsetX: "0",
    offsetY: "2px",
  });

  // Badge configuration - can be modified to change marker badges
  const [badgeConfig, setBadgeConfig] = useState({
    show: true,
    color: "#ff4444",
    size: "8px",
  });

  // Initialize state with original city positions
  const [markerPositions, setMarkerPositions] = useState(
    cities.features.map((city) => ({
      ...city,
      geometry: {
        ...city.geometry,
        coordinates: [...city.geometry.coordinates],
      },
    }))
  );

  const mapRef = useRef(null);

  // Generate all possible pairs of markers for mesh connections
  const generateConnectionPairs = () => {
    const pairs = [];
    for (let i = 0; i < markerPositions.length; i++) {
      for (let j = i + 1; j < markerPositions.length; j++) {
        const cityA = markerPositions[i];
        const cityB = markerPositions[j];
        
        // Skip if either city has invalid coordinates
        const [lngA, latA] = cityA.geometry.coordinates;
        const [lngB, latB] = cityB.geometry.coordinates;
        if (isNaN(latA) || isNaN(lngA) || isNaN(latB) || isNaN(lngB)) {
          continue;
        }
        
        pairs.push({
          positions: [[latA, lngA], [latB, lngB]],
          color: cityA.properties.lineColor, // Use lineColor from the first city in the pair
          key: `line-${i}-${j}`
        });
      }
    }
    return pairs;
  };

  // Handle marker drag end event
  const handleMarkerDragEnd = (index, event) => {
    const marker = event.target;
    const position = marker.getLatLng();

    // Update the marker position in state
    setMarkerPositions((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        geometry: {
          ...updated[index].geometry,
          coordinates: [position.lng, position.lat],
        },
      };
      return updated;
    });

    // Log the new coordinates
    console.log(
      `${
        markerPositions[index].properties.name
      } moved to: Lat ${position.lat.toFixed(6)}, Lng ${position.lng.toFixed(
        6
      )}`
    );
  };

  return (
    <Map
      center={[20, 0]}
      zoom={2}
      style={{ height: "100vh", width: "100%" }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Render connection lines */}
      {generateConnectionPairs().map((connection) => (
        <Polyline
          key={connection.key}
          positions={connection.positions}
          color={connection.color}
          weight={1}
          opacity={0.6}
        />
      ))}

      {/* Render markers */}
      {markerPositions.map((city, index) => {
        const [lng, lat] = city.geometry.coordinates;

        // Skip markers with invalid coordinates
        if (isNaN(lat) || isNaN(lng)) {
          return null;
        }

        return (
          <Marker
            key={`marker-${city.properties.index}-${index}`}
            position={[lat, lng]}
            icon={createNumberedIcon(
              city.properties.index,
              city.properties.name,
              shadowConfig,
              badgeConfig
            )}
            draggable={true}
            onDragend={(event) => handleMarkerDragEnd(index, event)}
          />
        );
      })}
    </Map>
  );
};

export default WorldMap;
