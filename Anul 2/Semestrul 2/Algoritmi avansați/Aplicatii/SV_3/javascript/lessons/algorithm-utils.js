POINT_RADIUS = 7
POINT_COORDINATE_MAX_VALUE = 50
NUMERIC_UNIT_PIXEL_SIZE = 20
CANVAS_COORDINATE_MAX_VALUE = POINT_COORDINATE_MAX_VALUE * NUMERIC_UNIT_PIXEL_SIZE
RED_COLOR = "rgb(153, 24, 24)"
ORANGE_COLOR = "#FF4500"
GREEN_COLOR = "#31695d"
LIGHT_GREEN_COLOR = "#52ab98"
BLUE_COLOR = "#2b6777"

function getNextPointLetter(lastPointLetter) {
    var nextPointLetter = "";
    if (lastPointLetter == "") {
        nextPointLetter = "A";
    }
    else {
        if (lastPointLetter === 'Z' || lastPointLetter === 'z') {
            nextPointLetter = String.fromCharCode(lastPointLetter.charCodeAt() - 25) + String.fromCharCode(lastPointLetter.charCodeAt() - 25);
        } else {
            var lastChar = lastPointLetter.slice(-1);
            var sub = lastPointLetter.slice(0, -1);
            if (lastChar === 'Z' || lastChar === 'z') {
                nextPointLetter = getNextPointLetter(sub) + String.fromCharCode(lastChar.charCodeAt() - 25);
            } else {
                nextPointLetter = sub + String.fromCharCode(lastChar.charCodeAt() + 1);
            }
        }
    }
    return nextPointLetter;
}

function getDistanceBetweenPoints(firstPoint, secondPoint) {
    return Math.sqrt(Math.pow(firstPoint.x - secondPoint.x, 2) + Math.pow(firstPoint.y - secondPoint.y, 2))
}

function getMousePositionOnCanvas(event, canvas, context) {
    let boundingCanvasRect = canvas.getBoundingClientRect();
    let x = event.clientX - boundingCanvasRect.left;
    let y = event.clientY - boundingCanvasRect.top;
    let transformation = context.getTransform();
    x = x - transformation.e;
    y = y - transformation.f;
    return { x: x, y: y };
}


function sortList(list, comparator) {
    var sortedList = list.slice();
    sortedList.sort(comparator);
    return sortedList;
}

function comparatorPointsByYDescending(firstPoint, secondPoint) {
    if (firstPoint.y > secondPoint.y) return -1;
    if (firstPoint.y < secondPoint.y) return 1;
    if (firstPoint.x < secondPoint.x) return -1;
    if (firstPoint.x > secondPoint.x) return 1;
    return 0;
}

function comparatorPointsByXAscending(firstPoint, secondPoint) {
    if (firstPoint.x < secondPoint.x) return -1;
    if (firstPoint.x > secondPoint.x) return 1;
    if (firstPoint.y < secondPoint.y) return -1;
    if (firstPoint.y > secondPoint.y) return 1;
    return 0;
}

function comparatorPointsByAngleAscending(firstPoint, secondPoint) {
    var angleA = getAngle(firstPoint)
    var angleB = getAngle(secondPoint)
    if (angleA > angleB) return 1;
    if (angleA < angleB) return -1;
    var distA = getDistanceBetweenPoints(centerOfPoints, firstPoint)
    var distB = getDistanceBetweenPoints(centerOfPoints, secondPoint)
    if (distA < distB) return 1;
    return -1;
}

function checkIfListContainsPoint(list, point) {
    for (let i = 0; i < list.length; i++) {
        if (list[i].x == point.x && list[i].y == point.y) {
            return true;
        }
    }
    return false;
}


function getEcuationCoefficients(firstPoint, secondPoint) {
    var coefX = secondPoint.y - firstPoint.y;
    var coefY = firstPoint.x - secondPoint.x;
    var coef = secondPoint.x * firstPoint.y - firstPoint.x * secondPoint.y;
    return {
        coefX: coefX,
        coefY: coefY,
        coef: coef
    }
}

function checkIfSegmentIncludesPoint(segment, point) {
    var minX, maxX, minY, maxY;
    if (segment.leftSegmentPoint.x < segment.rightSegmentPoint.x) {
        minX = segment.leftSegmentPoint.x;
        maxX = segment.rightSegmentPoint.x;
    }
    else {
        maxX = segment.leftSegmentPoint.x;
        minX = segment.rightSegmentPoint.x;
    }

    if (segment.leftSegmentPoint.y < segment.rightSegmentPoint.y) {
        minY = segment.leftSegmentPoint.y;
        maxY = segment.rightSegmentPoint.y;
    }
    else {
        maxY = segment.leftSegmentPoint.y;
        minY = segment.rightSegmentPoint.y;
    }
    if (minX <= point.x && point.x <= maxX && minY <= point.y && point.y <= maxY)
        return true;

    return false;
}

function getLinesIntersection(firstSegment, secondSegment) {
    var firstSegmentEcuationCoef = getEcuationCoefficients(firstSegment.leftSegmentPoint, firstSegment.rightSegmentPoint)
    var secondSegmentEcuationCoef = getEcuationCoefficients(secondSegment.leftSegmentPoint, secondSegment.rightSegmentPoint)

    var A1 = firstSegmentEcuationCoef.coefX;
    var B1 = firstSegmentEcuationCoef.coefY;
    var C1 = firstSegmentEcuationCoef.coef;
    var A2 = secondSegmentEcuationCoef.coefX;
    var B2 = secondSegmentEcuationCoef.coefY;
    var C2 = secondSegmentEcuationCoef.coef;

    var det = A1 * B2 - B1 * A2;
    if (det == 0) {
        if (A1 * C2 - A2 * C1 == 0 && B1 * C2 - B2 * C1 == 0) {
            return { status: "coincid", point: null }
        }
        return { status: "paralele", point: null };
    }
    var intersectionX = (-C1 * B2 + B1 * C2) / det;
    var intersectionY = (-A1 * C2 + A2 * C1) / det;
    var intersectionPoint = { x: intersectionX, y: intersectionY }
    return { status: "intersecteaza", point: intersectionPoint }
}



function calculateOrientationForCanvasPoints(firstPoint, middlePoint, endPoint) {
    // 2 = dreapta, 0 = coliniare, 1 = stanga
    let val = (middlePoint.x - firstPoint.x) * (endPoint.y - firstPoint.y) - (endPoint.x - firstPoint.x) * (middlePoint.y - firstPoint.y);
    if (val == 0) return 0;
    return (val > 0) ? 2 : 1;
}


function calculateOrientationForNormalPoints(firstPoint, middlePoint, endPoint) {
    // 2 = stanga,  1 = dreapta, 0 = coliniare
    let val = (middlePoint.x - firstPoint.x) * (endPoint.y - firstPoint.y)
        - (endPoint.x - firstPoint.x) * (middlePoint.y - firstPoint.y);
    if (val == 0) return 0;
    return (val > 0) ? 2 : 1;
}

function checkIfPointsAreCollinear(firstPoint, secondPoint, pointC) {
    var area = firstPoint.x * (secondPoint.y - pointC.y) + secondPoint.x * (pointC.y - firstPoint.y) + pointC.x * (firstPoint.y - secondPoint.y);
    return (area == 0)
}


function checkSamePoint(firstPoint, secondPoint) {
    if (Number(firstPoint.x.toFixed(4)) == Number(secondPoint.x.toFixed(4))
        && Number(firstPoint.y.toFixed(4)) == Number(secondPoint.y.toFixed(4))) {
        return true;
    }
    return false;
}



function addScrollToVisualSupportFunctionality() {
    var scrollButton = document.getElementById("scrollButton");
    var scrollIcon = scrollButton.firstChild;
    scrollButton.addEventListener("click", function () {
        if (scrollIcon.classList.contains("fa-arrow-down")) {
            scrollToVisualSupportSection("#visualSupportSection");
            scrollIcon.classList.remove("fa-arrow-down");
            scrollIcon.classList.add("fa-arrow-up")
            scrollButton.setAttribute("title", "Arata lectie");
        }
        else {
            scrollToVisualSupportSection("#startLesson");
            scrollIcon.classList.remove("fa-arrow-up")
            scrollIcon.classList.add("fa-arrow-down");
            scrollButton.setAttribute("title", "Arata suport vizual");
        }
    })
}

function scrollToVisualSupportSection(elementSelector) {
    $('html, body').animate({
        scrollTop: $(elementSelector).offset().top
    }, 1200);
}


function getPointsFromFile(fileContent) {
    var filePoints = [];
    try {
        var lines = fileContent.trim().split("\n")
        for (let lineNumber = 0; lineNumber < lines.length; lineNumber++) {
            var line = lines[lineNumber].trim()
            if (line) {
                let coordinates = line.split(" , ")
                let pointX = Number(coordinates[0].trim())
                let pointY = Number(coordinates[1].trim())
                filePoints.push({ x: pointX, y: pointY });
            }
        }
    } catch {
        filePoints = [];
    }
    return filePoints;
}