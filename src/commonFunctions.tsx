
//Collection of random functions that are often useful.

/**
 * Returns the input object as a new, seperate object.
 * @param objectToClone
 * @returns
 */
export function deepCloneObject(objectToClone: object): any {

    return JSON.parse(JSON.stringify(objectToClone));

}

