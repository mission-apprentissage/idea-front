import axios from "axios";
import baseUrl from "../utils/baseUrl";
import _ from 'lodash'
import { logError } from "../utils/tools";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";


export default async function fetchRomes(value, errorCallbackFn=_.noop, localBaseUrl=baseUrl, localAxios=axios) {
  
  const romeLabelsApi = localBaseUrl + "/romelabels";

  if (value) {
    const response = await localAxios.get(romeLabelsApi, { params: { title: value } });

    if (_.get(response, 'data.labelsAndRomes')) {
      return response.data.labelsAndRomes;
    } else if (_.get(response, 'data.error')) {
      errorCallbackFn()
    }
  } else {
    return [];
  }
};
