import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";
// import dotenv from "dotenv";

// dotenv.config();

// const apiKey = process.env.MAPS_KEY;

const GoogleMap = ({ venue }) => {
  const [map, setMap] = useState(null);

  const loader = new Loader({
    apiKey: "apiKey",
    version: "weekly",
    libraries: ["places"],
  });

  const center = {
    lat: venue.lat,
    lng: venue.lng,
  };

  const mapOptions = {
    center,
    zoom: 8,
  };

  loader.load().then((google) => {
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    new google.maps.Marker({
      position: center,
      map,
      title: "My Location",
    });
  });
  // setMap(map);
  //   });

  return (
    <div
      id={"map"}
      style={{ height: "500px", width: "100%", marginTop: "20px" }}
    />
  );
};

export default GoogleMap;
