import React, { useEffect, useRef } from "react";
import { useStore } from "react-redux";

import { map, initializeMap } from "../../utils/mapTools";

const Map = ({ showResultList }) => {
  const store = useStore();
  const mapContainer = useRef(null);

  useEffect(() => {
    if (!map) initializeMap({ mapContainer, store, showResultList });
  });

  return <div ref={(el) => (mapContainer.current = el)} className="mapContainer" />;
};

export default Map;
