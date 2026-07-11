var Canvas = function(elementId) {
	this.element = document.getElementById(elementId);
    this.width = this.element.width;
    this.height = this.element.height;
	this.ctx = this.element.getContext("2d");
	this.permanent_drawings = [];
	this.points = [];
	this.liter = 'A';
}

Canvas.prototype.drawPoint = function(point, colour, size) {
	this.ctx.beginPath();
	this.ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);		// un punct este de fapt un cerc plin
	this.ctx.fillStyle = colour;
	this.ctx.fill();
	this.ctx.closePath();
}

Canvas.prototype.drawLiter = function(point, colour) {
	this.ctx.beginPath();
	this.ctx.font = "15px Arial";
	this.ctx.fillStyle = colour;
    this.ctx.fillText(point.litera, point.x-10, point.y-10);
	this.ctx.closePath();
}

Canvas.prototype.drawPolygon = function(points, colour) {
	this.ctx.beginPath();
	this.ctx.fillStyle = colour;
	this.ctx.moveTo(points[0].x, points[0].y);

	for (var idx=1; idx<points.length; idx++){
		this.ctx.lineTo(points[idx].x, points[idx].y);
	}

	this.ctx.closePath();
	this.ctx.fill();

	for (var idx=1; idx<points.length; idx++){
		var segm = getSegmentY(points[idx - 1], points[idx]);
		this.drawLine(segm, "black", 1);
	}
}

Canvas.prototype.drawLine = function(segment, colour, width) {
	this.ctx.beginPath();
	this.ctx.moveTo(segment.firstPoint.x, segment.firstPoint.y);
	this.ctx.lineTo(segment.secondPoint.x, segment.secondPoint.y);
	this.ctx.lineWidth = width;
    this.ctx.strokeStyle = colour;
	this.ctx.stroke();
	this.ctx.closePath();
}

Canvas.prototype.draw = function(drawing) {
	var data = drawing.data;
	if (typeof drawing.colour == "undefined") {
		drawing.colour = "black";
	}
	if (typeof drawing.size == "undefined") {
		drawing.size = 3;
	}
	switch (drawing.shape) {
	case "segment": {
		this.drawLine(data, drawing.colour, drawing.size);
		break;
	};
	case "point": {
		this.drawPoint(data, drawing.colour, drawing.size);
		break;
	};
	case "liter": {
		this.drawLiter(data, drawing.colour);
		break;
	};
	case "sweepY": {
		this.drawLine(this.getSweepY(data.y), "black", 1);
		this.drawPoint(data, drawing.colour, drawing.size);
		break;
	};
	case "polygon": {
		this.drawPolygon(data, drawing.colour);
		break
	};
	case "trapez": {
		this.drawPolygon(data.polygon, drawing.colour);
		this.drawLiter(data.center, "black");
		break
	};
	case "extension": {
		var sweep = this.getSweepX(data.x);
		var lowerPoint = intersection(sweep, data.lower);
		var upperPoint = intersection(sweep, data.upper);
		var ext = getSegmentY(lowerPoint, upperPoint);
		this.drawLine(ext, drawing.colour, drawing.size);
		break;
	};
	case "graph": {
		var my_chart = new Treant(data);
		break;
	};
	case "markers": {
		for (var idx in data) {
			this.drawLiter(data[idx].center, "black");
		}
		break;
	};
	default: {
		console.log("wrong shape: " + drawing.shape);
	}
	}
}

Canvas.prototype.action = function(drawing) {
	if (typeof drawing.message !== "undefined") {
		messList.append( '<li>' + drawing.message + '</li>' );
	}
	for (idx in drawing.events) {
		var ev = drawing.events[idx];
		if (ev == "push") {
			this.permanent_drawings.push(drawing);
		}
		if (ev == "pop") {
			this.permanent_drawings.pop();
		}
		if (ev == "redraw") {
			this.redraw();
		}
		if (ev == "update") {
			for (var key in drawing.update) {
				drawing.data[key] = drawing.update[key];
			}
		}
	}
	this.draw(drawing);
}

Canvas.prototype.redraw = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
	for (var idx in this.permanent_drawings) {
		this.draw(this.permanent_drawings[idx]);
	}
}

Canvas.prototype.getSweepY = function(y) {
	return {
		"firstPoint": {
			"x": 0,
			"y": y
		},
		"secondPoint": {
			"x": this.width,
			"y": y
		}
	}
}

Canvas.prototype.getSweepX = function(x) {
	return {
		"firstPoint": {
			"x": x,
			"y": 0
		},
		"secondPoint": {
			"x": x,
			"y": this.height
		}
	}
}

Canvas.prototype.genericEvent = function(event) {
	// this.element = document.getElementById(canvasId);
	var rect = this.element.getBoundingClientRect();
	var punct = {
		"x": event.clientX - rect.left,
		"y": event.clientY - rect.top
	};
	return this.getNearPoint(punct);
}

Canvas.prototype.genericEventReverse = function(point) {
	var rect = this.element.getBoundingClientRect();
	var event = {
		clientX: point.x + rect.left,
		clientY: point.y + rect.top
	}
	return event;
}

Canvas.prototype.getNearPoint = function(point) {
	for (var idx in this.points) {
		if (areNear(this.points[idx], point)) {
			return this.points[idx];
		}
	}
	return point;
}

Canvas.prototype.pointOK = function(point) {
	if (typeof point !== "object" ||
		typeof point.x !== "number" ||
		typeof point.y !== "number") {
		return false;
	}
	if (isNaN(point.x) || isNaN(point.y)) {
		return false;
	}
	if (point.x < 0 || point.x > this.width ||
		point.y < 0 || point.y > this.height) {
		return false;
	}
	return true;
}

Canvas.prototype.addPoint = function(point) {
	// point.litera = "P" + canvas.points.length;
	point.litera = this.liter;
	this.liter = nextLiter(this.liter);

	this.points.push(point);
}

Canvas.prototype.leftmostPoint = function() {
	if (this.points.length == 0)
		return null;

	var leftmost = this.points[0];
	for (idx in this.points) {
		point = this.points[idx];
		if (point.x == "undefined"){
			console.log("leftPoint function must get list of correct points");
			return null;
		}
		if (point.x < leftmost.x){
			leftmost = point;
		}
	}

	return leftmost;
}

Canvas.prototype.addEvent = function(action, fct) {
	this.element.addEventListener(action, fct);
}

Canvas.prototype.removeEvent = function(action, fct) {
	this.element.removeEventListener(action, fct);
}