//= require active_admin/base
//= require jqueryui
//= require_self


$(document).ready(function() { 
	$('#sortable_slides').sortable({
		update: function(event, ui) { alert('hello'); }
	});
});