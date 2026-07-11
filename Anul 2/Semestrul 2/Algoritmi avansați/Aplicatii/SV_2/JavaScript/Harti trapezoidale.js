function Trapez(top, bottom, leftp, rightp) {
	this.bottom = bottom;
	this.top = top;
	this.leftp = leftp;
	this.rightp = rightp;

	this.node = null; //this property will be updated lately

	this.topLeft = null;
	this.topRight = null;
	this.bottomLeft = null;
	this.bottomRight = null;

	// properties for drawing
	this.idx = tridx;
	tridx++;
	this.polygon = this.getPolygon();
	this.center = this.getCenter();
	this.str = this.idx;
};

Trapez.prototype.getPolygon = function() {
	var polygon = [];
	var leftSweep = canvas.getSweepX(this.leftp.x);
	var rightSweep = canvas.getSweepX(this.rightp.x);
	if (this.leftp.lower === this.bottom) {
		polygon.push(intersection(leftSweep, this.bottom));
	}
	polygon.push(this.leftp);
	if (this.leftp.upper === this.top) {
		polygon.push(intersection(leftSweep, this.top));
	}
	if (this.rightp.upper === this.top) {
		polygon.push(intersection(rightSweep, this.top));
	}
	polygon.push(this.rightp);
	if (this.rightp.lower === this.bottom) {
		polygon.push(intersection(rightSweep, this.bottom));
	}
	return polygon;
}

Trapez.prototype.getCenter = function() {
	var point = getCenter(this.polygon);
	point.x += 10;
	point.y += 10;
	point.litera = this.idx;
	return point;
}

Trapez.prototype.updateNeighbors = function(topLeft, topRight, bottomLeft, bottomRight) {
	if (topLeft != null) {
		this.topLeft = topLeft;
		topLeft.topRight = this;
	}
	if (topRight != null) {
		this.topRight = topRight;
		topRight.topLeft = this;
	}
	if (bottomLeft != null) {
		this.bottomLeft = bottomLeft;
		bottomLeft.bottomRight = this;
	}
	if (bottomRight != null) {
		this.bottomRight = bottomRight;
		bottomRight.bottomLeft = this;
	}
};

var Node = function(info) {
	this.type = "trapez";
	this.leftn = null;
	this.rightn = null;
	this.info = info;
	info.node = this;
};

Node.prototype.changeType = function(type, leftn, rightn, info) {
	this.type = type;
	this.leftn = leftn;
	this.rightn = rightn;
	this.info = info;
}

Node.prototype.getLeafs = function() {
	if (this.leftn && this.rightn) {
		return this.leftn.getLeafs().concat(this.rightn.getLeafs());
	}
	if (this.leftn) {
		return this.leftn.getLeafs();
	}
	if (this.rightn) {
		return this.rightn.getLeafs();
	}
	return [this.info];
};

Node.prototype.search = function(point) {
	if (this.type == "trapez") {
		searchBreakPoints.push({
			"shape": "trapez",
			"data": this.info,
			"colour": "DeepSkyBlue"
		});
		return this;
	}

	if (this.type == "segment") {
		searchBreakPoints.push({
			"shape": "segment",
			"data": this.info,
			"colour": "red"
		});
		var orient = orientation(this.info.firstPoint, this.info.secondPoint, point);
		if (orient == "dreapta") {
			return this.rightn.search(point);
		}
		if (orient == "stanga") {
			return this.leftn.search(point);
		}
		return this;
	}

	if (this.type == "point") {
		searchBreakPoints.push({
			"shape": "point",
			"data": this.info,
			"colour": "red",
			"size": 5
		});
		if (point.x < this.info.x) {
			return this.leftn.search(point);
		}
		if (this.info.x < point.x) {
			return this.rightn.search(point);
		}
		return this;
	}
	console.log("wrong node type");
};

Node.prototype.chart = function() {
	if (this.type == "point") {
		var name = this.info.litera;
	}
	if (this.type == "trapez") {
		var name = this.info.str;
	}
	if (this.type == "segment") {
		var name = this.info.str();
	}

	var children = [];
	if (this.leftn != null) {
		children.push(this.leftn.chart());
	}
	if (this.rightn != null) {
		children.push(this.rightn.chart());
	}

	return {
		text: {
			name: name
		},
		children : children
	}
}

var D = {
	init: function() {
		var tr = {x:canvas.width, y:0};
		var bl = {x:0, y:canvas.height};
		var tl = {x: 0, y:0};
		var br = {x:canvas.width, y:canvas.height};
		var top = getSegmentX(tl, tr);
		var bottom = getSegmentX(bl, br);
		tl.lower = bottom;
		tl.upper = top;
		br.lower = bottom;
		br.upper = top;
		var tr = new Trapez(top, bottom, tl, br);

		var nod = new Node(tr);
		this.root = nod;
	},
	search: function(point) {
		return this.root.search(point);
	},
	getChart: function() {
		return {
			chart: generalChart,
			nodeStructure: this.root.chart()
		};
	},
	getLeafs: function() {
		return this.root.getLeafs();
	}
}

function newPoint(point) {
	for (var idx in canvas.points) {
		if (theSamePoint(point, canvas.points[idx])) {
			return false;
		}
	}
	return true;
}

function createExtension(point, trapez) {
	if (!newPoint(point)) {
		return false;
	}
	point.upper = trapez.top;
	point.lower = trapez.bottom;
	canvas.addPoint(point);

	return true;
}

function nextTrapezPosition(segm, trapez) {
	var orient = orientation(segm.firstPoint, segm.secondPoint, trapez.rightp);
	if (orient == "dreapta") {
		return "top";
	}
	if (orient == "stanga") {
		return "bottom";
	}
	return "none";
}

function getIntersectList(segm) {
	var point = segm.firstPoint;
	if (!newPoint(point)) {
		// se ia un punct de pe segment putin mai la dreapta
		point = intersection(segm, canvas.getSweepX(segm.firstPoint.x + near));
	}

	var node = D.search(point);
	var trList = [node.info];
	do {
		var lastTr = lastElem(trList);
		if (lastTr.rightp.x >=  segm.secondPoint.x) {
			break;
		}
		if (nextTrapezPosition(segm, lastTr) == "bottom") {
			trList.push(lastTr.bottomRight);
		}
		if (nextTrapezPosition(segm, lastTr) == "top") {
			trList.push(lastTr.topRight);
		}
	} while(true);

	return trList;
}

function createTrapez(segm, trapez, nodes, where) {
	var leftp = segm.firstPoint;
	var lastTr = null;
	var lastNode = lastElem(nodes);
	if (lastNode != null) {
		lastTr = lastNode.info;
		leftp = lastTr.rightp;
	}
	if (where == "bottom") {
		var newTrapez = new Trapez(segm, trapez.bottom, leftp, trapez.rightp);
	} else {
		var newTrapez = new Trapez(trapez.top, segm, leftp, trapez.rightp);
	}
	var newNode = new Node(newTrapez);

	nodes.push(newNode);
}

function createMiddleTrapezoids(segm, trList) {
	var bottomNodes = [];
	var topNodes = [];

	for (var idx in trList) {
		var trapez = trList[idx];
		trapez.type = nextTrapezPosition(segm, trapez);

		if (nextTrapezPosition(segm, trapez) == "top") {
			trapez.type = "bottom";
			trapez.rightp.upper = segm;
			createTrapez(segm, trapez, bottomNodes, "bottom");
			continue;
		}
		if (nextTrapezPosition(segm, trapez) == "bottom") {
			trapez.type = "top";
			trapez.rightp.lower = segm;
			createTrapez(segm, trapez, topNodes, "top");
			continue;
		}

		//last one
		createTrapez(segm, trapez, bottomNodes, "bottom");
		createTrapez(segm, trapez, topNodes, "top");
	}

	// set neighbours
	var previous = "";
	var lastBottom = trList[0].bottomLeft;
	var lastTop = trList[0].topLeft;
	for (var tidx=0, bidx=0, idx=0; idx<trList.length; idx++) {
		var trapez = trList[idx];
		var drawings = [];
		var thisNode = trapez.node;
		var message = "Se actualizează extensia <b>";
		thisNode.changeType("segment", topNodes[tidx], bottomNodes[bidx], segm);

		breakPoints.push([{
			"shape": "trapez",
			"data": trapez,
			"colour": "DeepSkyBlue",
			"message": "Se analizează trapezul <b>" + trapez.str + "</b>"
		}, {
			"shape": "segment",
			"data": segm
		}]);

		if (trapez.type != "top") {
			message = message + "superioară";
			var topLeft = null;
			var topRight = null;
			var bottomLeft = trapez.bottomLeft;
			var bottomRight = trapez.bottomRight;

			if (previous != "bottom") {
				previous = "bottom";
				bottomLeft = lastBottom;
				lastTop = trapez.topLeft;
			}
			if (bidx!=0) {
				topLeft = bottomNodes[bidx-1].info;
			}

			bottomNodes[bidx].info.updateNeighbors(topLeft, topRight, bottomLeft, bottomRight);
			drawings.push({
				"shape": "trapez",
				"data": bottomNodes[bidx].info,
				"colour": "SteelBlue",
				"message": "Se creează trapezul <b>" + bottomNodes[bidx].info.str + "</b>"
			});
			bidx++;
		}
		if (trapez.type != "bottom") {
			message = message + "inferioară";
			var topLeft = trapez.topLeft;
			var topRight = trapez.topRight;
			var bottomLeft = null;
			var bottomRight = null;

			if (previous != "top") {
				previous = "top";
				topLeft = lastTop;
				lastBottom = trapez.bottomLeft;
			}
			if (tidx!=0) {
				bottomLeft = topNodes[tidx-1].info;
			}

			topNodes[tidx].info.updateNeighbors(topLeft, topRight, bottomLeft, bottomRight);
			drawings.push({
				"shape": "trapez",
				"data": topNodes[tidx].info,
				"colour": "RoyalBlue",
				"message": "Se creează trapezul <b>" + topNodes[tidx].info.str + "</b>"
			});
			tidx++;
		}
		message = message + "</b> a punctului <b>" + trapez.rightp.litera;

		if (idx != trList.length - 1){
			breakPoints.push({
				"shape": "extension",
				"data": trapez.rightp,
				"colour": "red",
				"events": ["update"],
				"update": {
					"upper": trapez.rightp.upper,
					"lower": trapez.rightp.lower
				},
				"message": message
			});
		}

		drawings.push({
			"shape": "segment",
			"data": segm
		});
		drawings.push({
			"shape": "graph",
			"data": D.getChart()
		});
		drawings.push({
			"shape": "markers",
			"data": D.getLeafs()
		});

		breakPoints.push(drawings);
	}
}

function createLeftTrapez(point, trList) {
	var trapez = trList[0];

	var leftTrapez = new Trapez(trapez.top, trapez.bottom, trapez.leftp, point);
	var fakeTrapez = new Trapez(trapez.top, trapez.bottom, point, trapez.rightp);

	leftTrapez.updateNeighbors(trapez.topLeft, null, trapez.bottomLeft, null);
	fakeTrapez.updateNeighbors(leftTrapez, trapez.topRight, leftTrapez, trapez.bottomRight);

	var leftNode = new Node(leftTrapez);
	var fakeNode = new Node(fakeTrapez);

	trapez.node.changeType("point", leftNode, fakeNode, point);

	trList[0] = fakeTrapez;

	breakPoints.push([{
		"shape": "trapez",
		"data": leftTrapez,
		"colour": "Teal",
		"message": "Se creeaza trapezul <b>" + leftTrapez.str + "</b>"
	},{
		"shape": "graph",
		"data": D.getChart()
	},{
		"shape": "markers",
		"data": D.getLeafs()
	}]);
}

function createRightTrapez(point, trList) {
	var trapez = lastElem(trList);

	var rightTrapez = new Trapez(trapez.top, trapez.bottom, point, trapez.rightp);
	var fakeTrapez = new Trapez(trapez.top, trapez.bottom, trapez.leftp, point);

	rightTrapez.updateNeighbors(null, trapez.topRight, null, trapez.bottomRight);
	fakeTrapez.updateNeighbors(trapez.topLeft, rightTrapez, trapez.bottomLeft, rightTrapez);

	var rightNode = new Node(rightTrapez);
	var fakeNode = new Node(fakeTrapez);

	trapez.node.changeType("point", fakeNode, rightNode, point);

	trList[trList.length-1] = fakeTrapez;

	breakPoints.push([{
		"shape": "trapez",
		"data": rightTrapez,
		"colour": "Teal",
		"message": "Se creează trapezul <b>" + rightTrapez.str + "</b>"
	},{
		"shape": "graph",
		"data": D.getChart()
	},{
		"shape": "markers",
		"data": D.getLeafs()
	}]);
}

function modifyTrapezoids(segm) {
	canvas.permanent_drawings.push({
		"shape": "segment",
		"data": segm,
		"colour": "DarkCyan"
	});
	breakPoints.push([{
		"shape": "segment",
		"data": segm,
		"colour": "DarkCyan",
		"events": ["push", "redraw"],
		"message": "S-a introdus un nou segment."
	},{
		"shape": "markers",
		"data": D.getLeafs()
	}]);

	var trList = getIntersectList(segm);

	if (newPoint(segm.firstPoint)) {
		var point = segm.firstPoint;
		createExtension(point, trList[0]);
		var drawings = [{
			"shape": "liter",
			"data": point,
			"events": ["push"]
		}, {
			"shape": "point",
			"data": point,
			"events": ["push"]
		}, {
			"shape": "extension",
			"data": point,
			"size": 1,
			"events": ["push", "update"],
			"update": {
				"lower": point.lower,
				"upper": point.upper
			},
			"message": "Se creează punctul <b>" + point.litera + "</b> și extensia acestuia"
		}];
		extend(canvas.permanent_drawings, drawings);
		breakPoints.push(drawings);

		createLeftTrapez(point, trList);
	}
	if (newPoint(segm.secondPoint)) {
		var point = segm.secondPoint;
		createExtension(point, lastElem(trList));
		var drawings = [{
			"shape": "liter",
			"data": point,
			"events": ["push"]
		}, {
			"shape": "point",
			"data": point,
			"events": ["push"]
		}, {
			"shape": "extension",
			"data": point,
			"size": 1,
			"events": ["push", "update"],
			"update": {
				"lower": point.lower,
				"upper": point.upper
			},
			"message": "Se creează punctul <b>" + point.litera + "</b> și extensia acestuia"
		}];
		extend(canvas.permanent_drawings, drawings);
		breakPoints.push(drawings);

		createRightTrapez(point, trList);
	}
	createMiddleTrapezoids(segm, trList);

	canvas.redraw();
	canvas.draw({
		"shape": "graph",
		"data": D.getChart()
	});
	canvas.draw({
		"shape": "markers",
		"data":  D.getLeafs()
	});
}

function init() {
	canvas.segmente = [];
	canvas.points = [];
	canvas.addEvent("click", firstClick);
	loadButton.addEventListener("click", loadSegments);
	$("#shuffleButton").click(shuffle);

	this.tridx = 0;
	this.searchBreakPoints = [];
	D.init();
}


function firstClick(event) {
	var punct = canvas.genericEvent(event);
	if (!pointOk(punct)) {
		return false;
	}
	canvas.removeEvent("click", firstClick);
	canvas.firstPoint = punct;

	canvas.addEvent("click", secondClick);
	canvas.addEvent("mousemove", mouseMove);

	return true;
}

function tooNear(point, segm) {
	var picior = piciorulPerpendicularei(point, segm);
	return between(picior, segm) && pointDistance(picior, point) < near;
}

function pointOk(verif) {
	if (verif.x <= 0 || verif.x >= canvas.width)
		return false;
	if (verif.y <= 0 || verif.y >= canvas.height)
		return false;

	for (var idx in canvas.points) {
		var point = canvas.points[idx];
		if (theSamePoint(verif, point)) {
			return true;
		}

		if (point.x == verif.x) {
			return false;
		}
	}

	for (var idx in canvas.segmente) {
		if (tooNear(verif, canvas.segmente[idx])) {
			return false;
		}
	}

	return true;
}

function segmentOk(verif) {
	if (verif.secondPoint.x == verif.firstPoint.x) {
		return false;
	}

	for (var idx in canvas.segmente) {
		var segm = canvas.segmente[idx];

		if (!theSamePoint(segm.secondPoint, verif.secondPoint) &&
			!theSamePoint(segm.secondPoint, verif.firstPoint) &&
			tooNear(segm.secondPoint, verif)) {
			return false;
		}
		if (!theSamePoint(segm.firstPoint, verif.secondPoint) &&
			!theSamePoint(segm.firstPoint, verif.firstPoint) &&
			tooNear(segm.firstPoint, verif)) {
			return false;
		}

		if ((theSamePoint(segm.firstPoint, verif.firstPoint) ||
			theSamePoint(segm.firstPoint, verif.secondPoint)) &&
			(theSamePoint(segm.secondPoint, verif.firstPoint) ||
			theSamePoint(segm.secondPoint, verif.secondPoint))) {
			return false;
		}

		var int = has_intersection(verif, segm);
		if (false === int) {
			continue;
		}

		if ((theSamePoint(int, verif.secondPoint) || theSamePoint(int, verif.firstPoint)) &&
			(theSamePoint(int, segm.secondPoint) || theSamePoint(int, segm.firstPoint))) {
			continue;
		}

		return false;
	}
	return true;
}

function secondClick(event) {
	var punct = canvas.genericEvent(event);
	if (!pointOk(punct)) {
		return;
	}

	var segment = getSegmentX(canvas.firstPoint, punct);
	if (!segmentOk(segment)) {
		return;
	}

	if (pointDistance(segment.firstPoint, segment.secondPoint) < near) {
		return;
	}

	canvas.removeEvent("click", secondClick);
	canvas.removeEvent("mousemove", mouseMove);
	canvas.addEvent("click", firstClick);
	canvas.firstPoint = null;

	canvas.segmente.push(segment);
	modifyTrapezoids(segment);
}

function instantInsert(p1, p2) {
	var ev1 = canvas.genericEventReverse(p1);
	if(firstClick(ev1)) {
		var ev2 = canvas.genericEventReverse(p2);
		secondClick(ev2);
	}
}

function loadSegments() {
	loadButton.style.visibility = "hidden";
	loadButton.removeEventListener("click", loadSegments);

	if (typeof harti === 'undefined') {
		alert("nu s-a gasit variabila 'harti' în fișierul 'puncte.js'")
		return;
	}
	if (typeof harti !== 'object') {
		alert("variabila 'harti' nu este o lista")
		return;
	}
	var ok = true;
	for (var idx in harti) {
		var segm = harti[idx];
		if (!canvas.pointOK(segm.p1) || !canvas.pointOK(segm.p2)) {
			ok = false;
			continue;
		}
		instantInsert(segm.p1, segm.p2);
	}
	if (!ok) {
		alert("unele date din lista sunt corupte");
	}
}

function mouseMove(event) {
	canvas.redraw();

	var punct = canvas.genericEvent(event);
	if (!pointOk(punct)) {
		return;
	}

	var segm = getSegmentX(canvas.firstPoint, punct);
	if (!segmentOk(segm)) {
		return;
	}

	var drawing = {
		"shape": "segment",
		"data": segm,
		"colour": "CadetBlue"
	};
	canvas.draw(drawing);
}

function shuffle() {
	permute(canvas.segmente);
	run();
}

function find(event) {
	canvas.redraw();
	var point = canvas.genericEvent(event);
	if (!pointOk(point)) {
		return;
	}
	canvas.draw({
		"shape": "point",
		"data": point
	});

	searchBreakPoints = [];
	var where = D.search(point);
	console.log(where.info);
	runButton.style.visibility = "hidden";
	startButton.style.visibility = "hidden";
	shuffleButton.style.visibility = "hidden";

	var idx = 0;
	function timer() {
		if (idx == searchBreakPoints.length){
			runButton.style.visibility = "visible";
			startButton.style.visibility = "visible";
			shuffleButton.style.visibility = "visible";
			canvas.draw({
				"shape": "point",
				"data": point
			});
			return null;
		}
		canvas.action(searchBreakPoints[idx]);
		idx++;
		setTimeout(timer, speedMap[speedSelector.value]);
	}
	timer();
}

function run() {
	canvas.liter = 'A';
	canvas.points = [];
	this.tridx = 0;
	this.searchBreakPoints = [];
	D.init();
	breakPoints = [];
	canvas.permanent_drawings = [];
	for (var idx in canvas.segmente) {
		modifyTrapezoids(canvas.segmente[idx]);
	}
}
function condition() {
	return true;
}

function firstPart() {
	if (canvas.firstPoint != null) {
		canvas.removeEvent("click", secondClick);
		canvas.removeEvent("mousemove", mouseMove);
		canvas.redraw();
	}

	run();
	canvas.removeEvent("click", firstClick);
	shuffleButton.style.visibility = "hidden";
	canvas.permanent_drawings = [];

	canvas.draw({
		"shape": "graph",
		"data": {
			chart: generalChart,
			nodeStructure: {}
		}
	});
	return true;
}

function callback() {
	canvas.permanent_drawings.push({
		"shape": "markers",
		"data": D.getLeafs()
	});
	canvas.redraw();
	canvas.addEvent("click", find);
	shuffleButton.style.visibility = "visible";
}