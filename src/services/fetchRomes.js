import axios from "axios";
import baseUrl from "../utils/baseUrl";
import _ from 'lodash'
import { logError } from "../utils/tools";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";


export default async function fetchRomes(value, errorCallbackFn=_.noop, localBaseUrl=baseUrl, localAxios=axios) {
  

  let res = []
  const romeLabelsApi = localBaseUrl + "/romelabels";

  if (value) {
    const response = await localAxios.get(romeLabelsApi, { params: { title: value } });

    if (_.get(response, 'data.error')) {
      errorCallbackFn()
    } else if (_.get(response, 'data.labelsAndRomes')) {
      res = response.data.labelsAndRomes;
    }
  } else {
    return [];
  }
  return res;
};
