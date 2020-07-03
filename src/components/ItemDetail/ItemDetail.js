import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { Button } from "reactstrap";
import LbbCompany from "./LbbCompany";
import Training from "./Training";
import PeJobDetail from "./PeJobDetail";
import PeJob from "./PeJob";
import LbbCompanyDetail from "./LbbCompanyDetail";
import TrainingDetail from "./TrainingDetail";
import "./itemdetail.css";

const ItemDetail = ({ selectedItem, handleClose }) => {
  return (
    <div className={`itemDetail ${selectedItem ? "" : "hiddenItemDetail"}`}>
      <header>
        <Button className="closeButton" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </Button>
        {selectedItem && selectedItem.type === "peJob" ? <PeJob job={selectedItem.item} showTextOnly={true} /> : ""}
        {selectedItem && (selectedItem.item.type === "lbb" || selectedItem.item.type === "lba") ? (
          <LbbCompany company={selectedItem.item} showTextOnly={true} />
        ) : (
          ""
        )}
        {selectedItem && selectedItem.type === "training" ? (
          <Training training={selectedItem.item} showTextOnly={true} />
        ) : (
          ""
        )}
      </header>
      <div className="clearBoth" />
      {selectedItem && selectedItem.item.type === "peJob" ? <PeJobDetail job={selectedItem.item} /> : ""}
      {selectedItem && (selectedItem.item.type === "lbb" || selectedItem.item.type === "lba") ? (
        <LbbCompanyDetail company={selectedItem.item} />
      ) : (
        ""
      )}
      {selectedItem && selectedItem.type === "training" ? <TrainingDetail training={selectedItem.item} /> : ""}
    </div>
  );
};

export default ItemDetail;
