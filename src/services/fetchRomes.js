import axios from "axios";
import baseUrl from "../utils/baseUrl";
import _ from 'lodash'
import { logError } from "../utils/tools";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";


const isNonEmptyString = (val) => {(_.isString(val) && val.trim().length > 0)}

export default async function fetchRomes(value, errorCallbackFn=_.noop, localBaseUrl=baseUrl, localAxios=axios, localWindow=window) {
  

  let res = []

  if (isNonEmptyString(value)) return res

  const romeLabelsApi = localBaseUrl + "/romelabels";

  const response = await localAxios.get(romeLabelsApi, { params: { title: value } });

  if (_.get(response, 'data.error')) {
    errorCallbackFn()
  } else if (_.get(response, 'data.labelsAndRomes')) {
    res = response.data.labelsAndRomes;
  }

  return res;
};
