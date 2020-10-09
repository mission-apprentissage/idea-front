import axios from "axios";
import baseUrl from "../utils/baseUrl";
import _ from 'lodash'
import { isNonEmptyString } from '../utils/strutils'
import { logError } from "../utils/tools";


const filteredInput = (input) => {
  let res = []
  if (_.isArray(input)) {
    res = _.filter(input, (e) => isNonEmptyString(e))  
  }
  return res
} 

export default async function fetchDiplomas(
                                arrayOfRome, 
                                errorCallbackFn=_.noop, 
                                _baseUrl=baseUrl, 
                                _axios=axios, 
                                _window=window, 
                                _logError=logError) {
  
  let res = []

  let cleanedArrayOfRome = filteredInput(arrayOfRome)

  if (cleanedArrayOfRome.length === 0) return res

  const romeDiplomasApi = _baseUrl + "/jobsdiplomas";
  const response = await _axios.get(romeDiplomasApi, { params: { romes: cleanedArrayOfRome.join(",") } });
  const isAxiosError = !!_.get(response, 'data.error')
  const hasNoValidData = !_.isArray(_.get(response, 'data'))
  const isSimulatedError = _.includes(_.get(_window, 'location.href', ''), 'diplomaError=true')

  const isError = isAxiosError || hasNoValidData || isSimulatedError

  if (isError) {
    errorCallbackFn()
    if (isAxiosError) {
      _logError("Diploma API error", `Diploma API error ${response.data.error}`);
    } else if (hasNoValidData) {
      _logError("Diploma API error : API call worked, but returned unexpected data");
    } else if (isSimulatedError) {
      _logError("Diploma API error simulated with a query param :)");
    }
  } else {
    res = response.data;
  }  

  return res;
};
