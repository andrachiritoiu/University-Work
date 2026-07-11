var speedMap = [0, 500, 1000, 3000, 5000];

function load() {
	this.canvas = new Canvas("myCanvas");
	this.startButton = document.getElementById("startButton");
	this.message = document.getElementById("message");
	this.loadButton = document.getElementById("loadButton");
	this.runButton = document.getElementById("runButton");
	this.speedSelector = document.getElementById("speedSelector");
	message.innerText = "Introduceti datele de intrare";

    $("#flip").click(function(){
        $("#panel").slideToggle("slow");
    });
	this.messList = $("#messList");
	this.breakPointsIdx = null;

	startButton.addEventListener("click", startAlgorithm);
	runButton.addEventListener("click", autorun);
	this.breakPoints = [];

	init();
}

function nextStep() {
	if (breakPointsIdx > breakPoints.length - 1) {
		genericCB();
		return null;
	}

	to_draw = breakPoints[breakPointsIdx];
	breakPointsIdx += 1;

	if (false === Array.isArray(to_draw)) {
		canvas.action(to_draw);
		return true;
	}
	for (var idx in to_draw) {
		canvas.action(to_draw[idx]);
	}
	return true;
}

function genericCB() {
	startButton.removeEventListener("click", nextStep);
	startButton.addEventListener("click", startAlgorithm);
	startButton.style.visibility = "visible";
	startButton.innerText = "Restart";

	message.innerText = "Algoritmul s-a sfarsit";
	runButton.style.visibility = "visible";
	canvas.redraw();
	callback();
}

function genericFP(){
	loadButton.style.visibility = "hidden";

	startButton.removeEventListener("click", startAlgorithm);
	startButton.addEventListener("click", nextStep);
	startButton.innerText = "Următorul pas";

	message.innerText = "Algoritmul este in curs de rulare";
	runButton.style.visibility = "hidden";
	canvas.permanent_drawings = [];
	breakPointsIdx = 0;
	$('#messList').empty();
	breakPoints = [];
	firstPart();
}

function startAlgorithm() {
	if (!condition()) {
		return null;
	}
	genericFP()
	nextStep();
}

function autorun() {
	if (!condition()){
		return null;
	}
	genericFP();
	startButton.style.visibility = "hidden";

	function timer() {
		if (null === nextStep()){
			return null;
		}
		setTimeout(timer, speedMap[speedSelector.value]);
	}
	timer();
}

function reset() {
	location.reload();
}