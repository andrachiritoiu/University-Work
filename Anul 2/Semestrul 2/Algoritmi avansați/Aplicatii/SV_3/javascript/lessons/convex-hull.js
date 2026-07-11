window.onload = function () {
    addScrollToVisualSupportFunctionality();
    algorithmSlidesFunctionality();
    initValues();
    initButtonsAndAddEventListeners();
    initCanvas();
}


window.onresize = function () {
    // Nu poti face resize daca algoritmul ruleaza
    if (!algorithmIsRunning) {
        moveXValue = 0
        moveYValue = 0
        setCanvas();
        updateCanvasAfterMove();
    }
}


function initValues() {
    maxWidthResponsive = 900
    columnPadding = 50
    canvasBorder = 3

    moveXValue = 0
    moveYValue = 0

    animationStepIndex = 0;
    algorithmGraphicIndications = [];
    algorithmIsRunning = false;
    convexHullPointsOnCanvas = [];

    totalNumberOfPointsOnCanvas = 0;
    lastPointLetter = "";
    pointsOnCanvas = [];
}

function initButtonsAndAddEventListeners() {
    // Adauga eventListeners pentru butoane
    showGridButton = document.getElementById("showGrid");
    showGridButton.addEventListener("click", showGrid);

    generateRandomPointsButton = document.getElementById("generateRandomPoints");
    generateRandomPointsButton.addEventListener("click", generateAndDrawRandomPoints);

    resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", reset);

    grahamScanButton = document.getElementById("grahamScan");
    grahamScanButton.classList.add("selectedAlgorithm");
    grahamScanButton.addEventListener("click", selectGrahamScan);

    jarvisMarchButton = document.getElementById("jarvisMarch");
    jarvisMarchButton.addEventListener("click", selectJarvisMarch);

    startAutorunAlgorithm = document.getElementById("autorun");
    startAutorunAlgorithm.addEventListener("click", startVisualizationOnAutorun);

    startStepByStepAlgorithm = document.getElementById("stepByStep");
    startStepByStepAlgorithm.addEventListener("click", startVisualizationOnSteptByStep);
}


function initCanvas() {
    // Se initializeaza canvas
    convexHullCanvas = document.getElementById("convexHullCanvas")
    canvasContext = convexHullCanvas.getContext("2d")
    setCanvas();
    convexHullCanvas.addEventListener("click", addPointAtCanvasClick);
    moveCanvasFunctions();
}

function setCanvas() {
    // Se seteaza canvas conform dimensiunilor ferestrei
    var canvasHeight = window.innerHeight / 1.3
    convexHullCanvas.height = canvasHeight

    var windowsWidth = window.innerWidth;
    var canvasWidth;
    if (windowsWidth <= maxWidthResponsive) {
        canvasWidth = windowsWidth - columnPadding * 2 - canvasBorder * 2;
    }
    else {
        canvasWidth = windowsWidth * 0.65 - columnPadding * 2 - canvasBorder * 2;
    }
    convexHullCanvas.width = canvasWidth;
    canvasContext.resetTransform();
    canvasContext.translate(canvasWidth / 2, canvasHeight / 2)
}

function selectGrahamScan() {
    jarvisMarchButton.classList.remove("selectedAlgorithm");
    grahamScanButton.classList.add("selectedAlgorithm");
}

function selectJarvisMarch() {
    grahamScanButton.classList.remove("selectedAlgorithm");
    jarvisMarchButton.classList.add("selectedAlgorithm");
}

function algorithmSlidesFunctionality() {
    algSlideIndex = 1;
    showAlgorithmSlide();
}

function showPreviousAlgSlide() {
    algSlideIndex--;
    showAlgorithmSlide();
}

function showNextAlgSlide() {
    algSlideIndex++;
    showAlgorithmSlide();
}

function showAlgorithmSlide(slideNumber = algSlideIndex) {
    var algSlides = document.getElementsByClassName("algSlides");
    var indicators = document.getElementsByClassName("indicator");
    if (slideNumber > algSlides.length) {
        slideNumber = 1;
    }
    if (slideNumber < 1) {
        slideNumber = algSlides.length;
    }
    algSlideIndex = slideNumber;

    for (let i = 0; i < algSlides.length; i++) {
        algSlides[i].style.display = "none";
    }
    for (let i = 0; i < indicators.length; i++) {
        indicators[i].className = indicators[i].className.replace(" active", "");
    }
    algSlides[slideNumber - 1].style.display = "block";
    indicators[slideNumber - 1].className += " active";
}


function startVisualizationOnAutorun() {
    startAlgorithmVisualization("autorun")
}

function startVisualizationOnSteptByStep() {
    startAlgorithmVisualization("stepByStep")
}

function startAlgorithmVisualization(startType) {
    if (pointsOnCanvas.length >= 2) {
        grahamScanButton.removeEventListener("click", selectGrahamScan);
        jarvisMarchButton.removeEventListener("click", selectJarvisMarch);
        convexHullCanvas.removeEventListener("click", addPointAtCanvasClick);

        grahamScanButton.disabled = true;
        jarvisMarchButton.disabled = true;
        startAutorunAlgorithm.disabled = true;
        algorithmIsRunning = true;
        generateRandomPointsButton.disabled = true
        moveCanvasUp.disabled = true;
        moveCanvasDown.disabled = true;
        moveCanvasLeft.disabled = true;
        moveCanvasRight.disabled = true;
        showGridButton.disabled = true;

        var algorithmType = document.getElementsByClassName("selectedAlgorithm")[0].id;
        if (algorithmType == "grahamScan") {
            executeGrahamScanAlgorithm();
        }
        else {
            executeJarvisMarchAlgorithm();
        }

        if (startType == "autorun") {
            startStepByStepAlgorithm.disabled = true;
            startAutorunAlgorithm.removeEventListener("click", startVisualizationOnAutorun);
            startAutorunAlgorithm.innerHTML = "ANIMATIA ALGORITMULUI E IN EXECUTIE";
            let speed = (101 - document.getElementById("speed").value) * 25;
            startAnimationOnAutorun(speed)
        }
        if (startType == "stepByStep") {
            startStepByStepAlgorithm.innerText = "EXECUTA PASUL URMATOR";
            startStepByStepAlgorithm.removeEventListener("click", startVisualizationOnSteptByStep);
            startStepByStepAlgorithm.addEventListener("click", startAnimationForStep);
            startAnimationForStep()
        }
    }
}

function startAnimationOnAutorun(speed) {
    algorithmRunningInterval = setInterval(startAnimationForStep, speed);
}


function moveCanvasFunctions() {
    moveCanvasUp = document.getElementById("up")
    moveCanvasUp.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < moveYValue + 40 && moveYValue + 40 < CANVAS_COORDINATE_MAX_VALUE) {
            moveYValue += 40;
            updateCanvasAfterMove();
        }
    })
    moveCanvasDown = document.getElementById("down")
    moveCanvasDown.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < moveYValue - 40 && moveYValue - 40 < CANVAS_COORDINATE_MAX_VALUE) {
            moveYValue -= 40;
            updateCanvasAfterMove();
        }
    })
    moveCanvasLeft = document.getElementById("left")
    moveCanvasLeft.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < moveXValue + 40 && moveXValue + 40 < CANVAS_COORDINATE_MAX_VALUE) {
            moveXValue += 40;
            updateCanvasAfterMove();
        }
    })
    moveCanvasRight = document.getElementById("right")
    moveCanvasRight.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < moveXValue - 40 && moveXValue - 40 < CANVAS_COORDINATE_MAX_VALUE) {
            moveXValue -= 40;
            updateCanvasAfterMove();
        }
    })
}


function showGrid() {
    var showGridIcon = document.getElementById("showGridIcon");
    var isGridActive = showGridIcon.classList.contains("fa-eye-slash")
    if (isGridActive) {
        showGridIcon.classList.remove("fa-eye-slash");
        showGridIcon.classList.add("fa-eye");
        removeCartesianSystemLines()
    }
    else {
        showGridIcon.classList.remove("fa-eye");
        showGridIcon.classList.add("fa-eye-slash");
        drawCartesianSystemLines(canvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
            -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
            NUMERIC_UNIT_PIXEL_SIZE, moveXValue, moveYValue, false)
        redrawCanvasElements();
    }
}

function removeCartesianSystemLines() {
    clearCanvas();
    redrawCanvasElements();
}


function updateCanvasAfterMove() {
    clearCanvas();
    let isGridActive = document.getElementById("showGridIcon").classList.contains("fa-eye-slash");
    if (isGridActive) {
        drawCartesianSystemLines(canvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
            -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
            NUMERIC_UNIT_PIXEL_SIZE, moveXValue, moveYValue, false)
    }
    redrawCanvasElements();
}


function getStandardPointFromTranslatedCanvas(canvasPointPosition) {
    var standardPointX = (canvasPointPosition.x - moveXValue) / NUMERIC_UNIT_PIXEL_SIZE;
    var standardPointY = -(canvasPointPosition.y - moveYValue) / NUMERIC_UNIT_PIXEL_SIZE;
    return { x: standardPointX, y: standardPointY }
}


function addPointAtCanvasClick(event) {
    totalNumberOfPointsOnCanvas++;
    document.getElementById("totalPointsOnCanvas").innerHTML = "PUNCTE: " + totalNumberOfPointsOnCanvas;
    var mousePosition = getMousePositionOnCanvas(event, convexHullCanvas, canvasContext);
    var pointOnNormalCanvas = getStandardPointFromTranslatedCanvas(mousePosition);
    if (!checkPointAlreadyExistsOnCanvas(pointOnNormalCanvas)) {
        lastPointLetter = getNextPointLetter(lastPointLetter);
        var realPoint = { x: pointOnNormalCanvas.x, y: pointOnNormalCanvas.y, letter: lastPointLetter };
        pointsOnCanvas.push(realPoint);
        drawNewPoint(canvasContext, mousePosition);
        drawElementIndicator(canvasContext, mousePosition.x - 10, mousePosition.y - 10, lastPointLetter);
    }
}

function checkPointAlreadyExistsOnCanvas(newPoint) {
    for (let p = 0; p < pointsOnCanvas.length; p++) {
        let pointOnCanvas = pointsOnCanvas[p];
        if (Math.abs(pointOnCanvas.x - newPoint.x) < 2 * POINT_RADIUS / NUMERIC_UNIT_PIXEL_SIZE
            && Math.abs(pointOnCanvas.y - newPoint.y) < 2 * POINT_RADIUS / NUMERIC_UNIT_PIXEL_SIZE) {
            return true;
        }
    }
    return false;
}

function redrawCanvasElements() {
    redrawPointOnCanvas()
    redrawConvexHullLines()
}

function getPointCoordinatesOnTranslatedCanvas(standardPoint) {
    var initialCanvasX = standardPoint.x * NUMERIC_UNIT_PIXEL_SIZE;
    var initialCanvasY = - standardPoint.y * NUMERIC_UNIT_PIXEL_SIZE;
    return {
        x: initialCanvasX + moveXValue,
        y: initialCanvasY + moveYValue,
        letter: standardPoint.letter
    }
}


function redrawConvexHullLines() {
    var canvasHullLen = convexHullPointsOnCanvas.length;
    if (canvasHullLen == 1) {
        let onlyPoint = getPointCoordinatesOnTranslatedCanvas(convexHullPointsOnCanvas[canvasHullLen - 1]);
        drawNewPoint(canvasContext, onlyPoint, GREEN_COLOR);
    } else {
        for (let i = 0; i < canvasHullLen - 1; i++) {
            let firstPoint = getPointCoordinatesOnTranslatedCanvas(convexHullPointsOnCanvas[i])
            let secondPoint = getPointCoordinatesOnTranslatedCanvas(convexHullPointsOnCanvas[i + 1])
            drawNewLine(canvasContext, firstPoint, secondPoint, LIGHT_GREEN_COLOR, [], 4);
            drawNewPoint(canvasContext, firstPoint, GREEN_COLOR);
            drawNewPoint(canvasContext, secondPoint, GREEN_COLOR);
        }
    }
}

function redrawPointOnCanvas() {
    // Redeseneaza toate punctele initiale
    for (let i = 0; i < pointsOnCanvas.length; i++) {
        let point = pointsOnCanvas[i];
        point = getPointCoordinatesOnTranslatedCanvas(point)
        drawNewPoint(canvasContext, point);
        drawElementIndicator(canvasContext, point.x - 10, point.y - 10, point.letter);
    }
}


function generateAndDrawRandomPoints() {
    var inputNumber = parseInt(document.getElementById("randomPointsNumberInput").value);
    if (inputNumber < 2 || inputNumber > 50) {
        return;
    }
    else {
        let isGridActive = document.getElementById("showGridIcon").classList.contains("fa-eye-slash");
        reset();
        if (isGridActive) {
            drawCartesianSystemLines(canvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
                -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
                NUMERIC_UNIT_PIXEL_SIZE, moveXValue, moveYValue, false)
        }
        convexHullCanvas.removeEventListener("click", addPointAtCanvasClick);
        totalNumberOfPointsOnCanvas = inputNumber;
        setTotalPointsOnCanvasNumber(totalNumberOfPointsOnCanvas)
        for (let i = 0; i < totalNumberOfPointsOnCanvas; i++) {
            var x = Math.random() * 10;
            var y = Math.random() * 10;
            lastPointLetter = getNextPointLetter(lastPointLetter);
            let point = { x: x, y: y, letter: lastPointLetter };
            pointsOnCanvas.push(point);
            let canvasPoint = getPointCoordinatesOnTranslatedCanvas(point);
            drawNewPoint(canvasContext, canvasPoint);
            drawElementIndicator(canvasContext, canvasPoint.x - 10, canvasPoint.y - 10, lastPointLetter);
        }
    }
}


function setTotalPointsOnCanvasNumber(number) {
    document.getElementById("totalPointsOnCanvas").innerHTML = "PUNCTE: " + number;
}

function setTotalPointsOnConvexHullNumber(number) {
    document.getElementById("pointsInConvexHull").innerHTML = "PUNCTE IN ACOPERIREA CONVEXA: " + number;
}

function reset() {
    clearCanvas()
    initValues();

    setTotalPointsOnCanvasNumber(0);
    setTotalPointsOnConvexHullNumber(0);

    convexHullCanvas.addEventListener("click", addPointAtCanvasClick);
    generateRandomPointsButton.addEventListener("click", generateAndDrawRandomPoints);
    generateRandomPointsButton.disabled = false;

    document.getElementById("steps").innerHTML = "";

    startStepByStepAlgorithm.disabled = false
    startStepByStepAlgorithm.innerHTML = "PAS CU PAS"
    startStepByStepAlgorithm.addEventListener("click", startVisualizationOnSteptByStep);
    startAutorunAlgorithm.disabled = false
    startAutorunAlgorithm.innerHTML = "AUTOMAT"
    startAutorunAlgorithm.addEventListener("click", startVisualizationOnAutorun);

    moveCanvasUp.disabled = false;
    moveCanvasDown.disabled = false;
    moveCanvasLeft.disabled = false;
    moveCanvasRight.disabled = false;
    showGridButton.disabled = false;
    var showGridIcon = document.getElementById("showGridIcon");
    showGridIcon.classList.remove("fa-eye-slash");
    showGridIcon.classList.add("fa-eye");

    grahamScanButton.disabled = false;
    jarvisMarchButton.disabled = false;
    grahamScanButton.addEventListener("click", selectGrahamScan);
    jarvisMarchButton.addEventListener("click", selectJarvisMarch);
}



function startAnimationForStep() {
    if (animationStepIndex < algorithmGraphicIndications.length) {
        let currentAnimationStep = algorithmGraphicIndications[animationStepIndex];
        drawAnimationForStep(currentAnimationStep);
        animationStepIndex++;
    }
    else {
        finishAnimation();
    }
}

function finishAnimation() {
    if (startStepByStepAlgorithm.disabled) {
        clearInterval(algorithmRunningInterval);
    } else {
        startStepByStepAlgorithm.innerHTML = "ALGORITM FINALIZAT";
        startStepByStepAlgorithm.disabled = true;
        startStepByStepAlgorithm.removeEventListener("click", startAnimationForStep);
    }
    moveCanvasUp.disabled = false;
    moveCanvasDown.disabled = false;
    moveCanvasLeft.disabled = false;
    moveCanvasRight.disabled = false;
    document.getElementById("showGrid").disabled = false;
    algorithmIsRunning = false;
    startAutorunAlgorithm.innerHTML = "ALGORITM FINALIZAT";
    updateCanvasAfterMove();
}


function drawAnimationForStep(animationStep) {
    var stepExplanation = animationStep.explanation;
    addExplanationInList(stepExplanation);
    var graphicDrawingsStepList = animationStep.graphicDrawingsStepList;
    for (let i = 0; i < graphicDrawingsStepList.length; i++) {
        var subStep = graphicDrawingsStepList[i];
        drawAnimationForIntermediateStep(subStep);
    }
}

function addExplanationInList(explanation) {
    let newStepLi = document.createElement("li");
    newStepLi.innerHTML = explanation;
    document.getElementById("steps").appendChild(newStepLi);
}


function drawAnimationForIntermediateStep(subStep) {
    var stepType = subStep.type;
    var stepElement = subStep.element;
    var stepColor = subStep.color !== undefined ? subStep.color : "black";
    var stepSize = subStep.size !== undefined ? subStep.size : POINT_RADIUS;
    var stepStyle = subStep.style;

    if (stepType == "updateNumber") {
        setTotalPointsOnConvexHullNumber(stepElement);
    }
    if (stepType == "updateConvexHullList") {
        convexHullPointsOnCanvas = stepElement;
        redrawConvexHull();
    }
    if (stepType == "point") {
        var element = getPointCoordinatesOnTranslatedCanvas(stepElement);
        drawNewPoint(canvasContext, element, stepColor, stepSize);
    }
    if (stepType == "line") {
        let lineDash = []
        if (stepStyle == "dash") {
            lineDash = [10, 10]
        }
        let firstPoint = getPointCoordinatesOnTranslatedCanvas(stepElement[0])
        let secondPoint = getPointCoordinatesOnTranslatedCanvas(stepElement[1])
        drawNewLine(canvasContext, firstPoint, secondPoint, stepColor, lineDash);
    }
}


function redrawConvexHull() {
    clearCanvas();
    redrawCanvasElements()
}


function clearCanvas() {
    canvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
}



// ALGORITMI
function getIndexOfFarLeftPoint() {
    var mostLeftPoint = pointsOnCanvas[0];
    mostLeftPointIndex = 0
    for (let i = 0; i < pointsOnCanvas.length; i++) {
        if (pointsOnCanvas[i].x < mostLeftPoint.x) {
            mostLeftPoint = pointsOnCanvas[i];
            mostLeftPointIndex = i;
        }
    }
    return mostLeftPointIndex;
}

function determineLowConvexHull(points) {
    lowConvexHull = [points[0], points[1]];
    algorithmNumberOfPointsInConvexHull += 2;

    var stepExplanation = "Punctele au fost sortate lexicografic. Frontiera inferioara este initializata cu punctele " + lowConvexHull[0].letter + " si " + lowConvexHull[1].letter + ". ";
    var visualizationStep = {
        explanation: stepExplanation,
        graphicDrawingsStepList: [{
            type: "updateConvexHullList",
            element: lowConvexHull.slice(),
        },
        {
            type: "updateNumber",
            element: algorithmNumberOfPointsInConvexHull
        }]
    };
    algorithmGraphicIndications.push(visualizationStep);

    for (let i = 2; i < points.length; i++) {
        algorithmNumberOfPointsInConvexHull++;
        var visualizationStep = {
            explanation: "Punctul " + points[i].letter + " este adaugat in lista.",
            graphicDrawingsStepList: [
                {
                    type: "point",
                    element: points[i],
                    color: ORANGE_COLOR,
                    size: 8
                },
                {
                    type: "updateNumber",
                    element: algorithmNumberOfPointsInConvexHull
                }]
        };
        algorithmGraphicIndications.push(visualizationStep);


        while (lowConvexHull.length >= 2) {
            var secondLastPoint = lowConvexHull[lowConvexHull.length - 2];
            var lastPoint = lowConvexHull[lowConvexHull.length - 1];
            var orientation = calculateOrientationForNormalPoints(secondLastPoint, lastPoint, points[i]);
            if (orientation == 2) {
                var temporaryLowConvexHull = lowConvexHull.slice();
                temporaryLowConvexHull.push(points[i]);
                visualizationStep = {
                    explanation: "Punctele " + secondLastPoint.letter + ", " + lastPoint.letter + " si " + points[i].letter + " formeaza un viraj la stanga, deci niciun element nu este sters. ",
                    graphicDrawingsStepList: [
                        {
                            type: "updateConvexHullList",
                            element: temporaryLowConvexHull
                        }
                    ]
                };
                algorithmGraphicIndications.push(visualizationStep);
                break;
            }
            else {
                var stepExplanation = "Punctele " + secondLastPoint.letter + ", " + lastPoint.letter + " si " + points[i].letter
                if (orientation == 0) {
                    stepExplanation += " sunt coliniare";
                }
                else {
                    stepExplanation += " formeaza un viraj la dreapta";
                }
                stepExplanation += ", deci punctul " + lastPoint.letter + " este sters din lista.";

                lowConvexHull.pop();
                algorithmNumberOfPointsInConvexHull--;
                var temporaryLowConvexHull = lowConvexHull.slice();
                temporaryLowConvexHull.push(points[i]);
                visualizationStep = {
                    explanation: stepExplanation,
                    graphicDrawingsStepList: [
                        {
                            type: "updateConvexHullList",
                            element: temporaryLowConvexHull
                        },
                        {
                            type: "line",
                            element: [secondLastPoint, lastPoint],
                            style: "dash",
                            color: RED_COLOR
                        },
                        {
                            type: "line",
                            element: [lastPoint, points[i]],
                            style: "dash",
                            color: RED_COLOR
                        },
                        {
                            type: "point",
                            element: lastPoint,
                            color: RED_COLOR
                        },
                        {
                            type: "updateNumber",
                            element: algorithmNumberOfPointsInConvexHull
                        }
                    ]
                };
                algorithmGraphicIndications.push(visualizationStep);
            }
        }
        lowConvexHull.push(points[i]);


        var messageConvexHullList = "Frontiera inferioara contine punctele ";
        for (let i = 0; i < lowConvexHull.length; i++) {
            messageConvexHullList += lowConvexHull[i].letter;
            if (i != lowConvexHull.length - 1) {
                messageConvexHullList += ", "
            }
            else {
                messageConvexHullList += ". "
            }
        }
        visualizationStep = {
            explanation: messageConvexHullList,
            graphicDrawingsStepList: [
                {
                    type: "updateConvexHullList",
                    element: lowConvexHull.slice()
                }]
        };
        algorithmGraphicIndications.push(visualizationStep);
    }
}


function determineUpperConvexHull(points) {
    upperConvexHull = [points[points.length - 1], points[points.length - 2]];
    algorithmNumberOfPointsInConvexHull++;

    var stepExplanation = "Analog, se determina frontiera superioara, care se initializeaza cu punctele " + upperConvexHull[0].letter + " si " + upperConvexHull[1].letter + ". ";
    var visualizationStep = {
        explanation: stepExplanation,
        graphicDrawingsStepList: [
            {
                type: "updateConvexHullList",
                element: upperConvexHull.slice()
            },
            {
                type: "updateNumber",
                element: algorithmNumberOfPointsInConvexHull
            }]
    };
    algorithmGraphicIndications.push(visualizationStep);

    for (let i = points.length - 3; i >= 0; i--) {
        algorithmNumberOfPointsInConvexHull++;
        var visualizationStep = {
            explanation: "Punctul " + points[i].letter + " este adaugat in lista.",
            graphicDrawingsStepList: [
                {
                    type: "point",
                    element: points[i],
                    color: ORANGE_COLOR,
                    size: 8
                },
                {
                    type: "updateNumber",
                    element: algorithmNumberOfPointsInConvexHull
                }]
        };
        algorithmGraphicIndications.push(visualizationStep);

        while (upperConvexHull.length >= 2) {
            var secondLastPoint = upperConvexHull[upperConvexHull.length - 2];
            var lastPoint = upperConvexHull[upperConvexHull.length - 1];
            var orientation = calculateOrientationForNormalPoints(secondLastPoint, lastPoint, points[i]);
            if (orientation == 2) {
                var temporaryUpperConvexHull = upperConvexHull.slice();
                temporaryUpperConvexHull.push(points[i]);
                visualizationStep = {
                    explanation: "Punctele " + secondLastPoint.letter + ", " + lastPoint.letter + " si " + points[i].letter + " formeaza un viraj la stanga, deci niciun element nu este sters. ",
                    graphicDrawingsStepList: [
                        {
                            type: "updateConvexHullList",
                            element: temporaryUpperConvexHull
                        }
                    ]
                };
                algorithmGraphicIndications.push(visualizationStep);
                break;
            }
            else {
                var stepExplanation = "Punctele " + secondLastPoint.letter + ", " + lastPoint.letter + " si " + points[i].letter
                if (orientation == 0) {
                    stepExplanation += " sunt coliniare";
                }
                else {
                    stepExplanation += " formeaza un viraj la dreapta";
                }
                stepExplanation += ", deci punctul " + lastPoint.letter + " este sters din lista.";

                upperConvexHull.pop();
                algorithmNumberOfPointsInConvexHull--;
                var temporaryUpperConvexHull = upperConvexHull.slice();
                temporaryUpperConvexHull.push(points[i]);
                visualizationStep = {
                    explanation: stepExplanation,
                    graphicDrawingsStepList: [
                        {
                            type: "updateConvexHullList",
                            element: temporaryUpperConvexHull
                        },
                        {
                            type: "line",
                            element: [secondLastPoint, lastPoint],
                            style: "dash",
                            color: RED_COLOR
                        },
                        {
                            type: "line",
                            element: [lastPoint, points[i]],
                            style: "dash",
                            color: RED_COLOR
                        },
                        {
                            type: "point",
                            element: lastPoint,
                            color: RED_COLOR
                        },
                        {
                            type: "updateNumber",
                            element: algorithmNumberOfPointsInConvexHull
                        }
                    ]
                };
                algorithmGraphicIndications.push(visualizationStep);
            }
        }
        upperConvexHull.push(points[i]);


        var messageConvexHullList = "Frontiera superioara contine punctele ";

        for (let i = 0; i < lowConvexHull.length; i++) {
            messageConvexHullList += lowConvexHull[i].letter;
            if (i != upperConvexHull.length - 1) {
                messageConvexHullList += ", "
            }
            else {
                messageConvexHullList += ". "
            }
        }
        visualizationStep = {
            explanation: messageConvexHullList,
            graphicDrawingsStepList: [
                {
                    type: "updateConvexHullList",
                    element: upperConvexHull.slice()
                }]
        };
        algorithmGraphicIndications.push(visualizationStep);
    }
}



function executeGrahamScanAlgorithm() {
    algorithmNumberOfPointsInConvexHull = 0;

    var sortedPoints = sortList(pointsOnCanvas, comparatorPointsByXAscending)

    determineLowConvexHull(sortedPoints);
    determineUpperConvexHull(sortedPoints);

    algorithmNumberOfPointsInConvexHull--;
    lowConvexHull.pop();
    let messageConvexHullList = "Acoperirea convexa este formata din punctele: ";
    for (let i = 0; i < lowConvexHull.length; i++) {
        messageConvexHullList += lowConvexHull[i].letter;
        messageConvexHullList += ", "
    }
    for (let i = 0; i < upperConvexHull.length - 1; i++) {
        messageConvexHullList += upperConvexHull[i].letter;
        if (i != upperConvexHull.length - 2) {
            messageConvexHullList += ", "
        }
        else {
            messageConvexHullList += ". "
        }
    }
    var visualizationStep = {
        explanation: messageConvexHullList,
        graphicDrawingsStepList: [
            {
                type: "updateConvexHullList",
                element: lowConvexHull.concat(upperConvexHull)
            },
            {
                type: "updateNumber",
                element: algorithmNumberOfPointsInConvexHull
            }
        ]
    };
    algorithmGraphicIndications.push(visualizationStep);
}



function executeJarvisMarchAlgorithm() {
    algorithmNumberOfPointsInConvexHull = 0;
    var convexHullPoints = [];

    var leftMostPointIndex = getIndexOfFarLeftPoint();
    var currentPointIndex = leftMostPointIndex;
    var currentPoint = pointsOnCanvas[currentPointIndex];
    algorithmNumberOfPointsInConvexHull++;
    convexHullPoints.push(currentPoint);
    var visualizationStep = {
        explanation: "Acoperirea convexa se initializeaza cu cel mai mic punct in ordine lexicografica, punctul " + currentPoint.letter + ". ",
        graphicDrawingsStepList: [
            {
                type: "point",
                element: currentPoint,
                color: GREEN_COLOR,
                size: 8
            },
            {
                type: "updateNumber",
                element: algorithmNumberOfPointsInConvexHull
            }]
    };
    algorithmGraphicIndications.push(visualizationStep);

    var pivotPoint;
    var pivotIndex;
    var valid = true;

    while (valid) {
        do {
            pivotIndex = Math.floor(Math.random() * pointsOnCanvas.length);
        } while (pivotIndex == currentPointIndex);

        pivotPoint = pointsOnCanvas[pivotIndex]
        visualizationStep = {
            explanation: "Se alege arbitrat punctul " + pivotPoint.letter + " drept pivot",
            graphicDrawingsStepList: [
                {
                    type: "line",
                    element: [currentPoint, pivotPoint],
                    color: ORANGE_COLOR,
                },
                {
                    type: "point",
                    element: currentPoint,
                    color: GREEN_COLOR
                },
                {
                    type: "point",
                    element: pivotPoint,
                    color: ORANGE_COLOR,
                    size: 8
                }
            ]
        };
        algorithmGraphicIndications.push(visualizationStep);

        for (let i = 0; i < pointsOnCanvas.length; i++) {
            var testedPoint = pointsOnCanvas[i];
            visualizationStep = {
                explanation: "Punctul " + testedPoint.letter + " este ales pentru a fi comparat",
                graphicDrawingsStepList: [
                    {
                        type: "point",
                        element: testedPoint,
                        color: RED_COLOR,
                        size: 8
                    }
                ]
            };
            algorithmGraphicIndications.push(visualizationStep);

            var orientation = calculateOrientationForNormalPoints(currentPoint, pivotPoint, testedPoint);
            if (orientation == 1) {
                visualizationStep = {
                    explanation: "Punctul " + testedPoint.letter + " se afla la dreapta muchiei " +
                        currentPoint.letter + pivotPoint.letter + ", deci devine noul pivot. ",
                    graphicDrawingsStepList: [
                        {
                            type: "updateConvexHullList",
                            element: convexHullPoints.slice(),
                        },
                        {
                            type: "line",
                            element: [currentPoint, testedPoint],
                            color: ORANGE_COLOR,
                        },
                        {
                            type: "point",
                            element: currentPoint,
                            color: GREEN_COLOR
                        },
                        {
                            type: "point",
                            element: testedPoint,
                            color: ORANGE_COLOR,
                            size: 8
                        }]
                };
                algorithmGraphicIndications.push(visualizationStep);
                pivotPoint = testedPoint;
                pivotIndex = i;
            }
            else {
                visualizationStep = {
                    explanation: "Punctul " + testedPoint.letter + " nu se afla la dreapta muchiei "
                        + currentPoint.letter + pivotPoint.letter + ", deci nu devine noul pivot. ",
                    graphicDrawingsStepList: [
                        {
                            type: "updateConvexHullList",
                            element: convexHullPoints.slice(),
                        },
                        {
                            type: "line",
                            element: [currentPoint, pivotPoint],
                            color: ORANGE_COLOR,
                        },
                        {
                            type: "point",
                            element: currentPoint,
                            color: GREEN_COLOR
                        },
                        {
                            type: "point",
                            element: pivotPoint,
                            color: ORANGE_COLOR,
                            size: 8
                        }
                    ]
                };
                algorithmGraphicIndications.push(visualizationStep);
            }
        }

        
        if (convexHullPoints[0].x == pivotPoint.x && convexHullPoints[0].y == pivotPoint.y) {
            valid = false;
        }
        else {
            convexHullPoints.push(pivotPoint);
            algorithmNumberOfPointsInConvexHull++;
            currentPoint = pivotPoint;
            currentPointIndex = pivotIndex;
            visualizationStep = {
                explanation: "Punctul " + pivotPoint.letter + " se adauga in acoperirea convexa. ",
                graphicDrawingsStepList: [
                    {
                        type: "updateConvexHullList",
                        element: convexHullPoints.slice(),
                    },
                    {
                        type: "updateNumber",
                        element: algorithmNumberOfPointsInConvexHull
                    }
                ]
            };
            algorithmGraphicIndications.push(visualizationStep);
        }
    };

    let messageConvexHullList = "Acoperirea convexa este formata din punctele: ";
    for (let i = 0; i < convexHullPoints.length; i++) {
        messageConvexHullList += convexHullPoints[i].letter;
        if (i != convexHullPoints.length - 1) {
            messageConvexHullList += ", "
        }
        else {
            messageConvexHullList += ". "
        }
    }
    convexHullPoints.push(convexHullPoints[0])
    var visualizationStep = {
        explanation: messageConvexHullList,
        graphicDrawingsStepList: [
            {
                type: "updateConvexHullList",
                element: convexHullPoints.slice(),
            }]
    };
    algorithmGraphicIndications.push(visualizationStep);
};