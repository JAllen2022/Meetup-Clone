import React, { useState, useEffect } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const GoogleMap = () => {
  const [map, setMap] = useState(null);

  const loader = new Loader({
    apiKey: "AIzaSyDDvtQm_4Vy4fJAk0iXGHZ-ozoiK0_vEVA",
    version: "weekly",
    libraries: ["places"],
  });

  const mapOptions = {
    center: {
      lat: 0,
      lng: 0,
    },
    zoom: 4,
  };

  loader.load().then((google) => {
    new google.maps.Map(document.getElementById("map"), mapOptions);
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
