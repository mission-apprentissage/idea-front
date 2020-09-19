import { getValueFromPath } from "../utils/tools";

export let widgetParameters = null;
export let applyWidgetParameters = false;

export const getWidgetParameters = () => {
  if (getValueFromPath("caller")) {
    widgetParameters = {
      caller: getValueFromPath("caller"),
    };

    applyWidgetParameters = true;

    let p = getValueFromPath("lat");
    if (p && !isNaN(p)) widgetParameters.lat = parseFloat(p);
    else applyWidgetParameters = false;

    p = getValueFromPath("lon");
    if (p && !isNaN(p)) widgetParameters.lon = parseFloat(p);
    else applyWidgetParameters = false;

    p = getValueFromPath("romes"); // todo appliquer un ctrl regexp sur romes, max 3
    if (p) widgetParameters.romes = p;
    else applyWidgetParameters = false;

    p = getValueFromPath("radius"); //todo: vérifier les valeurs légitimes
    if (p && !isNaN(p) && (p === "10" || p === "30" || p === "60" || p === "100"))
      widgetParameters.radius = parseInt(p);

    p = getValueFromPath("return_uri");
    if (p) widgetParameters.returnURI = p;

    p = getValueFromPath("return_logo_url");
    if (p) widgetParameters.returnLogoURL = p;
    /*
        radius : Optionnel . Valeur numérique. Valeurs autorisées : 10 | 30 | 60 | 100. Le rayon de recherche autour du lieu en km. Valeur par défaut 30.
        return_uri : Optionnel. Valeur par défaut / . L'uri de retour qui sera notifiée au site appelant. 
        return_logo_url : Optionnel. Valeur par défaut : logo du site Labonnealternance.pole-emploi.fr . L'url du logo du site vers lequel l'utilisateur revient en cliquant sur le bouton de retour dans Idea. 
        Si lat, lon et romes sont correctement renseignés une recherche sera lancée automatiquement en utilisant ces critères. Si radius est correctement renseigné il sera utilisé comme critère de la recherche.
        */
  }
};

export const setWidgetApplied = () => {
  applyWidgetParameters = false;
};

export const getIsTrainingOnly = () => {
  let result = getValueFromPath("isTrainingOnly") ? true : false; // paramètres historique utilisé par par LBA
  if (!result && getValueFromPath("scope") === "training" && getValueFromPath("caller")) result = true;
  return result;
};
