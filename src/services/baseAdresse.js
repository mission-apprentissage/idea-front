import axios from "axios";

export const fetchAddresses = (value) => {
  if (value) {
    const limit = 10;
    let addressURL = `https://api-adresse.data.gouv.fr/search/?limit=${limit}&q=${value}`;

    if (value.length < 6 && isNaN(value[0])) addressURL += "&type=municipality";

    return axios.get(addressURL).then((response) => {
      response.data.features.sort((a, b) => { // tri des résultats avec mise en avant des villes de plus grande taille en premier
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
