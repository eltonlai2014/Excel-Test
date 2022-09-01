const log4js = require('log4js');
const logger = log4js.getLogger('TestEmitter');
// 載入 Event Module
const EventEmitter = require('events');

const _ = require('lodash');
class TestEmitter extends EventEmitter{

    constructor(options) {
        super();
        this.myInit(options);
    }

    myInit(options) {
        logger.info('myInit', options);
    }

    startTimer(t) {
        setInterval(() => {
            this.newMethod();
        }, t);
    }


    newMethod() {
        this.emit('Time');
    }
}
// util.inherits(Test, eventEmitter)
module.exports = TestEmitter;
