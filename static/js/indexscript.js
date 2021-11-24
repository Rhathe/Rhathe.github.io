(function($) {

$(document).ready( function() {

var enterStopsAnim = true;

var indexMenu = function(linkInfo, menus, menuManager) {
	menu.apply(this,arguments);
	this.clearCellsHover = function() {
		$(this.cells).find('.shadow').css('display','none');
	}
	this.lightUpTheNight = function() {
		var currLink = this.currCell();
		if (currLink) $(currLink).find('.shadow').css('display','inline');
	}
}

menuManager.makeMenu({
	container: '.selection',
	cellBoxes: '.link',
	cells: "a"
},{},indexMenu,null);

function stop() {
	$(".ht, .selection, #footer").css(stopAnim);
	enterStopsAnim = false;
}

$("body").on("click", function() {
	stop();
});

function enterKey() {
	if (enterStopsAnim) {
		stop();
	} else {
		menuManager.clickLink();
	}
}

keys = {
	"38": {"canPress":true,"fn":arrowKeys},
	"40": {"canPress":true,"fn":arrowKeys},
	"13": {"canPress":true,"fn":enterKey}
};

$('.selection').bind('animationEnd webkitAnimationEnd', function() {
	enterStopsAnim = false;
});

});
})(jQuery)
