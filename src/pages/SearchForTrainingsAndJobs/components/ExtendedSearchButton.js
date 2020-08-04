import React from "react";
import { Button } from "reactstrap";

const ExtendedSearchButton = ({ title, handleExtendedSearch, isTrainingOnly }) => {
  const handleClick = async () => {
    handleExtendedSearch();
  };

  return !isTrainingOnly ? (
    <Button className="submitButton" onClick={handleClick}>
      {title}
    </Button>
  ) : (
    ""
  );
};

export default ExtendedSearchButton;
