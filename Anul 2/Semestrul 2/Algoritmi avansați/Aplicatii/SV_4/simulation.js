
var POPUP_X_DELTA = 100,
	POPUP_Y_DELTA = 40 ;

absoluteOffset = function(element) {
	var top = 0, left = 0;
	do {
		top += element.offsetTop || 0;
		left += element.offsetLeft || 0;
		element = element.offsetParent;
	} while (element);

	return {
		top : top,
		left : left,
	};
};

function pixels(n) {
	return n + "px";
}

getPopupTopLeft = function(elementId) {
	var e = document.getElementById(elementId);
	var p = absoluteOffset(e);
	return [p.top + POPUP_Y_DELTA, p.left + POPUP_X_DELTA];
};

function newDiv() {
	return document.createElement("div");
}

jQuery(function ($) {
	$('#calldoc').click(function (e) {
		$('#popup').modal({
			
			opacity: 0,
			
			overlayClose: true,
			
			position: getPopupTopLeft('main'),
			
			onOpen: function (dialog) {
				dialog.overlay.show();
				dialog.container.fadeIn('fast', function() {dialog.data.fadeIn('fast');});
			},
		
			onClose: function (dialog) {
				dialog.container.fadeOut('fast', function() {$.modal.close();});
			}
		
		});
		return false;
	});
});

/* 
 * Avem nevoie de aceasta variabila globala pentru a accesa 
 * obiectul FortunseSimulation din functiile callback
 * (animatie si tratarea evenimentelor keydown) 
 */
var fortuneSim = undefined;

var Engine = {

	getInputValue : function(inputId, def) {
		var input = document.getElementById(inputId);
		if (!input)
			return;
		var n = parseInt(input.value);
		if (!n)
			n = def !== undefined ? def : 0;
		return n;
	},
	
	getCheckBoxValue : function(inputId, def) {
		var input = document.getElementById(inputId);
		if (!input)
			return false;
		return input.checked;
	},	
		
	hookKeys: function(deltaId) {
		var eng = this;
		var khandle = function(e) {
			e = e || event;
			var delta = eng.getInputValue(deltaId, 1);
			if (e.keyCode == 40) 
				fortuneSim.sweep(delta);
			if (e.keyCode == 34) 
				fortuneSim.sweep(delta * 2);

		};
		document.getElementById(deltaId).onkeydown = khandle;
	},	
		
	initSimulation : function(canvasId, deltaId) {
		var canvas = document.getElementById(canvasId);
		fortuneSim = new FortuneSimulation(canvas);
		this.hookKeys(deltaId);
	},

	addRandomSites : function(inputId) {
		n = this.getInputValue(inputId, 30);
		fortuneSim.addRandomSites(n);
	},

	clearAllSites : function(senderId) {
		fortuneSim.clearSites();
	},
	
	execute : function() {
		fortuneSim.compute();
	},
	
	benchmark : function(id) {
		fortuneSim.benchmark(id);
	},
	
	startAnimation : function(deltaId, delayId) {
		var delta = this.getInputValue(deltaId, 5);
		var delay = this.getInputValue(delayId, 100);
		fortuneSim.startAnimation(delta, delay);
	},
	
	stopAnimation : function() {
		fortuneSim.stopAnimation();
	},
	
	advanceSweepLine : function(inputId) {
		n = this.getInputValue(inputId, 1);
		fortuneSim.sweep(n);
	},
	
	reset : function() {
		fortuneSim.reset();
	},

	triangulate : function(ckEdgesId, fromCk) {
		var showEdges = this.getCheckBoxValue(ckEdgesId, false);
		fortuneSim.triangulate(showEdges, fromCk === undefined ? false : fromCk);
	},

};




/**
 * Componenta de simulare grafica a executiei algoritmului lui Fortune.
 * 
 */
function FortuneSimulation(canvas) {

	//culori si stiluri (pe viitor poate vor fi configurabile)
	//canvas
	this.CANVAS_BG_COLOR = '#FFFFFF';
	this.CANVAS_FG_COLOR = '#2E4B92';
    //linia de baleiere
	this.SWEEP_LINE_COLOR = '#FF0000';
	this.SWEEP_LINE_WIDTH = 0.85;
	//site-urile
	this.SITE_RADIUS_1 = 3;//raza inainte de terminare
	this.SITE_RADIUS_2 = 2;//raza dupa terminare
	this.SITE_RADIUS_3 = 4;//raza la afisarea triangularii
	this.SITE_COLOR = '#901010';
	//muchiile Voronoi
	this.EDGE_COLOR = '#2E4B92';
	this.EDGE_WIDTH = 1;
	//circle-eventuri
	this.CIRCLE_COLOR = '#FF9900';
	this.CIRCLE_LINE_WIDTH = 2.5;
	this.CIRCLE_CENTER_COLOR = '#FF9900';
	this.CIRCLE_CENTER_RADIUS = 3;
	//beachline
	this.BEACH_LINE_COLOR_1 = '#006699';//divergenta
	this.BEACH_LINE_COLOR_2 = '#FF9900';//convergenta
	this.BEACH_LINE_WIDTH   = 2.5;
	//nodurile Voronoi
	this.VERTEX_COLOR = '#2E4B92';
	this.VERTEX_RADIUS = 2.5;
	//triunghiuri
	this.TRIANGLE_COLOR = '#000';
	this.TRIANGLE_LINE_WIDTH = 1;

	//Suprafata de desenare
	this.canvas = canvas;

	if (!this.canvas.getContext)
		return;
	var ctx = this.canvas.getContext('2d');
	if (!ctx)
		return;

	//Instanta de algoritm
	this.fortuneImpl = new FortuneImpl(0, 0, this.canvas.width,	this.canvas.height);

	this.paintBackground(ctx);

	/*
	 * handler eveniment onclick: Se adauga un nou "Site"
	 */
	this.canvas.onclick = function(event) {
		if (!event)
			event = self.event;
		if (event.offsetX === undefined || event.offsetY === undefined) {
			fortuneSim.addSite(event.layerX, event.layerY);	
		}    else
		fortuneSim.addSite(event.offsetX, event.offsetY);
	};

	//Pentru animatie
	this.timer = undefined;
	this.delta = undefined;
	this.delay = undefined;
	
	//Pentru triangulare
	this.showEdges = true;
	this.delaunay  = false;

}

/**
 * Simulare incheiata <=> coada de evenimente vida
 */
FortuneSimulation.prototype.isReady = function() {
	return this.fortuneImpl.ready;
};


/**
 * Adauga site.
 */
FortuneSimulation.prototype.addSite = function(x, y) {
	this.fortuneImpl.addSite(x, y);
	this.reset();
};


FortuneSimulation.prototype.randomSites = function(n) {
	var exclusion = 2 * this.SITE_RADIUS_1;
	var box = this.fortuneImpl.box;
	var x0 = box.xl + exclusion;
	var dx = box.xr - exclusion * 2;
	var y0 = box.yt + exclusion;
	var dy = box.yb - exclusion * 2;
	for ( var i = 0; i < n; i++) {
		this.fortuneImpl.addSite(round(x0 + random() * dx), round(y0 + random() * dy));
	}
};

/**
 * Adauga n site-uri la pozitii aleatorii.
 */
FortuneSimulation.prototype.addRandomSites = function(n) {
	this.randomSites(n);
	this.reset();
};

/**
 * Strege toate site-urile din plansa.
 */
FortuneSimulation.prototype.clearSites = function() {
	this.fortuneImpl.clearSites();
	this.paint();
};

/**
 * Reprezentare grafica a performantei algoritmului
 * pentru seturi de date in progresie liniara a dimensiunii.
 */
FortuneSimulation.prototype.benchmark = function(parentId) {
	
	var WIN_W	   = 680;  //nu schimba! latime popup
	var WIN_H      = 350;  //nu schimba! inaltime popup
	var G_HEIGHT   = 170;  //nu schimba! inalatime grafic (px)
	var G_WIDTH    = 450;  //nu schimba! latime grafic (px)
	
	var G_STEP     = 1000; //increment
	var G_COUNT    = 20;   //numar de serii
	
	var G_MIN      = G_STEP;
	var G_MAX      = G_COUNT * G_STEP;
	var BAR_WIDTH  = Math.round(G_WIDTH / G_COUNT)  - 1;
	
	var closed = false;
	var popup = new Popup(parentId);
	var content = popup.getContent();
	var log = new Log(content);
    var me = this;
    var data = [];
    var counter = 0;

    popup.onClose(function() { 	closed = true; me.fortuneImpl.clearSites(); });
    popup.show(WIN_W, WIN_H);
    
    //Simulare fara desen (doar algoritmul!)
    function simulate() {
    	var d = new Date();
    	var t0 = d.getTime();
        me.randomSites(G_STEP);
        me.fortuneImpl.reset();
        me.fortuneImpl.processEvents();
        d = new Date();
        return d.getTime() - t0;
    }
    
    //Pentru normare grafic
    function maxTime() {
    	r = 0;
    	for (var i = 0; i < data.length; i++)
    		if (data[i].y > r)
    			r = data[i].y;
    	return r;
    }

    //Adauga element grfic (bara)
    function addBar(graph, x, y, tooltip) {
    	var bar = newDiv();
    	bar.className = "benchmarkgraphbar";
	bar.setAttribute("title", tooltip);
    	bar.style.width = pixels(BAR_WIDTH);
    	bar.style.height = pixels(y);
    	bar.style.left = pixels(x);
    	bar.style.top = pixels(G_HEIGHT - y);
    	graph.appendChild(bar);
    }
    
    //Scrie eticheta pentru axa specificata
    function writeGraphAxisValue(graph, x, y, value, horz) {
    	var div = newDiv();
    	div.className = "benchmarkgraphaxisvalue" + (horz ? "x" : "y");
    	lbl = document.createTextNode(value);
    	div.appendChild(lbl);
    	div.style.left = pixels(x);
    	div.style.top = pixels(y);
    	graph.appendChild(div);
    }
    
    //Construieste graficul de timpi de simulare
    function doGraph() {
    	log.close();
    	var gwin = newDiv();
    	gwin.className = "benchmarkgraphwindow";
    	content.appendChild(gwin);
    	graph = newDiv();
    	graph.className = "benchmarkgraph";
    	gwin.appendChild(graph);
    	var max = maxTime();
    	for (var i = 0; i < data.length; i++) {
    		var h = Math.floor(data[i].y / max * G_HEIGHT);
        	var l = (data[i].x-1)*(BAR_WIDTH + 1);
                var tooltip = "Num\u0103r site-uri: " + data[i].x * G_STEP + "\n" +  
                              "Timp finalizare: " + data[i].y + " ms";
        	addBar(graph, l, h, tooltip);
    	};
    	writeGraphAxisValue(gwin, 85, 251, G_MIN, true);
    	writeGraphAxisValue(gwin, 526, 251, G_MAX, true);
    	writeGraphAxisValue(gwin, 20, 66, max, false);
    	writeGraphAxisValue(gwin, 20, 233, 0, false);
    };

    //functie auto-temporizata pentru monitorizarea progresului testului 
    function runTest() {
        counter += 1;
        var time = simulate();
        data.push({x: counter, y: time, });
        log.write("Simularea pentru " + counter * G_STEP + " puncte incheiat\u0103 cu durata: "+time+" ms.");
        if (counter < G_COUNT && !closed) {
          setTimeout(runTest, 1);
        } else {
      	    log.addSection();
      	    log.write("Simulare incheiat\u0103. Calculez reprezentarea grafic\u0103...");
      	    setTimeout(doGraph, 1000);
        };
      }

    //Entry point
    log.write("Se ruleaz\u0103 algoritmul pe seturi aleatoare de puncte de la ("+G_MIN+" la "+G_MAX+") cu " +
    		  "incrementare liniar\u0103 a dimensiunii setului ("+G_STEP+" de puncte la fiecare pas):");
    log.addSection();
    this.stopAnimation();
    this.clearSites();
    setTimeout(runTest, 500);
};

/**
 * Reinitializeaza procesarea.
 */
FortuneSimulation.prototype.reset = function() {
	this.showEdges = true;
	this.delaunay = false;
	this.fortuneImpl.reset();
	this.paint();
};

/**
 * Procesare totala a cozii de evenimente.
 */
FortuneSimulation.prototype.compute = function() {
	this.stopAnimation();
	this.fortuneImpl.reset();
	this.fortuneImpl.processEvents();
	this.paint();
};

/**
 * Avanseaza linia de baleiere cu valaoarea data pentru pixeles.
 */
FortuneSimulation.prototype.sweep = function(pixels) {
	this.fortuneImpl.advanceSweepLine(pixels);
	this.paint();
};

/**
 * Deseneaza fundalul. 
 */
FortuneSimulation.prototype.paintBackground = function(ctx) {
	ctx.globalAlpha = 1;
	ctx.beginPath();
	ctx.rect(0, 0, this.canvas.width, this.canvas.height);
	ctx.fillStyle = this.CANVAS_BG_COLOR;
	ctx.fill();
};

/**
 * Deseneaza linia de baleiere.
 */
FortuneSimulation.prototype.paintSweepLine = function(ctx) {
	if (this.fortuneImpl.sweep < this.canvas.height) {
		ctx.globalAlpha = 0.9;
		ctx.strokeStyle = this.SWEEP_LINE_COLOR;
		ctx.lineWidth = this.SWEEP_LINE_WIDTH;
		ctx.beginPath();
		ctx.moveTo(0, this.fortuneImpl.sweep);
		ctx.lineTo(this.canvas.width, this.fortuneImpl.sweep);
		ctx.stroke();
	}
};

/**
 * Deseneaza site-urile.
 */
FortuneSimulation.prototype.paintSites = function(ctx) {
	var w1 = this.SITE_RADIUS_1 / 2;
	var w2 = this.delaunay ? w2 = this.SITE_RADIUS_3 / 2 : this.SITE_RADIUS_2 / 2;
	var cl = this.SITE_COLOR;
	var onSite = function(emptyQueue, x, y) {
		if (emptyQueue) {
			ctx.rect(x - w2, y - w2, w2 * 2, w2 * 2);
		} else {
			ctx.rect(x - w1, y - w1, w1 * 2, w1 * 2);
		}
	};
	ctx.beginPath();
	this.fortuneImpl.visitSites(onSite);
	ctx.fillStyle = cl;
	ctx.fill();
};

/**
 * Deseneaza muchiile.
 */
FortuneSimulation.prototype.paintEdges = function(ctx) {
	if (!this.showEdges)
		return;
	var onEdge = function(ax, ay, bx, by) {
		ctx.moveTo(ax, ay);
		ctx.lineTo(bx, by);
	};
	ctx.beginPath();
	ctx.lineWidth = this.EDGE_WIDTH;
	ctx.globalAlpha = 0.5;
	this.fortuneImpl.visitEdges(onEdge);
	ctx.strokeStyle = this.EDGE_COLOR;
	ctx.stroke();
};

/**
 * Deseneaza nodurile.
 */
FortuneSimulation.prototype.paintVertices = function(ctx) {
	if (this.delaunay || this.fortuneImpl.ready)
		return;
	var sim = this;
	var rad = this.VERTEX_RADIUS / 2;
	var onVertex = function(x, y) {
		ctx.rect(x - rad, y - rad, rad * 2, rad * 2);
	};
	ctx.globalAlpha = 1;
	ctx.beginPath();
	this.fortuneImpl.visitVertices(onVertex);
	ctx.fillStyle = sim.VERTEX_COLOR;
	ctx.fill();
};

/**
 * Deseneaza beachline.
 */
FortuneSimulation.prototype.paintBeachLine = function(ctx) {
	if (this.delaunay || this.fortuneImpl.ready)
		return;
	var sim = this;
	var ccr = this.CIRCLE_CENTER_RADIUS / 2;
	// rutina pentru desenarea cercurilor corespunzatoare circle eventurilor
	// asociate sectiunilor de beachline (arcelor de parabola)
	var onCircle = function(x, y, r) {
		ctx.save();
		ctx.globalAlpha = 0.25;
		ctx.beginPath();
		ctx.arc(x, y, r, 0, 2 * PI, true);
		ctx.lineWidth = sim.CIRCLE_LINE_WIDTH;
		ctx.strokeStyle = sim.CIRCLE_COLOR;
		ctx.stroke();
		ctx.fillStyle = sim.CIRCLE_CENTER_COLOR;
		ctx.beginPath();
		ctx.fillRect(x - ccr, y - ccr, 2 * ccr, 2 * ccr);
		ctx.restore();
	};
	// rutina pentru desenarea sectiunii de beachline care este un arc
	// de parabola degenerata(focar pe dirctoare)
	var onDegenerate = function(x, y, r) {
		ctx.strokeStyle = sim.BEACH_LINE_COLOR_1;
		ctx.beginPath();
		ctx.lineWidth = sim.BEACH_LINE_WIDTH;
		ctx.moveTo(x, y);
		ctx.lineTo(x, r);
		ctx.stroke();
	};
	// rutina pentru desenarea arcului de parabola corespunzator sectiunii
	// curente a beachline
	var onArc = function(isCollapsing, xl, yl, cx, cy, xr, yr) {
		ctx.strokeStyle = isCollapsing ? sim.BEACH_LINE_COLOR_2 : sim.BEACH_LINE_COLOR_1;
		ctx.beginPath();
		ctx.moveTo(xl, yl);
		ctx.quadraticCurveTo(cx, cy, xr, yr);
		ctx.lineWidth = sim.BEACH_LINE_WIDTH;
		ctx.stroke();
	};
	this.fortuneImpl.visitBeachline(onCircle, onDegenerate, onArc);
};

/**
 * Deseneaza triangularea.
 */
FortuneSimulation.prototype.paintTriangles = function(ctx) {
	if (!this.delaunay)
		return;
	var onEdge = function(ax, ay, bx, by) {
		ctx.moveTo(ax, ay);
		ctx.lineTo(bx, by);
	};
	ctx.beginPath();
	ctx.lineWidth = this.TRIANGLE_LINE_WIDTH;
	ctx.globalAlpha = 1;
	this.fortuneImpl.visitEdgesDelaunay(onEdge);
	ctx.strokeStyle = this.TRIANGLE_COLOR;
	ctx.stroke();
	
};

/**
 * Rutina de desenare a starii curente a algoritmului
 * in fereastra de vizualizare.
 */
FortuneSimulation.prototype.paint = function() {
	var ctx = this.canvas.getContext('2d');
	this.paintBackground(ctx);
	this.paintSites(ctx);
	this.paintSweepLine(ctx);
	this.paintEdges(ctx);
	this.paintVertices(ctx);
	this.paintBeachLine(ctx);
	this.paintTriangles(ctx);
};

/*
 * RUTINE PENTRU ANIMATIE
 * 
 */ 

/**
 * Callback pentru setTimeOut() - rutina de animare
 */
var animate = function() {
	fortuneSim.timer = undefined;
	fortuneSim.sweep(fortuneSim.delta);
	if (!fortuneSim.isReady())
		fortuneSim.timer = setTimeout(animate, fortuneSim.delay);
};

/**
 * Porneste animatia cu parametrii delta - increment baleiere 
 * si delay - pauza intre cadre
 */
FortuneSimulation.prototype.startAnimation = function(delta, delay) {
	this.delay = delay;
	this.delta = delta;
	this.stopAnimation();
	if (this.fortuneImpl.ready)
		this.reset();
	this.timer = setTimeout(animate, delay);
};

/**
 * Opresete animatia.
 */
FortuneSimulation.prototype.stopAnimation = function() {
	if (this.timer !== undefined) {
		clearTimeout(this.timer);
		this.timer = undefined;
	}
};

/**
 * Triangularea unghiular optima.
 */
FortuneSimulation.prototype.triangulate = function(showEdges, fromCk) {
	this.delaunay = fromCk ? true : !this.delaunay;
	this.showEdges = showEdges || !this.delaunay;
	this.stopAnimation();
	this.fortuneImpl.reset();
	this.fortuneImpl.processEvents();
	this.paint();
};

