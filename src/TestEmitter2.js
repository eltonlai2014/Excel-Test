const log4js = require('log4js');
const logger = log4js.getLogger('TestEmitter2');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

const _ = require('lodash');
class TestEmitter2 {

    constructor(options) {
        // call the super constructor to initialize `this`
        EventEmitter.call(this);
        this.myInit(options);
    }

    myInit(options) {
        console.log('myInit', options);
    }

    startTimer(t) {
        setInterval(() => {
            this.newMethod();
        }, t);
    }


    newMethod() {
        this.emit('Time', { name: 'asd' });
    }
}
util.inherits(TestEmitter2, EventEmitter);
module.exports = TestEmitter2;
