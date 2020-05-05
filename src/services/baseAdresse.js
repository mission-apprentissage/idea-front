import axios from "axios";

export const fetchAddresses = (value) => {
  if (value) {
    const limit = 7;
    const addressURL = `https://api-adresse.data.gouv.fr/search/?limit=${limit}&q=${value}`;

    return axios.get(addressURL).then((response) => {
      const returnedItems = response.data.features.map((feature) => {
        return { value: feature.geometry, label: feature.properties.label };
      });

      //console.log("returned items : ", returnedItems);

      return returnedItems;
    });
  } else return [];
};
