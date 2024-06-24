
function BubbleSort(arr,sort) {
    if (sort == "<") {
        let changeValue;
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] < arr[j]) {
                    changeValue = arr[i];
                    arr[i] = arr[j];
                    arr[j] = changeValue;
                }
            }
        }
    } else {
        let changeValue;
        for (let i = 0; i < arr.length - 1; i++) {
            for (let j = i + 1; j < arr.length; j++) {
                if (arr[i] > arr[j]) {
                    changeValue = arr[i];
                    arr[i] = arr[j];
                    arr[j] = changeValue;
                }
            }
        }
    }
    return arr;
}

console.log(BubbleSort([4,7,0,23,22,44,1,-15],">"))
console.log(BubbleSort([4,7,0,23,22,44,1,-15],"<"))