import axios from "axios";

export const fetchAddresses = (value, type) => {
  if (value) {
    let term = value;
    const limit = 10;
    let filter = "";

    if (term.length < 6) {
      // sur courte recherche on ne demande que des villes
      if (!type) filter = "&type=municipality";

      if (!isNaN(term)) {
        // si le début est un nombre on complète à 5 chiffes avec des 0 pour rechercher sur un CP
        let zipLengthDiff = 5 - term.length;
        for (let i = 0; i < zipLengthDiff; ++i) term += "0";
      }
    }
    if (type) filter = "&type=" + type;

    let addressURL = `https://api-adresse.data.gouv.fr/search/?limit=${limit}&q=${term}${filter}`;

    return axios.get(addressURL).then((response) => {
      response.data.features.sort((a, b) => {
        // tri des résultats avec mise en avant des villes de plus grande taille en premier
        if (a.properties.population && b.properties.population)
          return b.properties.population - a.properties.population;
        else if (a.properties.population) return -1;
        else if (b.properties.population) return 1;
        else return 0;
      });

      const returnedItems = response.data.features.map((feature) => {
        let label = feature.properties.label;
        if (label.indexOf(feature.properties.postcode) < 0) label += " " + feature.properties.postcode; // ajout du postcode dans le label pour les villes

        return {
          value: feature.geometry,
          insee: feature.properties.citycode,
          zipcode: feature.properties.postcode,
          label,
        };
      });

      //console.log("returned items : ", returnedItems);

      return returnedItems;
    });
  } else return [];
};

// récupère cp et insee à partir de lat / lon
export const fetchAddressFromCoordinates = (coordinates) => {
  let addressURL = `https://api-adresse.data.gouv.fr/reverse/?lat=${coordinates[1]}&lon=${coordinates[0]}`;
  return axios.get(addressURL).then((response) => {
    const returnedItems = response.data.features.map((feature) => {
      return {
        insee: feature.properties.citycode,
        zipcode: feature.properties.postcode,
        label: feature.properties.label,
      };
    });

    //console.log("returned items : ", returnedItems);

    return returnedItems;
  });
};
