function sumHalf(arr){
    let sum = 0;
    let half = arr.length/2;
    for(let i=0;i<half;i++)
    {
        sum += arr[i];
    }
    return sum
}
console.log(sumHalf([1,2,3,4,5]));