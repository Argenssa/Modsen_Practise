'[1]use strict';

function spliceString(str) {
    str=str.replace(/[^\w\s']|_/g, '');
    return str.split(' ');
}

console.log(spliceString("Hello, how are you?"));