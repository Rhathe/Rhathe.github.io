(function() {

var form = 'form.columns';
var firstFormAction = $(form)[0].action;

$('.preview-btn').click(function() {
	$(form)[0].target = '_blank';
	$(form)[0].action = '/blog/preview/';
});

$('.save-btn, .save-draft-btn, .delete-draft-btn').click(function() {
	$(form)[0].target = '';
	$(form)[0].action = firstFormAction;
});

var originalSlug = null;
$('#enable-slug-edit input').change(function() {
	var slug = $('#slug');
	if (!originalSlug) originalSlug = slug.val();
	else slug.val(originalSlug);
	slug.prop('disabled', !this.checked);
});

})()
