function init() {
	this.algorithm =  document.getElementById("algorithmSelector");
	canvas.addEvent("click", addPoint);
	loadButton.addEventListener("click", loadPoints);
}

function addPoint(event) {
	var punct = canvas.genericEvent(event);
	canvas.addPoint(punct);

	canvas.draw({
		"shape":"point",
		"data": punct
	});
	canvas.draw({
		"shape":"liter",
		"data": punct
	});
}

function loadPoints() {
	loadButton.style.visibility = "hidden";
	loadButton.removeEventListener("click", loadPoints);
	if (typeof acoperiri === 'undefined') {
		alert("nu s-a gasit variabila 'acoperiri' în fișierul 'puncte.js'")
		return;
	}
	var ok = true;
	if (typeof acoperiri !== 'object') {
		alert("variabila 'acoperiri' nu este o lista")
		return;
	}
	for (var idx in acoperiri) {
		if (!canvas.pointOK(acoperiri[idx])) {
			ok = false;
			continue;
		}
		var ev = canvas.genericEventReverse(acoperiri[idx]);
		addPoint(ev);
	}
	if (!ok) {
		alert("unele date din lista sunt corupte");
	}
}

function runJarvis(){
	var valid = true;
	var S, to_draw;
	var L = [];
	L.push(canvas.leftmostPoint());

	// break point
	to_draw = {
		"shape": "point",
		"data": L[0],
		"colour": "cyan",
		"message": "Punctul <b>" + L[0].litera + "</b> e cel mai din dreapta."
	};
	breakPoints.push(to_draw)
	while (true) {
		var last = lastElem(L);
		do {
			var nr = Math.floor(random(0, canvas.points.length));
			S = canvas.points[nr];
		} while (S == last)

		// break point
		to_draw = [{
			"shape": "segment",
			"data": getSegmentY(last, S),
			"colour": "CadetBlue",
			"events": ["push", "redraw"]
		},{
			"shape": "point",
			"data": S,
			"colour": "cyan",
			"events": ["push", "redraw"],
			"message": "Punctul <b>" + S.litera + "</b> este pivotul ales la întâmplare."
		}];
		breakPoints.push(to_draw);

		for (var idx in canvas.points) {
			var pct = canvas.points[idx];
			var orient = orientation(last, S, pct);

			// break point
			breakPoints.push({
				"shape": "point",
				"data": pct,
				"colour": "red",
				"size": 4,
				"events": ["redraw"],
				"message": "Punctul <b>" + pct.litera + "</b> este în <b>" + orient + "</b> segmentului <b>" + last.litera + S.litera + "</b>"
			});

			if (orient !== "dreapta") {
				continue;
			}

			// break point
			to_draw = [{
				"shape": "segment",
				"data": getSegmentY(last, pct),
				"colour": "CadetBlue",
				"events": ["pop", "pop", "push"]
			},{
				"shape": "point",
				"data": pct,
				"colour": "cyan",
				"events": ["push", "redraw"],
				"message": "Punctul <b>" + pct.litera + "</b> devine pivot."
			}];
			breakPoints.push(to_draw);
			S = pct;
		}

		// break point
		to_draw = {
			"shape": "segment",
			"data": getSegmentY(last, S),
			"events": ["pop", "pop", "push", "redraw"],
			"message": "Punctul <b>" + S.litera + "</b> face parte din acoperirea convexă."
		};
		breakPoints.push(to_draw);

		if (S == L[0]) {
			break;
		}
		L.push(S);
	}
	return L;
}

function check(array, point) {
	breakPoints.push({
		"shape": "point",
		"data": point,
		"colour": "DeepSkyBlue",
		"size": 4,
		"events": ["redraw"],
		"message": "Urmatorul punct in listă este <b>" + point.litera + "</b>"
	});
	do {
		var len = array.length;
		var last = array[len-1];
		var anteLast = array[len-2];
		var orient = orientation(anteLast, last, point);
		var segm = getSegmentX(last, anteLast);
		breakPoints.push([{
			"shape": "segment",
			"data": segm,
			"colour": "DeepSkyBlue",
			"events": ["redraw"]
			}, {
			"shape": "point",
			"data": point,
			"colour": "DeepSkyBlue",
			"size": 4,
			"message": "Punctul <b>" + point.litera + "</b> este în <b>" + orient + "</b> segmentului <b>" + anteLast.litera + last.litera + "</b>"
		}]);
		if (orient !== "stanga") {
			array.pop();
			breakPoints.push({
				"shape": "segment",
				"data": segm,
				"colour": "red",
				"message": "Se șterge punctul <b>" + last.litera + "</b>",
				"events": ["pop"]
			});
		} else {
			break;
		}
	} while (len >=3);

	array.push(point);

	var len = array.length;
	var segm = getSegmentX(array[len-2], array[len-1]);
	breakPoints.push({
		"shape": "segment",
		"data": segm,
		"events": ["push", "redraw"],
		"message": "Se adaugă punctul <b>" + point.litera + "</b>"
	});
}

function runGrahams() {
	var sortedPoints = sort(canvas.points, comparePointsX);
	var len = sortedPoints.length;

	var lower = [];
	lower.push(sortedPoints[0]);
	lower.push(sortedPoints[1]);
	breakPoints.push({
		"shape": "segment",
		"data": getSegmentX(lower[0], lower[1]),
		"events": ["push"],
		"message": "Frontiera inferioară - puncte de start: <b>" + lower[0].litera + " " + lower[1].litera + "</b>"
	});

	for (var idx=2; idx<len; idx++) {
		check(lower, sortedPoints[idx])
	}

	var upper = [];
	upper.push(sortedPoints[len-1]);
	upper.push(sortedPoints[len-2]);
	breakPoints.push({
		"shape": "segment",
		"data": getSegmentX(upper[0], upper[1]),
		"events": ["push"],
		"message": "Frontiera superioară - puncte de start: <b>" + upper[0].litera + " " + upper[1].litera + "</b>"
	});

	for (var idx=len-3; idx>=0; idx--) {
		check(upper, sortedPoints[idx]);
	}
	lower.pop();
	upper.pop();

	return extend(lower, upper);
}

function condition() {
	if (canvas.points.length < 2) {
		message.innerText = "at least 2 points";
		return null;
	}
	return true;
}

function firstPart() {
	canvas.removeEvent("click", addPoint);

	for (var idx in canvas.points) {
		extend(canvas.permanent_drawings, [{
			"shape":"point",
			"data": canvas.points[idx]
		}, {
			"shape":"liter",
			"data": canvas.points[idx]
		}]);
	}
	canvas.redraw();

	if (algorithm.value == 0) {
		canvas.acoperirea = runGrahams();
	} else {
		canvas.acoperirea = runJarvis();
	}

	return true;
}

function callback(){
	for (var idx in canvas.acoperirea) {
		canvas.draw({
			"shape": "point",
			"data": canvas.acoperirea[idx],
			"colour": "red",
			"size": 4
		});
	}

	return;
}
