import axios from "axios";
import baseUrl from "../utils/baseUrl";
import get from 'lodash/get'
import { logError } from "../utils/tools";

export default async function(value, localBaseUrl=baseUrl, localAxios=axios, localLogError=logError) {
  
  const romeLabelsApi = localBaseUrl + "/romelabels";

  if (value) {
    const response = await localAxios.get(romeLabelsApi, { params: { title: value } });

    if (response.data.labelsAndRomes) {
      return response.data.labelsAndRomes;
    } else {
      if (response.data.error) {
        console.log("error!!!!!!!!!!!!!!!!!!!!!!");
        localLogError("Rome API error", `Rome API error ${response.data.error}`);
      }
      return [];
    }
  } else {
    return [];
  }
};
