$(document).ready(function() {

	///////////
	// ORBIT //
	///////////
	
	var slideContainer 	= $("#slideshow");
    slideContainer.orbit({
        animation: 'fade',
        timer: false,
        bullets: true,
        directionalNav: admin
    });

	//////////
	// PREZ //
	//////////
	
    var admin 			= $("#admin").size() > 0;
    var poll_url 		= slideContainer.attr('data-poll-url');
	var post_url 		= slideContainer.attr('data-post-url');
	var orbit_list 		= $("ul.orbit-bullets");
    var active_key 		= 'active';


	// Polling function
    function slidePoll() {
        $.GET(poll_url,
        function(data) {

			// Default in case no data yet
			if (!data) {
				data = { active: '1' }
			} 

            // Get the active slide from JSON and on the page
            var active_slide = data[active_key];
            var active_li = $("li.active").text();

            // If different, change using the click handler
            if (active_li != active_slide) {
                var query = "li:contains(" + active_slide + ")"
                $(query).click();
            }
        });
        setTimeout("slidePoll()", 500);
    }

    // Hide bullets for non-admins
    if (!admin) {
        $("ul.orbit-bullets").css('display: none');
    }

	// Admin posting to change slide server-wide
	if (admin) {
		var bullets = $("ul.orbit-bullets").children();
		$.each(bullets, function(index, value) {
			
			$(value).click(function(e) {
				var active_li = $("li.active").text();
				var data = { active: active_li };
				$.POST(post_url, data, function());
			});
			
		});
	}
	
	// Start polling
	slidePoll();

});