/**
 * Componente:
 * 
 * Fereastra popup - modala - cu umbra (folosind DOM)
 * Jurnal monitorizare progres
 * 
 */

/*===============================================================================*/

/** Umbra */
function Shadow(popup, width) {
	width = width > 15 ? 15 : width;
	this.popup = popup;
	var w = popup.info.w;
	var h = popup.info.h;
	var t = popup.info.t;
	var l = popup.info.l;
	var hsw = w - width + 1, hsh = 1, hsl = l + width, hst = t + h + 1;
	var vsw = 1, vsh = h - width + 1, vsl = l + w + 1, vst = t + width;
	this.divs = [];
	for (var i = 0; i < width; i++) {
		var div = newDiv();
		div.className = "divpopupshadow";
		div.style.width = pixels(hsw + 1);
		div.style.height = pixels(hsh);
		div.style.left = pixels(hsl);
		div.style.top = pixels(hst);
		div.style.opacity = 1 - (i+1)/width;
		hst ++;
		hsw ++;
		this.divs.push(div);
	}
	for (var i = 0; i < width; i++) {
		var div = newDiv();
		div.className = "divpopupshadow";
		div.style.width = pixels(vsw);
		div.style.height = pixels(vsh);
		div.style.left = pixels(vsl);
		div.style.top = pixels(vst);
		div.style.opacity = 1 - (i+1)/width;
		vsl ++;
		vsh ++;
		this.divs.push(div);
	}
};

Shadow.prototype.show = function() {
	for (var i = 0; i < this.divs.length; i++)
		this.popup.parent.appendChild(this.divs[i]);
};

Shadow.prototype.hide = function() {
	for (var i = 0; i < this.divs.length; i++)
		this.popup.parent.removeChild(this.divs[i]);
};

/**
 * 
 * Fereastra popup
 * elementId - id element parinte
 * 
 * Inchidere cu buton propriu, click in afara sau tasta ESC
 */
function Popup(elementId) {
	var me = this;

	this.BPH = 40;  // inaltimea zoei butoanelor
	this.BH  = 24;  // inaltimea butonului
	this.BW  = 100; // latimea butonului
	this.MG  = 20;  // margine continut
	
	
	var close    = function() { 
		me.hide();
		if (me.closeHandler != undefined && me.closeHandler != null)
			me.closeHandler();
	};
	
	this.closeHandler = undefined;
	this.parent = document.getElementById(elementId);
	this.div = newDiv();
	this.div.className = "divpopup";
	this.div.id = "divpopup" + Popup.prototype.id++;
	this.div.style.margin = "0px auto";
	this.div.style.position = "absolute";
	this.shadow = undefined;
	this.inner = newDiv();
	this.inner.className = "divpopupinner";
	this.div.appendChild(this.inner);
	this.content = newDiv();
	this.content.className = "divpopupcontent";
	this.inner.appendChild(this.content);
	this.bdiv = newDiv();
	this.bdiv.className="divpopupbuttonpane";
	this.button =  document.createElement("button");
	this.button.className = "divpopupbutton";
	this.button.innerHTML = "&Icirc;nchide";
	this.button.onclick = close;
	this.bdiv.appendChild(this.button);
	this.inner.appendChild(this.bdiv);
	this.overlay = newDiv();
	this.overlay.className = "divpopupoverlay";
	this.overlay.onclick = close;

};

Popup.prototype.close = function() {
	this.hide();
	if (this.closeHandler != undefined && this.closeHandler != null)
		this.closeHandler();
};

Popup.prototype.computePos = function(width, height) {
	var pStyle = this.parent.currentStyle || getComputedStyle(this.parent, null);
	var left = parseInt(pStyle.width);
	var top = parseInt(pStyle.height);
	left = Math.floor((left - width) / 2);
	top = Math.floor((top - height) / 2);
	this.div.style.left = pixels(left);
	this.div.style.top = pixels(top);
	this.div.style.width = pixels(width);
	this.div.style.height = pixels(height);
	this.info = {w: width, h: height, l: left, t: top, };
	this.content.style.height = pixels(height - this.BPH - this.MG * 2);
	this.content.style.width = pixels(width - this.MG * 2);
	this.bdiv.style.top = pixels(height - this.BPH + 1);
	this.button.style.top = pixels((this.BPH - this.BH)/2);
	this.button.style.left = pixels((width - this.BW - 2)/2);
	
};

Popup.prototype.show = function(width, height) {
	this.computePos(width, height);
	if(this.shadow == undefined)
		this.shadow = new Shadow(this, 8);
	this.parent.appendChild(this.overlay);
	this.parent.appendChild(this.div);
	this.shadow.show();
	this.button.focus();
	this.wke = window.onkeydown;
	var me = this;
	window.onkeydown = function(e) { 
		if (e.keyCode == 27) {
			me.close();
		}
	};
	
};

Popup.prototype.hide = function() {
	if(this.shadow != undefined)
		this.shadow.hide();
	this.parent.removeChild(this.div);
	this.parent.removeChild(this.overlay);
	window.onkeydown = this.wke;
	
};

Popup.prototype.getContent = function() {
	return this.content;
};

Popup.prototype.onClose = function(action) {
	this.closeHandler = action;
};

Popup.prototype.id = 1;


/**
 * Jurnal de monitorizare progres. 
 */
Log = function(parent) {
	this.log = newDiv();
	this.parent = parent;
	this.log.className = "benchmarklogwindow";
	this.log.style.padding = "5px";
	this.log.style.width = "100%";
	this.log.style.height = "100%";
	this.log.style.overflow = "auto";
    this.parent.appendChild(this.log);
    this.addSection();
};

Log.prototype.addSection = function() {
    this.section = document.createElement("p");
    this.section.className = "benchmarklogentry";
    this.log.appendChild(this.section);
};

Log.prototype.write = function(text) {
    var br = document.createElement("br");
    var entry = document.createTextNode(text);
    this.section.appendChild(entry);
    this.section.appendChild(br);
    this.log.scrollTop = this.log.scrollHeight;
};

Log.prototype.close = function() {
	this.parent.removeChild(this.log);
};


/*===============================================================================*/