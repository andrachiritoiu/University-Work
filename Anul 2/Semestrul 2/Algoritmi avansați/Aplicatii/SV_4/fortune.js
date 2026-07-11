
//Functii matematice pentru accesare rapida:
atan2 = self.Math.atan2;
sqrt = self.Math.sqrt;
abs = self.Math.abs;
random = self.Math.random;
round = self.Math.round;
min = self.Math.min;
max = self.Math.max;
PI = self.Math.PI;

//Tipuri de evenimente
SITE_EVENT   =  0;
CIRCLE_EVENT =  1;

//Functii pentru compararea "aproximativa"
//precizia curenta: 1e-4

//<
ls = function(a, b) {
	return (b - a) > 1e-4;
};

//<=
leq = function(a, b) {
	return (a - b) < 1e-4;
};

//==
eq = function(a, b) {
	return abs(a - b) < 1e-4;
};

//>
gr = function(a, b) {
	return (a - b) > 1e-4;
};

//>=
geq = function(a, b) {
	return (b - a) < 1e-4;
};

//Alte functii utilitare

/**
 * Determina cercul care contine punctele p1, p2 si p3.
 * Intoarce un obiect cu campurile x, y (coord. centrului) si
 * r (raza). parametrii trebuie sa contina campurile x si y.
 * (folosim ducktyping :))
 */
getCircle = function(p1, p2, p3) {
	var ax = p1.x;
	var ay = p1.y;
	var bx = p2.x - ax;
	var by = p2.y - ay;
	var cx = p3.x - ax;
	var cy = p3.y - ay;
	var d = 2 * (bx * cy - by * cx);
	var hb = bx * bx + by * by;
	var hc = cx * cx + cy * cy;
	var x = (cy * hb - by * hc) / d;
	var y = (bx * hc - cx * hb) / d;
	return {
		x : x + ax,
		y : y + ay,
		radius : sqrt(x * x + y * y)
	};
};

/**
 * Determina mediatoarea segmentului dat de va si vb.
 * Intoarce:
 * (x,y) - mijlocul segmentului [va, vb]
 * m - panta segmentului
 * b - panta mediatoarei(bisectoarei) 
 */
getBisector = function(va, vb) {
	var r = {
		x : (va.x + vb.x) / 2,
		y : (va.y + vb.y) / 2
	};
	if (vb.y == va.y) {
		return r;
	}
	r.m = (va.x - vb.x) / (vb.y - va.y);
	r.b = r.y - r.m * r.x;
	return r;
};

/**
 * Decide daca cele doua puncte sunt identice.
 */
isSamePoint = function(p1, p2) {
	return eq(p1.x, p2.x) && eq(p1.y, p2.y);
};

/**
 * Compara unghiurile facute cu axa Ox de celor doua muchii
 * transmise ca parametru. functia va fi folosita pentru
 * sortarea halfedges, dupa unghi,  in sens trigonometric.
 */
angleComparartor = function(a,b) {
	var ava = a.getStart();
	var avb = a.getEnd();
	var bva = b.getStart();
	var bvb = b.getEnd();
	return self.Math.atan2(bvb.y-bva.y,bvb.x-bva.x) - self.Math.atan2(avb.y-ava.y,avb.x-ava.x);
};


/*========================================================*/
/*            OBIECTE AUXILIARE - DEFINITII               */	
/*========================================================*/	
	
/**
 * Fig.1.
 * Elementele diagramei Voronoi
 * 
 *    (Edge)        
 *       \
 *        \    Site *
 *         \
 *          \       Cell    
 *  Cell     \
 *            \   -------------> halfedge 
 *   Site   Vertex------------- Vertex
 *    *       /   <------------- halfedge
 *           /   
 *          /       * Site
 *         /			  Cell
 *   (Edge)
 *   
 *   HalfEdge : Fiecarei muchii i se asociaza doua segmente orientate, de sens opus, 
 *   denumite "halfedge". O celula Voronoi este determinata prin parcurgerea in sens 
 *   trigonometric a elementelor de tip HalfEdge asociate.
 *   
 */	    


	
/**
 * Construieste obiectul de tip "site".
 * Un site reprezinta un punct al diagaramei Voronoi
 * specificat prin coordonatele x si y.
 */
function Site(x, y) {
	//Coordonatele site-ului
	this.x = x;
	this.y = y;
	//Identificator unic
	this.id = this.constructor.prototype.id++;
}



/**
 * Construieste obiectul de tip "edge" (muchie).
 * Orice muchie separa doua site-uri si uneste doua noduri
 * ale grafului diagramei.
 * lSite - site-ul de la stanga muchiei
 * rSite - site-ul de la dreapta muchiei
 * v1 - nodul start (de tip Vertex)
 * v2 - nodul sfarsit (de tip Vertex)
 */
Edge = function(leftSite, rightSite) {
	//Siteurile de la stanga, resp. dreapta muchiei.
	this.lSite = leftSite;
	this.rSite = rightSite;
	//Vertex-urile de plecare, resp oprire ale muchiei.
	this.va = undefined; 
	this.vb = undefined;
	//Identificator unic
	this.id = this.constructor.prototype.id++;
};

/**
 * >Metoda:
 * Verifica daca muchia este complet definita.
 */
Edge.prototype.isLineSegment = function() {
	return this.id != undefined && this.va != undefined && this.vb != undefined;
};

/**
 * >Metoda:
 * Verifica daca muchia este pe frontiera ferestrei de vizualizare.
 */
Edge.prototype.isBorderEdge = function() {
	return this.rSite == null;
};




/**
 * Construieste obiectul de tip "halfedge".
 *  
 * Fiecarei muchii i se asociaza doua segmente orientate, 
 * de sens opus, denumite "halfedge". O celula Voronoi va fi 
 * determinata prin parcurgerea in sens trigonometric a 
 * elementelor de tip HalfEdge asociate.
 * 
 */
Halfedge = function(leftSite, edge) {
	//site-ul dinspre interiorul celulei diagramei (stanga sensului de parcurgere)
	this.site = leftSite;
	//muchia din care face parte aceasta halfedge.
	this.edge = edge;
};

/**
 * >Metoda:
 * Intoarce vertex-ul de start al segmentului orientat.
 */
Halfedge.prototype.getStart = function() {
	return this.edge.lSite.id === this.site.id ? this.edge.va : this.edge.vb;
};

/**
 * >Metoda:
 * Intoarce vertex-ul spre care este orientat segmentul de muchie.
 */
Halfedge.prototype.getEnd = function() {
	return this.edge.lSite.id === this.site.id ? this.edge.vb : this.edge.va;
};

/**
 * >Metoda:
 * Verifica daca muchia este complet definita.
 */
Halfedge.prototype.isLineSegment = function() {
	return this.edge.isLineSegment();
};



/**
 * Construieste obiectul de tip "vertex" (nod al diagramei)
 * Un vertex este intersectia uneia sau mai multor muchii.
 * Este descris de coordonatele x si y.
 */
Vertex = function(x, y) {
	//Coordonatele nodului
	this.x = x;
	this.y = y;
};	



/**
 * Construieste obiectul de tip celula Voronoi.
 * O celula este definita de site-ul pe care il contine, respectiv
 * segmentele orientate (halfedges) care se inchid la parcurgerea
 * in sens trigonometric. Exemplu de celula:
 *                                            
 *       V---------------------------V---------   
 *       |◄-------------------------▲||              
 *       ||                         |||         
 *       ||           site          ||| <halfedges          
 *       ||                         |||         
 *       |▼-------------------------►|▼          
 *       V---------------------------V--------- 
 */ 
Cell = function(site) {
	this.site = site;
	this.halfedges = [];
};


/**
 * Construieste obiectul sectiune beachline.
 * O astfel de sectiune reprezinta arcul de parabola ce are ca
 * linie directoare, linia de baleiere si ca focar, punctul cu 
 * coordonatele site-ului. Acestui arc i se va asocia un circle event 
 * daca exista un cerc care contine 3 site-uri si acest arc urmeaza 
 * sa colapseze atunci cand linia de baleiere va deveni tangent al acest 
 * cerc. Centrul cercului respectiv va deveni un Vertex (nod) al 
 * diagramei.  
 * 
 */
Beachsection = function(site) {
	//Site-ul focar al parabolei din care face parte arcul.
	this.site = site;
	//Muchia decrisa de acest arc care se termina
	//in centrul cercului definit in circleEvent (definita numai 
	//daca arcul are asociat un circleEvent <=> arcul colapseaza.
	this.edge = null;
	
	//Urmatoarele campuri vor fi folosite pentru construirea unui cache
	//care sa evite calculul repetat al punctului de intersectie a 
	//parabolei curente cu parabola de la stanga (vezi metoda).
	//Pozitia liniei de baleire ce indica directoarea parabolei.
	this.sweep = -Infinity;
	//id-ul arcului predecesor: elementul de inlantuire a listei
	//sectiunilor de beachline (0 daca este primul element)
	this.lid = 0;
	//circle event-ul asociat (daca este cazul)
	this.circleEvent = undefined;
	

};

/**
 * >Metoda:
 * Calculeaza coordonata x a punctului de intersectie dintre:
 * - parabola de directoare data (directrix) si focar in site si
 * - parabola de directoare data (directrix) si focar in left
 *                                                                                         
 * 
 *                                 |                                             
 *                                 |                                         
 *                       *         |         *
 *                        *        |   p    *     
 *                          *      F----- P(h, k)
 *                            *    |    * |
 *                               * | *    | p
 *                                 |      |                directoare 
 * --------------------------------+------+---------------------------
 *                                 |
 *                                 |
 * Ecuatia unei parabolei de focar (h,k),  ale carei puncte sunt situate la 
 * distanta p de directoarea sa:                                 
 * 	(x-h)² = 4p(y-k) => (x-h)²/4p + k 
 * 
 * Rezulta ecuatia polinomiala: y = ax² + bx + c unde:
 * 	a = 1/4p
 * 	b = -h/2p
 * 	c = h²/4c + p     
 * 
 * Punctele de intersectie a doua parabole  y = a₁x² + b₁x + c₁ si
 * y = a₂x² + b₂x + c₂ si sun soultiile ecuatiei de gradul 2:
 * (a₁-a₂)x² + (b₁-b₂)x + (c₁-c₂) = 0.
 *                            
 *                                 
 */
Beachsection.prototype.computeLeftIntersectionPoint = function(site, left, directrix) {
	var siteFocusX = site.x, siteFocusY = site.y;
	//Caz degenerat: coordonata y a focarului "site" este chiar pe sweepline (directoare)
	if (siteFocusY == directrix)
		return siteFocusX;
	var leftFocusX = left.x, leftFocusY = left.y;
	//Caz degenerat: coordonata y a focarului "left" este chiar pe sweepline (directoare)
	if (leftFocusY == directrix)
		return leftFocusX;
	//Ambele parabole au aceeasi distanta pe Oy fata de directoare, deci pct. de 
	//intersectie se situeaza la mijloc (pe Ox) 
	if (siteFocusY == leftFocusY)
		return (siteFocusX + leftFocusX) / 2;
	//Cazul general: folosim ecuatiile parabolelor si formula analitica a pct de intersectie
	var p1 = siteFocusY - directrix,  
	    p2 = leftFocusY - directrix, 
	    d  = leftFocusX - siteFocusX;
	var r = 1 / p1 - 1 / p2;
	var b = d / p2;
	var delta = b*b - 2*r*( d*d / (-2*p2) - leftFocusY + p2/2 + siteFocusY-p1/ 2);
	return siteFocusX + (-b + sqrt(delta))/r;
};

/**
 * >Metoda:
 * 
 * 
 */
Beachsection.prototype.leftCutPointX = function(left, sweep) {
	if (this.sweep !== sweep || this.lid !== left.id) {
		this.sweep = sweep;
		this.lid = left.id;
		this.lBreak = this.computeLeftIntersectionPoint(this.site, left, sweep);
	}
	return this.lBreak;
};
	
/**
 * >Metoda:
 * Verifica daca sectiunea aceasta este un arc ce are asociat un
 * circle event. In acest caz arcul va colapsa in centrul cercului
 * asociat evenimentului care va determina un vertex al diagramei. 
 */
Beachsection.prototype.isCollapsing = function() {
	return this.circleEvent !== undefined
			//&& this.circleEvent.type == CIRCLE_EVENT;
			&& this.circleEvent.enabled;
};




/**
 * Construieste obiectul de tip eveniment.
 * In bucla principala a algoritmului se proceseaza
 * o coada cu prioritate ce are ca elemente doua tipuri de evenimente:
 * 
 * site event   <=> linia de baleiere a intalnit un site
 * circle event <=> exista un cerc (potential) tangent la linia de baleiere
 * 					care contine 3 site-uri pe circumferinta.
 * 
 * Un circle-event poate fi invalidat daca un nou site intalnit de linia 
 * de baleiere, "rupe" arcul de parabola corespunzator evenimentului.
 * 
 */
Event = function(type, site, x, y, x0, y0) {
	this.enabled = true; //valid sau nu?
	this.type = type;    //tip eveniment SITE/CIRCLE
	this.site = site;    //site-ul/site-ul coresp. arcului de parabola asociat
	this.x = x;          //coord. x a siteului/punctului de jos al cercului
	this.y = y;          //coord. y a siteului/punctului de jos al cercului
	this.center = {x : x0, y : y0};//numai pt. circle events: coord centrului cercului.
};




/**
 * Obiect: coada de evenimente pentru algoritmul lui Fortune.
 * Simuleaza comportamentul unei cozi cu prioritati.
 * Folosim doua structuri de tip array pentru pastrarea obiectelor-eveniment
 * de tip site, respectiv circle. Insertia se face cu pastrarea ordinii
 * de prioritizare (y, respectiv x), prin cautare binara a pozitiei.
 * Parametrul beachline reprezinta pointer la colectia de beachsections (arce)
 * folosita de algoritm si va fi utilizata in rutina de eliminare a 
 * evenimentelor dezactivate.
 *  
 */
EventQueue = function(beachline) {
	this.siteEvents = [];
	this.circEvents = [];
	this.beachline = beachline;
};

/**
 * >Metoda:
 * Adauga eveniment in coada de evenimente.
 * adaugarea se face prin insertia la pozitia corespunzatoare prioritatii,
 * adica coordonatei y, respectiv coordonatei x, in caz ca exista evenimente
 * cu acceasi pozitie pe Oy. Pentru evenimentele de tip SITE, nu se admit 
 * duplicate (puncte cu aceleasi coordonate).
 *
 */
EventQueue.prototype.enqueue = function(event) {
	var col = event.type === SITE_EVENT ? this.siteEvents : this.circEvents;
	var r = col.length;
	if (r) {
		var l = 0;
		var i, delta;
		while (l < r) {
			i = (l + r) >> 1;
			delta = event.y - col[i].y;
			if (!delta) {
				delta = event.x - col[i].x;
			}
			if (event.type == CIRCLE_EVENT) {
				if (delta > 0) {
					r = i;
				} else {
					l = i + 1;
				}
			} else {
				if (delta > 0) {
					r = i;
				} else if (delta < 0){
					l = i + 1;
				} else
					return;
			}	
		}
		col.splice(l, 0, event);
	} else {
		col.push(event);
	}
};

/**
 * >Metoda:
 * Scoate din coada si intoarce evenimentul de prioriate maxima.
 */
EventQueue.prototype.dequeue = function() {
	var event = this.peek();
	if (event) {
		if (event.type == SITE_EVENT) {
			this.siteEvents.pop();
		} else {
			this.circEvents.pop();
		}
	}
	return event;
};

/**
 * >Metoda:
 * Intoarce (fara a elimina) primul element, in ordinea prioritatii, din
 * coada de evenimente. Prioritizarea cozii se face dupa coordontata y, respectiv
 * coordonata x a site-ului sau punctului cel mai de jos al cercului corespunzator
 * circle event-ului.
 */
EventQueue.prototype.peek = function() {
	this.cleanUp();
	var evtSite = this.siteEvents.length > 0 ? this.siteEvents[this.siteEvents.length - 1] : null;
	var evtCirc = this.circEvents.length > 0 ? this.circEvents[this.circEvents.length - 1] : null;
	if (Boolean(evtSite) !== Boolean(evtCirc)) {
		return evtSite ? evtSite : evtCirc;
	}
	if (!evtSite) {
		return null;
	}
	if (evtSite.y < evtCirc.y || (evtSite.y == evtCirc.y && evtSite.x < evtCirc.x)) {
		return evtSite;
	}
	return evtCirc;
};

/**
 * >Metoda:
 * Optimizeaza coada de evenimente prin curatarea circle-event-urilor
 * dezactivate. Putem eficientiza astfel rutina de cautare binara, 
 * pentru ca circle eventurile dezactivate se acumuleaza la sfarsitul 
 * colectiei. Totusi pentru a nu pierde prea mult timp in procesul de 
 * optimizare fixam ca prag pentru dimensiunea cozii de circle event-uri 
 * chiar numarul de beach-sections din beach line, motivati de faptul ca
 * nu este posibil ca toate beach-sections sa produca simultan un circle 
 * event. De asemenea, nu optimizam decat daca dimensiunea cozii de 
 * circle-events a depasit dublul numarului de beach-sections. 
 * 
 */
EventQueue.prototype.cleanUp = function() {
	var col = this.circEvents;
	var r = col.length;
	if (!r)
		return;
	var threshold = this.beachline.length;
	var l = r;
	while (l && !col[l - 1].enabled)
		l--;
	var nEvents = r - l;
	if (nEvents) 
		col.splice(l, nEvents);
	if (col.length < threshold * 2) 
		return;
	do {
		r = l - 1;
		while (r > 0 && col[r - 1].enabled) 
			r--;
		if (r <= 0) 
			break;
		l = r - 1;
		while (l > 0 && !col[l - 1].enabled) 
			l--;
		nEvents = r - l;
		col.splice(l, nEvents);
		if (col.length < threshold) 
			return;
	} while (true);
};

/**
 * >Metoda:
 * Verifica daca exista sau nu evenimente valide in coada.
 * @returns {Boolean}
 */
EventQueue.prototype.isEmpty = function() {
	this.cleanUp();
	return this.siteEvents.length === 0 && this.circEvents.length === 0;
};

/**
 * >Metoda:
 * Reinitializeaza coada de evenimente.
 */
EventQueue.prototype.clear = function() {
	this.siteEvents = [];
	this.circEvents = [];
};




/*========================================================*/
/*                I M P L E M E N T A R E                 */	
/*========================================================*/
	
/**
 * Construieste obiectul care reprezinta implementarea
 * algoritmului lui Fortune pentru generarea eficienta a
 * diagramei Voronoi.
 *  
 * Se specifica prin parametrii dati, zona dreptunghiulara 
 * care va fi baleiata pentru identificarea site-urilor. 
 */
function FortuneImpl(top, left, width, height) {

	this.box = {
		xl : left, 
		yt: top , 
		xr : left + width, 
		yb : top + height, 
		w : width, 
		h : height
	};

	this.sweep = 0;
	this.sites = [];
	this.beachline  = [];
	this.edges = [];
	this.cells = {};
	
	this.eventQueue = new EventQueue(this.beachline);
	
	Site.prototype.id = 1;
	Edge.prototype.id = 1;
	
	this.ready = false;
	
};


/**
 * >Metoda:
 * Adauga punctul de coordonate x, y in lista de site-uri 
 * ale diagaramei Voronoi.
 */
FortuneImpl.prototype.addSite = function(x, y) {
	/* Nu mai este necesar. Verificarea duplicatelor se face la adaugarea in coada! 
	for (var i = 0; i < this.sites.length; i++) { 
		var site = this.sites[i];
		if (x === site.x && y === site.y)
			return;
	}
	*/
	this.sites.push(new Site(x, y));
};


/**
 * >Metoda:
 * Goleste lista de site-uri si reinitializeaza coda 
 * de evenimente si obiectele grafice generate. 
 */
FortuneImpl.prototype.clearSites = function() {
	this.sites = [];
	this.reset();
};

/**
 * >Metoda:
 * Reinitializeaza avansul algoritmului prin golirea
 * cozii de evenimente, distrugerea obiectelor grafice create
 * pana la apelul acestei metode (beachsections, celule,
 * muchii) si repune linia de baleiere in pozitia de start.
 * 
 * Coada de evenimente este reintializata prin adaugarea
 * tuturuor site-urilor, cu prioritizare dupa coordonata y. 
 *  
 */
FortuneImpl.prototype.reset = function() {
	this.sweep = -1;
	this.beachline = [];
	this.edges = [];
	this.cells = {};
	this.initializeQueue();
	this.ready = false;
};

//PARABOLIC INTERSECTION:

/**
 * >Metoda:
 * Calculeaza coordonata x a puntctului din extr. stanga a 
 * arcului de parabola din sectiunea beachline data de index.
 * Directoarea acestei parabole este data de parametrul sweep.
 */
FortuneImpl.prototype.getLeftBreakPointX = function(iarc, sweep) {
	var arc = this.beachline[iarc];
	var site = arc.site;
	if (site.y == sweep) {
		return site.x;
	}
	if (iarc === 0) {
		return -Infinity;
	}
	return arc.leftCutPointX(this.beachline[iarc - 1].site, sweep);
};

/**
 * >Metoda:
 * Calculeaza coordonata x a puntctului din extr. dreapta a 
 * arcului de parabola din sectiunea beachline data de index.
 * Directoarea acestei parabole este data de parametrul sweep.
 */
FortuneImpl.prototype.getRightBreakPointX = function(iarc, sweep) {
	if (iarc < this.beachline.length - 1) {
		return this.getLeftBreakPointX(iarc + 1, sweep);
	}
	var site = this.beachline[iarc].site;
	return site.y == sweep ? site.x : Infinity;
};



/**
 * >Metoda:
 * Caculeaza si intoarce pozitia (indexul) in lista de beachsections
 * unde noul arc de parabola (corespunzator siteului de coordonate (x, sweep)) 
 * care trebuie inserat astfel incat sa se pastreze ordonarea dupa coordonata x. 
 * In acest caz o structura de tip arbore binar echilibrat ar fi fost mai 
 * potrivita, dar lista e mai usor de parcurs pentru rutina de desenare a 
 * "beachline".
 * 
 * Metoda folosita este cautarea binara in lista de arce dupa cum
 * va fi pozitionat noul arc in functie de punctele de intersectie cu
 * arcele de la stanga, respectiv la dreapta. 
 * 
 */
FortuneImpl.prototype.findInsertIndex = function(x, sweep) {
	var n = this.beachline.length;
	if (!n)
		return 0;
	var left = 0, right = n;
	var ip, i;
	while (left < right) {
		i = (left + right) >> 1;
		ip = this.getLeftBreakPointX(i, sweep); 
		if (ls(x, ip)) {
			right = i;
			continue;
		};
		ip = this.getRightBreakPointX(i, sweep);
		if (geq(x, ip)) {
			left = i + 1;
			continue;
		}
		return i;
	}
	return left;
};

/**
 * >Metoda:
 * Caculeaza si intoarce pozitia (indexul) in lista de beachsections
 * a arcului de parabola corespunzator siteului de coordonate (x, sweep) 
 * care trebuie sters deoarece s-a realizat circle-eventul corespunzator. 
 * 
 * Metoda folosita este cautarea binara in lista de arce sortata dupa x. 
 * 
 */
FortuneImpl.prototype.findDeleteIndex = function(x, sweep) {
	var n = this.beachline.length;
	if (!n)
		return 0;
	var left = 0, right = n; 
	var i, ip;
	while (left < right) {
		i = (left + right) >> 1;
		ip = this.getLeftBreakPointX(i, sweep);
		if (ls(x, ip)) {
			right = i;
			continue;
		}
		if (gr(x, ip)) {
			left = i + 1;
			continue;
		}
		ip = this.getRightBreakPointX(i, sweep);
		if (gr(x, ip)) {
			left = i + 1;
			continue;
		}
		if (ls(x, ip)) {
			right = i;
			continue;
		}
		if (i==undefined)
			debugger;
		return i;
	}
};


// EDGE METHODS

/**
 * >Metoda:
 * Atribuie vertex-ul dat ca punct initial (v0) pentru muchia diagramei
 * ce separa siteu-rile leftSite si rightSite.  
 */
FortuneImpl.prototype.setEdgeStart = function(edge, lSite, rSite, vertex) {
	if (edge.va === undefined && edge.vb === undefined) {
		edge.va = vertex;
		edge.lSite = lSite;
		edge.rSite = rSite;
		}
	else if (edge.lSite.id == rSite.id) 
		edge.vb = vertex;
	else 
		edge.va = vertex;
};
	
/**
 * >Metoda:
 * Atribuie vertex-ul dat ca punct final (v1) pentru muchia diagramei
 * ce separa siteu-rile leftSite si rightSite.  
 */
FortuneImpl.prototype.setEdgeEnd = function(edge, lSite, rSite, vertex) {
	this.setEdgeStart(edge,rSite,lSite,vertex);
};


/**
 * >Metoda:
 * Instantiaza un obiect de tip muchie ce separa siteu-rile leftSite 
 * si rightSite si il adauga in lista de muchii.
 * De asemenea creaza cele doua segemente orientate (halfedges) 
 * corespunzatoare acestei muchii  si le a adauga la colectia 
 * (ordonata invers trogonometric dupa unghi) de halfedges ale celulelor
 * corespunzatoare celor doua siteuri pe care le separa. 
 *   
 */
FortuneImpl.prototype.createEdge = function(lSite, rSite, va, vb) {
	var edge = new Edge(lSite,rSite);
	this.edges.push(edge);
	if (va !== undefined) {
		this.setEdgeStart(edge,lSite,rSite,va);
		}
	if (vb !== undefined) {
		this.setEdgeEnd(edge,lSite,rSite,vb);
		}
	this.cells[lSite.id].halfedges.push(new Halfedge(lSite,edge));
	this.cells[rSite.id].halfedges.push(new Halfedge(rSite,edge));
	return edge;
};

/**
 * >Metoda:
 * Creaza o muchia speciala, situata pe frontiera ferestrei de vizualizare.
 * In particular, aceste muchii, nu au site la dreapta (in sens trgonometric) 
 * deci nu pot fi produse de algoritm prin procesarea cozii de evenimente.
 */
FortuneImpl.prototype.createBorderEdge = function(leftSite, start, end) {
	var edge = new Edge(leftSite, null);
	edge.va = start;
	edge.vb = end;
	this.edges.push(edge);
	return edge;
};

/**
 * >Metoda:
 * 
 */
FortuneImpl.prototype.destroyEdge = function(edge) {
	edge.va = undefined;
	edge.vb = undefined;
	edge.id = undefined;
};

/**
 * Daca muchia transmisa ca parametru va fi vizibila si nu este complet 
 * definita (nu are ambele vertex-uri definite), cream un vertex virtual 
 * in functie de orientarea sa relativa la marginile ferestrei de 
 * vizualizare si il atribuim acestei muchii, definind-o astfel complet.
 * Functia intoarce true daca operatia de conectare s-a realizat (muchie
 * vizibila), respectiv false, daca nu.
 * 
 */
FortuneImpl.prototype.validateEdge = function(edge) {
	var vb = edge.vb;
	if (!!vb) 
		return true;
	var va = edge.va;
	var xl = this.box.xl, xr = this.box.xr, yt = this.box.yt, yb = this.box.yb;
	var lSite = edge.lSite, rSite = edge.rSite;
	// determinam dreapta mediatoare:
	var bisector = getBisector(lSite, rSite);
	// mediatoarea este linie verticala
	if (bisector.m === undefined) {
		// daca nu va fi vizibila:
		if (bisector.x < xl || bisector.x >= xr) 
			return false;
		// orientata in jos:
		if (lSite.x > rSite.x) {
			if (va === undefined) {
				va = new Vertex(bisector.x, yt);
			} else if (va.y >= yb) {
				return false;
			}
			vb = new Vertex(bisector.x, yb);
		}
		// orientata in sus
		else {
			if (va === undefined) {
				va = new Vertex(bisector.x, yb);
			} else if (va.y < yt) {
				return false;
			}
			vb = new Vertex(bisector.x, yt);
		}
	} else if (bisector.m < 1) {
		// mediatoare cu unghi ascutit fata de orizontala: 
		// conectam la dreapta 
		if (lSite.y < rSite.y) {
			if (va === undefined) {
				va = new Vertex(xl, bisector.m * xl + bisector.b);
			} else if (va.x >= xr) {
				return false;
			}
			vb = new Vertex(xr, bisector.m * xr + bisector.b);
		}
		// sau la stanga
		else {
			if (va === undefined) {
				va = new Vertex(xr, bisector.m * xr + bisector.b);
			} else if (va.x < xl) {
				return false;
			}
			vb = new Vertex(xl, bisector.m * xl + bisector.b);
		}
	} else {
		// mediatoare cu unghi ascutit fata de verticala:
		// conectam in jos
		if (lSite.x > rSite.x) {
			if (va === undefined) {
				va = new Vertex((yt - bisector.b) / bisector.m, yt);
			} else if (va.y >= yb) {
				return false;
			}
			vb = new Vertex((yb - bisector.b) / bisector.m, yb);
		}
		// sau in sus
		else {
			if (va === undefined) {
				va = new Vertex((yb - bisector.b) / bisector.m, yb);
			} else if (va.y < yt) {
				return false;
			}
			vb = new Vertex((yt - bisector.b) / bisector.m, yt);
		}
	}
	edge.va = va;
	edge.vb = vb;
	return true;
};

/**
 * Rectifica coordonatele punctelor ce definesc aceasta muchie astfel
 * incat acestea sa apartina ferestrei de vizualizare.
 * Functia intoarce true daca muchia, in urma ajustarilor, va fi vizibila,
 * respectiv false, daca nu. IMPORTANT!!! Toate muchiile trebuie sa fie
 * valide (cu ambele capete definite) !!!
 * 
 * Algoritmul de clipping a fost luat de la adresa:
 * http://www.skytopia.com/project/articles/compsci/clipping.html
 */
FortuneImpl.prototype.clipEdge = function(edge) {
	var ax = edge.va.x, ay = edge.va.y;
	var bx = edge.vb.x, by = edge.vb.y;
	var t0 = 0, t1 = 1;
	var dx = bx - ax, dy = by - ay;
	// clipping la stanga:
	var q = ax - this.box.xl;
	if (dx === 0 && q < 0) {
		return false;
	}
	var r = -q / dx;
	if (dx < 0) {
		if (r < t0) {
			return false;
		} else if (r < t1) {
			t1 = r;
		}
	} else if (dx > 0) {
		if (r > t1) {
			return false;
		} else if (r > t0) {
			t0 = r;
		}
	}
	// clipping la dreapta: 
	q = this.box.xr - ax;
	if (dx === 0 && q < 0) {
		return false;
	}
	r = q / dx;
	if (dx < 0) {
		if (r > t1) {
			return false;
		} else if (r > t0) {
			t0 = r;
		}
	} else if (dx > 0) {
		if (r < t0) {
			return false;
		} else if (r < t1) {
			t1 = r;
		}
	}
	// clipping in partea de sus:
	q = ay - this.box.yt;
	if (dy === 0 && q < 0) {
		return false;
	}
	r = -q / dy;
	if (dy < 0) {
		if (r < t0) {
			return false;
		} else if (r < t1) {
			t1 = r;
		}
	} else if (dy > 0) {
		if (r > t1) {
			return false;
		} else if (r > t0) {
			t0 = r;
		}
	}
	// clipping in partea de jos:
	q = this.box.yb - ay;
	if (dy === 0 && q < 0) {
		return false;
	}
	r = q / dy;
	if (dy < 0) {
		if (r > t1) {
			return false;
		} else if (r > t0) {
			t0 = r;
		}
	} else if (dy > 0) {
		if (r < t0) {
			return false;
		} else if (r < t1) {
			t1 = r;
		}
	}
	edge.va.x = ax + t0 * dx;
	edge.va.y = ay + t0 * dy;
	edge.vb.x = ax + t1 * dx;
	edge.vb.y = ay + t1 * dy;
	return true;
};


/**
 * Etapa finala a algoritmului:
 * Inchdem celulele deschise prin validarea si clipping-ul muchiilor
 * deja determinate, apoi parcurgem seturile de halfedges ale fiecarei celule 
 * pentru a defini complet muchiile acesteia prin adaugarea vertex-urilor 
 * lipsa. Completam astfel celulele cu muchiile lipsa de pe frontiera ferestrei 
 * de vizualizare. Setam campul "ready" la true. 
 */
FortuneImpl.prototype.closeCells = function() {
	if (this.ready)
		return;
	// Validam muchiile si le restrangem la fereastra de vizualizare.
	// Eliminam muchiile invizibile sau degenerate (va =vb).
	for ( var i = this.edges.length - 1; i >= 0; i -= 1) {
		var edge = this.edges[i];
		if (!this.validateEdge(edge) || !this.clipEdge(edge)
				|| isSamePoint(edge.va, edge.vb)) {
			this.destroyEdge(edge);
			this.edges.splice(i, 1);
		}
	}
	var xl = this.box.xl, xr = this.box.xr, yt = this.box.yt, yb = this.box.yb;
	// prune and order halfedges
	var cells = this.cells;
	var cell;
	var l, r;
	var hedges, edge;
	var start, end, va, vb;
	// iteram colectia de celule:
	for ( var cellid in cells) {
		cell = cells[cellid];
		hedges = cell.halfedges;
		l = hedges.length;
		// eliminam halfedges nefolosite
		while (l) {
			r = l;
			while (r > 0 && hedges[r - 1].isLineSegment()) {
				r--;
			}
			l = r;
			while (l > 0 && !hedges[l - 1].isLineSegment()) {
				l--;
			}
			if (l === r) {
				break;
			}
			hedges.splice(l, r - l);
		}
		if (hedges.length === 0) {
			// daca celula nu are inregistrate halfedges, o eliminam 
			delete cells[cellid];
			continue;
		}
		// sortam segmentele orientate dupa unghi, in sens trigonometric:
		hedges.sort(angleComparartor);
		var n = hedges.length;
		// determinam si adaugam vertex-urile lipsa ale celulei
		l = 0;
		while (l < n) {
			r = (l + 1) % n;
			end = hedges[l].getEnd();
			start = hedges[r].getStart();
			vb = 0;
			if (!isSamePoint(end, start)) {
				va = new Vertex(end.x, end.y);
				// in jos pe partea stanga:
				if (eq(end.x, xl) && ls(end.y, yb)) {
					vb = new Vertex(xl, eq(start.x, xl) ? start.y : yb);
				}
				// spre dreapta pe jos:
				else if (eq(end.y, yb) && ls(end.x, xr)) {
					vb = new Vertex(eq(start.y, yb) ? start.x : xr, yb);
				}
				// spre sus prin dreapta:
				else if (eq(end.x, xr) && gr(end.y, yt)) {
					vb = new Vertex(xr, eq(start.x, xr) ? start.y : yt);
				}
				// spre stanga pe sus:
				else if (eq(end.y, yt) && gr(end.x, xl)) {
					vb = new Vertex(eq(start.y, yt) ? start.x : xl, yt);
				}
				// adaugam si muchia de pe marginea ferestrei de vizualizare
				edge = this.createBorderEdge(cell.site, va, vb);
				hedges.splice(l + 1, 0, new Halfedge(cell.site, edge));
				n = hedges.length;
			}
			l++;
		}
	}
	this.ready = true;
};


//BEACHSECTION METHODS:

/**
 * >Metoda:
 * Elimina datele aferente sectiunii din beachline care a colapsat in urma
 * realizarii unui circle event. Se determina mai intai coordonata x a punctului
 * in care se va afla un vertex al diagramei. 
 * 
 * Este posibil ca in acelasi punct sa avem mai mult de un arc colapsat (in cazul 
 * in care mai mult de doua muchii vor fi legate printr-un vertex comun) deci trebuie 
 * sa inregistram ambele muchii cautand atat in stanga cat si in dreapta punctului
 * de stergere.
 * 
 * Circle event-urile asociate arcelor disparute vor fi invalidate (marcate
 * ca realizate) si se vor crea anticipat noi astfel de evenimente pentru 
 * arcele adiacente sectiunilor disparute. Acest lucru nu ar fi fost realizat
 * intr-o implementare eficienta, dar in cazul de fata avem nevoie ca evenimentele
 * sa fie anticipate astfel pentru a reprezenta grafic cercurile potentiale.
 * 
 */
FortuneImpl.prototype.removeBeachSection = function(event) {
	if (!event.enabled)
		return;
	var x = event.center.x;
	var y = event.center.y;
	var sweep = event.y;
	var delIndex = this.findDeleteIndex(x, sweep);
	// Determinam indexurile stanga si dreapta a le sectiunilor adiacente de sters:
	// arce la stanga?
	var l = delIndex;
	while (l - 1 > 0 && eq(x, this.getLeftBreakPointX(l - 1, sweep))) 
		l--;
	// arce la dreapta?
	var r = delIndex;
	while (r + 1 < this.beachline.length && eq(x, this.getRightBreakPointX(r + 1, sweep))) 
		r++;
	// pentru sectiunile colapsate, setam punctul de start al muchiei de la stanga:
	var ls, rs;
	for ( var i = l; i <= r + 1; i++) {
		ls = this.beachline[i - 1];
		rs = this.beachline[i];
		this.setEdgeStart(rs.edge, ls.site, rs.site,	new Vertex(x, y));
	}
	// acum trebuie sa dezactivam circle-eventurile asociate arcurilor colapsate
	// si a celor adiacente acestora:
	this.disableEvents(l - 1, r + 1);
	// actualizam beachline:
	this.beachline.splice(l, r - l + 1);
	// cream muchia aferenta tranzitiei intre doua arce care initial nu erau 
	// adiacente, dar in uram eliminarii arcului/arcelor aferente circle eventului
	// au devenit astfel.
	ls = this.beachline[l - 1];
	rs = this.beachline[l];
	rs.edge = this.createEdge(ls.site, rs.site, undefined, new Vertex(x, y));
	// cream anticipat si circle-eventurile pentru aceste arce si le adaugam la
	// coada de evenimente. 
	this.createCircleEvents(l - 1, sweep);
	this.createCircleEvents(l, sweep);
};


/**
 * >Metoda:
 * Creaza si adauga o noua sectiune in beachline. Actualizeaza corespunzator
 * caoda de evenimente prin dezactivarea circle-eventurilor care nu mai pot avea loc
 * prin "ruperea" unui arc si introducerea unor noi circle-eventuri aferente arcelor
 * nou create. Ne putem situa intr-unul din urmatoarele cazuri:
 * 
 *   1) toate site-urile procestate anterior au acelasi y :
 *   	cream un noua sectiune pe care o adaugam la sfarsitul listei; In acest
 *   	caz nu pot rezulta sectiuni potential generatoare de circle eventuri.
 *   
 *   2) noua sectiune se va situa intre doua sectiuni existente:
 *   	dispare tranzitia dintre cele dou sectiuni, in consecinta punctul 
 *   	final al muchiei aferente acestei tranzitii se modifica;
 *   	apar doua noi sectiuni si implicit doua noi tranzitii cu muchiile aferente.
 *   	
 *   	         ...[Sectiunea 1]T12[Sectiunea 2]...
 *                                
 *      ...[Sectiunea 1]T1N[Sectiunea noua]TN2[Sectiunea 2]....
 *      
 *      			dispare T12, apar T1N si TN2	
 *   	
 *	 3) noua sectiune va "rupe" o sectiune existenta:
 *		apare o noua sectiune si 2 noi tranzitii care determina de aceasta 
 *      data o singura muchie, deoarece doar 2 site-uri sunt implicate. 
 *      (cele doua muchii aferente difera doar prin simetria veretex-urilor).
 *
 *			...][.............Sectiunea1.............][...
 *
 *			...][........]T12[Sectiunea2]T21[........][...
 *
 *			  apar T12 si T21 care de termina 1! muchie
 *	 
 * 
 */
FortuneImpl.prototype.createBeachSection = function(site) {
	// find insertion point of new beach section on the beachline
	var arc = new Beachsection(site);
	var i   = this.findInsertIndex(site.x, site.y);
	// Cazul 1)
	if (i == this.beachline.length) {
		this.beachline.push(arc);
		// prima si singura sectiune => fara tranzitii => fara muchii:
		if (i === 0)
			return;
		// tranzitie intre 2 sectiuni => o muchie intre site-urile asociate:
		arc.edge = this.createEdge(this.beachline[i - 1].site, arc.site);
		return;
	}
	var ls, rs; //sectiunile stanga si dreapta
	// Cazul 2)
	var lbp = this.getLeftBreakPointX(i, site.y);
	var rbp = this.getRightBreakPointX(i - 1, site.y);
	if (i > 0 && eq(site.x, rbp) && eq(site.x, lbp)) {
		ls = this.beachline[i - 1];
		rs = this.beachline[i];
		// dezactiva circle eventurile asociate arcelor
		this.disableEvents(i - 1, i);
		// Tranzitia T12 dispare: apare un nou potential vertex in centrul
		// cercului
		// care contine punctele aferente siteurilor stanga, curent si dreapta:
		var c = getCircle(ls.site, site, rs.site);
		this.setEdgeStart(rs.edge, ls.site, rs.site, new Vertex(c.x, c.y));
		// Apar tranzitiile T1N si TN2 deci doua noi potentiale muchii
		arc.edge = this.createEdge(ls.site, arc.site, undefined, new Vertex(c.x, c.y));
		rs.edge = this.createEdge(arc.site, rs.site, undefined, new Vertex(c.x, c.y));
		// actulaizam beachline
		this.beachline.splice(i, 0, arc);
		// inregistram si potentialele circle events pentru sectiunile "rupte"
		// care acum este posibil sa fie arce care colapseaza:
		this.createCircleEvents(i - 1, site.y);
		this.createCircleEvents(i + 1, site.y);
		return;
	}
	// Cazul 3)
	// dezactivam circle eventul asociat cu sectiunea care va fi "rupta"
	this.disableEvents(i);
	// sectiunea "rupta":
	ls = this.beachline[i];
	// noua sectiune:
	rs = new Beachsection(ls.site);
	// actualizam beachline cu noua sectiune
	this.beachline.splice(i + 1, 0, arc, rs);
	// cream muchia
	arc.edge = rs.edge = this.createEdge(ls.site, arc.site);
	// cream anticipat si circle-eventurile pentru aceste sectiuni si le
	// adaugam la coada de evenimente.
	this.createCircleEvents(i, site.y);
	this.createCircleEvents(i + 2, site.y);
};


// EVENT QUEUE

/**
 * >Metoda:
 * Initializam coda de evenimente.
 * Cum stim deja pozitiile site-urilor, le adaugam la coada, urmand
 * a fi prioritizate dupa coordonata y. Initializam si celelalte structuri
 * folosite de algoritm. 
 */
FortuneImpl.prototype.initializeQueue = function() {
	this.sweep = -1;
	this.eventQueue.clear();
	var n = this.sites.length;
	for (var i=0; i<n; i++) {
		var site = this.sites[i];
		this.eventQueue.enqueue(new Event(SITE_EVENT, site, site.x, site.y, site.x, site.y));
		}
	this.beachline = [];
	this.edges = [];
	this.cells = {};
};

/**
 * >Metoda:
 * Verifica daca pentru sectiunea de index i si pozitaia liniei de
 * baleiere data de sweep, acestei sectiuni i se poate asocia un potential
 * circle event. Daca da, atunci este creat evenimentul prin calcularea 
 * cercului ce contine punctele aferente siteurilor sectiunilor stanga, dreapta 
 * si curenta  si adaugarea in coada de evenimente.
 * 
 */
FortuneImpl.prototype.createCircleEvents = function(i, sweep) {
	if (i <= 0 || i >= this.beachline.length - 1) 
		return;
	var arc = this.beachline[i];
	var l = this.beachline[i - 1].site; //stanga
	var c = this.beachline[i].site;     //dreapta
	var r = this.beachline[i + 1].site; //centru 
	// cele trei siteuri sunt de fapt doua sau unul: nu putem avea circle event! 
	if (l.id == r.id || l.id == c.id || c.id == r.id)
		return;
	// daca punctele stanga centru si dreapta sunt in sens invers trigonometric,
	// sectiunea centru nu are cum sa colapseze deci nu putem avea circle event!
	if ((l.y - c.y) * (r.x - c.x) <= (l.x - c.x) * (r.y - c.y))
		return;
	var circle = getCircle(l, c, r);
	var bottom = circle.y + circle.radius;
	// daca punctul cel mai de jos al cerului determinat se afla deasupra liniei de baleiere
	// inseamna  ca circle eventul este deja consumat, deci nu-l mai adaugam!
	if (!geq(bottom, sweep)) 
		return;
	// cream si adaugam evenimentul:
	arc.circleEvent = new Event(CIRCLE_EVENT, c, circle.x, bottom, circle.x, circle.y);
	this.eventQueue.enqueue(arc.circleEvent);
};

/**
 * >Metoda:
 * Dezactivam circle-eventurile asociate sectiunilor date 
 * de indexurile l si r.
 */
FortuneImpl.prototype.disableEvents = function(l, r) {
	if (r === undefined) {
		r = l;
	}
	l = max(l, 0);
	r = min(r, this.beachline.length - 1);
	while (l <= r) {
		var arc = this.beachline[l];
		if (arc.circleEvent !== undefined) {
			arc.circleEvent.enabled = false;
			arc.circleEvent = undefined;
		}
		l++;
	}
};

/**
 * >Metoda:
 * Proceseaza un singur eveniment din coada de evenimente.
 * Dupa cum evenimentul este de tip SITE sau CIRCLE, se creaza sau se
 * elimina sectiunile de beachline corespunzatoare.
 */
FortuneImpl.prototype.processEvent = function() {
	var event = this.eventQueue.dequeue();
	if (!event || !event.enabled)
		return;
	this.sweep = event.y;
	if (event.type == SITE_EVENT) {
		this.cells[event.site.id] = new Cell(event.site);
		this.createBeachSection(event.site);
	} else {
		this.removeBeachSection(event);
	}
};

/**
 * >Metoda:
 * Proceseaza toate evenimentele din coada de evenimente.
 * Practic aceasta este bucla principala a algoritmului.
 * La iesirea din aceasta metoda, diagrama Voronoi este complet 
 * definita!
 */
FortuneImpl.prototype.processEvents = function() {
	while (!this.eventQueue.isEmpty()) 
		this.processEvent();
	if (this.eventQueue.isEmpty()) { 
		this.sweep = max(this.sweep, this.box.h);
		this.closeCells();
	}
};


/**
 * >Metoda:
 * Avanseaza pozitia liniei de baleiere cu incrementul delta.
 * Efectul este procesarea cozii de evenimente pana cel mult la ultimul
 * site event (site-ul cu coordonata y ce mai mare). Din acest punct se
 * proceseaza integral evenimentele ramase in coada (care nu mai pot fi 
 * decat circle events).  
 */
FortuneImpl.prototype.advanceSweepLine = function(delta) {
	var event;
	if (delta <= 0)
		return;
	var y = this.sweep + delta;
	while (!this.eventQueue.isEmpty()) {
		event = this.eventQueue.peek();
		if (event.y > y)
			break;
		this.processEvent();
	}
	this.sweep = max(this.sweep, y);
	if (this.sweep > this.box.h) 
		this.processEvents();
};


// ELEMENT VISITORS:

/**
 * Vizitator beachline:
 * Exploreaza sectiunile beachline apeland functiile callback
 * 		onCircle : daca sectiunea are asociat un circle event (deci converge)
 * 			parametri : x, y - coord. centru si r - raza			
 * 		onDegenerate : pt fiecare arc - parabola degenerata (eq. linie verticala)
 * 			parametri : x, y, r unde (x,y) si (x,r) sunt pnctele ce definesc linia
 * 		onArc : pentru fiecare arc nedegenerat
 * 			parametri : iscollapsing - true daca arcul converge
 * 						xl, yl - punctul stanga (de start) al arcului de parabola
 * 						cx, cy - punctul Bezier de control al curbei
 * 						xr, yr - punctul dreapta (terminus) al arcului de parabola 
 */
FortuneImpl.prototype.visitBeachline = function(onCircle, onDegenerate, onArc) {
	if (this.sweep > this.box.h)
		return;
	var nArcs = this.beachline.length;
	if (!nArcs)
		return;
	var directrix = this.sweep;
	var arc = this.beachline[0];
	var xl = 0;
	var yl, xr, yr;
	var focx = arc.site.x, focy = arc.site.y;
	var p;
	if (focy == directrix) {
		xl = focx;
		yl = 0;
	} else {
		p = (focy - directrix) / 2;
		yl = (focx * focx) / (4 * p) + focy - p;
	}
	for ( var i = 0; i < nArcs; i++) {
		arc = this.beachline[i];
		focx = arc.site.x;
		focy = arc.site.y;
		// arcut converge => circle event!
		if (arc.isCollapsing()) {
			var circEvent = arc.circleEvent;
			onCircle(circEvent.center.x, circEvent.center.y, circEvent.y
					- circEvent.center.y);
		}
		// caz degenerat: focar pe directoare => linie verticala
		if (focy == directrix) {
			var v;
			xr = focx;
			v = i > 0 ? this.beachline[i - 1] : null;
			// vecin degenerat?
			if (!v || v.site.y == directrix) 
				v = i < this.beachline.length - 1 ? this.beachline[i + 1] : null;
			// ambii vecini degenerati?
			if (!v || v.site.y == directrix) 
				yr = 0;
			// 
			else {
				p = (v.site.y - directrix) / 2;
				yr = (focx - v.site.x) * (focx - v.site.x)	/ (4 * p) + v.site.y - p;
			}
			onDegenerate(focx, focy, yr);
			xl = xr;
			yl = yr;
			continue;
		}
		// arc de parabola nedegenerat
		var ac_x, ac_y, bc_x, bc_y, gx, gy, n;
		// Determinam punctul de intersectie din dreapta arcului: 
		xr = min(this.getRightBreakPointX(i, directrix), this.box.w);
		p = (focy - directrix) / 2;
		yr = (xr - focx) * (xr - focx) / (4 * p) + focy - p;
		// Daca arcul nu este vizibil, ignoram:
		if (xr >= 0 && xl < this.box.w && xr > xl) {
			// http://alecmce.com/as3/parabolas-and-quadratic-bezier-curves
			// determinam punctul de control pentru curba Bezier in cazul particular
			// al parabolelor cu linie directoare paralela cu Ox
			ac_x = focx - xl;
			ac_y = focy - directrix;
			bc_x = focx - xr;
			bc_y = focy - directrix;
			gx = (xr + focx) / 2;
			gy = (directrix + focy) / 2;
			n = ((gx - (xl + focx) / 2) * ac_x + (gy - (directrix + focy) / 2) * ac_y)/ (bc_y * ac_x - bc_x * ac_y);
			var cx = gx - bc_y * n, cy = gy + bc_x * n; // Punctul de control al
														// curbei Bezier.
			onArc(arc.isCollapsing(), xl, yl, cx, cy, xr, yr);
		}
		// avansam:
		xl = xr;
		yl = yr;
	}

};

/**
 * Vizitator site-uri
 * functia callback onSite asteapta parametrii:
 *  empty - true daca nu mai sunt evenimente in coada. 
 * 	x, y  - coordonatele site-ului
 *  
 */
FortuneImpl.prototype.visitSites = function(onSite) {
	var empty = this.eventQueue.isEmpty() && this.sweep > 0;
	var n = this.sites.length;
	for ( var i = 0; i < n; i++) {
		var site = this.sites[i];
		onSite(empty, site.x, site.y);
	}
};

/**
 * Vizitator vertex-uri
 * functia callback onVertex asteapta parametrii:
 * 	x, y  - coordonatele site-ului
 *  
 */
FortuneImpl.prototype.visitVertices = function(onVertex) {
	if (this.eventQueue.isEmpty())
		return false;
	var n = this.edges.length;
	var edge, va, vb;
	for ( var i = 0; i < n; i++) {
		edge = this.edges[i];
		va = edge.va;
		if (va !== undefined)
			onVertex(va.x, va.y);
		vb = edge.vb;
		if (vb !== undefined)
			onVertex(va.x, va.y);
	}
	return true;
};

/**
 * Vizitator muchii
 * functia callback onEdge asteapta parametrii:
 * 	x1, y1  - coordonatele punctului start
 * 	x2, y2  - coordonatele punctului terminus
 *  
 */
FortuneImpl.prototype.visitEdges = function(onEdge) {
	var n = this.edges.length;
	var edge, va, vb;
	for ( var i = 0; i < n; i++) {
		edge = this.edges[i];
		if (edge.va != undefined && edge.vb != undefined) {
			va = edge.va;
			vb = edge.vb;
			onEdge(va.x, va.y, vb.x, vb.y);
		}
	}
};

/**
 * Vizitator muchii pentru triangulare
 * functia callback onEdge asteapta parametrii:
 * 	x1, y1  - coordonatele punctului start
 * 	x2, y2  - coordonatele punctului terminus
 *  
 */
FortuneImpl.prototype.visitEdgesDelaunay = function(onEdge) {
	var n = this.edges.length;
	var edge, ls, rs;
	for ( var i = 0; i < n; i++) {
		edge = this.edges[i];
		if (edge.isLineSegment() && !edge.isBorderEdge()) {
			ls = edge.lSite;
			rs = edge.rSite;
			onEdge(ls.x, ls.y, rs.x, rs.y);
		}
	}
};
