window.onload = function () {
    addScrollToVisualSupportFunctionality();
    initValues();
    initButtonsAndAddEventListeners();
    initCanvas();
}

window.onresize = function () {
    // Nu poti face resize daca algoritmul ruleaza
    if (!algorithmIsRunning) {
        moveXValue = 0
        moveYValue = 0
        setCanvas(triangulationCanvas, canvasContext);
        updateCanvasAfterMove();
    }
}


function initValues() {
    lastPointLetter = ""
    maxWidthResponsive = 900
    columnPadding = 50
    canvasBorder = 3
    moveXValue = 0
    moveYValue = 0

    algorithmIsRunning = false
    algorithmDone = false
    isDrawing = false
    firstDrawnPoint = null
    additionalPoint = false
    pointsDrawn = false

    fileContent = ""

    pointsInTrigonometricOrder = [] // punctele care sunt retinute deja in sens trigonometric
    adjacencyListOfPointsForEdges = new Map() // punct -> lista puncte conectate; se realizeaza prin trasarea muchiilor pe ecran sau prin campuri
    pointsOnCanvas = [] // doar punctele (nu neaparat in ordine trigonometrica)

    pointsFromFile = false
    onlyPoints = false
    edgesAddedByNumericFields = false
    edgesAddedByDrawing = false

    animationStepIndex = 0
    algorithmGraphicIndications = []
    leftChain = []
    rightChain = []
    triangulationDiagonals = []
}

function initButtonsAndAddEventListeners() {
    showGridButton = document.getElementById("showGrid");
    showGridButton.addEventListener("click", activateGrid);

    checkYMonotoneButton = document.getElementById("checkYMonotone")
    checkXMonotoneButton = document.getElementById("checkXMonotone")
    checkYMonotoneButton.addEventListener("click", function () {
        checkMonotone("y")
    });
    checkXMonotoneButton.addEventListener("click", function () {
        checkMonotone("x")
    });

    addPolygonEdgeButton = document.getElementById("addPolygonEdge");
    addPolygonEdgeButton.addEventListener("click", addPolygonEdgeByNumericFields);

    addPointButton = document.getElementById("addPoint");
    addPointButton.addEventListener("click", addPointOnCanvas);

    uploadPolygonFileButton = document.getElementById("uploadPolygonFile");
    uploadPolygonFileButton.addEventListener("change", getUploadedFile);

    addPolygonFromFileButton = document.getElementById("addPolygonFromFile");
    addPolygonFromFileButton.addEventListener("click", addPolygonFromFile);

    startAutorunAlgorithm = document.getElementById("autorun");
    startStepByStepAlgorithm = document.getElementById("stepByStep");
    startAutorunAlgorithm.addEventListener("click", startVisualizationOnAutorun);
    startStepByStepAlgorithm.addEventListener("click", startVisualizationOnSteptByStep);

    resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", reset);
}

function initCanvas() {
    triangulationCanvas = document.getElementById("triangulationCanvas")
    canvasContext = triangulationCanvas.getContext("2d")
    setCanvas()
    triangulationCanvas.addEventListener("mousedown", drawLinesOnCanvas);
    moveCanvasFunctions()
}

function startVisualizationOnAutorun() {
    startAlgorithmVisualization("autorun")
}

function startVisualizationOnSteptByStep() {
    startAlgorithmVisualization("stepByStep")
}

function startAlgorithmVisualization(startType) {
    var message = document.getElementById("polygonMessage");
    if (checkValidPolygon()) {
        if (!pointsFromFile) {
            getPointsCounterclockwise()
        }
        if (onlyPoints) {
            drawTrigonometricPointsAndEdges();
        }
        if (checkYMonotone()) {
            triangulateYMonotonePolygon();

            checkXMonotoneButton.disabled = true;
            checkYMonotoneButton.disabled = true;
            addPolygonEdgeButton.disabled = true
            addPointButton.disabled = true
            addPolygonFromFileButton.disabled = true
            triangulationCanvas.removeEventListener("mousedown", drawLinesOnCanvas);

            startAutorunAlgorithm.disabled = true;
            algorithmIsRunning = true;
            if (startType == "autorun") {
                startStepByStepAlgorithm.disabled = true;
                startAutorunAlgorithm.removeEventListener("click", startVisualizationOnAutorun);
                startAutorunAlgorithm.innerHTML = "Algoritm in desfasurare ...";
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
        else {
            message.innerHTML = "POLIGONUL NU ESTE Y-MONOTON";
            message.classList.remove("info");
            message.classList.add("error");
        }
    }
    else {
        message.innerHTML = "POLIGONUL NU ESTE VALID"
        message.classList.remove("info");
        message.classList.add("error");
    }
}


function startAnimationOnAutorun(speed) {
    algorithmRunningInterval = setInterval(startAnimationForStep, speed);
}

function finishAnimation() {
    if (startStepByStepAlgorithm.disabled) {
        clearInterval(algorithmRunningInterval);
        startAutorunAlgorithm.innerHTML = "ALGORITM FINALIZAT";
        updateCanvasAfterMove()
        algorithmIsRunning = false;
    }
    else {
        startStepByStepAlgorithm.innerText = "ALGORITM FINALIZAT";
        startStepByStepAlgorithm.disabled = true;
    }
    algorithmDone = true;
}

function addExplanationInList(explanation, stackStatus) {
    var stepMessage = "";
    if (typeof explanation !== 'undefined') {
        stepMessage += explanation;
    }
    if (typeof stackStatus !== 'undefined') {
        stepMessage = stepMessage + "Stiva: ";
        if (stackStatus.length > 0) {
            stepMessage += stackStatus;
        }
        else {
            stepMessage += "-";
        }
    }
    if (stepMessage != "") {
        let newStepLi = document.createElement("li");
        newStepLi.innerHTML = stepMessage;
        document.getElementById("steps").appendChild(newStepLi);
    }
}

function drawAnimationForStep(animationStep) {
    addExplanationInList(animationStep.explanation, animationStep.stackStatus)
    var graphicDrawingsStepList = animationStep.graphicDrawingsStepList;
    if (typeof graphicDrawingsStepList !== "undefined") {
        for (let i = 0; i < graphicDrawingsStepList.length; i++) {
            var subStep = graphicDrawingsStepList[i];
            drawAnimationForIntermediateStep(subStep);
        }
    }
}


function startAnimationForStep() {
    if (animationStepIndex < algorithmGraphicIndications.length) {
        let currentAnimationStep = algorithmGraphicIndications[animationStepIndex];
        drawAnimationForStep(currentAnimationStep);
        animationStepIndex++;
    } else {
        finishAnimation();
    }
}


function drawAnimationForIntermediateStep(subStep) {
    var stepType = subStep.type;
    var stepElement = subStep.element;
    var stepColor = subStep.color !== undefined ? subStep.color : "black";
    var stepSize = subStep.size !== undefined ? subStep.size : POINT_RADIUS;
    var stepStyle = subStep.style;

    if (stepType == "point") {
        var element = getPointCoordinatesOnTranslatedCanvas(stepElement);
        drawNewPoint(canvasContext, element, stepColor, stepSize);
    }
    if (stepType == "line") {
        let lineDash = []
        if (stepStyle == "dash") {
            lineDash = [5, 10]
        }
        let firstPoint = getPointCoordinatesOnTranslatedCanvas(stepElement[0])
        let secondPoint = getPointCoordinatesOnTranslatedCanvas(stepElement[1])
        drawNewLine(canvasContext, firstPoint, secondPoint, stepColor, lineDash);
    }
    if (stepType == "redrawCanvasElements") {
        updateCanvasAfterMove();
    }
    if (stepType == "addDiagonal") {
        triangulationDiagonals.push({ firstPoint: stepElement[0], secondPoint: stepElement[1] });
    }
}


function addPolygonEdgeByNumericFields() {
    addPointButton.disabled = true
    addPolygonFromFileButton.disabled = true
    triangulationCanvas.removeEventListener("mousedown", drawLinesOnCanvas)

    pointsFromFile = false
    onlyPoints = false
    edgesAddedByNumericFields = true
    edgesAddedByDrawing = false

    let firstPointX = Number(document.getElementById("firstPointX").value)
    let firstPointY = Number(document.getElementById("firstPointY").value)
    let secondPointX = Number(document.getElementById("secondPointX").value)
    let secondPointY = Number(document.getElementById("secondPointY").value)
    var pointA = { x: firstPointX, y: firstPointY }
    var pointB = { x: secondPointX, y: secondPointY }
    var pointAExists = getPointOnCanvasWithCoordinates(pointA)
    var pointBExists = getPointOnCanvasWithCoordinates(pointB)

    var newSegment = { leftSegmentPoint: pointA, rightSegmentPoint: pointB }
    var intersect = checkNewSegmentIntersect(newSegment)
    if (!intersect) {
        if (pointAExists && !pointBExists) {
            lastPointLetter = getNextPointLetter(lastPointLetter)
            var pointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(pointB);
            drawNewPoint(canvasContext, pointCanvasCoordinates)
            drawElementIndicator(canvasContext, pointCanvasCoordinates.x - 10, pointCanvasCoordinates.y - 10, lastPointLetter)
            var pointACanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(pointA);
            drawNewLine(canvasContext, pointACanvasCoordinates, pointCanvasCoordinates)
            var newPoint = { x: pointB.x, y: pointB.y, letter: lastPointLetter }
            adjacencyListOfPointsForEdges.get(pointAExists).push(newPoint)
            adjacencyListOfPointsForEdges.set(newPoint, [pointAExists])
        }
        if (!pointAExists && pointBExists) {
            lastPointLetter = getNextPointLetter(lastPointLetter)
            var pointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(pointA)
            drawNewPoint(canvasContext, pointCanvasCoordinates)
            drawElementIndicator(canvasContext, pointCanvasCoordinates.x - 10, pointCanvasCoordinates.y - 10, lastPointLetter)
            drawNewLine(canvasContext, pointCanvasCoordinates, getPointCoordinatesOnTranslatedCanvas(pointB))
            var newPoint = { x: pointA.x, y: pointA.y, letter: lastPointLetter }
            adjacencyListOfPointsForEdges.get(pointBExists).push(newPoint)
            adjacencyListOfPointsForEdges.set(newPoint, [pointBExists])
        }
        if (!pointAExists && !pointBExists) {
            lastPointLetter = getNextPointLetter(lastPointLetter)
            var pointACanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(pointA)
            drawNewPoint(canvasContext, pointACanvasCoordinates)
            drawElementIndicator(canvasContext, pointACanvasCoordinates.x - 10, pointACanvasCoordinates.y - 10, lastPointLetter)
            var newAPoint = { x: pointA.x, y: pointA.y, letter: lastPointLetter }

            lastPointLetter = getNextPointLetter(lastPointLetter)
            var pointBCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(pointB)
            drawNewPoint(canvasContext, pointBCanvasCoordinates)
            drawElementIndicator(canvasContext, pointBCanvasCoordinates.x - 10, pointBCanvasCoordinates.y - 10, lastPointLetter)
            var newBPoint = { x: pointB.x, y: pointB.y, letter: lastPointLetter }

            drawNewLine(canvasContext, pointACanvasCoordinates, pointBCanvasCoordinates)
            adjacencyListOfPointsForEdges.set(newAPoint, [newBPoint])
            adjacencyListOfPointsForEdges.set(newBPoint, [newAPoint])
        }
        if (pointAExists && pointBExists) {
            let edgeAlreadyExists = checkEdgeExistsOnCanvas(pointAExists, pointBExists)
            if (!edgeAlreadyExists) {
                drawNewLine(canvasContext, getPointCoordinatesOnTranslatedCanvas(pointAExists), getPointCoordinatesOnTranslatedCanvas(pointBExists))
                adjacencyListOfPointsForEdges.get(pointAExists).push(pointBExists)
                adjacencyListOfPointsForEdges.get(pointBExists).push(pointAExists)
            }
        }
    }
}


function drawLinesOnCanvas(event) {
    addPointButton.disabled = true
    addPolygonFromFileButton.disabled = true
    addPolygonEdgeButton.disabled = true

    pointsFromFile = false
    onlyPoints = false
    edgesAddedByNumericFields = false
    edgesAddedByDrawing = true

    drawEdgeOnCanvas(event)
}


function drawTrigonometricPointsAndEdges() {
    for (let i = 0; i < pointsInTrigonometricOrder.length; i++) {
        var point = pointsInTrigonometricOrder[i]
        var nextPoint = i == (pointsInTrigonometricOrder.length - 1) ? pointsInTrigonometricOrder[0] : pointsInTrigonometricOrder[i + 1]

        var pointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(point)
        drawNewPoint(canvasContext, pointCanvasCoordinates)
        drawElementIndicator(canvasContext, pointCanvasCoordinates.x - 10, pointCanvasCoordinates.y - 10, point.letter)

        var nextPointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(nextPoint);
        drawNewLine(canvasContext, pointCanvasCoordinates, nextPointCanvasCoordinates)
    }
}


function redrawCanvasElements() {
    for (let i = 0; i < triangulationDiagonals.length; i++) {
        let firstPoint = getPointCoordinatesOnTranslatedCanvas(triangulationDiagonals[i].firstPoint)
        let secondPoint = getPointCoordinatesOnTranslatedCanvas(triangulationDiagonals[i].secondPoint);
        drawNewLine(canvasContext, firstPoint, secondPoint, GREEN_COLOR, [], 5);
    }

    if (algorithmIsRunning || algorithmDone) {
        drawTrigonometricPointsAndEdges()
    }
    else {
        if (onlyPoints) {
            for (let i = 0; i < pointsOnCanvas.length; i++) {
                var point = pointsOnCanvas[i]
                var pointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(point)
                drawNewPoint(canvasContext, pointCanvasCoordinates)
                drawElementIndicator(canvasContext, pointCanvasCoordinates.x - 10, pointCanvasCoordinates.y - 10, point.letter)
            }
        }
        else {
            if (pointsFromFile) {
                drawTrigonometricPointsAndEdges()
            }
            else {
                for (const [point, connectedPoints] of adjacencyListOfPointsForEdges.entries()) {
                    var pointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(point)
                    drawNewPoint(canvasContext, pointCanvasCoordinates)
                    drawElementIndicator(canvasContext, pointCanvasCoordinates.x - 10, pointCanvasCoordinates.y - 10, point.letter)

                    for (let i = 0; i < connectedPoints.length; i++) {
                        var connectedPointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(connectedPoints[i])
                        drawNewLine(canvasContext, pointCanvasCoordinates, connectedPointCanvasCoordinates)
                    }
                }
            }
        }
    }
}


function addPolygonFromFile() {
    // ia punctele din fisier
    // daca e bifat ca sunt deja in ordine trigonometrica, atunci aceastea se adauga in pointsInTrigonometricOrder
    // daca nu, se pun in pointsOnCanvas si se apeleaza functia sa le puna in ordine trigonometrica

    addPolygonEdgeButton.disabled = true
    addPointButton.disabled = true
    triangulationCanvas.removeEventListener("mousedown", drawLinesOnCanvas);
    addPolygonFromFileButton.disabled = true

    pointsFromFile = true
    onlyPoints = false
    edgesAddedByNumericFields = false
    edgesAddedByDrawing = false

    var points = getPointsFromFile(fileContent)

    if (points.length < 3) {
        var message = document.getElementById("polygonMessage")
        message.innerHTML = "DATELE DIN FISIER NU SUNT VALIDE";
        message.classList.remove("info");
        message.classList.add("error");
    } else {
        var trigonometricOrder = document.querySelector('input[name="trigonometricOrder"]:checked').value == "trigonometric";
        if (trigonometricOrder) {
            for (let i = 0; i < points.length; i++) {
                lastPointLetter = getNextPointLetter(lastPointLetter)
                pointsInTrigonometricOrder.push({ x: points[i].x, y: points[i].y, letter: lastPointLetter })
            }
        }
        else {
            for (let i = 0; i < points.length; i++) {
                let pointExists = getPointOnCanvasWithCoordinates(points[i])
                if (!pointExists) {
                    lastPointLetter = getNextPointLetter(lastPointLetter)
                    pointsOnCanvas.push({ x: points[i].x, y: points[i].y, letter: lastPointLetter })
                }
            }
            getPointsCounterclockwise()
        }
        redrawCanvasElements()
    }
}

function addPointOnCanvas() {
    pointsDrawn = false
    triangulationCanvas.removeEventListener("mousedown", drawLinesOnCanvas)
    addPolygonEdgeButton.disabled = true
    addPolygonFromFileButton.disabled = true

    pointsFromFile = false
    onlyPoints = true
    edgesAddedByNumericFields = false
    edgesAddedByDrawing = false

    if (additionalPoint) {
        updateCanvasAfterMove()
    }

    let pointX = Number(document.getElementById("pointX").value)
    let pointY = Number(document.getElementById("pointY").value)
    var point = { x: pointX, y: pointY }
    let pointExists = getPointOnCanvasWithCoordinates(point)
    if (!pointExists) {
        lastPointLetter = getNextPointLetter(lastPointLetter)
        var pointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(point)
        drawNewPoint(canvasContext, pointCanvasCoordinates)
        drawElementIndicator(canvasContext, pointCanvasCoordinates.x - 10, pointCanvasCoordinates.y - 10, lastPointLetter)
        pointsOnCanvas.push({ x: pointX, y: pointY, letter: lastPointLetter })
    }
}

function getPointOnCanvasWithCoordinates(point) {
    if (onlyPoints) {
        for (let i = 0; i < pointsOnCanvas.length; i++) {
            let p = pointsOnCanvas[i]
            if (p.x == point.x && p.y == point.y)
                return p;
        }
    }
    if (edgesAddedByNumericFields || edgesAddedByDrawing) {
        for (let p of adjacencyListOfPointsForEdges.keys()) {
            if (p.x == point.x && p.y == point.y)
                return p;
        }
    }
    return null
}

function checkEdgeExistsOnCanvas(firstPoint, secondPoint) {
    var connectedPoints = getConnectedPoints(firstPoint)
    for (let i = 0; i < connectedPoints.length; i++) {
        if (connectedPoints[i].x == secondPoint.x && connectedPoints[i].y == secondPoint.y)
            return true
    }
    return false
}

function getConnectedPoints(point) {
    for (let [p, connectedPoints] of adjacencyListOfPointsForEdges.entries()) {
        if (p.x == point.x && p.y == point.y)
            return connectedPoints;
    }
    return null;
}

function setConnectedPoints(point, connectedPoints) {
    for (let p of adjacencyListOfPointsForEdges.keys()) {
        if (p.x == point.x && p.y == point.y) {
            adjacencyListOfPointsForEdges.set(p, connectedPoints);
            break;
        }
    }
}


function checkMonotone(montoneType) {
    var message = document.getElementById("polygonMessage")
    if (checkValidPolygon()) {
        if (!pointsFromFile) {
            getPointsCounterclockwise()
        }

        if (onlyPoints) {
            if (!pointsDrawn) {
                drawTrigonometricPointsAndEdges()
                pointsDrawn = true
            }
            additionalPoint = true
        }

        if (montoneType == "y") {
            if (checkYMonotone()) {
                message.innerHTML = "POLIGONUL ESTE Y-MONOTON";
                message.classList.remove("error");
                message.classList.add("info");
            }
            else {
                message.innerHTML = "POLIGONUL NU ESTE Y-MONOTON";
                message.classList.remove("info");
                message.classList.add("error");
            }
        }
        if (montoneType == "x") {
            if (checkXMonotone()) {
                message.innerHTML = "POLIGONUL ESTE X-MONOTON"
                message.classList.remove("error");
                message.classList.add("info");
            }
            else {
                message.innerHTML = "POLIGONUL NU ESTE X-MONOTON";
                message.classList.remove("info");
                message.classList.add("error");
            }
        }
    }
    else {
        message.innerHTML = "POLIGONUL NU ESTE VALID"
        message.classList.remove("info");
        message.classList.add("error");
    }
}


function getPointWithYMin() {
    var pointYMinim;
    for (point of adjacencyListOfPointsForEdges.keys()) {
        if (pointYMinim == undefined || point.y < pointYMinim.y) {
            pointYMinim = point
        }
    }
    return pointYMinim;
}



function getCenterOfPoints() {
    var centerX = 0
    var centerY = 0
    var numberPoints = pointsOnCanvas.length
    for (let i = 0; i < numberPoints; i++) {
        centerX += pointsOnCanvas[i].x
        centerY += pointsOnCanvas[i].y
    }
    centerX = centerX / parseFloat(numberPoints)
    centerY = centerY / parseFloat(numberPoints)
    return { x: centerX, y: centerY }
}


function getAngle(point) {
    var x = point.x - centerOfPoints.x
    var y = point.y - centerOfPoints.y

    var angle = Math.atan2(y, x) * 180 / Math.PI
    if (angle < 0) {
        angle = 360 + angle
    }
    return angle
}

function getPointsCounterclockwise() {
    pointsInTrigonometricOrder = []

    if (onlyPoints || pointsFromFile) {
        var trigonometricOrder = document.querySelector('input[name="trigonometricOrder"]:checked').value == "trigonometric";
        if (trigonometricOrder) {
            for (let i = 0; i < pointsOnCanvas.length; i++) {
                pointsInTrigonometricOrder.push(pointsOnCanvas[i])
            }
        }
        else {
            centerOfPoints = getCenterOfPoints()
            pointsInTrigonometricOrder = sortList(pointsOnCanvas, comparatorPointsByAngleAscending)
        }
    } else {
        var copyPointsWithEdgesOnCanvas = new Map(JSON.parse(JSON.stringify(Array.from(adjacencyListOfPointsForEdges))))

        var pointYMinim = getPointWithYMin()
        var currentPoint = pointYMinim
        pointsInTrigonometricOrder.push(pointYMinim)

        var connectedPointsForPointYMinim = getConnectedPoints(currentPoint)
        var nextPoint = connectedPointsForPointYMinim[1]
        if (connectedPointsForPointYMinim[0].x > connectedPointsForPointYMinim[1].x) {
            nextPoint = connectedPointsForPointYMinim[0]
            setConnectedPoints(currentPoint, [connectedPointsForPointYMinim[1]])
        }
        else {
            setConnectedPoints(currentPoint, [connectedPointsForPointYMinim[0]])
        }

        var connectedPointsForNextPoint = getConnectedPoints(nextPoint)
        var pointLeft = connectedPointsForNextPoint[1]
        if (connectedPointsForNextPoint[1].x == currentPoint.x && connectedPointsForNextPoint[1].y == currentPoint.y) {
            indexOfCurrentPoint = 1
            pointLeft = connectedPointsForNextPoint[0]
        }
        setConnectedPoints(nextPoint, [pointLeft])
        pointsInTrigonometricOrder.push(nextPoint)

        currentPoint = nextPoint
        for (let numberOfSteps = 0; numberOfSteps < adjacencyListOfPointsForEdges.size - 2; numberOfSteps++) {
            nextPoint = getConnectedPoints(currentPoint)[0]
            indexOfCurrentPoint = 0
            connectedPointsForNextPoint = getConnectedPoints(nextPoint)
            pointLeft = connectedPointsForNextPoint[1]
            if (connectedPointsForNextPoint[1].x == currentPoint.x && connectedPointsForNextPoint[1].y == currentPoint.y) {
                indexOfCurrentPoint = 1
                pointLeft = connectedPointsForNextPoint[0]
            }
            setConnectedPoints(nextPoint, [pointLeft])
            pointsInTrigonometricOrder.push(nextPoint)

            currentPoint = nextPoint
        }

        adjacencyListOfPointsForEdges = new Map(JSON.parse(JSON.stringify(Array.from(copyPointsWithEdgesOnCanvas))))
    }
}


function reset() {
    lastPointLetter = ""
    fileContent = ""
    moveXValue = 0
    moveYValue = 0

    algorithmIsRunning = false
    algorithmDone = false
    isDrawing = false
    firstDrawnPoint = null
    additionalPoint = false
    pointsDrawn = false

    pointsInTrigonometricOrder = []
    adjacencyListOfPointsForEdges = new Map()
    pointsOnCanvas = []

    pointsFromFile = false
    onlyPoints = false
    edgesAddedByNumericFields = false
    edgesAddedByDrawing = false

    animationStepIndex = 0
    algorithmGraphicIndications = []
    leftChain = []
    rightChain = []
    triangulationDiagonals = []

    let showGridIcon = document.getElementById("showGridIcon");
    let isGridActive = showGridIcon.classList.contains("fa-eye-slash")
    if (isGridActive) {
        showGridIcon.classList.remove("fa-eye-slash");
        showGridIcon.classList.add("fa-eye");
    }

    let polygonMessage = document.getElementById("polygonMessage");
    polygonMessage.innerHTML = "";
    polygonMessage.classList.remove("info");
    polygonMessage.classList.remove("error");
    document.getElementById("steps").innerHTML = "";

    checkXMonotoneButton.disabled = false;
    checkYMonotoneButton.disabled = false;
    addPolygonEdgeButton.disabled = false
    addPointButton.disabled = false
    addPolygonFromFileButton.disabled = false
    startStepByStepAlgorithm.disabled = false
    startStepByStepAlgorithm.innerHTML = "PAS CU PAS"
    startAutorunAlgorithm.disabled = false
    startAutorunAlgorithm.innerHTML = "AUTOMAT"
    triangulationCanvas.addEventListener("mousedown", drawLinesOnCanvas)

    uploadPolygonFileButton.value = null
    document.getElementById("firstPointX").value = null
    document.getElementById("firstPointY").value = null
    document.getElementById("secondPointX").value = null
    document.getElementById("secondPointY").value = null
    document.getElementById("pointX").value = null
    document.getElementById("pointY").value = null

    updateCanvasAfterMove()

    startAutorunAlgorithm.addEventListener("click", startVisualizationOnAutorun);
    startStepByStepAlgorithm.addEventListener("click", startVisualizationOnSteptByStep);
}

function getUploadedFile() {
    var inputFile = uploadPolygonFileButton.files[0];
    if (inputFile) {
        var fileReader = new FileReader();
        fileReader.readAsText(inputFile, "UTF-8");
        fileReader.addEventListener('load', () => {
            fileContent = fileReader.result;
        });
    }
}

function activateGrid() {
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
        drawCartesianSystemLines(canvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE,
            CANVAS_COORDINATE_MAX_VALUE, NUMERIC_UNIT_PIXEL_SIZE, moveXValue, moveYValue)
        redrawCanvasElements()
    }
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

function setCanvas() {
    var canvasHeight = window.innerHeight / 1.3;
    triangulationCanvas.height = canvasHeight

    var windowsWidth = window.innerWidth;
    var canvasWidth;
    if (windowsWidth <= maxWidthResponsive) {
        canvasWidth = windowsWidth - columnPadding * 2 - canvasBorder * 2;
    }
    else {
        canvasWidth = windowsWidth * 0.65 - columnPadding * 2 - canvasBorder * 2;
    }
    triangulationCanvas.width = canvasWidth;
    canvasContext.resetTransform();
    canvasContext.translate(canvasWidth / 2, canvasHeight / 2)
}

function updateCanvasAfterMove() {
    clearCanvas();
    let isGridActive = document.getElementById("showGridIcon").classList.contains("fa-eye-slash");
    if (isGridActive) {
        drawCartesianSystemLines(canvasContext, -CANVAS_COORDINATE_MAX_VALUE,
            CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE,
            CANVAS_COORDINATE_MAX_VALUE, NUMERIC_UNIT_PIXEL_SIZE, moveXValue, moveYValue)
    }
    redrawCanvasElements()
}

function clearCanvas() {
    canvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE,
        CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
}


function removeCartesianSystemLines() {
    clearCanvas()
    redrawCanvasElements()
}


function checkConnectedComponentUtil(i, visited, adjacencyList) {
    visited[i] = true
    for (let j = 0; j < adjacencyList[i].length; j++) {
        if (!visited[adjacencyList[i][j]])
            checkConnectedComponentUtil(adjacencyList[i][j], visited, adjacencyList);
    }
}

function checkConnectedComponent() {
    var points = []
    var adjacencyList = []
    var visited = []

    var indexCount = 0
    for (let point of adjacencyListOfPointsForEdges.keys()) {
        visited[indexCount] = false
        points.push(point)
        indexCount++
    }

    indexCount = 0
    for (let connectedPoints of adjacencyListOfPointsForEdges.values()) {
        adjacencyList.push([])
        for (let i = 0; i < connectedPoints.length; i++) {
            var indexInPoints = 0
            for (let j = 0; j < points.length; j++) {
                if (points[j].x == connectedPoints[i].x && points[j].y == connectedPoints[i].y) {
                    indexInPoints = j;
                    break;
                }
            }
            adjacencyList[indexCount].push(indexInPoints)
        }
        indexCount++
    }

    var countConnectedComponents = 0
    for (let i = 0; i < points.length; i++) {
        if (!visited[i]) {
            checkConnectedComponentUtil(i, visited, adjacencyList);
            countConnectedComponents++
            if (countConnectedComponents > 1)
                return false
        }
    }
    return true
}


function checkValidPolygon() {
    if (onlyPoints) {
        if (pointsOnCanvas.length < 3)
            return false
        for (let i = 0; i < pointsOnCanvas.length - 2; i++) {
            if (!checkIfPointsAreCollinear(pointsOnCanvas[i], pointsOnCanvas[i + 1], pointsOnCanvas[i + 2])) {
                return true;
            }
        }
        return false;
    }
    if (pointsFromFile) {
        if (pointsInTrigonometricOrder.length < 3)
            return false;
        for (let i = 0; i < pointsInTrigonometricOrder.length - 2; i++) {
            if (!checkIfPointsAreCollinear(pointsInTrigonometricOrder[i], pointsInTrigonometricOrder[i + 1], pointsInTrigonometricOrder[i + 2])) {
                return true;
            }
        };
        return false;
    }
    if (edgesAddedByNumericFields || edgesAddedByDrawing) {
        if (adjacencyListOfPointsForEdges.size < 3) {
            return false
        }
        if (!checkConnectedComponent()) {
            return false
        }
        for ([point, connectedPoints] of adjacencyListOfPointsForEdges.entries()) {
            if (connectedPoints.length != 2) {
                return false
            }
        }
    }
    if (!onlyPoints && !pointsFromFile && !edgesAddedByNumericFields && !edgesAddedByDrawing) {
        return false;
    }
    return true
}


function checkXMonotone() {
    var indexMinPoint = 0
    for (let i = 1; i < pointsInTrigonometricOrder.length; i++) {
        if (pointsInTrigonometricOrder[i].x < pointsInTrigonometricOrder[indexMinPoint].x) {
            indexMinPoint = i
        }
    }

    var ascending = true
    for (let i = 1; i < pointsInTrigonometricOrder.length; i++) {
        var currentIndex = (i + indexMinPoint) % (pointsInTrigonometricOrder.length)
        var previous = currentIndex == 0 ? pointsInTrigonometricOrder.length - 1 : currentIndex - 1

        if (pointsInTrigonometricOrder[previous].x < pointsInTrigonometricOrder[currentIndex].x && ascending == false) {
            return false
        }

        if (pointsInTrigonometricOrder[previous].x > pointsInTrigonometricOrder[currentIndex].x && ascending == true)
            ascending = false
    }
    return true
}


function checkYMonotone() {
    leftChain = []
    rightChain = []

    var indexMinPoint = 0
    for (let i = 1; i < pointsInTrigonometricOrder.length; i++) {
        if (pointsInTrigonometricOrder[i].y < pointsInTrigonometricOrder[indexMinPoint].y) {
            indexMinPoint = i
        }
    }
    rightChain.push(pointsInTrigonometricOrder[indexMinPoint])

    var ascending = true;
    for (let i = 1; i < pointsInTrigonometricOrder.length; i++) {
        var currentIndex = (i + indexMinPoint) % (pointsInTrigonometricOrder.length)
        var previous = currentIndex == 0 ? pointsInTrigonometricOrder.length - 1 : currentIndex - 1
        //daca parcurgerea este in jos/scad, dar punctul curent are coordonata mai mare decat precedentul
        // returnez False deoarece am intalnit deja punctul maxim cand am schimbat directia (nu poate exista altul)
        if (pointsInTrigonometricOrder[previous].y < pointsInTrigonometricOrder[currentIndex].y && ascending == false)
            return false

        // daca urc si intalnesc un punct care are coordonata y < precedentul, inseamna ca schimb directia (parcurgere in jos)
        // nu returnez False deoarece punctele sunt parcurse trigonometric deci poate am dat de punctul maxim
        if (pointsInTrigonometricOrder[previous].y > pointsInTrigonometricOrder[currentIndex].y && ascending == true)
            ascending = false

        if (ascending) {
            rightChain.push(pointsInTrigonometricOrder[currentIndex])
        } else {
            leftChain.push(pointsInTrigonometricOrder[currentIndex])
        }
    }
    return true
}


function triangulateYMonotonePolygon() {
    var numberOfPoints = pointsInTrigonometricOrder.length;
    if (numberOfPoints == 3) {
        var step = { explanation: "Poligonul dat este deja un triunghi." };
        algorithmGraphicIndications.push(step);
    }
    else {
        var sortedPolygonPoints = sortList(pointsInTrigonometricOrder, comparatorPointsByYDescending);
        var message = "Varfurile se ordoneaza descrescător după y (dacă ordinea este egală, se folosește abscisa): ";
        for (let i = 0; i < sortedPolygonPoints.length; i++) {
            if (i > 0)
                message = message + ", ";
            message = message + sortedPolygonPoints[i].letter;
        }
        var step = { explanation: message };
        algorithmGraphicIndications.push(step);


        var pointsStack = [sortedPolygonPoints[0], sortedPolygonPoints[1]];
        var pointsLettersStack = [pointsStack[0].letter, pointsStack[1].letter];
        step = {
            explanation: "Se initializeaza stiva cu primele 2 varfuri. ",
            stackStatus: pointsLettersStack.slice(),
            graphicDrawingsStepList: [
                {
                    type: "point",
                    element: pointsStack[0],
                    color: GREEN_COLOR,
                    size: 9
                },
                {
                    type: "point",
                    element: pointsStack[1],
                    color: GREEN_COLOR,
                    size: 9
                }
            ]
        };
        algorithmGraphicIndications.push(step);


        for (let i = 2; i < numberOfPoints - 1; i++) {
            var currentPoint = sortedPolygonPoints[i];

            var inSameList = (checkIfListContainsPoint(leftChain, currentPoint) && checkIfListContainsPoint(leftChain, pointsStack[pointsStack.length - 1]))
                || (checkIfListContainsPoint(rightChain, currentPoint) && checkIfListContainsPoint(rightChain, pointsStack[pointsStack.length - 1]))
            if (inSameList) {
                step = {
                    explanation: "Punctul curent, " + currentPoint.letter + ", si punctul din varful stivei, " + pointsStack[pointsStack.length - 1].letter + ", sunt in acelasi lant. ",
                    graphicDrawingsStepList: [
                        {
                            type: "point",
                            element: currentPoint,
                            color: ORANGE_COLOR,
                            size: 9
                        },
                        {
                            type: "point",
                            element: pointsStack[pointsStack.length - 1],
                            color: ORANGE_COLOR,
                            size: 9
                        }]
                };
                algorithmGraphicIndications.push(step);

                var lastPointFromStack = pointsStack[pointsStack.length - 1];
                pointsStack.pop();
                pointsLettersStack.pop();
                step = {
                    explanation: "Se extrage un varf din stiva. ",
                    stackStatus: pointsLettersStack.slice(),
                    graphicDrawingsStepList: [
                        {
                            type: "point",
                            element: lastPointFromStack,
                            color: RED_COLOR,
                            size: 9
                        }]
                };
                algorithmGraphicIndications.push(step);


                while (pointsStack.length > 0 && isDiagonalInterior(currentPoint, lastPointFromStack, pointsStack[pointsStack.length - 1])) {
                    lastPointFromStack = pointsStack[pointsStack.length - 1]
                    pointsStack.pop();
                    pointsLettersStack.pop();
                    step = {
                        explanation: "Se extrage varful " + lastPointFromStack.letter + " din stiva pentru ca formeaza cu " + currentPoint.letter + " diagonala interioara poligonului. ",
                        stackStatus: pointsLettersStack.slice(),
                        graphicDrawingsStepList: [
                            {
                                type: "addDiagonal",
                                element: [currentPoint, lastPointFromStack]
                            },
                            {
                                type: "line",
                                element: [currentPoint, lastPointFromStack],
                                color: LIGHT_GREEN_COLOR
                            },
                            {
                                type: "point",
                                element: lastPointFromStack,
                                color: RED_COLOR,
                                size: 9
                            },
                            {
                                type: "point",
                                element: currentPoint,
                                color: ORANGE_COLOR,
                                size: 9
                            }
                        ]
                    };
                    algorithmGraphicIndications.push(step);
                }

                pointsStack.push(lastPointFromStack);
                pointsStack.push(currentPoint);
                pointsLettersStack.push(lastPointFromStack.letter)
                pointsLettersStack.push(currentPoint.letter)
                step = {
                    explanation: "Se insereaza inapoi in stiva ultimul varf extras, " + lastPointFromStack.letter + " si varful curent " + currentPoint.letter + ". ",
                    stackStatus: pointsLettersStack.slice(),
                    graphicDrawingsStepList: [
                        {
                            type: "point",
                            element: lastPointFromStack,
                            color: LIGHT_GREEN_COLOR,
                            size: 9
                        },
                        {
                            type: "point",
                            element: currentPoint,
                            color: LIGHT_GREEN_COLOR,
                            size: 9
                        }]
                };
                algorithmGraphicIndications.push(step);
            }
            else {
                step = {
                    explanation: "Punctul curent, " + currentPoint.letter + ", si punctul din varful stivei, " + pointsStack[pointsStack.length - 1].letter + ", sunt in lanturi diferite. ",
                    graphicDrawingsStepList: [
                        {
                            type: "addDiagonal",
                            element: [currentPoint, pointsStack[pointsStack.length - 1]]
                        },
                        {
                            type: "line",
                            element: [currentPoint, pointsStack[pointsStack.length - 1]],
                            color: ORANGE_COLOR,
                            style: "dash"
                        },
                        {
                            type: "point",
                            element: currentPoint,
                            color: ORANGE_COLOR,
                            size: 9
                        },
                        {
                            type: "point",
                            element: pointsStack[pointsStack.length - 1],
                            color: LIGHT_GREEN_COLOR,
                            size: 9
                        }
                    ]
                };
                algorithmGraphicIndications.push(step);

                var pointOnTopOfStack = pointsStack[pointsStack.length - 1];
                for (let j = pointsStack.length - 1; j > 0; j--) {
                    pointsLettersStack.pop()
                    step = {
                        explanation: "Se extrage din stiva varful " + pointsStack[j].letter + " si se adauga noua diagonala: " + currentPoint.letter + pointsStack[j].letter + ". ",
                        stackStatus: pointsLettersStack.slice(),
                        graphicDrawingsStepList: [
                            {
                                type: "addDiagonal",
                                element: [currentPoint, pointsStack[j]]
                            },
                            {
                                type: "line",
                                element: [currentPoint, pointsStack[j]],
                                color: GREEN_COLOR
                            },
                            {
                                type: "point",
                                element: pointsStack[j],
                                color: RED_COLOR,
                                size: 9
                            },
                            {
                                type: "point",
                                element: currentPoint,
                                color: ORANGE_COLOR,
                                size: 9
                            }]
                    };
                    algorithmGraphicIndications.push(step);
                }

                var firstPointInStack = pointsStack[0];
                pointsStack.pop();
                pointsLettersStack.pop()
                step = {
                    explanation: "Se extrage din stiva varful " + firstPointInStack.letter + ", dar fiind ultimul, nu se adauga diagonala. ",
                    stackStatus: pointsLettersStack.slice(),
                    graphicDrawingsStepList: [
                        {
                            type: "point",
                            element: firstPointInStack,
                            color: RED_COLOR,
                            size: 9
                        }
                    ]
                };
                algorithmGraphicIndications.push(step);


                pointsStack = [pointOnTopOfStack, currentPoint]
                pointsLettersStack = [pointsStack[0].letter, pointsStack[1].letter]
                step = {
                    explanation: "Se insereaza inapoi in stiva primul varf extras, " + pointOnTopOfStack.letter + " si varful curent " + currentPoint.letter + ". ",
                    stackStatus: pointsLettersStack.slice(),
                    graphicDrawingsStepList: [
                        {
                            type: "point",
                            element: pointOnTopOfStack,
                            color: LIGHT_GREEN_COLOR,
                            size: 9
                        },
                        {
                            type: "point",
                            element: currentPoint,
                            color: LIGHT_GREEN_COLOR,
                            size: 9
                        }
                    ]
                };
                algorithmGraphicIndications.push(step);
            }

            step = {
                graphicDrawingsStepList: [
                    {
                        type: "redrawCanvasElements",
                    }
                ]
            };
            if (i < numberOfPoints - 2) {
                for (let i = 0; i < pointsStack.length; i++) {
                    step.graphicDrawingsStepList.push({
                        type: "point",
                        element: pointsStack[i],
                        color: LIGHT_GREEN_COLOR,
                        size: 9
                    })
                }
            }
            algorithmGraphicIndications.push(step);
        }

        var lastPointInSortedList = sortedPolygonPoints[sortedPolygonPoints.length - 1];
        for (let i = 1; i < pointsStack.length - 1; i++) {
            step = {
                message: "Se adauga diagonale de la ultimul varf din lista, " + lastPointInSortedList.letter + ", la varful stivei (exceptand primul ̧si ultimul). ",
                graphicDrawingsStepList: [
                    {
                        type: "addDiagonal",
                        element: [lastPointInSortedList, pointsStack[j]]
                    },
                    {
                        type: "line",
                        element: [lastPointInSortedList, pointsStack[i]],
                        color: BLUE_COLOR
                    }]
            };
            if (i == pointsStack.length - 2) {
                step.graphicDrawingsStepList.push({ type: "redrawCanvasElements" })
            }
            algorithmGraphicIndications.push(step);
        }
    }
}


function isDiagonalInterior(currentPoint, pointOnTopOfStack, topOfStackPoint) {
    let inLeftChain = checkIfListContainsPoint(leftChain, currentPoint) && checkIfListContainsPoint(leftChain, pointOnTopOfStack);
    var orientation = calculateOrientationForNormalPoints(currentPoint, pointOnTopOfStack, topOfStackPoint);

    if (inLeftChain) {
        return (orientation == 1);
    } else {
        return (orientation == 2);
    }
}


function drawEdgeOnCanvas(event) {
    var mousePosition = getMousePositionOnCanvas(event, triangulationCanvas, canvasContext);
    var pointOnCanvas = getPointInProximity(mousePosition)
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
        var intersect = checkNewSegmentIntersect(newSegment);
        if (getDistanceBetweenPoints(getPointCoordinatesOnTranslatedCanvas(firstDrawnPoint), mousePosition) >= 2 * POINT_RADIUS
            && !intersect) {
            if (pointOnCanvas == null) {
                triangulationCanvas.removeEventListener("mousemove", drawLineOnMouseOver)
                isDrawing = false

                lastPointLetter = getNextPointLetter(lastPointLetter)
                var newPoint = { x: normalPointFromCanvas.x, y: normalPointFromCanvas.y, letter: lastPointLetter }
                adjacencyListOfPointsForEdges.set(newPoint, [firstDrawnPoint])
                adjacencyListOfPointsForEdges.get(firstDrawnPoint).push(newPoint)

                var pointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(newPoint)
                drawNewPoint(canvasContext, pointCanvasCoordinates)
                drawElementIndicator(canvasContext, pointCanvasCoordinates.x - 10, pointCanvasCoordinates.y - 10, lastPointLetter)
            }
            else {
                let edgeAlreadyExists = checkEdgeExistsOnCanvas(firstDrawnPoint, pointOnCanvas)
                if (!edgeAlreadyExists) {
                    triangulationCanvas.removeEventListener("mousemove", drawLineOnMouseOver)
                    isDrawing = false

                    adjacencyListOfPointsForEdges.get(pointOnCanvas).push(firstDrawnPoint)
                    adjacencyListOfPointsForEdges.get(firstDrawnPoint).push(pointOnCanvas)
                }
            }
        }
    }
    else {
        if (pointOnCanvas == null) {
            lastPointLetter = getNextPointLetter(lastPointLetter)
            firstDrawnPoint = { x: normalPointFromCanvas.x, y: normalPointFromCanvas.y, letter: lastPointLetter }
            adjacencyListOfPointsForEdges.set(firstDrawnPoint, [])

            var pointCanvasCoordinates = getPointCoordinatesOnTranslatedCanvas(firstDrawnPoint)
            drawNewPoint(canvasContext, pointCanvasCoordinates)
            drawElementIndicator(canvasContext, pointCanvasCoordinates.x - 10, pointCanvasCoordinates.y - 10, lastPointLetter)
        }
        else {
            firstDrawnPoint = pointOnCanvas
        }

        triangulationCanvas.addEventListener("mousemove", drawLineOnMouseOver)
        isDrawing = true
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

function getPointInProximity(newPoint) {
    for (let point of adjacencyListOfPointsForEdges.keys()) {
        let distance = getDistanceBetweenPoints(getPointCoordinatesOnTranslatedCanvas(point), newPoint)
        if (distance < 2 * POINT_RADIUS)
            return point;
    }
    return null;
}


function drawLineOnMouseOver(event) {
    var mousePosition = getMousePositionOnCanvas(event, triangulationCanvas, canvasContext)
    updateCanvasAfterMove();
    drawNewLine(canvasContext, getPointCoordinatesOnTranslatedCanvas(firstDrawnPoint), mousePosition);
}


function checkNewSegmentIntersect(newSegment) {
    for (const [point, connectedPoints] of adjacencyListOfPointsForEdges.entries()) {
        for (let i = 0; i < connectedPoints.length; i++) {
            var segment = {
                leftSegmentPoint: point,
                rightSegmentPoint: connectedPoints[i]
            }
            var intersection = getLinesIntersection(segment, newSegment)
            var intersectionPoint = intersection.point
            var status = intersection.status
            if (status == "coincid") {
                return true;
            }
            if (intersectionPoint != null) {
                if (checkIfSegmentIncludesPoint(segment, intersectionPoint) &&
                    checkIfSegmentIncludesPoint(newSegment, intersectionPoint)) {
                    let isSegmentsEndpoint = checkSamePoint(intersectionPoint, segment.leftSegmentPoint) && checkSamePoint(intersectionPoint, newSegment.leftSegmentPoint)
                        || checkSamePoint(intersectionPoint, segment.leftSegmentPoint) && checkSamePoint(intersectionPoint, newSegment.rightSegmentPoint)
                        || checkSamePoint(intersectionPoint, segment.rightSegmentPoint) && checkSamePoint(intersectionPoint, newSegment.leftSegmentPoint)
                        || checkSamePoint(intersectionPoint, segment.rightSegmentPoint) && checkSamePoint(intersectionPoint, newSegment.rightSegmentPoint);
                    if (!isSegmentsEndpoint) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
