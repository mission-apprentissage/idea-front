import React from "react";

const NoJobResult = ({ isTrainingOnly }) => {
  return isTrainingOnly ? "" : <div className="bold jobColor noOpportunityFound">Aucune entreprise trouvée</div>;
};

export default NoJobResult;
