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

const ItemDetail = ({ selectedItem, handleClose }) => {
  return (
    <div className={`itemDetail ${selectedItem ? "" : "hiddenItemDetail"}`}>
      <header>
        <Button className="closeButton" onClick={handleClose}>
          <FontAwesomeIcon icon={faTimes} />
        </Button>
        {selectedItem && selectedItem.type === "pe" ? <PeJob job={selectedItem.item} showTextOnly={true} /> : ""}
        {selectedItem && selectedItem.type === "lbb" ? (
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
      {selectedItem && selectedItem.type === "pe" ? <PeJobDetail job={selectedItem.item} /> : ""}
      {selectedItem && selectedItem.type === "lbb" ? <LbbCompanyDetail company={selectedItem.item} /> : ""}
      {selectedItem && selectedItem.type === "training" ? <TrainingDetail training={selectedItem.item} /> : ""}
    </div>
  );
};

export default ItemDetail;
