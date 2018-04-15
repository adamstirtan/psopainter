
$(document).ready(function() {
    var worker = null,
        imageOriginal = $("#img-original"),
        textareaOutput = $("#textarea-output"),
        inputSelectImage = $("#input-select-image"),
        inputR1 = $("#input-r1"),
        inputR2 = $("#input-r2"),
        inputSwarmSize = $("#input-swarm-size"),
        buttonStart = $("#button-start"),
        buttonStop = $("#button-stop");

    $(".tabular.menu .item").tab();

    inputSelectImage.on("change", function(e) {
        if (e.target.files && e.target.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                imageOriginal
                    .attr('src', e.target.result)
                    .width(500)
                    .height(500);

                buttonStart.removeClass("disabled");
            };

            reader.readAsDataURL(e.target.files[0]);
        }
    });

    buttonStart.on("click", function(e) {
        e.preventDefault();

        buttonStart.addClass("disabled");
        buttonStop.removeClass("disabled");

        worker = new Worker("pso.js");
        worker.addEventListener("message", function (e) {
            textareaOutput.val(e.data + "\r\n" + textareaOutput.val());
        });

        worker.postMessage("START");
    });

    buttonStop.on("click", function(e) {
        e.preventDefault();

        buttonStart.removeClass("disabled");
        buttonStop.addClass("disabled");

        if (worker != null) {
            worker.terminate();
        }
    });

    // var canvasOriginal = document.getElementById("canvas-original");
    // var contextOriginal = canvas.getContext("2d");

    // var canvasPso = document.getElementById("canvas-pso");
    // var contextPso = canvas.getContext("2d");

    // context.beginPath();
    // context.arc(359, 150, 70, 0, 2 * Math.PI, false);
    // context.fillStyle = "rgba(0, 255, 0, 0.8)";
    // context.fill();
});
