class Trapezoid {
    constructor(topEdge, bottomEdge, leftVertex, rightVertex) {
        this.topEdge = topEdge;
        this.bottomEdge = bottomEdge;
        this.leftVertex = leftVertex;
        this.rightVertex = rightVertex;
        if (typeof trapezoidCount !== 'undefined') {
            this.number = ++trapezoidCount;
        }
        this.downLeftTrapezoid = null;
        this.downRightTrapezoid = null;
        this.upLeftTrapezoid = null;
        this.upRightTrapezoid = null;
        this.correspondingLeaf = null;
    }
}

function setNeighbourTrapezoids(trapezoidToBeUpdated,
    downLeftTrapezoid, downRightTrapezoid,
    upLeftTrapezoid, upRightTrapezoid) {
    if (downLeftTrapezoid != null) {
        trapezoidToBeUpdated.downLeftTrapezoid = downLeftTrapezoid;
        downLeftTrapezoid.downRightTrapezoid = trapezoidToBeUpdated;
    }
    if (downRightTrapezoid != null) {
        trapezoidToBeUpdated.downRightTrapezoid = downRightTrapezoid;
        downRightTrapezoid.downLeftTrapezoid = trapezoidToBeUpdated;
    }
    if (upLeftTrapezoid != null) {
        trapezoidToBeUpdated.upLeftTrapezoid = upLeftTrapezoid;
        upLeftTrapezoid.upRightTrapezoid = trapezoidToBeUpdated;
    }
    if (upRightTrapezoid != null) {
        trapezoidToBeUpdated.upRightTrapezoid = upRightTrapezoid;
        upRightTrapezoid.upLeftTrapezoid = trapezoidToBeUpdated;
    }
}

class Node {
    constructor(label, value) {
        this.label = label;
        this.value = value;
        this.leftNode = null;
        this.rightNode = null;
    }
}

function getAllTrapezoidsFromGraph(graphNode) {
    if (graphNode.label == "trapezoid") {
        return new Set([graphNode.value]);
    }
    else {
        var leftSet = getAllTrapezoidsFromGraph(graphNode.leftNode);
        var rightSet = getAllTrapezoidsFromGraph(graphNode.rightNode);
        return new Set([...leftSet, ...rightSet])
    }
}

function getTreeDataJson(graphNode) {
    var indicator;
    var children = [];
    var label = graphNode.label;
    var value = graphNode.value;
    if (label == "trapezoid") {
        indicator = "T" + value.number;
    } else {
        if (label == "vertex") {
            indicator = value.letter;
        }
        if (label == "segment") {
            indicator = value.leftSegmentPoint.letter + value.rightSegmentPoint.letter;
        }
        children.push(getTreeDataJson(graphNode.leftNode));
        children.push(getTreeDataJson(graphNode.rightNode));
    }

    return {
        name: indicator,
        children: children
    }
}


class Segment {
    constructor(leftSegmentPoint, rightSegmentPoint) {
        this.leftSegmentPoint = leftSegmentPoint;
        this.rightSegmentPoint = rightSegmentPoint;
    }
}


class Point {
    constructor(x, y, letter) {
        this.x = x;
        this.y = y;
        this.letter = letter;
        this.extensionTop = null;
        this.extensionBottom = null;
    }
}



function drawTrapezoid(canvasContext, trapezoid, canvasHeight, color = "black", style = "fill", withIndicator = true) {
    var trapezoidCorners = getTrapezoidCorners(trapezoid, canvasHeight);
    var downLeftCorner = getPointCoordinatesOnTranslatedCanvas(trapezoidCorners.downLeftCorner);
    var downRightCorner = getPointCoordinatesOnTranslatedCanvas(trapezoidCorners.downRightCorner);
    var upLeftCorner = getPointCoordinatesOnTranslatedCanvas(trapezoidCorners.upLeftCorner);
    var upRightCorner = getPointCoordinatesOnTranslatedCanvas(trapezoidCorners.upRightCorner);

    if (style == "fill") {
        canvasContext.beginPath();
        canvasContext.fillStyle = color;
        canvasContext.moveTo(upLeftCorner.x, upLeftCorner.y);
        canvasContext.lineTo(upRightCorner.x, upRightCorner.y);
        canvasContext.lineTo(downRightCorner.x, downRightCorner.y);
        canvasContext.lineTo(downLeftCorner.x, downLeftCorner.y);
        canvasContext.fill();
        canvasContext.closePath();
    }
    else {
        drawNewLine(canvasContext, upLeftCorner, upRightCorner, color, [], 4)
        drawNewLine(canvasContext, upRightCorner, downRightCorner, color, [], 4)
        drawNewLine(canvasContext, downRightCorner, downLeftCorner, color, [], 4)
        drawNewLine(canvasContext, downLeftCorner, upLeftCorner, color, [], 4)
    }

    if (withIndicator) {
        drawTrapezoidIndicator(canvasContext, downLeftCorner, downRightCorner, upLeftCorner, upRightCorner, trapezoid.number);
    }
}


function drawTrapezoidIndicator(canvasContext, downLeftCorner, downRightCorner, upLeftCorner, upRightCorner, trapezoidNumber) {
    var pointsSet = [...new Set([downLeftCorner, downRightCorner, upLeftCorner, upRightCorner])];
    var cornersX = [], cornersY = [];
    for (let point of pointsSet) {
        cornersX.push(point.x);
        cornersY.push(point.y);
    }
    cornersX.sort(function (a, b) { return a - b; });
    cornersY.sort(function (a, b) { return a - b; });
    var centerX = (cornersX[1] + cornersX[2]) / parseFloat(2);
    var centerY = (cornersY[1] + cornersY[2]) / parseFloat(2);
    drawElementIndicator(canvasContext, centerX, centerY, trapezoidNumber);
}


function getTrapezoidCorners(trapezoid, canvasHeight) {
    var downLeftCorner, downRightCorner, upLeftCorner, upRightCorner;

    var leftVertexXVertical = new Segment(new Point(trapezoid.leftVertex.x, -canvasHeight / 2),
        new Point(trapezoid.leftVertex.x, canvasHeight / 2))
    upLeftCorner = getLinesIntersection(leftVertexXVertical, trapezoid.topEdge).point;
    downLeftCorner = getLinesIntersection(leftVertexXVertical, trapezoid.bottomEdge).point;

    rightVertexXVertical = new Segment(new Point(trapezoid.rightVertex.x, -canvasHeight / 2),
        new Point(trapezoid.rightVertex.x, canvasHeight / 2))
    upRightCorner = getLinesIntersection(rightVertexXVertical, trapezoid.topEdge).point;
    downRightCorner = getLinesIntersection(rightVertexXVertical, trapezoid.bottomEdge).point

    return {
        downLeftCorner: downLeftCorner,
        downRightCorner: downRightCorner,
        upLeftCorner: upLeftCorner,
        upRightCorner: upRightCorner
    }
}


function checkPointsWithSameX(newPoint) {
    for (let p = 0; p < initialPoints.length; p++) {
        let point = initialPoints[p];
        if (point.x == newPoint.x)
            return true;
    }
    return false;
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
