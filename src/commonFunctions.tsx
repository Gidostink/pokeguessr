
//Collection of random functions that are often useful.

/**
 * Returns the input object as a new, seperate object.
 * @param objectToClone
 * @returns
 */
export function deepCloneObject(objectToClone: object): any {

    return JSON.parse(JSON.stringify(objectToClone));

}

export function shuffleArray(inputArray: any[]): any[] {

    let copyFromArray: any[] = [...inputArray];
    let returnedArray: any[] = [];

    while (copyFromArray.length >= 1) {

        let removedItem: any = copyFromArray.splice(Math.floor(Math.random() * copyFromArray.length), 1);

        returnedArray.push(removedItem[0]);

        console.log(removedItem);

    }

    return returnedArray;

}