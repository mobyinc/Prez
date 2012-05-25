//= require active_admin/base
//= require jqueryui
//= require_self

$(document).ready(function() { 

    $.ajaxSetup({
        beforeSend: function(xhr) {
            xhr.setRequestHeader('X-CSRF-Token',
            $('meta[name="csrf-token"]').attr('content'));
        }
    });


	$('#sortable_slides').sortable({
		update: function(event, ui) {
			var slide_id = ui.item.attr('data-id');
			var index = ui.item.index();
			var url = ui.item.parent().attr('data-update-url');
		
			$.post(url, {
            	_method: 'put',
            	slide_id: slide_id,
            	index: index
	        },
	        function(data) {
	            console.log(data);
	            });
			}
	});
});