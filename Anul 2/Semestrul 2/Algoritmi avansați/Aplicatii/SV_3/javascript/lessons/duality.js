window.onload = function () {
    addScrollToVisualSupportFunctionality()
    initValues();
    initCanvas();

    resetButton = document.getElementById("reset");
    resetButton.addEventListener("click", reset);

    transformationsMessagesContainer = document.getElementById("dualityTransformations");

    transformPointButton = document.getElementById("transformPoint")
    transformPointButton.addEventListener("click", transformPoint)

    transformLineButton = document.getElementById("transformLine")
    transformLineButton.addEventListener("click", transformLine)

    transformLineWithPointsButton = document.getElementById("transformLineWithPoints")
    transformLineWithPointsButton.addEventListener("click", transformLineWithTwoPoints)

    // getLineFromPoint({ x: 5, y: 2 }) //-> 5x-2
    // getPointFromLine(2, 3) //-> (2,-3)
    // getConfigurationFromLineWithTwoPoints({ x: 1, y: 3 }, { x: 3, y: 2 }) //-> y=x-3, y=3x-2, P(-1/2, -3/2)
}


function initCanvas() {
    primalCanvas = document.getElementById("primalPlan")
    primalCanvasContext = primalCanvas.getContext("2d")

    dualCanvas = document.getElementById("dualPlan")
    dualCanvasContext = dualCanvas.getContext("2d")

    setCanvas(primalCanvas, primalCanvasContext)
    setCanvas(dualCanvas, dualCanvasContext);

    movePrimalCanvasUp = document.getElementById("primalUp")
    movePrimalCanvasUp.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < movePrimalYValue + 40 && movePrimalYValue + 40 < CANVAS_COORDINATE_MAX_VALUE) {
            primalCanvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
            movePrimalYValue += 40;
            drawCartesianSystemLines(primalCanvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
                NUMERIC_UNIT_PIXEL_SIZE, movePrimalXValue, movePrimalYValue)
            drawPrimalPointAndLines();
        }
    })
    movePrimalCanvasDown = document.getElementById("primalDown")
    movePrimalCanvasDown.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < movePrimalYValue - 40 && movePrimalYValue - 40 < CANVAS_COORDINATE_MAX_VALUE) {
            primalCanvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
            movePrimalYValue -= 40;
            drawCartesianSystemLines(primalCanvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
                NUMERIC_UNIT_PIXEL_SIZE, movePrimalXValue, movePrimalYValue)
            drawPrimalPointAndLines();
        }
    })
    movePrimalCanvasLeft = document.getElementById("primalLeft")
    movePrimalCanvasLeft.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < movePrimalXValue + 40 && movePrimalXValue + 40 < CANVAS_COORDINATE_MAX_VALUE) {
            primalCanvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
            movePrimalXValue += 40;
            drawCartesianSystemLines(primalCanvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
                NUMERIC_UNIT_PIXEL_SIZE, movePrimalXValue, movePrimalYValue)
            drawPrimalPointAndLines();
        }
    })
    movePrimalCanvasRight = document.getElementById("primalRight")
    movePrimalCanvasRight.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < movePrimalXValue - 40 && movePrimalXValue - 40 < CANVAS_COORDINATE_MAX_VALUE) {
            primalCanvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
            movePrimalXValue -= 40;
            drawCartesianSystemLines(primalCanvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
                NUMERIC_UNIT_PIXEL_SIZE, movePrimalXValue, movePrimalYValue)
            drawPrimalPointAndLines();
        }
    })


    moveDualCanvasUp = document.getElementById("dualUp")
    moveDualCanvasUp.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < moveDualYValue + 40 && moveDualYValue + 40 < CANVAS_COORDINATE_MAX_VALUE) {
            dualCanvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
            moveDualYValue += 40;
            drawCartesianSystemLines(dualCanvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
                NUMERIC_UNIT_PIXEL_SIZE, moveDualXValue, moveDualYValue)
            drawDualPointAndLines();
        }
    })
    moveDualCanvasDown = document.getElementById("dualDown")
    moveDualCanvasDown.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < moveDualYValue - 40 && moveDualYValue - 40 < CANVAS_COORDINATE_MAX_VALUE) {
            dualCanvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
            moveDualYValue -= 40;
            drawCartesianSystemLines(dualCanvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
                NUMERIC_UNIT_PIXEL_SIZE, moveDualXValue, moveDualYValue)
            drawDualPointAndLines();
        }
    })
    moveDualCanvasLeft = document.getElementById("dualLeft")
    moveDualCanvasLeft.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < moveDualXValue + 40 && moveDualXValue + 40 < CANVAS_COORDINATE_MAX_VALUE) {
            dualCanvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
            moveDualXValue += 40;
            drawCartesianSystemLines(dualCanvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
                NUMERIC_UNIT_PIXEL_SIZE, moveDualXValue, moveDualYValue)
            drawDualPointAndLines();
        }
    })
    moveDualCanvasRight = document.getElementById("dualRight")
    moveDualCanvasRight.addEventListener("click", function () {
        if (-CANVAS_COORDINATE_MAX_VALUE < moveDualXValue - 40 && moveDualXValue - 40 < CANVAS_COORDINATE_MAX_VALUE) {
            dualCanvasContext.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
            moveDualXValue -= 40;
            drawCartesianSystemLines(dualCanvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
                NUMERIC_UNIT_PIXEL_SIZE, moveDualXValue, moveDualYValue)
            drawDualPointAndLines();
        }
    })
}


window.onresize = function () {
    movePrimalXValue = 0
    movePrimalYValue = 0
    moveDualXValue = 0
    moveDualYValue = 0
    setCanvas(primalCanvas, primalCanvasContext)
    setCanvas(dualCanvas, dualCanvasContext)
}

function initValues() {
    lastPointLetter = "";
    lineCount = 0;

    maxWidthResponsive = 950;
    columnPadding = 50;
    canvasBorder = 3;

    primalPoints = [];
    primalLines = [];
    dualPoints = [];
    dualLines = [];

    movePrimalXValue = 0;
    movePrimalYValue = 0;
    moveDualXValue = 0;
    moveDualYValue = 0;
}

function reset() {
    initValues();
    transformationsMessagesContainer.innerHTML = "";

    setCanvas(primalCanvas, primalCanvasContext)
    setCanvas(dualCanvas, dualCanvasContext)
}

function setCanvas(canvas, context) {
    context.clearRect(-CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE * 2, CANVAS_COORDINATE_MAX_VALUE * 2);
    var windowsWidth = window.innerWidth
    var windowsHeight = window.innerHeight / 1.2

    var canvasHeight = windowsHeight - 50
    canvas.height = canvasHeight

    var canvasWidth;
    if (windowsWidth <= maxWidthResponsive) {
        canvasWidth = windowsWidth - columnPadding * 2 - canvasBorder * 2
        canvas.width = canvasWidth
    }
    else {
        canvasWidth = windowsWidth / parseFloat(2) - columnPadding * 2 - canvasBorder * 2;
        canvas.width = canvasWidth
    }
    context.translate(canvasWidth / 2, canvasHeight / 2)

    if (context == primalCanvasContext) {
        drawCartesianSystemLines(primalCanvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
            NUMERIC_UNIT_PIXEL_SIZE, movePrimalXValue, movePrimalYValue)
    }
    if (context == dualCanvasContext) {
        drawCartesianSystemLines(dualCanvasContext, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE, -CANVAS_COORDINATE_MAX_VALUE, CANVAS_COORDINATE_MAX_VALUE,
            NUMERIC_UNIT_PIXEL_SIZE, moveDualXValue, moveDualYValue)
    }
    drawPointsAndLines()
}


function drawPointsAndLines() {
    drawPrimalPointAndLines()
    drawDualPointAndLines()
}

function drawPrimalPointAndLines() {
    for (let i = 0; i < primalPoints.length; i++) {
        var point = primalPoints[i];
        var pointOnNormalCanvas = getPointCoordinatesOnUntranslatedCanvas(point);
        var pointOnTranslatedCanvas = { x: pointOnNormalCanvas.x + movePrimalXValue, y: pointOnNormalCanvas.y + movePrimalYValue }
        drawNewPoint(primalCanvasContext, pointOnTranslatedCanvas)
        drawElementIndicator(primalCanvasContext, pointOnTranslatedCanvas.x - 7, pointOnTranslatedCanvas.y - 10, point.letter)
    }

    for (let i = 0; i < primalLines.length; i++) {
        var line = primalLines[i]
        drawInfiniteLine(primalCanvasContext, line.m, line.n, line.number)
    }
}


function drawDualPointAndLines() {
    for (let i = 0; i < dualPoints.length; i++) {
        var point = dualPoints[i];
        var pointOnNormalCanvas = getPointCoordinatesOnUntranslatedCanvas(point);
        var pointOnTranslatedCanvas = { x: pointOnNormalCanvas.x + moveDualXValue, y: pointOnNormalCanvas.y + moveDualYValue }
        drawNewPoint(dualCanvasContext, pointOnTranslatedCanvas)
        drawElementIndicator(dualCanvasContext, pointOnTranslatedCanvas.x - 7, pointOnTranslatedCanvas.y - 10, point.letter);
    }

    for (let i = 0; i < dualLines.length; i++) {
        var line = dualLines[i]
        drawInfiniteLine(dualCanvasContext, line.m, line.n, line.number)
    }
}



function transformPoint() {
    var pointXInput = document.getElementById("pointX");
    var pointYInput = document.getElementById("pointY");
    let pointX = Number(pointXInput.value)
    let pointY = Number(pointYInput.value)
    if (pointX != 0 || pointY != 0) {

        //Afisare punct + litera pe ecran
        var pointCanvasCoordinates = getPointCoordinatesOnUntranslatedCanvas({ x: pointX, y: pointY })
        var movedPointCanvasCoordinates = { x: pointCanvasCoordinates.x + movePrimalXValue, y: pointCanvasCoordinates.y + movePrimalYValue }
        drawNewPoint(primalCanvasContext, movedPointCanvasCoordinates)
        lastPointLetter = getNextPointLetter(lastPointLetter)
        drawElementIndicator(primalCanvasContext, movedPointCanvasCoordinates.x - 7, movedPointCanvasCoordinates.y - 10, lastPointLetter)

        // Adaugare punct in lista
        primalPoints.push({ x: pointX, y: pointY, letter: lastPointLetter });

        // Transformarea punctului in dreapta si afisarea ei pe ecran
        var line = getLineFromPoint({ x: pointX, y: pointY })
        var transformation = "Punctul " + lastPointLetter + "(" + pointX + ", " + pointY + ") devine dreapta d" + lineCount + ": y = ";
        if (line.gradient != 0 && line.gradient != 1) {
            transformation += line.gradient;
        }
        if (line.gradient != 0) {
            transformation += "x";
        }
        if (line.intercept > 0) {
            transformation = transformation + "+"
        }
        if (line.intercept != 0) {
            transformation = transformation + line.intercept;
        }
        addNewTransformationInList(transformation);
    }
}

function getLineFromPoint(point) {
    var m = point.x
    var n = -point.y
    lineCount++
    drawInfiniteLine(dualCanvasContext, m, n, lineCount)
    dualLines.push({ m: m, n: n, number: lineCount })
    return { gradient: m, intercept: n }
}


function transformLine() {
    let m = Number(document.getElementById("lineM").value)
    let n = Number(document.getElementById("lineN").value)
    lineCount++
    drawInfiniteLine(primalCanvasContext, m, n, lineCount)
    primalLines.push({ m: m, n: n, number: lineCount })

    var point = getPointFromLine(m, n)
    var transformation = "Dreapta d" + lineCount + ": y = " + m + "x"
    if (n >= 0) {
        transformation = transformation + "+"
    }
    transformation = transformation + n + " devine punctul " + lastPointLetter + "(" + point.x + ", " + point.y + ")"
    addNewTransformationInList(transformation)
}

function getPointFromLine(m, n) {
    var point = { x: m, y: -n };
    var pointOnNormalCanvas = getPointCoordinatesOnUntranslatedCanvas(point);
    var pointOnTranslatedCanvas = { x: pointOnNormalCanvas.x + moveDualXValue, y: pointOnNormalCanvas.y + moveDualYValue }
    lastPointLetter = getNextPointLetter(lastPointLetter)
    drawElementIndicator(dualCanvasContext, pointOnTranslatedCanvas.x - 7, pointOnTranslatedCanvas.y - 10, lastPointLetter)
    drawNewPoint(dualCanvasContext, pointOnTranslatedCanvas)
    dualPoints.push({ x: point.x, y: point.y, letter: lastPointLetter })
    return point
}



function transformLineWithTwoPoints() {
    // Primul punct de pe dreapta
    let firstPointX = Number(document.getElementById("firstPointX").value)
    let firstPointY = Number(document.getElementById("firstPointY").value)
    var firstPoint = { x: firstPointX, y: firstPointY }

    // Al doilea punct de pe dreapta
    let secondPointX = Number(document.getElementById("secondPointX").value)
    let secondPointY = Number(document.getElementById("secondPointY").value)
    var secondPoint = { x: secondPointX, y: secondPointY }

    // Desenarea primului punct si stocarea lui
    var pointOnNormalCanvas = getPointCoordinatesOnUntranslatedCanvas(firstPoint);
    var pointOnTranslatedCanvas = { x: pointOnNormalCanvas.x + movePrimalXValue, y: pointOnNormalCanvas.y + movePrimalYValue }
    lastPointLetter = getNextPointLetter(lastPointLetter)
    var firstPointLetter = lastPointLetter
    drawElementIndicator(primalCanvasContext, pointOnTranslatedCanvas.x - 7, pointOnTranslatedCanvas.y - 10, firstPointLetter)
    drawNewPoint(primalCanvasContext, pointOnTranslatedCanvas)
    primalPoints.push({ x: firstPoint.x, y: firstPoint.y, letter: lastPointLetter })

    // Desenarea celui de-al doilea punct si stocarea lui
    pointOnNormalCanvas = getPointCoordinatesOnUntranslatedCanvas(secondPoint);
    pointOnTranslatedCanvas = { x: pointOnNormalCanvas.x + movePrimalXValue, y: pointOnNormalCanvas.y + movePrimalYValue }
    lastPointLetter = getNextPointLetter(lastPointLetter)
    var secondPointLetter = lastPointLetter
    drawElementIndicator(primalCanvasContext, pointOnTranslatedCanvas.x - 7, pointOnTranslatedCanvas.y - 10, secondPointLetter)
    drawNewPoint(primalCanvasContext, pointOnTranslatedCanvas)
    primalPoints.push({ x: secondPoint.x, y: secondPoint.y, letter: secondPointLetter })

    lineCount++
    var gradient = (secondPointY - firstPointY) / parseFloat(secondPointX - firstPointX)
    var intercept = firstPointY - firstPointX * gradient

    drawInfiniteLine(primalCanvasContext, gradient, intercept, lineCount)
    primalLines.push({ m: gradient, n: intercept, number: lineCount })

    var configuration = getConfigurationFromLineWithTwoPoints(firstPoint, secondPoint)
    var intersectionPoint = configuration.point
    var firstLine = configuration.firstLine
    var secondLine = configuration.secondLine

    var transformation = "Dreapta d" + (lineCount - 2) + " determinata de punctele " + firstPointLetter + "(" + firstPointX + "," + firstPointY + ") si "
        + secondPointLetter + "(" + secondPointX + ", " + secondPointY + ")"
        + " este transformata in punctul de intersectie " + intersectionPoint.letter + "(" + intersectionPoint.x + "," + intersectionPoint.y
        + ") a doua drepte d" + (lineCount - 1) + ": y = " + firstLine.gradient + "x"
    if (firstLine.intercept >= 0) {
        transformation = transformation + "+"
    }
    transformation = transformation + firstLine.intercept + " si d" + lineCount + ": y = " + secondLine.gradient + "x"
    if (secondLine.intercept >= 0) {
        transformation = transformation + "+"
    }
    transformation = transformation + secondLine.intercept
    addNewTransformationInList(transformation)
}

function getConfigurationFromLineWithTwoPoints(firstPoint, secondPoint) {
    var firstLine = getLineFromPoint(firstPoint)
    var secondLine = getLineFromPoint(secondPoint)

    var n1 = -firstPoint.y
    var n2 = -secondPoint.y
    var m1 = firstPoint.x
    var m2 = secondPoint.x
    var x = (n2 - n1) / parseFloat(m1 - m2)
    var y = m1 * x + n1

    var pointOnNormalCanvas = getPointCoordinatesOnUntranslatedCanvas({ x: x, y: y });
    var pointOnTranslatedCanvas = { x: pointOnNormalCanvas.x + moveDualXValue, y: pointOnNormalCanvas.y + moveDualYValue }
    lastPointLetter = getNextPointLetter(lastPointLetter)
    drawElementIndicator(dualCanvasContext, pointOnTranslatedCanvas.x - 7, pointOnTranslatedCanvas.y - 10, lastPointLetter)
    drawNewPoint(dualCanvasContext, pointOnTranslatedCanvas)
    dualPoints.push({ x: x, y: y, letter: lastPointLetter })

    return {
        point: { x: x, y: y, letter: lastPointLetter },
        firstLine: firstLine,
        secondLine: secondLine
    }
}



function drawInfiniteLine(context, m, n, number) {
    // Pentru a simula o dreapta infinita, iau valorile maxime pe care le poate lua x pe canvas (-50,50)
    // Rezolv eecuatia dreptei folosind aceste doua valori
    // Si trasez linia prin intermediul lor
    var moveXValue = 0;
    var moveYValue = 0;
    if (context == primalCanvasContext) {
        moveXValue = movePrimalXValue;
        moveYValue = movePrimalYValue;
    }
    if (context == dualCanvasContext) {
        moveXValue = moveDualXValue;
        moveYValue = moveDualYValue;
    }

    var minX = -POINT_COORDINATE_MAX_VALUE
    var minXPoint = getPointCoordinatesOnUntranslatedCanvas({ x: minX, y: solveLineEquationForPoint(m, n, minX) });
    minXPoint = { x: minXPoint.x + moveXValue, y: minXPoint.y + moveYValue };

    var maxX = POINT_COORDINATE_MAX_VALUE
    var maxXPoint = getPointCoordinatesOnUntranslatedCanvas({ x: maxX, y: solveLineEquationForPoint(m, n, maxX) })
    maxXPoint = { x: maxXPoint.x + moveXValue, y: maxXPoint.y + moveYValue }
    drawNewLine(context, minXPoint, maxXPoint, "black", [], 4);

    // Adaug indice pentru dreapta
    var pointCanvasCoordinates = getPointCoordinatesOnUntranslatedCanvas({ x: 3, y: solveLineEquationForPoint(m, n, 3) })
    drawElementIndicator(context, pointCanvasCoordinates.x + moveXValue + 10, pointCanvasCoordinates.y + moveYValue + 10, "d" + number)
}

function solveLineEquationForPoint(m, n, x) {
    return (m * x + n)
}



function addNewTransformationInList(transformation) {
    var newTransformation = document.createElement("p")
    newTransformation.innerHTML = transformation
    transformationsMessagesContainer.appendChild(newTransformation)
}

function getPointCoordinatesOnUntranslatedCanvas(point) {
    var canvasX = point.x * NUMERIC_UNIT_PIXEL_SIZE;
    var canvasY = - point.y * NUMERIC_UNIT_PIXEL_SIZE;
    return { x: canvasX, y: canvasY }
}
