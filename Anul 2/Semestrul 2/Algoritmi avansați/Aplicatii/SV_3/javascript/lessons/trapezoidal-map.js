window.onload = function () {
    addScrollToVisualSupportFunctionality();
    initValues();
    initButtonsAndAddEventListeners();
    initCanvas();
}

window.onresize = function () {
    if (!algorithmIsRunning) {
        moveXValue = 0
        moveYValue = 0
        setCanvas();
        updateCanvasAfterMove();
    }
}

function initValues() {
    maxWidthResponsive = 900;
    lastPointLetter = ""
    trapezoidCount = 0;
    isDrawing = false
    firstDrawnPoint = null;
    simulateClickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: false
    });
    algorithmIsRunning = false;
    algorithmIsDone = false;
    moveXValue = 0
    moveYValue = 0

    // pentru desenare
    algorithmGraphicIndications = []
    animationStepIndex = 0

    // datele initiale -> segmentele desenate
    initialSegments = []
    initialPoints = [];

    // punctele = capetele segmentelor care sunt adaugate in timpul algoritmului
    // pentru a redesena segmentele de pana acum si extensiile lor 
    // sunt folosite de drawCurrentStateOfMap()
    endpointsOfExistingSegments = [];
    algorithmDrawPoints = [];
    algorithmDrawSegments = [];

    lastTrapezoids = null;
    childNodesPositions = []
    rootNode = null

    userPointTrapezoid = undefined
    userPointTrapezoidClick = undefined
}

function initCanvas() {
    trapezoidalMapCanvas = document.getElementById("trapezoidalMapCanvas")
    canvasContext = trapezoidalMapCanvas.getContext("2d")
    setCanvas();
    trapezoidalMapCanvas.addEventListener("mousedown", drawEdgeOnCanvas);
    moveCanvasFunctions();
}


function moveCanvasFunctions() {
    moveCanvasUp = document.getElementById("up")
    moveCanvasUp.addEventListener("click", function () {
        if (-800 < moveYValue + 40 && moveYValue + 40 < 800) {
            moveYValue += 40;
            updateCanvasAfterMove();
        }
    })
    moveCanvasDown = document.getElementById("down")
    moveCanvasDown.addEventListener("click", function () {
        if (-800 < moveYValue - 40 && moveYValue - 40 < 800) {
            moveYValue -= 40;
            updateCanvasAfterMove();
        }
    })
    moveCanvasLeft = document.getElementById("left")
    moveCanvasLeft.addEventListener("click", function () {
        if (-800 < moveXValue + 40 && moveXValue + 40 < 800) {
            moveXValue += 40;
            updateCanvasAfterMove();
        }
    })
    moveCanvasRight = document.getElementById("right")
    moveCanvasRight.addEventListener("click", function () {
        if (-800 < moveXValue - 40 && moveXValue - 40 < 800) {
            moveXValue -= 40;
            updateCanvasAfterMove();
        }
    })


    moveCanvasUp.disabled = false;
    moveCanvasDown.disabled = false;
    moveCanvasLeft.disabled = false;
    moveCanvasRight.disabled = false;
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

function setCanvas() {
    var canvasHeight = window.innerHeight / 1.3;
    trapezoidalMapCanvas.height = canvasHeight

    var windowsWidth = window.innerWidth;
    var canvasWidth;
    if (windowsWidth <= maxWidthResponsive) {
        canvasWidth = windowsWidth - 100;
    }
    else {
        canvasWidth = windowsWidth * 0.5;
    }
    trapezoidalMapCanvas.width = canvasWidth;
    canvasContext.resetTransform();
    canvasContext.translate(canvasWidth / 2, canvasHeight / 2);
}



function initButtonsAndAddEventListeners() {
    showGridButton = document.getElementById("showGrid");
    showGridButton.addEventListener("click", showGrid);
    startAutorunAlgorithm = document.getElementById("autorun")
    startStepByStepAlgorithm = document.getElementById("stepByStep")
    resetButton = document.getElementById("reset")
    startAutorunAlgorithm.addEventListener("click", startVisualizationOnAutorun);
    startStepByStepAlgorithm.addEventListener("click", startVisualizationOnSteptByStep);
    resetButton.addEventListener("click", reset);
    showGridButton.disabled = false;
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


function reset() {
    clearCanvas()
    initValues();

    document.getElementById("steps").innerHTML = "";
    document.getElementById("graphContainer").innerHTML = "";

    trapezoidalMapCanvas.removeEventListener("click", searchUserPointInTrapezoidalMap);
    trapezoidalMapCanvas.removeEventListener("mousemove", drawLineOnMouseOver);
    trapezoidalMapCanvas.addEventListener("mousedown", drawEdgeOnCanvas);

    startStepByStepAlgorithm.disabled = false
    startStepByStepAlgorithm.innerHTML = "PAS CU PAS"
    startAutorunAlgorithm.disabled = false
    startAutorunAlgorithm.innerHTML = "AUTOMAT"
    startStepByStepAlgorithm.removeEventListener("click", startAnimationForStep);

    startAutorunAlgorithm.addEventListener("click", startVisualizationOnAutorun);
    startStepByStepAlgorithm.addEventListener("click", startVisualizationOnSteptByStep);
}


function startVisualizationOnAutorun() {
    startAlgorithmVisualization("autorun")
}

function startVisualizationOnSteptByStep() {
    startAlgorithmVisualization("stepByStep")
}

function startAlgorithmVisualization(startType) {
    algorithmIsRunning = true;

    startAutorunAlgorithm.disabled = true;
    moveCanvasUp.disabled = true;
    moveCanvasDown.disabled = true;
    moveCanvasLeft.disabled = true;
    moveCanvasRight.disabled = true;
    showGridButton.disabled = true;
    trapezoidalMapCanvas.removeEventListener("mousedown", drawEdgeOnCanvas);
    getTrapezoidalMap();

    if (startType == "autorun") {
        startStepByStepAlgorithm.disabled = true;
        startAutorunAlgorithm.removeEventListener("click", startVisualizationOnAutorun);
        startAutorunAlgorithm.innerHTML = "ANIMATIA ALGORITMULUI E IN EXECUTIE";
        clearCanvas()
        let speed = (101 - document.getElementById("speed").value) * 25;
        startAnimationOnAutorun(speed)
    }
    if (startType == "stepByStep") {
        startStepByStepAlgorithm.innerText = "EXECUTA PASUL URMATOR";
        startStepByStepAlgorithm.removeEventListener("click", startVisualizationOnSteptByStep);
        clearCanvas()
        startStepByStepAlgorithm.addEventListener("click", startAnimationForStep);
        startAnimationForStep()
    }
}


function startAnimationOnAutorun(speed) {
    algorithmRunningInterval = setInterval(startAnimationForStep, speed);
}

function finishAnimation() {
    if (startStepByStepAlgorithm.disabled) {
        clearInterval(algorithmRunningInterval);
    }
    startStepByStepAlgorithm.innerHTML = "ALGORITM FINALIZAT";
    startAutorunAlgorithm.innerHTML = "ALGORITM FINALIZAT"
    trapezoidalMapCanvas.addEventListener("click", searchUserPointInTrapezoidalMap);
    algorithmIsRunning = false;
    algorithmIsDone = true;
    moveCanvasUp.disabled = false;
    moveCanvasDown.disabled = false;
    moveCanvasLeft.disabled = false;
    moveCanvasRight.disabled = false;
    document.getElementById("showGrid").disabled = false;
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
    if (typeof explanation != "undefined") {
        let newStepLi = document.createElement("li");
        newStepLi.innerHTML = explanation;
        document.getElementById("steps").appendChild(newStepLi);
    }
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


function drawAnimationForIntermediateStep(subStep) {
    var stepType = subStep.type;
    var stepElement = subStep.element;
    var stepColor = subStep.color !== undefined ? subStep.color : "black";
    var stepSize = subStep.size !== undefined ? subStep.size : POINT_RADIUS;
    var stepStyle = subStep.style;
    var stepIndicator = subStep.withIndicator;

    if (stepType == "point") {
        var element = getPointCoordinatesOnTranslatedCanvas(stepElement);
        drawNewPoint(canvasContext, element, stepColor, stepSize);
        if (stepIndicator) {
            drawElementIndicator(canvasContext, element.x - 15, element.y - 5, stepElement.letter)
        }
    }
    if (stepType == "line") {
        let firstPoint = getPointCoordinatesOnTranslatedCanvas(stepElement[0])
        let secondPoint = getPointCoordinatesOnTranslatedCanvas(stepElement[1])
        drawNewLine(canvasContext, firstPoint, secondPoint, stepColor);
    }
    if (stepType == "trapezoid") {
        drawTrapezoid(canvasContext, stepElement, 2 * CANVAS_COORDINATE_MAX_VALUE, stepColor, stepStyle);
    }
    if (stepType == "extension") {
        drawExtension(stepElement, stepColor);
    }
    if (stepType == "drawCurrentStateOfMap") {
        algorithmDrawPoints = stepElement.points
        algorithmDrawSegments = stepElement.segments
        clearCanvas()
        drawCurrentStateOfMap(stepElement.trapezoids);
    }
    if (stepType == "graph") {
        let svgWidth = window.innerWidth / 2.4 - 50;
        if (window.innerWidth <= 1200) {
            svgWidth = window.innerWidth - 180;
        }
        drawGraph(stepElement, svgWidth);
    }
}

function drawExtension(normalPoint, color = "black") {
    // Se calculeaza intersectia cu limita inferioara si cea superioara a punctului
    let verticalLineFromPoint = new Segment(new Point(normalPoint.x, -POINT_COORDINATE_MAX_VALUE),
        new Point(normalPoint.x, POINT_COORDINATE_MAX_VALUE))
    if (normalPoint.extensionTop != null && normalPoint.extensionBottom != null) {
        let upperPointStop = getLinesIntersection(verticalLineFromPoint, normalPoint.extensionTop).point;
        let bottomPointStop = getLinesIntersection(verticalLineFromPoint, normalPoint.extensionBottom).point;
        let firstPoint = getPointCoordinatesOnTranslatedCanvas(upperPointStop)
        let secondPoint = getPointCoordinatesOnTranslatedCanvas(bottomPointStop);
        drawNewLine(canvasContext, firstPoint, secondPoint, color, [], 4);
    }
}



function drawCurrentStateOfMap(trapezoidsOnCanvas) {
    for (let i = 0; i < algorithmDrawPoints.length; i++) {
        var point = algorithmDrawPoints[i];
        let pointOnCanvas = getPointCoordinatesOnTranslatedCanvas(point)
        drawNewPoint(canvasContext, pointOnCanvas);
        drawElementIndicator(canvasContext, pointOnCanvas.x - 15, pointOnCanvas.y - 5, point.letter);
        drawExtension(point);
    }

    for (let i = 0; i < algorithmDrawSegments.length; i++) {
        let leftSegmentPoint = algorithmDrawSegments[i].leftSegmentPoint;
        let rightSegmentPoint = algorithmDrawSegments[i].rightSegmentPoint;
        let firstPoint = getPointCoordinatesOnTranslatedCanvas(leftSegmentPoint)
        let secondPoint = getPointCoordinatesOnTranslatedCanvas(rightSegmentPoint)
        drawNewLine(canvasContext, firstPoint, secondPoint);
    }

    if (typeof (trapezoidsOnCanvas) != "undefined") {
        lastTrapezoids = trapezoidsOnCanvas;
        lastTrapezoids.forEach(function (trapezoid) {
            var trapezoidCorners = getTrapezoidCorners(trapezoid, trapezoidalMapCanvas.height);
            var downLeftCorner = trapezoidCorners.downLeftCorner;
            var downRightCorner = trapezoidCorners.downRightCorner;
            var upLeftCorner = trapezoidCorners.upLeftCorner;
            var upRightCorner = trapezoidCorners.upRightCorner;
            drawTrapezoidIndicator(canvasContext, getPointCoordinatesOnTranslatedCanvas(downLeftCorner),
                getPointCoordinatesOnTranslatedCanvas(downRightCorner),
                getPointCoordinatesOnTranslatedCanvas(upLeftCorner),
                getPointCoordinatesOnTranslatedCanvas(upRightCorner), trapezoid.number);
        })
    }

    if (typeof (userPointTrapezoid) != "undefined") {
        drawTrapezoid(canvasContext, userPointTrapezoid, 2 * CANVAS_COORDINATE_MAX_VALUE, "rgba(82, 171, 152, 0.5)", "fill");
        drawNewPoint(canvasContext, getPointCoordinatesOnTranslatedCanvas(userPointTrapezoidClick));
    }
}


function drawLineOnMouseOver(event) {
    var mousePosition = getMousePositionOnCanvas(event, trapezoidalMapCanvas, canvasContext)
    updateCanvasAfterMove();
    drawNewLine(canvasContext, getPointCoordinatesOnTranslatedCanvas(firstDrawnPoint), mousePosition);
}


function drawEdgeOnCanvas(event) {
    var mousePosition = getMousePositionOnCanvas(event, trapezoidalMapCanvas, canvasContext)
    var pointOnCanvas = getPointInProximity(mousePosition);
    var normalPointFromCanvas = getStandardPointFromTranslatedCanvas(mousePosition)

    if (isDrawing) {
        var newSegment;
        if (pointOnCanvas == null) {
            newSegment = {
                leftSegmentPoint: firstDrawnPoint,
                rightSegmentPoint: normalPointFromCanvas
            }
        } else {
            newSegment = {
                leftSegmentPoint: firstDrawnPoint,
                rightSegmentPoint: pointOnCanvas
            }
        }

        var newSegmentIntersect = checkNewSegmentIntersect(newSegment);
        if (getDistanceBetweenPoints(getPointCoordinatesOnTranslatedCanvas(firstDrawnPoint), mousePosition) >= 2 * POINT_RADIUS
            && !newSegmentIntersect) {
            if (pointOnCanvas == null) {
                if (!checkPointsWithSameX(mousePosition)) {
                    trapezoidalMapCanvas.removeEventListener("mousemove", drawLineOnMouseOver);
                    isDrawing = false;

                    lastPointLetter = getNextPointLetter(lastPointLetter);
                    var newPoint = new Point(normalPointFromCanvas.x, normalPointFromCanvas.y, lastPointLetter);
                    initialPoints.push(newPoint);

                    var newSegment = (firstDrawnPoint.x < newPoint.x) ? (new Segment(firstDrawnPoint, newPoint)) : (new Segment(newPoint, firstDrawnPoint));
                    initialSegments.push(newSegment)

                    var pointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(newPoint)
                    drawNewPoint(canvasContext, pointCanvasCoordinates)
                    drawElementIndicator(canvasContext, pointCanvasCoordinates.x - 15, pointCanvasCoordinates.y - 5, lastPointLetter)
                }
            }
            else {
                var newSegment;
                if (firstDrawnPoint.x < pointOnCanvas.x) {
                    newSegment = new Segment(firstDrawnPoint, pointOnCanvas)
                }
                else {
                    newSegment = new Segment(pointOnCanvas, firstDrawnPoint)
                }
                let segmentAlreadyExists = checkSegmentExists(newSegment);
                if (!segmentAlreadyExists) {
                    trapezoidalMapCanvas.removeEventListener("mousemove", drawLineOnMouseOver)
                    isDrawing = false;
                    initialSegments.push(newSegment);
                }
            }
        }
    }
    else {
        if (pointOnCanvas == null) {
            if (!checkPointsWithSameX(normalPointFromCanvas)) {
                trapezoidalMapCanvas.addEventListener("mousemove", drawLineOnMouseOver);
                isDrawing = true;

                lastPointLetter = getNextPointLetter(lastPointLetter)
                firstDrawnPoint = new Point(normalPointFromCanvas.x, normalPointFromCanvas.y, lastPointLetter)
                initialPoints.push(firstDrawnPoint);
                var pointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(firstDrawnPoint)
                drawNewPoint(canvasContext, pointCanvasCoordinates)
                drawElementIndicator(canvasContext, pointCanvasCoordinates.x - 15, pointCanvasCoordinates.y - 5, lastPointLetter)
            }
        }
        else {
            trapezoidalMapCanvas.addEventListener("mousemove", drawLineOnMouseOver);
            isDrawing = true;
            firstDrawnPoint = pointOnCanvas;
        }
    }
}



function checkNewSegmentIntersect(newSegment) {
    for (let s = 0; s < initialSegments.length; s++) {
        var segment = initialSegments[s];
        var intersection = getLinesIntersection(segment, newSegment);
        var intersectionPoint = intersection.point;
        var status = intersection.status;
        if (status == "coincid") {
            return true;
        }
        if (intersectionPoint != null) {
            if (checkIfSegmentIncludesPoint(segment, intersectionPoint) &&
                checkIfSegmentIncludesPoint(newSegment, intersectionPoint)) {
                let isSegmentsEndpoint = (checkSamePoint(intersectionPoint, segment.leftSegmentPoint) && checkSamePoint(intersectionPoint, newSegment.leftSegmentPoint))
                    || (checkSamePoint(intersectionPoint, segment.leftSegmentPoint) && checkSamePoint(intersectionPoint, newSegment.rightSegmentPoint))
                    || (checkSamePoint(intersectionPoint, segment.rightSegmentPoint) && checkSamePoint(intersectionPoint, newSegment.leftSegmentPoint))
                    || (checkSamePoint(intersectionPoint, segment.rightSegmentPoint) && checkSamePoint(intersectionPoint, newSegment.rightSegmentPoint));
                if (!isSegmentsEndpoint) {
                    return true;
                }
            }
        }
    }
    return false;
}


function checkPointsWithSameX(newPoint) {
    for (let p = 0; p < initialPoints.length; p++) {
        let point = initialPoints[p];
        if (point.x == newPoint.x)
            return true;
    }
    return false;
}

function getPointInProximity(newPoint) {
    for (let p = 0; p < initialPoints.length; p++) {
        let point = initialPoints[p];
        let distance = getDistanceBetweenPoints(getPointCoordinatesOnTranslatedCanvas(point), newPoint)
        if (distance < 2 * POINT_RADIUS)
            return point;
    }
    return null;
}

function removeCartesianSystemLines() {
    clearCanvas()
    redrawCanvasElements()
}


function checkSegmentExists(newSegment) {
    for (let s = 0; s < initialSegments.length; s++) {
        var segment = initialSegments[s];
        if ((segment.leftSegmentPoint.x == newSegment.leftSegmentPoint.x && segment.leftSegmentPoint.y == newSegment.leftSegmentPoint.y)
            && (segment.rightSegmentPoint.x == newSegment.rightSegmentPoint.x && segment.rightSegmentPoint.y == newSegment.rightSegmentPoint.y))
            return true
    }
    return false
}

function clearCanvas() {
    canvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE,
        CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
}

function updateCanvasAfterMove() {
    clearCanvas();
    let isGridActive = document.getElementById("showGridIcon").classList.contains("fa-eye-slash");
    if (isGridActive) {
        drawCartesianSystemLines(canvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
            -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
            NUMERIC_UNIT_PIXEL_SIZE, moveXValue, moveYValue, false)
    }
    redrawCanvasElements()
}

function redrawCanvasElements() {
    if (!algorithmIsDone && !algorithmIsRunning) {
        redrawInitialValues();
    } else {
        drawCurrentStateOfMap(lastTrapezoids);
    }
}

function redrawInitialValues() {
    // punctele si segmentele desenate la inceput de utilizator
    for (let i = 0; i < initialPoints.length; i++) {
        var point = initialPoints[i];
        let canvasPoint = getPointCoordinatesOnTranslatedCanvas(point);
        drawNewPoint(canvasContext, canvasPoint);
        drawElementIndicator(canvasContext, canvasPoint.x - 15, canvasPoint.y - 5, point.letter);
        drawExtension(point);
    }

    for (let i = 0; i < initialSegments.length; i++) {
        let leftSegmentPoint = initialSegments[i].leftSegmentPoint;
        let rightSegmentPoint = initialSegments[i].rightSegmentPoint;
        let firstPoint = getPointCoordinatesOnTranslatedCanvas(leftSegmentPoint)
        let secondPoint = getPointCoordinatesOnTranslatedCanvas(rightSegmentPoint)
        drawNewLine(canvasContext, firstPoint, secondPoint);
    }
}

// ALGORITM
function permuteSegments() {
    let numberOfSegments = initialSegments.length;
    for (let i = 0; i < numberOfSegments; i++) {
        let randomIndex = parseInt(Math.floor(Math.random() * numberOfSegments))
        let aux = initialSegments[i];
        initialSegments[i] = initialSegments[randomIndex];
        initialSegments[randomIndex] = aux;
    }
}

function setBoundingBox() {
    var upLeftCorner = new Point(-POINT_COORDINATE_MAX_VALUE, POINT_COORDINATE_MAX_VALUE);
    var upRightCorner = new Point(POINT_COORDINATE_MAX_VALUE, POINT_COORDINATE_MAX_VALUE)
    var downLeftCorner = new Point(-POINT_COORDINATE_MAX_VALUE, -POINT_COORDINATE_MAX_VALUE)
    var downRightCorner = new Point(POINT_COORDINATE_MAX_VALUE, -POINT_COORDINATE_MAX_VALUE)

    var topEdge = new Segment(upLeftCorner, upRightCorner)
    var bottomEdge = new Segment(downLeftCorner, downRightCorner)

    downLeftCorner.extensionBottom = bottomEdge;
    downLeftCorner.extensionTop = topEdge;
    downRightCorner.extensionBottom = bottomEdge;
    downRightCorner.extensionTop = topEdge;

    var initialTrapezoid = new Trapezoid(topEdge, bottomEdge, downLeftCorner, downRightCorner);
    rootNode = new Node("trapezoid", initialTrapezoid);
    initialTrapezoid.correspondingLeaf = rootNode;

    let step = {
        explanation: "Se determina dreptunghiul initial.",
        graphicDrawingsStepList: [
            {
                type: "graph",
                element: getTreeDataJson(rootNode),
            }]
    };
    algorithmGraphicIndications.push(step);
}


function createCopyOfPoints() {
    var copyPoints = [];
    for (let p = 0; p < endpointsOfExistingSegments.length; p++) {
        let point = endpointsOfExistingSegments[p];
        let newPoint = new Point(point.x, point.y, point.letter);
        newPoint.extensionTop = new Segment(point.extensionTop.leftSegmentPoint, point.extensionTop.rightSegmentPoint);
        newPoint.extensionBottom = new Segment(point.extensionBottom.leftSegmentPoint, point.extensionBottom.rightSegmentPoint);
        copyPoints.push(newPoint);
    }
    return copyPoints;
}

function checkPointExistsOnCanvas(newPoint) {
    for (let p = 0; p < endpointsOfExistingSegments.length; p++) {
        let pointOnCanvas = endpointsOfExistingSegments[p];
        if (pointOnCanvas.x == newPoint.x && pointOnCanvas.y == newPoint.y) {
            return true;
        }
    }
    return false;
}



function divideHorizontallySameTrapezoid(trapezoid, segment) {
    var leftTrapezoid = new Trapezoid(trapezoid.topEdge, trapezoid.bottomEdge, trapezoid.leftVertex, segment.leftSegmentPoint);
    var upTrapezoid = new Trapezoid(trapezoid.topEdge, segment, segment.leftSegmentPoint, segment.rightSegmentPoint);
    var downTrapezoid = new Trapezoid(segment, trapezoid.bottomEdge, segment.leftSegmentPoint, segment.rightSegmentPoint);
    var rightTrapezoid = new Trapezoid(trapezoid.topEdge, trapezoid.bottomEdge, segment.rightSegmentPoint, trapezoid.rightVertex);

    setNeighbourTrapezoids(leftTrapezoid, trapezoid.downLeftTrapezoid, downTrapezoid, trapezoid.upLeftTrapezoid, upTrapezoid)
    setNeighbourTrapezoids(rightTrapezoid, downTrapezoid, trapezoid.downRightTrapezoid, upTrapezoid, trapezoid.upRightTrapezoid);

    var leftTrapezoidNode = new Node("trapezoid", leftTrapezoid);
    leftTrapezoid.correspondingLeaf = leftTrapezoidNode;
    var upTrapezoidNode = new Node("trapezoid", upTrapezoid);
    upTrapezoid.correspondingLeaf = upTrapezoidNode;
    var downTrapezoidNode = new Node("trapezoid", downTrapezoid);
    downTrapezoid.correspondingLeaf = downTrapezoidNode;
    var rightTrapezoidNode = new Node("trapezoid", rightTrapezoid);
    rightTrapezoid.correspondingLeaf = rightTrapezoidNode;

    var segmentNode = new Node("segment", segment)
    segmentNode.leftNode = upTrapezoidNode
    segmentNode.rightNode = downTrapezoidNode

    var rightEndpointNode = new Node("vertex", segment.rightSegmentPoint)
    rightEndpointNode.leftNode = segmentNode
    rightEndpointNode.rightNode = rightTrapezoidNode


    var leaf = trapezoid.correspondingLeaf;
    leaf.label = "vertex"
    leaf.value = segment.leftSegmentPoint
    leaf.leftNode = leftTrapezoidNode
    leaf.rightNode = rightEndpointNode


    var step = {
        explanation: "Trapezul " + trapezoid.number + " este eliminat si este inlocuit cu trapezele nou aparute: " + leftTrapezoid.number + ", " + upTrapezoid.number + ", " + downTrapezoid.number + ", " + rightTrapezoid.number,
        graphicDrawingsStepList: [
            {
                type: "drawCurrentStateOfMap",
                element: {
                    points: createCopyOfPoints(),
                    segments: algorithmSegments.slice()
                }
            },
            {
                type: "trapezoid",
                element: leftTrapezoid,
                color: "rgba(82, 171, 152, 0.4)",
                style: "fill"
            },
            {
                type: "trapezoid",
                element: upTrapezoid,
                color: "rgba(82, 171, 152, 0.4)",
                style: "fill"
            },
            {
                type: "trapezoid",
                element: downTrapezoid,
                color: "rgba(82, 171, 152, 0.4)",
                style: "fill"
            },
            {
                type: "trapezoid",
                element: rightTrapezoid,
                color: "rgba(82, 171, 152, 0.4)",
                style: "fill"
            }]
    }
    algorithmGraphicIndications.push(step);
}



function divideVerticallyFirstTrapezoid(trapezoid, segment) {
    var leftTrapezoid = new Trapezoid(trapezoid.topEdge, trapezoid.bottomEdge, trapezoid.leftVertex, segment.leftSegmentPoint);
    var temporaryRightTrapezoid = new Trapezoid(trapezoid.topEdge, trapezoid.bottomEdge, segment.leftSegmentPoint, trapezoid.rightVertex)

    setNeighbourTrapezoids(leftTrapezoid, trapezoid.downLeftTrapezoid, null, trapezoid.upLeftTrapezoid, null);
    setNeighbourTrapezoids(temporaryRightTrapezoid, leftTrapezoid, trapezoid.downRightTrapezoid, leftTrapezoid, trapezoid.upRightTrapezoid);

    var leftTrapezoidNode = new Node("trapezoid", leftTrapezoid);
    leftTrapezoid.correspondingLeaf = leftTrapezoidNode;
    var temporaryRightTrapezoidNode = new Node("trapezoid", temporaryRightTrapezoid);
    temporaryRightTrapezoid.correspondingLeaf = temporaryRightTrapezoidNode;

    var leaf = trapezoid.correspondingLeaf;
    leaf.label = "vertex"
    leaf.value = segment.leftSegmentPoint
    leaf.leftNode = leftTrapezoidNode
    leaf.rightNode = temporaryRightTrapezoidNode

    return { leftTrapezoid: leftTrapezoid, rightTrapezoid: temporaryRightTrapezoid };
}


function divideVerticallyLastTrapezoid(trapezoid, segment) {
    var rightTrapezoid = new Trapezoid(trapezoid.topEdge, trapezoid.bottomEdge, segment.rightSegmentPoint, trapezoid.rightVertex);
    var temporaryLeftTrapezoid = new Trapezoid(trapezoid.topEdge, trapezoid.bottomEdge, trapezoid.leftVertex, segment.rightSegmentPoint)

    setNeighbourTrapezoids(rightTrapezoid, null, trapezoid.downRightTrapezoid, null, trapezoid.upRightTrapezoid);
    setNeighbourTrapezoids(temporaryLeftTrapezoid, trapezoid.downLeftTrapezoid, rightTrapezoid, trapezoid.upLeftTrapezoid, rightTrapezoid);

    var rightTrapezoidNode = new Node("trapezoid", rightTrapezoid);
    rightTrapezoid.correspondingLeaf = rightTrapezoidNode;
    var temporaryLeftTrapezoidNode = new Node("trapezoid", temporaryLeftTrapezoid);
    temporaryLeftTrapezoid.correspondingLeaf = temporaryLeftTrapezoidNode;

    var leaf = trapezoid.correspondingLeaf;
    leaf.label = "vertex"
    leaf.value = segment.rightSegmentPoint
    leaf.leftNode = temporaryLeftTrapezoidNode
    leaf.rightNode = rightTrapezoidNode

    return { leftTrapezoid: temporaryLeftTrapezoid, rightTrapezoid: rightTrapezoid };
}



function getTrapezoidalMap() {
    algorithmSegments = [];
    endpointsOfExistingSegments = [];

    var step;
    setBoundingBox();
    permuteSegments();

    for (let i = 0; i < initialSegments.length; i++) {
        var segment = initialSegments[i];
        algorithmSegments.push({ leftSegmentPoint: segment.leftSegmentPoint, rightSegmentPoint: segment.rightSegmentPoint });
        step = {
            explanation: "Se adauga un segment: " + segment.leftSegmentPoint.letter + segment.rightSegmentPoint.letter,
            graphicDrawingsStepList: [
                {
                    type: "point",
                    element: segment.leftSegmentPoint,
                    color: "black",
                    withIndicator: true
                },
                {
                    type: "point",
                    element: segment.rightSegmentPoint,
                    color: "black",
                    withIndicator: true
                },
                {
                    type: "line",
                    element: [segment.leftSegmentPoint, segment.rightSegmentPoint],
                    color: "black"
                }]
        };
        algorithmGraphicIndications.push(step);


        var intersectedTrapezoids = getIntersectedTrapezoids(segment);
        var message = "Se evidentiaza trapezele care intersecteaza segmentul adaugat: ";
        step = { explanation: "", graphicDrawingsStepList: [] };
        for (let t = 0; t < intersectedTrapezoids.length; t++) {
            let trapezoid = intersectedTrapezoids[t];
            message = message + "T" + "<sub>" + trapezoid.number + "</sub>";
            if (t != intersectedTrapezoids.length - 1) {
                message += ", ";
            }
            step.graphicDrawingsStepList.push({
                type: "trapezoid",
                element: trapezoid,
                color: "rgba(43, 103, 119, 0.4)",
                style: "fill"
            });
        }
        step.explanation = message;
        algorithmGraphicIndications.push(step);


        var leftEndpointExistsOnCanvas = checkPointExistsOnCanvas(segment.leftSegmentPoint, endpointsOfExistingSegments);
        var rightEndpointExistsOnCanvas = checkPointExistsOnCanvas(segment.rightSegmentPoint, endpointsOfExistingSegments);

        if (intersectedTrapezoids.length == 1 && !leftEndpointExistsOnCanvas && !rightEndpointExistsOnCanvas) {
            // cazul mai simplu: ambele puncte sunt noi si doar un trapez este intersectat
            let trapezoid = intersectedTrapezoids[0];
            extendPoint(segment.leftSegmentPoint, trapezoid.topEdge, trapezoid.bottomEdge);
            extendPoint(segment.rightSegmentPoint, trapezoid.topEdge, trapezoid.bottomEdge);
            endpointsOfExistingSegments.push(segment.leftSegmentPoint);
            endpointsOfExistingSegments.push(segment.rightSegmentPoint);

            divideHorizontallySameTrapezoid(trapezoid, segment);
        } else {
            var newTrapezoidsDrawingStep = [];
            var messageFinal = "Trapezele intersectate sunt eliminate sunt inlocuite cu noile trapeze "

            // daca leftSegmentPoint este punct nou -> divideVerticallyFirstTrapezoid
            if (!leftEndpointExistsOnCanvas) {
                let trapezoid = intersectedTrapezoids[0];
                extendPoint(segment.leftSegmentPoint, trapezoid.topEdge, trapezoid.bottomEdge);
                endpointsOfExistingSegments.push(segment.leftSegmentPoint);

                var newTrapezoids = divideVerticallyFirstTrapezoid(trapezoid, segment);
                intersectedTrapezoids[0] = newTrapezoids.rightTrapezoid;

                messageFinal = messageFinal + newTrapezoids.leftTrapezoid.number + ", ";
                let drawingStep = {
                    type: "trapezoid",
                    element: newTrapezoids.leftTrapezoid,
                    color: "rgba(82, 171, 152, 0.4)",
                    style: "fill"
                };
                newTrapezoidsDrawingStep.push(drawingStep);
            }

            // daca rightSegmentPoint este punct nou -> divideVerticallyLastTrapezoid
            if (!rightEndpointExistsOnCanvas) {
                let trapezoid = intersectedTrapezoids[intersectedTrapezoids.length - 1];
                extendPoint(segment.rightSegmentPoint, trapezoid.topEdge, trapezoid.bottomEdge);
                endpointsOfExistingSegments.push(segment.rightSegmentPoint);

                var newTrapezoids = divideVerticallyLastTrapezoid(trapezoid, segment);
                intersectedTrapezoids[intersectedTrapezoids.length - 1] = newTrapezoids.leftTrapezoid;

                messageFinal = messageFinal + newTrapezoids.rightTrapezoid.number + ", ";
                let drawingStep = {
                    type: "trapezoid",
                    element: newTrapezoids.rightTrapezoid,
                    color: "rgba(82, 171, 152, 0.4)",
                    style: "fill"
                };
                newTrapezoidsDrawingStep.push(drawingStep);
            }


            var upTrapezoidsNodes = [];
            var downTrapezoidsNodes = [];
            var positionOfLastTrapezoidNode = "";
            var lastUpTrapezoid = intersectedTrapezoids[0].upLeftTrapezoid;
            var lastDownTrapezoid = intersectedTrapezoids[0].downLeftTrapezoid;

            for (let t = 0; t < intersectedTrapezoids.length; t++) {
                let trapezoid = intersectedTrapezoids[t];
                let trapezoidRightVertex = trapezoid.rightVertex;

                let orientation = calculateOrientationForNormalPoints(segment.leftSegmentPoint, segment.rightSegmentPoint, trapezoid.rightVertex);
                // orientation == 1 -> rightVertex este la dreapta segmentului
                // orientation == 2 -> rightVertex este la stanga segmentului

                if (orientation == 2 || t == intersectedTrapezoids.length - 1) {
                    // actualizare extensie inferioara pentru rightVertex daca nu e ultimul trapez
                    if (orientation == 2) {
                        updatePointExtension(trapezoidRightVertex, trapezoidRightVertex.extensionTop, segment);
                    }

                    // trebuie facut un trapez in partea de sus
                    let leftVertex = (upTrapezoidsNodes.length > 0) ? upTrapezoidsNodes[upTrapezoidsNodes.length - 1].value.rightVertex : segment.leftSegmentPoint;
                    let upTrapezoid = new Trapezoid(trapezoid.topEdge, segment, leftVertex, trapezoidRightVertex);

                    // actualizez vecini
                    let downLeftNeighbour = (upTrapezoidsNodes.length > 0) ? upTrapezoidsNodes[upTrapezoidsNodes.length - 1].value : null;
                    var upLeftNeighbour = trapezoid.upLeftTrapezoid;
                    if (positionOfLastTrapezoidNode != "up") {
                        upLeftNeighbour = lastUpTrapezoid;
                        lastDownTrapezoid = trapezoid.downLeftTrapezoid;
                        positionOfLastTrapezoidNode = "up";
                    }
                    setNeighbourTrapezoids(upTrapezoid, downLeftNeighbour, null, upLeftNeighbour, trapezoid.upRightTrapezoid);

                    // formez nod in graf
                    let upTrapezoidGraphNode = new Node("trapezoid", upTrapezoid);
                    upTrapezoid.correspondingLeaf = upTrapezoidGraphNode;
                    upTrapezoidsNodes.push(upTrapezoidGraphNode)

                    // adaugare indicatie de desenare
                    let drawingStep = {
                        type: "trapezoid",
                        element: upTrapezoid,
                        color: "rgba(82, 171, 152, 0.4)",
                        style: "fill"
                    };
                    newTrapezoidsDrawingStep.push(drawingStep);
                    messageFinal = messageFinal + upTrapezoid.number + ", ";
                }

                if (orientation == 1 || t == intersectedTrapezoids.length - 1) {
                    // actualizare extensie superioara pentru rightVertex daca nu e ultimul trapez
                    if (orientation == 1) {
                        updatePointExtension(trapezoidRightVertex, segment, trapezoidRightVertex.extensionBottom);
                    }
                    // trebuie facut un trapez in partea de jos
                    let leftVertex = (downTrapezoidsNodes.length > 0) ? downTrapezoidsNodes[downTrapezoidsNodes.length - 1].value.rightVertex : segment.leftSegmentPoint;
                    let downTrapezoid = new Trapezoid(segment, trapezoid.bottomEdge, leftVertex, trapezoidRightVertex);

                    // actualizez vecini
                    let upLeftNeighbour = (downTrapezoidsNodes.length > 0) ? downTrapezoidsNodes[downTrapezoidsNodes.length - 1].value : null;
                    var downLeftNeighbour = trapezoid.downLeftTrapezoid;
                    if (positionOfLastTrapezoidNode != "down") {
                        downLeftNeighbour = lastDownTrapezoid;
                        lastUpTrapezoid = trapezoid.upLeftTrapezoid;
                        positionOfLastTrapezoidNode = "down";
                    }
                    setNeighbourTrapezoids(downTrapezoid, downLeftNeighbour, trapezoid.downRightTrapezoid, upLeftNeighbour, null);

                    // formez nod in graf
                    let downTrapezoidGraphNode = new Node("trapezoid", downTrapezoid);
                    downTrapezoid.correspondingLeaf = downTrapezoidGraphNode;
                    downTrapezoidsNodes.push(downTrapezoidGraphNode)

                    // adaugare indicatie de desenare
                    let drawingStep = {
                        type: "trapezoid",
                        element: downTrapezoid,
                        color: "rgba(82, 171, 152, 0.4)",
                        style: "fill"
                    };
                    newTrapezoidsDrawingStep.push(drawingStep);
                    messageFinal = messageFinal + downTrapezoid.number + ", ";
                }
            }


            // actualizeaza structura de cautare
            var upTrapezoidsNodesIndex = 0;
            var downTrapezoidsNodesIndex = 0;

            for (let t = 0; t < intersectedTrapezoids.length; t++) {
                let trapezoid = intersectedTrapezoids[t];

                var leaf = trapezoid.correspondingLeaf;
                leaf.label = "segment"
                leaf.value = segment
                leaf.leftNode = upTrapezoidsNodes[upTrapezoidsNodesIndex];
                leaf.rightNode = downTrapezoidsNodes[downTrapezoidsNodesIndex];
                let orientation = calculateOrientationForNormalPoints(segment.leftSegmentPoint, segment.rightSegmentPoint, trapezoid.rightVertex);

                if (orientation == 2 || orientation == 0) {
                    upTrapezoidsNodesIndex++;
                }

                if (orientation == 1 || orientation == 0) {
                    downTrapezoidsNodesIndex++;
                }
            }

            step = {
                explanation: messageFinal,
                graphicDrawingsStepList: [
                    {
                        type: "drawCurrentStateOfMap",
                        element: {
                            points: createCopyOfPoints(),
                            segments: algorithmSegments.slice()
                        }
                    }
                ]
            };

            for (let ds = 0; ds < newTrapezoidsDrawingStep.length; ds++) {
                step.graphicDrawingsStepList.push(newTrapezoidsDrawingStep[ds]);
            }
            algorithmGraphicIndications.push(step);
        }

        step = {
            explanation: "Se elimina frunza corespunzatoare din structura de cautare si se creeaza noi frunze.",
            graphicDrawingsStepList: [
                {
                    type: "graph",
                    element: getTreeDataJson(rootNode),
                },
                {
                    type: "drawCurrentStateOfMap",
                    element: {
                        points: createCopyOfPoints(),
                        segments: algorithmSegments.slice(),
                        trapezoids: getAllTrapezoidsFromGraph(rootNode)
                    }
                }]
        };
        algorithmGraphicIndications.push(step);
    }
}




function updatePointExtension(point, top, bottom) {
    point.extensionTop = top;
    point.extensionBottom = bottom;
    let step = {
        explanation: "Se actualizeaza extensia punctului " + point.letter,
        graphicDrawingsStepList: [
            {
                type: "extension",
                element: { ...point },
                color: RED_COLOR
            }]
    };
    algorithmGraphicIndications.push(step);
}


function extendPoint(point, top, bottom) {
    point.extensionTop = top;
    point.extensionBottom = bottom;
    let step = {
        explanation: "Se adauga extensia punctului " + point.letter,
        graphicDrawingsStepList: [
            {
                type: "extension",
                element: { ...point },
                color: "black"
            }]
    };
    algorithmGraphicIndications.push(step);
}


function getIntersectedTrapezoids(segment) {
    var trapezoidOfLeftPointNode;

    var leftSegmentPoint = segment.leftSegmentPoint;
    if (checkPointExistsOnCanvas(leftSegmentPoint)) {
        // in caz ca se face colt in stanga cu un segment deja existente, 
        // din structura de cautare va rezulta un vertex, nu un trapezoid
        let proximityLineToTheRight = new Segment(new Point(leftSegmentPoint.x + 0.2, -POINT_COORDINATE_MAX_VALUE),
            new Point(leftSegmentPoint.x + 0.2, POINT_COORDINATE_MAX_VALUE));
        let intersectionPoint = getLinesIntersection(proximityLineToTheRight, segment).point;
        trapezoidOfLeftPointNode = searchPointInGraph(rootNode, intersectionPoint);
    } else {
        trapezoidOfLeftPointNode = searchPointInGraph(rootNode, leftSegmentPoint);
    }

    var intersectedTrapezoids = [trapezoidOfLeftPointNode.value];
    var currentTrapezoid = intersectedTrapezoids[intersectedTrapezoids.length - 1];
    while (segment.rightSegmentPoint.x > currentTrapezoid.rightVertex.x) {
        let trapezoidRightVertex = currentTrapezoid.rightVertex;
        let orientation = calculateOrientationForNormalPoints(segment.leftSegmentPoint, segment.rightSegmentPoint, trapezoidRightVertex);
        if (orientation == 2) {
            intersectedTrapezoids.push(currentTrapezoid.downRightTrapezoid);
        }
        if (orientation == 1) {
            intersectedTrapezoids.push(currentTrapezoid.upRightTrapezoid);
        }
        currentTrapezoid = intersectedTrapezoids[intersectedTrapezoids.length - 1];
    }
    return intersectedTrapezoids;
}

function searchUserPointInTrapezoidalMap(event) {
    let mousePosition = getMousePositionOnCanvas(event, trapezoidalMapCanvas, canvasContext);
    var normalPointFromCanvas = getStandardPointFromTranslatedCanvas(mousePosition);

    userPointTrapezoidClick = normalPointFromCanvas;
    childNodesPositions = [];
    var region = searchPointInGraph(rootNode, normalPointFromCanvas);
    if (region.label == "trapezoid") {
        userPointTrapezoid = region.value;
        let numberOfNodes = document.getElementsByClassName("node").length;
        document.getElementById("node" + numberOfNodes).parentElement.dispatchEvent(simulateClickEvent);
    }

    clearCanvas()
    drawCurrentStateOfMap(lastTrapezoids);
}


function searchPointInGraph(correspondingLeaf, point) {
    if (correspondingLeaf.label == "trapezoid") {
        return correspondingLeaf;
    }

    if (correspondingLeaf.label == "vertex") {
        if (point.x < correspondingLeaf.value.x) {
            childNodesPositions.push("left");
            return searchPointInGraph(correspondingLeaf.leftNode, point);
        }
        if (point.x > correspondingLeaf.value.x) {
            childNodesPositions.push("right")
            return searchPointInGraph(correspondingLeaf.rightNode, point);
        }
        return correspondingLeaf;
    }

    if (correspondingLeaf.label == "segment") {
        let orientation = calculateOrientationForNormalPoints(correspondingLeaf.value.leftSegmentPoint, correspondingLeaf.value.rightSegmentPoint, point);
        if (orientation == 1) {
            childNodesPositions.push("right");
            return searchPointInGraph(correspondingLeaf.rightNode, point);
        }
        if (orientation == 2) {
            childNodesPositions.push("left");
            return searchPointInGraph(correspondingLeaf.leftNode, point);
        }
        return correspondingLeaf;
    }
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

function getStandardPointFromTranslatedCanvas(canvasPointPosition) {
    var standardPointX = (canvasPointPosition.x - moveXValue) / NUMERIC_UNIT_PIXEL_SIZE;
    var standardPointY = -(canvasPointPosition.y - moveYValue) / NUMERIC_UNIT_PIXEL_SIZE;
    return { x: standardPointX, y: standardPointY }
}
