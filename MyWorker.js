
const { parentPort, workerData } = require("worker_threads");

const getFibonacciNumber = (num) => {
    if (num === 0) {
        return 0;
    }
    else if (num === 1) {
        return 1;
    }
    else {
        return getFibonacciNumber(num - 1) + getFibonacciNumber(num - 2);
    }
}

parentPort.on("message", message => {
    if (message == "start") {
        let ret = {};
        let t1 = Date.now();
        let sum = 0;
        try {
            sum = getFibonacciNumber(workerData.num);
        } catch (error) {
            console.error(error);
        }
    
        let t2 = Date.now();
        ret.sum = sum;
        ret.t = (t2 - t1);
        parentPort.postMessage(ret);
        parentPort.close();
    } 
    else {
        parentPort.postMessage({ going: message });
    }
});


