
$(document).ready(function() {
    var worker = null,
        endAngle = 2 * Math.PI,
        canvas = document.getElementById("canvas-pso"),
        context = canvas.getContext("2d"),
        imageOriginal = document.getElementById("img-original"),
        textareaOutput = document.getElementById("textarea-output"),
        inputSelectImage = document.getElementById("input-select-image"),
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

        buttonStart.classList.add("disabled");
        buttonStop.classList.remove("disabled");

        worker = new Worker("js/pso.js");
        worker.addEventListener("message", function (e) {
            textareaOutput.value = e.data + "\r\n" + textareaOutput.value;
        });

        worker.postMessage("START");
    });

    buttonStop.addEventListener("click", function(e) {
        e.preventDefault();

        buttonStart.classList.remove("disabled");
        buttonStop.classList.add("disabled");

        if (worker != null) {
            worker.terminate();
        }
    });

    paint = function(vector) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < vector.length; i += 7) {
            context.beginPath();
            context.arc(vector[i], vector[i + 1], vector[i + 2], 0, endAngle, false);
            context.fillStyle = "rgba(" + vector[i + 3] + "," + vector[i + 4] + "," + vector[i + 5] + "," + vector[i + 6] + ")";
            context.fill();
        }
    };

    paint([250, 250, 89, 255, 0, 0, 0.5,
           320, 160, 120, 0, 255, 255, 0.7]);
});
