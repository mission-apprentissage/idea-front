import React, { /*useState, */useEffect, useRef } from "react";

import { map, initializeMap/*, flyToMarker, closeMapPopups, clearMarkers*/ } from "../../utils/mapTools";

const Map = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!map) initializeMap({ mapContainer });
  });

  return <div ref={(el) => (mapContainer.current = el)} className="mapContainer" />;
};

export default Map;
