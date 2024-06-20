'use strict';

function find_in_array(array,element) {
    for(let i=0;i<array.length;i++){
        if(array[i]==element){
            return true;
        }
    }
    return false;
}
let arr=[1,4,5,6,7,15];
console.log(find_in_array(arr,4));
console.log(find_in_array(arr,3));