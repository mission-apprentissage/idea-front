import axios from "axios";
import baseUrl from "../utils/baseUrl";
import _ from 'lodash'
import { isNonEmptyString } from '../utils/strutils'
import { logError } from "../utils/tools";
import { useSelector, useDispatch } from "react-redux";
import { push } from "connected-react-router";


export default async function fetchRomes(
                                value, 
                                errorCallbackFn=_.noop, 
                                _baseUrl=baseUrl, 
                                _axios=axios, 
                                _window=window, 
                                _logError=logError) {
  
  let res = []

  if (!isNonEmptyString(value)) return res;

  const romeLabelsApi = _baseUrl + "/romelabels";
  const response = await _axios.get(romeLabelsApi, { params: { title: value } });
  const isAxiosError = !!_.get(response, 'data.error')
  const hasNoLabelsAndRomes = !_.get(response, 'data.labelsAndRomes')
  const isSimulatedError = _.includes(_.get(_window, 'location.href', ''), 'romeError=true')

  if (isAxiosError) {
    _logError("Rome API error", `Rome API error ${response.data.error}`);
    errorCallbackFn()
  } else if (hasNoLabelsAndRomes) {
    _logError("Rome API error : API call worked, but returned unexpected data");
    errorCallbackFn()
  } else if (isSimulatedError) {
    _logError("Rome API error simulated with a query param :)");
    errorCallbackFn()
  } else {
    res = response.data.labelsAndRomes;
  }

  return res;
};
