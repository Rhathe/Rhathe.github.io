(function($) {
$(document).ready( function() {
	var json = JSON.parse($("#contact-list").html());
	var href = json[Math.floor(Math.random()*json.length)];
	$("#contact-link").attr("href",href);
});
})(jQuery)

Array.prototype.map = function(cb) {
	for ( var i = 0, length = this.length; i < length; i++) {
		cb(this[i], i);
	}
}

keys = {};

function arrowKeys(key) {
	var menu = menuManager.currMenu;
	switch(key) {
		case 37: menu.moveLeft(); break;
		case 38: menu.moveUp(); break;
		case 39: menu.moveRight(); break;
		case 40: menu.moveDown(); break;
	}
}

stopAnim = {
	'-webkit-animation': 'stop 0.0001s',
	'-moz-animation': 'stop 0.0001s',
	'-ms-animation': 'stop 0.0001s',
	'-o-animation': 'stop 0.0001s',
	'animation': 'stop 0.0001s'
}

$(document).keydown(function(e) {

	var key = e.keyCode+"";
	if (keys.hasOwnProperty(key) && keys[key]["canPress"]) {
		keys[key]["fn"](e.keyCode);
	}

});

function toggleKey(key,enable) {
	if (keys.hasOwnProperty(key+"")) {
		keys[key+""]["canPress"] = enable;
	}
}

function toggleArrowKeys(enable) {
	for (var key = 37; key < 41; key++) {
		toggleKey(key,enable);
	}
}


function keysToggled() {
	for (var key = 37; key < 41; key++) {
		if (keys.hasOwnProperty(key+"")) {
			return keys[key+""]["canPress"];
		}
	}
}

function toggleEnterKey(enable) {
	toggleKey(13,enable);
}

function hypo(a,b) {
	return Math.sqrt(Math.pow(a,2) + Math.pow(b,2));
}

var menu = function(cellInfo, menus, menuManager, cellIndex) {

	this.left = [];
	this.right = [];
	this.up = [];
	this.down = [];

	this.enabled = "enabled" in cellInfo ? cellInfo["enabled"] : true;
	this.navByDist = "navByDist" in cellInfo ? cellInfo["navByDist"] : false;
	this.freeNav = "freeNav" in cellInfo ? cellInfo["freeNav"] : false;

	this.cellIndex = typeof(cellIndex) === "undefined" ? 0 : cellIndex;
	this.menuManager = menuManager;
	this.columns = function() {
		return Math.floor(this.container.innerWidth()/$(this.cellBoxes).outerWidth());
	}

	var invert = {
		left:"right",
		right:"left",
		up:"down",
		down:"up",
	}

	for (prop in menus) {
		if (menus.hasOwnProperty(prop)) {
			var menu = menus[prop];
			if (menu instanceof Array) {
				this[prop] = this[prop].concat(menu);
				var _this = this;
				menu.map( function(m) {
					m[invert[prop]].push(_this);
				});
			} else {
				this[prop].push(menu);
				menu[invert[prop]].push(this);
			}
		}
	};

	this.currCell = function() {
		if (this.cellIndex >= 0 && this.cellIndex < this.cells.length) {
			return this.cells[this.cellIndex];
		}
		return false;
	};


	this.closestLink = function(clink) {
	}

	this.setCurrCell = function(newIndex,direction,changeIndex) {
		if (this.cellIndex === null && typeof(changeIndex) !== "undefined") {
			this.cellIndex = 0;
			this.menuManager.lightUpTheNight();
			return;
		}

		if (this.navByDist && direction) {
			var menus = false;
			if (!this.freeNav) menus = this[direction].concat(this);
			this.menuManager.setByClosestCell(null,direction,menus);
			this.menuManager.lightUpTheNight();
			return;
		}


		if (newIndex < 0) {
			newIndex = 0;
		} else if (newIndex >= this.cells.length) {
			newIndex = this.cells.length-1;
		}

		var mlist = this[direction];
		if (!direction || changeIndex) {
			this.cellIndex = newIndex;
		} else if (mlist.length) {
			for (var i = 0; i < mlist.length; i++) {
				if (mlist[i].enabled) {
					this.menuManager.setCurrMenu(mlist[i]);
					break;
				}
			}
		}

		this.menuManager.lightUpTheNight();
	}

	this.moveLeft = function() {
		var c = this.columns();
		var newIndex = this.cellIndex-1;
		this.setCurrCell(newIndex, "left", newIndex%c < this.cellIndex%c);
	};
	this.moveRight = function() {
		var c = this.columns();
		var newIndex = this.cellIndex+1;
		this.setCurrCell(newIndex, "right", newIndex%c > this.cellIndex%c);
	};
	this.moveUp = function() {
		var newIndex = this.cellIndex - this.columns();
		this.setCurrCell(newIndex, "up", newIndex >= 0);
	};
	this.moveDown = function() {
		var newIndex = this.cellIndex + this.columns();
		this.setCurrCell(newIndex, "down", newIndex < this.cells.length);
	};

	this.clearCellsHover = function() {};

	this.lightUpTheNight = function() {
		if (!keysToggled()) return;
		var o = this.container.css("overflow-y");
		if (o !== "auto" && o !== "scroll") return;

		var cell = $(this.currCell());

		var top = cell.position().top;

		var height = cell.outerHeight(true);
		var cHeight = this.container.outerHeight();

		var bottom = top + height;

		if (bottom > cHeight) {
			this.container.scrollTop(bottom-cHeight+this.container.scrollTop());
		} else if (top < 0) {
			this.container.scrollTop(top+this.container.scrollTop());
		}
	};

	this.getCellIndex = function(cell) {
		if (this.cells == this.cellBoxes)
			return $(cell).index();
		return $(cell).parent().index();
	}

	this.clickLink = function(link) {
		var currLink = link || this.currCell();
		if (currLink) {
			var href = $(currLink).attr('href');
			if (href) window.location.href = href;
		}
	};

	this.clickCell = function() {};

	this.linkUp = function(cellInfo) {
		if (this.container) this.container.hide();
		if (this.cells) $(this.cells).unbind("click mouseenter mouseleave");

		this.container = $(cellInfo['container']);
		this.container.show();
		this.cellBoxes = this.container.find(cellInfo['cellBoxes']).toArray();
		this.cells = cellInfo['cells'] ? $(this.cellBoxes).find(cellInfo['cells']).toArray() : this.cellBoxes;
		if ("enabled" in cellInfo) this.enabled = cellInfo["enabled"];

		var _this = this;
		$(this.cells).hover(
			function() {
				if (!_this.enabled) return;
				toggleArrowKeys(false);
				_this.menuManager.setCurrCell(_this.getCellIndex(this),_this);
				_this.menuManager.lightUpTheNight();
			},
			function() {
				if (!_this.enabled) return;
				toggleArrowKeys(true);
			}
		).click( function() {
			if (!_this.enabled) return;
			_this.clickLink();
		});
	};

	this.linkUp(cellInfo);
}

var menuManager = {
	menus: [],
	currMenu: null,
	currCell: function() {
		return this.currMenu.currCell();
	},
	makeMenu: function(cellInfo, menus, menuType, cellIndex) {
		var menu = new menuType(cellInfo,menus,this,cellIndex);
		this.setCurrMenu(menu);
		this.menus.push(menu);
		return menu;
	},
	setCurrMenu: function(menu) {
		this.currMenu = menu;
	},
	setCurrCell: function(index,menu) {
		this.currMenu = menu;
		menu.setCurrCell(index);
	},
	lightUpTheNight: function() {
		this.menus.map( function(menu) {
			menu.clearCellsHover();
		});
		this.currMenu.lightUpTheNight();
	},
	clickLink: function() {
		this.currMenu.clickLink();
	},
	clickCell: function(cell) {
		this.currMenu.clickCell(cell);
	},
	mapCells: function(fn, allLinks, menus) {
		menus = menus || this.menus;
		menus.map( function(menu) {
			if (allLinks || menu.enabled) {
				menu.cells.map( function(cell,i) {
					fn(cell,i,menu);
				});
			}
		});
	},
	setByClosestCell: function(clink,dir,menus) {
		clink = clink || this.currCell();
		if (!clink) return false;
		var cleft = $(clink).offset().left;
		var ctop = $(clink).offset().top;
		var rdist = 0;
		var index = null;
		var menu = null;

		this.mapCells( function(nlink,nindex,nmenu) {
			var nleft = $(nlink).offset().left;
			var ntop = $(nlink).offset().top;

			var comp = nleft < cleft;
			switch(dir) {
				case "up": comp = ntop < ctop; break;
				case "right": comp = nleft > cleft; break;
				case "down": comp = ntop > ctop; break;
			};
			if (comp) {
				var dist = hypo(nleft-cleft, ntop-ctop);
				if (!rdist || dist < rdist) {
					rdist = dist;
					index = nindex;
					menu = nmenu;
				}
			}
		},null,menus);
		if (index !== null && menu !== null) {
			menu.cellIndex = index;
			this.setCurrMenu(menu);
			return true;
		}
		return false;
	}
}

