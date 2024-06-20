'[1]use strict';

function findDuplicates(arr) {
    for(let i = 0; i < arr.length-1; i++) {
        for(let j = i+1; j < arr.length; j++) {
            if(arr[i]===arr[j]){
                return true;
            }
        }
    }
    return false;
}

console.log(findDuplicates([1,2,3,4,5]));
console.log(findDuplicates([1,2,3,1,5]));