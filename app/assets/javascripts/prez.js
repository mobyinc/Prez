/**
	slidePoll()
 	Polling function. Polls every |timeout| milliseconds to see if the active slide has changed. If so, changes the slide to the appropriate one.
*/
function slidePoll() {
	var slideContainer 	= $("#slideshow");	
 	var poll_url 		= slideContainer.attr('data-poll-url');
	var active_key 		= 'current_slide';
	var timeout         = 5000;
	
    $.get(poll_url,
    function(data) {

		// Default in case no data yet
		if (!data) {
			data = { current_slide: '1' }
		} 

        // Get the active slide from JSON and on the page
        var active_slide = data[active_key];
        var active_li = $("li.active").text();

        // If different, change using the click handler
        if (active_li != active_slide) {
            var query = "li:contains(" + active_slide + ")";
            $(query).click();
        }
    });
    setTimeout("slidePoll()", timeout);
}

/**
	setSlide()
	Sets the slide, server-side. Checks for appropriate permissions first.
*/
function setSlide() {
	var admin     = $("#admin").size() > 0;
	var active_li = $("li.active").text();
	var data      = { current_slide: active_li };
	var post_url  = $("#slideshow").attr('data-post-url');
	if (!admin) {
		return;
	}
	
	$.ajax({
		type: "PUT",
		url: post_url, 
		data: data});	
}

$(window).load(function() {

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
	var orbit_list 		= $("ul.orbit-bullets");
	var slider_nav      = $(".slider-nav");
    // Hide bullets for non-admins
    if (!admin) {
        $("ul.orbit-bullets").css('display', 'none');
		$(".slider-nav").css('display', 'none');
    }

	if (admin) {	

		// Click handler for bullets
		var bullets = $("ul.orbit-bullets").children();
		$.each(bullets, function(index, value) {
			
			$(value).click(function(e) {
				setSlide();
			});
			
		});
		
		// Click handler for nav arrows
		$.each(slider_nav.children(), function(index, value) {
			$(value).click(function(e) {
				setSlide();
			})
		});
		
		// Key navigation
		$(document).keydown(function(e) {
			if (event.which == 37) { // left key
				slider_nav.children(".left").click();
				setSlide();
			}
			else if (event.which == 39) { // right key
				slider_nav.children(".right").click();
				setSlide();
			}
		});
		
	}
	
	// Start polling
	if (!admin) {
		slidePoll();
	}

});