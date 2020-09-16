import { getValueFromPath } from "../utils/tools";

export let widgetParameters = null;
export let applyWidgetParameters = false;

export const getWidgetParameters = () =>
{
    widgetParameters = {};
    applyWidgetParameters = true;
}

export const getIsTrainingOnly = () =>
{
    console.log("ok");

    let result = getValueFromPath("isTrainingOnly") ? true : false;     // paramètres historique utilisé par par LBA

    if(!result && getValueFromPath("scope")==="training" && getValueFromPath("caller"))
        result = true;
        
    return result;
}



/*
  radius : Optionnel . Valeur numérique. Valeurs autorisées : 10 | 30 | 60 | 100. Le rayon de recherche autour du lieu en km. Valeur par défaut 30.
  romes : Optionnel. Une liste de codes romes séparés par des virgules. Ex : A1021 | F1065,F1066,F1067 . Maximum 3 romes. Valeur par défaut null.
  scope : Optionnel. Valeurs autorisées all | training . Valeur par défaut all. Si absent ou la valeur est all la recherche portera sur les formations et les offres. Si training la recherche portera sur formations seulement
  lat : Optionnel. Coordonnée géographique en degrés décimaux (float). Valeur par défaut null. La partie lattitude des coordonnées gps.
  lon : Optionnel. Coordonnée géographique en degrés décimaux (float). Valeur par défaut null. La partie longitude des coordonnées gps.
  caller : Obligatoire. L'identification du site appelant. A fixer lors de la mise en place avec l’équipe d’IDEA.
  return_uri : Optionnel. Valeur par défaut / . L'uri de retour qui sera notifiée au site appelant. 
  return_logo_url : Optionnel. Valeur par défaut : logo du site Labonnealternance.pole-emploi.fr . L'url du logo du site vers lequel l'utilisateur revient en cliquant sur le bouton de retour dans Idea. 
Si lat, lon et romes sont correctement renseignés une recherche sera lancée automatiquement en utilisant ces critères. Si radius est correctement renseigné il sera utilisé comme critère de la recherche.
  */