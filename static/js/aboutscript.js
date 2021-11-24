(function($) {
$(document).ready( function() {

var aboutMenu = function(linkInfo, menus, menuManager) {
	menu.apply(this,arguments);

	this.navByDist = true;
	this.freeNav = false;

	this.clearCellsHover = function() {
		$(this.cells).find('.arrow').hide();
	};

	var menuLightUpTheNight = this.lightUpTheNight;
	this.lightUpTheNight = function() {
		var currLink = this.currCell();
		if (currLink) {
			var desc = $(currLink).find('.description');
			if (desc.length) {
				$('.message').html(desc.html());
				if (desc.hasClass("hide")) $('.message').html("???");
			} else $('.message').html("");
			$(currLink).find('.arrow').show();
		}
		menuLightUpTheNight.apply(this,arguments);
	};

	var menuClickLink = this.clickLink;
	this.clickLink = function(link) {
		link = link || this.currCell();

		var showLinkMenu = function(key) {
			var key = key || $(link).data('key');
			if (key == "Accessory") {
				alert("CANNOT UNEQUIP");
				return;
			}
			var select = "." + key + "-list";
			listMenu.linkUp({
				container: select,
				cellBoxes: "a",
				enabled: true
			});
			this.menuManager.setCurrCell(0,listMenu);
		}

		if ($(link).hasClass('menu-link')) {
			if ($(link).hasClass("equipment")) {
				equipMenu.enabled = true;
				listMenu.linkUp({enabled: true});
				this.menuManager.setCurrCell(0,equipMenu);
			} else {
				equipMenu.enabled = false;
				if ($(link).hasClass("skills")) {
					showLinkMenu("Skills");
				} else {
					listMenu.linkUp({enabled: true});
				}
			}
		} else if ($(link).hasClass('equipment-link')) {
			showLinkMenu();
		} else if ($(link).hasClass('list-item')) {
			var index = equip(link);
			if (index !== false) {
				this.menuManager.setCurrCell(index,equipMenu);
			}
		}
		menuClickLink.apply(this,arguments);
	};
}

var listMenu = menuManager.makeMenu({enabled: false},{},aboutMenu);

var equipMenu = menuManager.makeMenu({
	container: '.equipment-box',
	cellBoxes: '>div',
	cells: '.equipment-link',
	enabled: false
},{down:listMenu},aboutMenu);

var navSiteMenu = menuManager.makeMenu({
	container: '.nav-site',
	cellBoxes: '.site-link'
},{left:[equipMenu,listMenu]},aboutMenu);

var navMenu = menuManager.makeMenu({
	container: '.nav-about',
	cellBoxes: '.menu-link'
},{down:navSiteMenu,left:[equipMenu,listMenu]},aboutMenu,null);

function equip(el) {
	var spans = [".label",".description"];
	var key = $(el).data('key');
	var select = "#" + key + "-equipped";
	var equipment = $(select);
	if (!equipment.length) return false;

	var error = $(el).find('.error');
	if (error.length) {
		alert(error.html());
		return false;
	}
	spans.map( function(item) {
		equipment.find(item).html($(el).find(item).html());
	});
	return equipMenu.getCellIndex(equipment);
};

function showList(select) {
	$('.list > div').hide();
	if (select) $('.list ' + select).show();
};

function enterKey() {
	menuManager.clickLink();
}

keys = {
	"13": {"canPress":true,"fn":enterKey},
	"37": {"canPress":true,"fn":arrowKeys},
	"38": {"canPress":true,"fn":arrowKeys},
	"39": {"canPress":true,"fn":arrowKeys},
	"40": {"canPress":true,"fn":arrowKeys}
};

});
})(jQuery)
