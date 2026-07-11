function drawElementIndicator(canvasContext, x, y, indicator, font = "15px Arial") {
    canvasContext.beginPath();
    canvasContext.font = font;
    canvasContext.fillStyle = "black";
    canvasContext.fillText(indicator, x, y);
    canvasContext.closePath();
}

function drawNewPoint(canvasContext, point, color = "black", size = POINT_RADIUS) {
    canvasContext.beginPath();
    canvasContext.font = "15px Arial"
    canvasContext.fillStyle = color;
    canvasContext.arc(point.x, point.y, size, 0, 2 * Math.PI);
    canvasContext.fill();
    canvasContext.closePath();
}

function drawNewLine(canvasContext, firstPoint, secondPoint, color = "black", lineDash = [], width = 3) {
    canvasContext.beginPath();
    canvasContext.font = "15px Arial"
    canvasContext.setLineDash(lineDash);
    canvasContext.strokeStyle = color;
    canvasContext.lineWidth = width;
    canvasContext.moveTo(firstPoint.x, firstPoint.y);
    canvasContext.lineTo(secondPoint.x, secondPoint.y);
    canvasContext.stroke();
    canvasContext.closePath();
}

function drawCartesianSystemLines(canvasContext,
    startX, stopX, startY, stopY,
    unitPixelsSize = NUMERIC_UNIT_PIXEL_SIZE,
    moveXValue = 0, moveYValue = 0,
    withOXY = true) {
    canvasContext.lineWidth = 1
    canvasContext.strokeStyle = 'silver'
    canvasContext.beginPath();
    canvasContext.setLineDash([]);
    canvasContext.font = "15px Arial";

    // Linii orizontale
    var y = startY
    while (y <= stopY) {
        canvasContext.moveTo(startX, y);
        canvasContext.lineTo(stopX, y);
        canvasContext.stroke();
        y += unitPixelsSize;
    }

    // Linii verticale
    var x = startX
    while (x <= stopX) {
        canvasContext.moveTo(x, startY);
        canvasContext.lineTo(x, stopY);
        canvasContext.stroke();
        x += unitPixelsSize;
    }
    canvasContext.closePath();

    // Ox si Oy
    if (withOXY) {
        canvasContext.lineWidth = 3.5
        canvasContext.strokeStyle = '#999999'
        canvasContext.beginPath()
        canvasContext.moveTo(startX, moveYValue);
        canvasContext.lineTo(stopX, moveYValue);
        canvasContext.stroke();
        canvasContext.moveTo(moveXValue, startY + moveXValue);
        canvasContext.lineTo(moveXValue, stopY + moveXValue);
        canvasContext.stroke();
        canvasContext.closePath();
    }
}
