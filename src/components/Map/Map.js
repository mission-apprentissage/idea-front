import React, { useEffect, useRef } from "react";
import { useStore, useDispatch } from "react-redux";
import { setSelectedItem } from "../../redux/Training/actions";

import { map, initializeMap } from "../../utils/mapTools";

const Map = ({ showResultList }) => {
  const store = useStore();
  const mapContainer = useRef(null);
  const dispatch = useDispatch();

  const unselectItem = () => {
    dispatch(setSelectedItem(null));
  };

  useEffect(() => {
    if (!map) initializeMap({ mapContainer, store, showResultList, unselectItem });
  });

  return <div ref={(el) => (mapContainer.current = el)} className="mapContainer" />;
};

export default Map;
