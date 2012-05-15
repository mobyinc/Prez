/**
	slidePoll()
 	Polling function. Polls every |timeout| milliseconds to see if the active slide has changed. If so, changes the slide to the appropriate one.
*/
function slidePoll() {
	var slideContainer 	= $("#client_image");	
 	var poll_url 		= slideContainer.attr('data-poll-url');
	var active_key 		= 'current_slide';
	var timeout         = 1000;
	
    $.get(poll_url,
    function(data) {

		// Default in case no data yet
		if (!data) {
			data = { current_slide: '' }
		} 

        // Get the active slide from JSON and on the page
        var active_slide = data[active_key];
        
		slideContainer.attr('src', active_slide);
    });

	slideContainer.show();
	
    setTimeout("slidePoll()", timeout);
}

/**
	setSlideTimeout()
	Sets the slide, server-side. Checks for appropriate permissions first.
*/
function setSlideTimeout() {
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

/**
	setSlide()
	Starts a timeout that calls setSlide(). 
	The reason for the timeout is to give foundation time to call whatever functions necessary for orbit to work.
	We use the bullets for navigation purposes, so we want the active bullet to be accurate.
*/
function setSlide() {
	var timeout         = 200;
    setTimeout("setSlideTimeout()", timeout);	
}


/**
	storeImageAttributes()
	Stores image max widths and heights as data attributes on the image
*/
function storeImageAttributes() {

	var width  = $("img:last").width();
	var height = $("img:last").height();

	
	$("img").each(function (index, value){ 
		$(value).attr('data-max-width', width);
		$(value).attr('data-max-height', height);
	});
}

/**
	Makes CSS adjustments for prez, which are dynamic based on the size of the slides
*/
function cssAdjustments() {
	var container       = $("#container");
	var slideContainer	= $("#slideshow");
	var firstImage      = slideContainer.children(":last"); // ASSUMES ALL IMAGES THE SAME SIZE
	var width 			= 1024 ;//firstImage.width();
	var height			= 672; //firstImage.height();
	var imageWidth		= 1024 ;//firstImage.attr('data-max-width');
	var imageHeight		= 672; //firstImage.attr('data-max-height');
	
	if (document.body && document.body.offsetWidth) {
          winW = document.body.offsetWidth;
          winH = document.body.offsetHeight;
      }
      if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
          winW = document.documentElement.offsetWidth;
          winH = document.documentElement.offsetHeight;
      }
      if (window.innerWidth && window.innerHeight) {
          winW = window.innerWidth;
          winH = window.innerHeight;
      }
	
	var maxHeight 		= winH;
	var maxWidth		= winW;
	var images			= $("img");

	if (width > maxWidth) {
		width = maxWidth;
	} else if (width < imageWidth)  {
		width = maxWidth;
	}
	
	if (height > maxHeight) {
		height = maxHeight;
	} else if (height < imageHeight) {
		height = maxHeight;
	}
	
	// Height/width setup
	container.css('height', height).css('width', width);
	
}

function adminSetup() {
	var admin 			= $("#admin").size() > 0;
    
	if (!admin) {
		return;
	}
	
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
		if (e.which == 37) { // left key
			slider_nav.children(".left").click();
			setSlide();
		}
		else if (e.which == 39) { // right key
			slider_nav.children(".right").click();
			setSlide();
		}
	});
	
}

$(window).load(function() {

	///////////
	// ORBIT //
	///////////
	var slideContainer 	= $("#slideshow");
	window.admin 			= $("#admin").size() > 0;
	window.orbit_list 		= $("ul.orbit-bullets");

	
    slideContainer.orbit({
        animation: 'fade',
        timer: false,
        bullets: true,
        directionalNav: admin
    });

	window.slider_nav      	= $(".slider-nav");
	storeImageAttributes();
	cssAdjustments();

	//////////
	// PREZ //
	//////////
	
    
    // Hide bullets for non-admins
    if (!admin) {
        $("ul.orbit-bullets").css('display', 'none');
		$(".slider-nav").css('display', 'none');
    }

	if (admin) {	
		adminSetup();
	}
	
	// Start polling
	if (!admin) {
		slidePoll();
	} else {
		setSlide();
	}
	
	// Window resizing event
	$(window).resize(function() {
	    
		cssAdjustments();
	});

});