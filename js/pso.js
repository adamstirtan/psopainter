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
        });
    }

    start() {
        for (let i = 0; i < this.swarm.particles.length; i++) {
            console.log(this.swarm.particles[i]);
        }
    }
}

class Swarm {
    constructor(swarmSize, c1, c2, bounds) {
        this.particles = [];
        this.globalBest = [];

        for (let i = 0; i < swarmSize; i++) {
            this.particles.push(new Particle(bounds));
        }
    }

    iteration() {
        for (const particle of this.particles) {
            particle.update(this.globalBest);
        }
    }
}

class Particle {
    constructor(c1, c2, bounds) {
        this.position = [];
        this.velocity = [];
        this.personalBest = [];
        this.c1 = c1;
        this.c2 = c2;

        this.position.push(Math.random() * bounds.max);
        this.position.push(Math.random() * bounds.max);
        this.position.push(Math.random() * bounds.max);
        this.position.push(Math.random() * 255.0);
        this.position.push(Math.random() * 255.0);
        this.position.push(Math.random() * 255.0);
        this.position.push(Math.random());

        this.personalBest = this.position.slice(0); // copy

        for (let i = 0; i < this.position.length; i++) {
            this.velocity[i] = Math.random();
        }
    }

    update(globalBest) {
        let newVelocity = [];

        for (let i = 0; i < this.position.length; i++) {
            newVelocity[i] = this.velocity[i] +
                (this.c1 * (this.personalBest[i] - this.position[i])) +
                (this.c2 * (globalBest[i] - this.position[i]));
        }

        this.velocity = newVelocity;

        for (let i = 0; i < this.position.length; i++) {
            this.position[i] += this.velocity[i];
        }
    }
}
