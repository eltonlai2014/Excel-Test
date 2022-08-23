let maxValue = 8 ;
let axisCount = 4 ;

let steps = new Number(maxValue);
let stepWidth = 1;
if (maxValue > 10) {
    stepWidth = Math.floor(maxValue / axisCount);
    steps = Math.ceil(maxValue / stepWidth);
}

console.log('steps', steps);
console.log('stepWidth', stepWidth);
console.log('maxValue', maxValue);