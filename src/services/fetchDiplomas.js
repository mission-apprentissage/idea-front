import axios from "axios";
import baseUrl from "../utils/baseUrl";
import _ from 'lodash'
import { isNonEmptyString } from '../utils/strutils'
import { logError } from "../utils/tools";


const _isValidInput = (input) => {
  let res = false
  let numberOfNonEmptyString = _.countBy(input, (e) => {return isNonEmptyString(e)})[true]
  res = numberOfNonEmptyString > 0  
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

  if (!_isValidInput(arrayOfRome)) return res

  return res;
};
