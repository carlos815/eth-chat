
export default function compareArrays(array1: [], array2: []) {
    let areArraysEqual = true;

    const isArrayOneBiggest = array1.length > array2.length;

    const biggestArray = isArrayOneBiggest ? array1 : array2;
    const smallestArray = isArrayOneBiggest ? array2 : array1;

    biggestArray.every((item) => {
        const index = smallestArray.indexOf(item);
        if (index !== -1) {
            return true;
        } else {
            areArraysEqual = false;
            return false;
        }
    });
    return areArraysEqual;
}