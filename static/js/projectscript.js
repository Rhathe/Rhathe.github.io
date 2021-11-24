(function($) {
$(document).ready( function() {

$("head").append("<style id='dynoStyle'></style>");

var currProject = {};
var player = 0;

var projectMenu = function(cellInfo, menus, menuManager) {
	menu.apply(this,arguments);
	var _this = this;

	this.clearCellsHover = function() {
		$(this.cells).removeClass("hover");
	}
	this.lightUpTheNight = function() {
		var currCell = this.currCell();
		if (!currCell) return;

		currCell = $(currCell);
		currCell.addClass("hover");
		var title = currCell.find(".project-title").html();
		title = title ? '<div class="project-title">'+title+'</div>' : "";
		var img = currCell.find(".project-img").html();
		img = img ? title + img : title;
		var pdiv = "#ps" + (player+1);
		if ($(pdiv + ' .project-image').html() !== img)
			$(pdiv + ' .project-image').html(img);
	}
	$(this.cells).on("click", function() {
		_this.clickCell(this);
	});

	this.clickCell = function(cell) {
		cell = cell || this.currCell();
		if (!cell) return;;
		var title = $(cell).find(".project-title").html();
		if (!title) return;

		var pdiv = "#ps" + (player+1);
		$(pdiv + " img").css({
			"-webkit-animation": "stop 0s",
			"-moz-animation": "stop 0s",
			"animation": "stop 0s"
		});
		player = (player+1)%2;
		pdiv = "#ps" + (player+1);
		$(pdiv + " img").css({
			"-webkit-animation": "",
			"-moz-animation": "",
			"animation": ""
		});

		if (player) $("#dynoStyle").text('.hover,#projects .project-selection .project-cell-container .project-cell:hover {border: solid 5px green !important;}');
		else $("#dynoStyle").text('');

		var e = $(cell);
		var p = $(".project-info");
		var arr = [
			".project-title",
			".project-body",
			".project-github",
			".project-link"
		];
		arr.map( function(item) {
			var p2 = p.find(item);
			p2.css('display','none');
			currProject[item] = "";
			var e2 = e.find(item);
			if (e2.length) {
				p2.css('display','block');
				p2.html(e2.html());
				currProject[item] = e2.html();
			}
		});
	}

}

menuManager.makeMenu({
	container: '.project-selection',
	cellBoxes: '.project-cell-container',
	cells: ".project-cell"
},{},projectMenu,null);

function enterKey() {
	menuManager.clickCell();
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
