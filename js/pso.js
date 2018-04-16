let worker = this;

this.addEventListener("message", function(e) {
    let pso = new PSO(e.data);
    pso.start();
}, false);

class PSO {
    constructor(options) {
        this.imageData = options.imageData;
        this.swarm = new Swarm(options.swarmSize, {
            min: 0,
            max: 500
        }, {
            min: 0,
            max: 500
        });
    }

    start() {
        console.log("starting up");
    }
}

class Swarm {
    constructor(swarmSize, c1, c2, boundsX, boundsY) {
        this.counter = 0;
        this.particles = [];
        this.globalBest = [];

        for (let i = 0; i < swarmSize; i++) {
            this.particles.push(new Particle(boundsX, boundsY));
        }
    }
}

class Particle {
    constructor(c1, c2, boundsX, boundsY) {
        this.position = [];
        this.velocity = [];
        this.personalBest = [];
        this.c1 = c1;
        this.c2 = c2;

        this.position.push(Math.random() * boundsX.max);
        this.position.push(Math.random() * boundsY.max);
        this.position.push(Math.random() * ((boundsX.max + boundsY.max) / 2.0));
        this.position.push(Math.random() * 255.0);
        this.position.push(Math.random() * 255.0);
        this.position.push(Math.random() * 255.0);
        this.position.push(Math.random());

        this.personalBest = this.position.slice(0); // copy

        for (let i = 0; i < this.position.length; i++) {
            this.velocity[i] = Math.random();
        }
    }

    update() {
        let velocity = [];

        for (let i = 0; i < this.position.length; i++) {
            let velocity = 
        }

        for (let i = 0; i < this.position.length; i++) {
            this.position[i] = velocity[i] * this.position[i];
        }
    }
}
