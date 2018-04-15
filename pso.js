this.addEventListener("message", function(e) {
    this.postMessage(e.data);
}, false);

class Particle {
    constructor() {
        this.position = [];
    }
}

class Swarm {
    constructor() {
        this.counter = 0;
    }

    count() {
        return ++this.counter;
    }
}

let swarm = new Swarm();

setInterval(function () {
    this.postMessage("Counter: " + swarm.count());
}.bind(this), 1000);
