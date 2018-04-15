this.addEventListener("message", function(e) {
    this.postMessage(e.data);
}, false);

class PSO {
    constructor(options) {
        this.swarm = new Swarm(options.swarmSize, 7, {
            min: 0,
            max: 500
        }, {
            min: 0,
            max: 500
        });
    }
}

class Swarm {
    constructor(swarmSize, dimensions, boundsX, boundsY) {
        this.counter = 0;
        this.particles = [];
        this.globalBest = [];

        for (var i = 0; i < swarmSize; i++) {
            this.particles.push(new Particle(dimensions, boundsX, boundsY));
        }
    }

    count() {
        return ++this.counter;
    }
}

class Particle {
    constructor(boundsX, boundsY) {
        this.position = [];
        this.personalBest = [];

        this.position.push(Math.random() * boundsX.max);
        this.position.push(Math.random() * boundsY.max);
        this.position.push(Math.random() * ((boundsX.max + boundsY.max) / 2.0));
        this.position.push(Math.random() * 255.0);
        this.position.push(Math.random() * 255.0);
        this.position.push(Math.random() * 255.0);
        this.position.push(Math.random());

        this.personalBest = this.position.slice(0); // copy
    }

    update() {
        var velocity = [];

        for (var i = 0; i < this.position.length; i++) {
            this.position[i] = velocity[i] * this.position[i];
        }
    }
}

let swarm = new Swarm(10, 2);

setInterval(function () {
    this.postMessage("Counter: " + swarm.count());
}.bind(this), 1000);
