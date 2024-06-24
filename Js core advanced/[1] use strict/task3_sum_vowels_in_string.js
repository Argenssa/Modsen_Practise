'use strict';

function sum_vowels_in_string(str) {
    str = str.toLowerCase();
    let re = /[aeyuioj]/g;
    let vowels = str.match(re);
    return vowels.length;
}

console.log(sum_vowels_in_string("To day is a really nice day"));