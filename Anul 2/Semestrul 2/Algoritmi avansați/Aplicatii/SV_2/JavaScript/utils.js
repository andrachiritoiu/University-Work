var near = 10;

function nextChar(c) {
    return String.fromCharCode(c.charCodeAt(0) + 1);
}

function nextLiter(c) {
	if (c == "Z"){
		return "Aa";
	}

    if (c.length == 1) {
    	return nextChar(c);
    }
    if (c[1] == "z")
    	return nextChar(c[0]) + "a";
    return c[0] + nextChar(c[1]);
}

function extend(array1, array2) {
	array1.push.apply(array1, array2);
	return array1;
}

function copy(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function random(min, max) {
	if (min > max)
		return null;
	var nr = Math.random();
	nr = nr * (max - min) + min;
	return nr;
}

function permute(array) {
	var len = array.length;
	for (var idx=0; idx<len; idx++) {
		var perm = Math.floor(random(0, len-1));
		var aux = array[perm];
		array[perm] = array[idx];
		array[idx] = aux;
	}
}

function determinant3(matrice) {
	if (matrice.length != 3){
		console.log("cannot calculate delta");
		return null;
	}
	var l0 = matrice[0];
	var l1 = matrice[1];
	var l2 = matrice[2];

	if (l0.length != 3 || l1.length != 3 || l2.length != 3){
		console.log("cannot calculate delta");
		return null;
	}

	return l0[0]*l1[1]*l2[2] + l0[1]*l1[2]*l2[0] + l0[2]*l1[0]*l2[1] -
		l0[2]*l1[1]*l2[0] - l0[1]*l1[0]*l2[2] - l0[0]*l1[2]*l2[1];
}

function determinant2(matrice) {
	if (matrice.length != 2){
		console.log("cannot calculate delta");
		return null;
	}
	var l0 = matrice[0];
	var l1 = matrice[1];

	if (l0.length != 2 || l1.length != 2){
		console.log("cannot calculate delta");
		return null;
	}

	return l0[0]*l1[1] - l0[1]*l1[0];
}

function coliniare(p1, p2, p3) {
	var matrice = [[p1.x, p1.y, 1],
				   [p2.x, p2.y, 1],
				   [p3.x, p3.y, 1]];
	return determinant3(matrice) == 0;
}

function floor(point) {
	return {
		x: Math.floor(point.x),
		y: Math.floor(point.y)
	};
}

function lastElem(array) {
	var len = array.length;
	if (len == 0) {
		return null;
	}
	return array[len-1];
}

function orientation(p1, p2, p3) {
	var D = determinant3([[1, 1, 1], [p1.x, p2.x, p3.x], [p1.y, p2.y, p3.y]]);

	if (D == 0)
		return "fata";
	// invers fata de sistemul de coordonate xOy
	// in canvas, "cresterea" coordonatei y este de sus in jos
	if (D > 0)
		return "dreapta";
	if (D < 0)
		return "stanga";
}

function sort(list, compare) {
	var len = list.length;
	if (len < 2) {
		return list;
	}
	var st = list.slice(0, len/2);
	var dr = list.slice(len/2, len);

	var sort_st = sort(st, compare);
	var sort_dr = sort(dr, compare);

	var sorted = [];
	var idx_st = 0, idx_dr = 0;
	while (idx_st < sort_st.length && idx_dr < sort_dr.length) {
		if (compare(sort_st[idx_st], sort_dr[idx_dr]) > 0) {
			sorted.push(sort_dr[idx_dr]);
			idx_dr++;
		} else {
			sorted.push(sort_st[idx_st]);
			idx_st++;
		}
	}
	sorted.push.apply(sorted, sort_st.slice(idx_st, sort_st.length));
	sorted.push.apply(sorted, sort_dr.slice(idx_dr, sort_dr.length));

	return sorted;
}

function comparePointsY(p1, p2) {
	if (p1.y < p2.y) return -1;
	if (p1.y > p2.y) return 1;
	if (p1.x < p2.x) return -1;
	if (p1.x > p2.x) return 1;
	return 0;
}

function compareSegmentsY(s1, s2) {
	var compSup = comparePointsY(s1.firstPoint, s2.firstPoint);
	if (compSup != 0) {
		return compSup;
	}
	return comparePointsY(s1.secondPoint, s2.secondPoint);
}

function comparePointsX(p1, p2) {
	if (p1.x < p2.x) return -1;
	if (p1.x > p2.x) return 1;
	if (p1.y < p2.y) return -1;
	if (p1.y > p2.y) return 1;
	return 0;
}

function compareSegmentsX(s1, s2) {
	var compSup = comparePointsX(s1.firstPoint, s2.firstPoint);
	if (compSup != 0) {
		return compSup;
	}
	return comparePointsX(s1.secondPoint, s2.secondPoint);
}

function between(point, seg) {
	if (areNear(point, seg.firstPoint) ||
		areNear(point, seg.secondPoint)) {
		return true;
	}
	var leftX = seg.firstPoint.x;
	var rightX = seg.secondPoint.x;
	if (leftX > rightX) {
		leftX = rightX;
		rightX = seg.firstPoint.x;
	}

	if (point.x < leftX || rightX < point.x)
		return false;

	var upperY = seg.firstPoint.y;
	var lowerY = seg.secondPoint.y;
	if (lowerY < upperY) {
		lowerY = upperY;
		upperY = seg.secondPoint.y;
	}
	if (point.y < upperY || lowerY < point.y)
		return false;

	return true;
}

function areNear(p1, p2) {
	return pointDistance(p1, p2) < near;
}

function ecuatia_dreptei(segm) {
	// x * x_coef + y * y_coef = termen_liber
	var A = segm.firstPoint;
	var B = segm.secondPoint;
	return {
		"x_coef": A.y - B.y,
		"y_coef": B.x - A.x,
		"termen_liber": - A.x*B.y + B.x*A.y
	}
}

function concat(a1, a2, a3) {
	var a = a1.concat(a2);
	if (typeof a3 === "undefined")
		return a;
	return a.concat(a3);
}

function intersection(seg1, seg2) {
	var dr1 = ecuatia_dreptei(seg1);
	var dr2 = ecuatia_dreptei(seg2);
	var matrice = [[dr1.x_coef, dr1.y_coef],
				   [dr2.x_coef, dr2.y_coef]];
	var delta = determinant2(matrice);

	if (delta == 0)
		return false;

	matrice = [[dr1.termen_liber, dr1.y_coef],
			   [dr2.termen_liber, dr2.y_coef]];
	var x = determinant2(matrice) / delta;

	matrice = [[dr1.termen_liber, dr1.x_coef],
			   [dr2.termen_liber, dr2.x_coef]]
	var y = - determinant2(matrice) / delta;

	return {
		"x": x,
		"y": y
	}
}

function has_intersection(seg1, seg2) {
	var int = intersection(seg1, seg2);

	if (false === int)
		return false;

	if (between(int, seg1) && between(int, seg2)) {
		return int;
	}

	return false;
}

function getSegmentY(point1, point2) {
	var firstPoint, secondPoint;

	if (comparePointsY(point1, point2) <= 0) {
		firstPoint = point1;
		secondPoint = point2;
	} else {
		firstPoint = point2;
		secondPoint = point1;
	}

	return {
		"firstPoint": firstPoint,
		"secondPoint": secondPoint,
		"str": function() {return firstPoint.litera + secondPoint.litera}
	}
}

function getSegmentX(point1, point2) {
	var firstPoint, secondPoint;

	if (comparePointsX(point1, point2) <= 0) {
		firstPoint = point1;
		secondPoint = point2;
	} else {
		firstPoint = point2;
		secondPoint = point1;
	}

	return {
		"firstPoint": firstPoint,
		"secondPoint": secondPoint,
		"str": function() {return firstPoint.litera + secondPoint.litera}
	}
}

function theSamePoint(p1, p2) {
	return p1.x == p2.x && p1.y == p2.y;
}

function pointDistance(point1, point2) {
	return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
}

function panta(segment) {
	return (segment.secondPoint.y - segment.firstPoint.y) /
		   (segment.secondPoint.x - segment.firstPoint.x);
}

function piciorulPerpendicularei(point, segment) {
	if (segment.secondPoint.x == segment.firstPoint.x) {
		return {
			x: segment.secondPoint.x,
			y: point.y
		}
	}
	if (segment.secondPoint.y == segment.firstPoint.y) {
		return {
			x: point.x,
			y: segment.secondPoint.y
		}
	}

	var m = -(1/panta(segment));
	var another = {
		x: 0,
		y: point.y - m*point.x
	};

	if (theSamePoint(point, another)) {
		another.x = 1;
		another.y = another.y + m;
	}
	var perp = getSegmentY(point, another);
	return intersection(perp, segment);
}

function getCenter(polygon) {
	var X = 0;
	var Y = 0;
	for (var idx in polygon) {
		X += polygon[idx].x;
		Y += polygon[idx].y;
	}
	return {
		x: X/polygon.length,
		y: Y/polygon.length
	}
}
