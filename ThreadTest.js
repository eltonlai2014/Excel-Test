const { Worker } = require("worker_threads");

let number = [25, 40, 45];
let workers = [];
const count = 3;
for (let i = 0; i < count; i++) {
    let obj = { num: number[i] };
    const worker = new Worker("./MyWorker.js", { workerData: obj });
    workers.push(worker);
    workers[i].on("message", result => {
        console.log(`workers[${i}] ${number} ${JSON.stringify(result)}`);
    });

    workers[i].on("error", error => {
        console.log(workers[i], error);
    });

    workers[i].on("exit", exitCode => {
        console.log(`workers[${i}] It exited with code ${exitCode}`);
    })
}

for (let i = 0; i < count; i++) {
    workers[i].postMessage("sasdasdsadtart");
    workers[i].postMessage("start");
}
console.log("Execution in main thread");
setInterval(() => {
    console.log(new Date());
}, 1000)