// !!! - This file must contain validation functions that return a boolean value - TRUE or FALSE

import { LightningElement } from 'lwc';
import { showConsoleError } from './utils';

/**
 * @author Dmytro Lambru
 * @description Is the value type an object?
 * @param {*} value value to check
 * @returns {boolean} true or false
 */
export function isObject(value) {
    return !!value && typeof value === 'object';
}

/**
 * @author Dmytro Lambru
 * @description Is the value type null?
 * @param {*} value value to check
 * @returns {boolean} true or false
 */
export function isNull(value) {
    return value === null;
}

/**
 * @author Dmytro Lambru
 * @description Is the value type undefined?
 * @param {*} value value to check
 * @returns {boolean} true or false
 */
export function isUndefined(value) {
    return value === undefined;
}

/**
 * @author Dmytro Lambru
 * @description Is the value type undefined or null?
 * @param {*} value value to check
 * @returns {boolean} true or false
 */
export function isUndefinedOrNull(value) {
    return isUndefined(value) || isNull(value);
}

/**
 * @author Dmytro Lambru
 * @description Is the object inherited from the class "LightningElement"?
 * @param {*} value object to check
 * @returns {boolean} true or false
 */
export function isInheritedFromLightningElement(value) {
    const result = value instanceof LightningElement;

    if (!result) {
        showConsoleError(`An invalid object was passed, the object must be inherited from the class "LightningElement"`);
    }

    return result;
}