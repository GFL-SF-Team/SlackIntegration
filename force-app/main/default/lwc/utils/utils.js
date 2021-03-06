/**
 * @File Name          : utils.js
 * @Description        : Some common util functions for retrieving data and handling errors
 * @Author             : Pavel Riabov
 * @Last Modified By   : Pavel Riabov
 * @Last Modified On   : 28.02.2020, 13:01:22
 * Ver       Date            Author      		    Modification
 * 1.0    28.02.2020   Pavel Riabov     Initial Version
**/
import { ShowToastEvent } from "lightning/platformShowToastEvent";

import * as $Validation from "./validationUtils";
// redirect all
export * from "./validationUtils";

export const DEBUG_MODE = true;

export const SHOW_MESSAGE_CODE = 1001;
/**
 * @description to display error in console
 * @author Dmytro Lambru
 * @param {*} arg1
 * @param {*} arg2
 */
export function showConsoleError(arg1, arg2) {
  if (!DEBUG_MODE) return;

  if (arg2) {
    // eslint-disable-next-line no-console
    console.error(arg1, arg2);
  } else {
    // eslint-disable-next-line no-console
    console.error(arg1);
  }
}

/**
 * @author Dmytro Lambru
 * @description Reduces one or more LDS errors into a string[] of error messages
 * @param {*} errors
 * @return {string[]} Error messages
 */
export function reduceErrors(errors) {
  errors = convertToArrayIfNotArray(errors);

  return (
    errors
      // Remove null/undefined items
      .filter(error => !!error)
      // Extract an error message
      .map(error => {
        // UI API read errors
        if (Array.isArray(error.body)) {
          return error.body.map(e => e.message);
        }
        // UI API DML, Apex and network errors
        else if (error.body && typeof error.body.message === "string") {
          return error.body.message;
        }
        // JS errors
        else if (typeof error.message === "string") {
          return error.message;
        }
        // Unknown error shape so try HTTP status text
        return error.statusText;
      })
      // Flatten
      .reduce((prev, curr) => prev.concat(curr), [])
      // Remove empty strings
      .filter(message => !!message)
  );
}

/**
 * @author Lambru Dmytro
 * @description Convert value to an array if it is not an array
 * @param {*} value
 * @returns {array} value as array
 */
export function convertToArrayIfNotArray(value) {
  if ($Validation.isUndefinedOrNull(value)) {
    value = [];
  } else if (!Array.isArray(value)) {
    value = [value];
  }

  return value;
}

/**
 * @author Lambru Dmytro
 * @description Show error(s) info from response
 * @param {object} cmp component(this) object
 * @param {*} error
 * @param {boolean} [isShowToast=true]
 */
export function handleErrorInResponse(cmp, error, isShowToast = true) {
  if (!$Validation.isInheritedFromLightningElement(cmp)) return;

  if (isShowToast) {
    showCriticalErrorToast(cmp);
  }

  const errorList = reduceErrors(error);

  showConsoleError("ERRORS:", errorList);
}

/**
 * @author Lambru Dmytro
 * @description Show error(s) info from Apex
 * @param {object} cmp component(this) object
 * @param {object} response LightningResult class object
 * @param {boolean} [isShowToast=true]
 */
export function handleErrorInResponseFromApex(
  cmp,
  response,
  isShowToast = true
) {
  if (!$Validation.isInheritedFromLightningElement(cmp)) return;
  if (isShowToast) showCriticalErrorToast(cmp, response.code);

  if (!!response && response.hasOwnProperty("code") && !!response.code) {
    showConsoleError("APEX ERROR CODE:", response.code);
  }

  if (!!response && response.hasOwnProperty("message") && !!response.message) {
    showConsoleError("APEX ERROR MSG:", response.message);
  }
}

/**
 * @author Lambru Dmytro
 * @description Toast notification that pops up to alert users of a success, info, error, or warning.
 * @param {object} cmp component(this) object
 * @param {string} title title of toast
 * @param {string} message toast message
 * @param {string} [variant='success'] (info/success/warning/error)
 * @param {string} [mode='dismissable'] (dismissable/pester/sticky)
 */
export function showToast(
  cmp,
  title,
  message,
  variant = "success",
  mode = "dismissable"
) {
  if (!$Validation.isInheritedFromLightningElement(cmp)) return;

  const newEvent = new ShowToastEvent({
    title,
    message,
    variant,
    mode
  });

  cmp.dispatchEvent(newEvent);
}

/**
 * @author Lambru Dmytro
 * @description Toast notification with critical system error
 * @param {object} cmp component(this) object
 * @param {string|number} code error code
 */
export function showCriticalErrorToast(cmp, code) {
  if (!$Validation.isInheritedFromLightningElement(cmp)) return;

  const title = "System error!";
  let message = "Please let us know about it";
  const variant = "error";
  const mode = "sticky";

  if (!$Validation.isUndefinedOrNull(code)) {
    message = `Please let us know about it, error code: ${code}`;
  }

  showToast(cmp, title, message, variant, mode);
}

/**
 * @description: Shows error notification with given text
 */
export function showNotifyWithError(cmp, messageText) {
  if (!$Validation.isInheritedFromLightningElement(cmp)) return;

  const title = messageText;
  let message = "";
  const variant = "error";
  const mode = "sticky";

  showToast(cmp, title, message, variant, mode);
}

/**
 * @description: Parses SObject or list of SObjects from JSON and deletes 'attributes' variable from the result
 */
export function parseSObjects(jsonString) {
  let result = JSON.parse(jsonString);

  if (Array.isArray(result)) {

    result.forEach(elem => {
      delete elem.attributes;
    });

  } else {
    delete result.attributes;
  }

  return result;
}

/**
 * @description: Retrieves and parses SObjects from Apex along with handling some errors
 */
export async function getSObjectsFromApex(cmp, apexFunction, apexFunctionParams = {}) {

  return new Promise(async (resolve, reject) => {

    try {
      let response = await apexFunction(apexFunctionParams);

      await handleResponse(cmp, response);
      resolve(parseSObjects(response.data));

    } catch (errors) {
      reject(errors);
    }
  });
}

/**
 * @description: Checks if the response from Apex was successful
 */
export async function handleResponse(cmp, response) {

  return new Promise(async (resolve, reject) => {

      if (response.success) {
        resolve();

      } else {
        reject({ response });
      }
  });
}

/**
 * @description: Handles errors caused by wrong request and errors on Apex side
 */
export function handleErrors(cmp, errors) {

  if (errors.hasOwnProperty("response")) {

    let response = errors.response;

    // if the error message from Apex should be displayed
    if (!response.success && response.code === SHOW_MESSAGE_CODE) {
      showNotifyWithError(cmp, response.message);

    } else {
      handleErrorInResponseFromApex(cmp, response);
    }

  } else {
    handleErrorInResponse(cmp, errors);
  }
}
