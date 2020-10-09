import axios from "axios";
import baseUrl from "../utils/baseUrl";
import _ from 'lodash'
import { logError } from "../utils/tools";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";


const isNonEmptyString = (val) => {(_.isString(val) && val.trim().length > 0)}

export default async function fetchRomes(value, errorCallbackFn=_.noop, _baseUrl=baseUrl, _axios=axios, _window=window) {
  

  let res = []

  if (isNonEmptyString(value)) return res

  const romeLabelsApi = _baseUrl + "/romelabels";
  const response = await _axios.get(romeLabelsApi, { params: { title: value } });
  const isAxiosError = !!_.get(response, 'data.error')

  if (isAxiosError) {
    errorCallbackFn()
  } else if (_.get(response, 'data.labelsAndRomes')) {
    res = response.data.labelsAndRomes;
  }

  return res;
};
