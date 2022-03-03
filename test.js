const a = ["1", "dos", "tres", "cinco", "seis", "seven"];

const b = ["dos", "tres", "1", "eight", "cinco", "seis", "seven"];

function compareArrays(array1, array2) {
  let equalArrays = true;
  const biggestArray = array1.length > array2.length ? array1 : array2;
  const smallestArray = array1.length > array2.length ? array2 : array1;

  biggestArray.every((item) => {
    const index = smallestArray.indexOf(item);
    if (index !== -1) {
      return true;
    } else {
      equalArrays = false;
      console.log(item, "different");

      return false;
    }
  });

  return equalArrays;
}

console.log(compareArrays(a, b));
