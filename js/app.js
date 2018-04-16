$(document).ready(function() {
    let pso = null,
        imageOriginal = document.getElementById("img-original"),
        textareaOutput = document.getElementById("textarea-output"),
        inputSelectImage = document.getElementById("input-select-image"),
        inputInertia = document.getElementById("input-inertia"),
        inputC1 = document.getElementById("input-c1"),
        inputC2 = document.getElementById("input-c2"),
        inputSwarmSize = document.getElementById("input-swarm-size"),
        buttonStart = document.getElementById("button-start"),
        buttonStop = document.getElementById("button-stop");

    $(".tabular.menu .item").tab();

    inputSelectImage.addEventListener("change", function(e) {
        if (e.target.files && e.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                imageOriginal.src = e.target.result;
                buttonStart.classList.remove("disabled");
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    });

    buttonStart.addEventListener("click", function(e) {
        e.preventDefault();

        var buffer = document.createElement("canvas");
        buffer.width = imageOriginal.width;
        buffer.height = imageOriginal.height;

        var bufferContext = buffer.getContext("2d");
        bufferContext.drawImage(imageOriginal, buffer.width, buffer.height);

        var imageData = bufferContext.getImageData(0, 0, buffer.width, buffer.height)

        buttonStart.classList.add("disabled");
        buttonStop.classList.remove("disabled");

        let swarm = new Swarm({
            imageData: imageData,
            swarmSize: parseInt(inputSwarmSize.value),
            inertiaWeight: parseFloat(inputInertia.value),
            cognitiveWeight: parseFloat(inputC1.value),
            socialWeight: parseFloat(inputC2.value),
            bounds: {
                min: imageData.width,
                max: imageData.height
            }
        });

        swarm.start();
    });

    buttonStop.addEventListener("click", function(e) {
        // e.preventDefault();

        // buttonStart.classList.remove("disabled");
        // buttonStop.classList.add("disabled");

        // if (pso != null) {
        //     pso.stop();
        // }
    });

    paint = function(vector) {
        console.log(vector);
        var canvas = document.getElementById("canvas-pso");
        var context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < vector.length; i += 7) {
            context.beginPath();
            context.arc(vector[i], vector[i + 1], vector[i + 2], 0, 2 * Math.PI, false);
            context.fillStyle = "rgba(" + vector[i + 3] + "," + vector[i + 4] + "," + vector[i + 5] + "," + vector[i + 6] + ")";
            context.fill();
        }
    };

    // paint([250, 250, 89, 255, 0, 0, 0.5,
    //        320, 160, 120, 0, 255, 255, 0.7]);
});

class Swarm {
    constructor(options) {
        this.imageData = options.imageData;
        this.particles = [];
        this.globalBest = [];
        this.globalBestFitness = Number.MAX_VALUE;

        for (let i = 0; i < options.swarmSize; i++) {
            this.particles.push(new Particle(options));
        }
    }

    start() {
        for (var i = 0; i < 50; i++) {
            this.iteration();
        }
    }

    iteration() {
        for (let particle of this.particles) {
            var fitness = particle.fitness(this.imageData);

            if (fitness < this.globalBestFitness) {
                this.globalBestFitness = fitness;
                this.globalBest = particle.position.slice(0);
            }

            particle.update(this.globalBest);
        }

        paint(this.globalBest);
    }
}

class Particle {
    constructor(options) {
        this.bounds = options.bounds;
        this.inertiaWeight = options.inertiaWeight;
        this.cognitiveWeight = options.cognitiveWeight;
        this.socialWeight = options.socialWeight;
        this.position = [];
        this.velocity = [];
        this.personalBest = [];

        for (let i = 0; i < 20; i++) {
            this.position.push(Math.random() * this.bounds.max);
            this.position.push(Math.random() * this.bounds.max);
            this.position.push(Math.random() * this.bounds.max);
            this.position.push(Math.random() * 255.0);
            this.position.push(Math.random() * 255.0);
            this.position.push(Math.random() * 255.0);
            this.position.push(Math.random());
        }

        this.personalBest = this.position.slice(0); // copy

        for (let i = 0; i < this.position.length; i++) {
            this.velocity[i] = Math.random();
        }
    }

    fitness(imageData) {
        var canvas = document.createElement("canvas");
        canvas.width = this.bounds.max;
        canvas.height = this.bounds.max;

        var context = canvas.getContext("2d");

        for (let i = 0; i < this.position.length; i += 7) {
            context.beginPath();
            context.arc(this.position[i], this.position[i + 1], this.position[i + 2], 0, 2 * Math.PI, false);
            context.fillStyle = "rgba(" + this.position[i + 3] + "," + this.position[i + 4] + "," + this.position[i + 5] + "," + this.position[i + 6] + ")";
            context.fill();
        }

        let candidateData = context.getImageData(0, 0, this.bounds.max, this.bounds.max);
        let value = 0;

        for (let i = 0; i < candidateData.data.length; i += 4) {
            const red = candidateData.data[i];
            const green = candidateData.data[i + 1];
            const blue = candidateData.data[i + 2];

            value += red - imageData.data[i];
            value += green - imageData.data[i + 1];
            value += blue - imageData.data[i + 2];
        }

        return value;
    }

    update(globalBest) {
        let newVelocity = [];

        for (let i = 0; i < this.velocity.length; i++) {
            let r1 = Math.random(),
                r2 = Math.random();

            newVelocity.push(  
                (this.inertiaWeight * this.velocity[i]) +
                (this.cognitiveWeight * r1 * (this.personalBest[i] - this.position[i])) +
                (this.socialWeight * r2 * (globalBest[i] - this.position[i])));
        }

        this.velocity = newVelocity;

        for (let i = 0; i < this.position.length; i += 7) {
            position[i] = Math.min(0, Math.max(position[i] + this.velocity[i], this.bounds.max));
        }

        for (let i = 0; i < this.position.length; i++) {
            this.position[i] = this.position[i] + this.velocity[i];
        }
    }
}