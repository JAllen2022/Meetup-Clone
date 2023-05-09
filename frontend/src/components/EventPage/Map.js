import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GoogleMap = ({ apiKey }) => {
  const [map, setMap] = useState(null);

  const loader = new Loader({
    apiKey: "AIzaSyDDvtQm_4Vy4fJAk0iXGHZ-ozoiK0_vEVA",
    version: "weekly",
  });

  loader.load().then(() => {
    const map = new window.google.maps.Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8,
    });
    setMap(map);
  });

  return (
    <div
      id="map"
      style={{ height: "500px", width: "100%", marginTop: "20px" }}
    />
  );
};

export default GoogleMap;
