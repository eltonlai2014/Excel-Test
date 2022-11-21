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

const moment = require('moment');

let now = moment();
console.log(now);

console.log(now.valueOf());

let ts = now.format('YYYY-MM-DD HH:mm:ss.SSS');
console.log(ts);

console.log(moment(ts).valueOf());

let aTime = moment().add(10, 'days'); // Tue Nov 13 2018 17:25:31 GMT+0800
let bTime = moment().add(-12, 'months'); // Tue Nov 13 2018 17:25:31 GMT+0800
console.log(aTime.format('YYYY-MM-DD HH:mm:ss'));
console.log(bTime.format('YYYY-MM-DD HH:mm:ss'));