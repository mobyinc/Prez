/**
	slidePoll()
 	Polling function. Polls every |timeout| milliseconds to see if the active slide has changed. If so, changes the slide to the appropriate one.
*/
function slidePoll() {
	var slideContainer 	= $("#image");	
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
        var active_slide      = data[active_key];
		var current_container;
		var next_container = window.next_container; 
		
		if (next_container == "image") {
			current_container = "image_swap";
		} else {
			current_container = "image";
		}
		
		var current = "#" + current_container;
		var next    = "#" + next_container;
		var $current = $(current);
		var $next    = $(next);

		if ($current.attr('src') != active_slide) {
        	$current.fadeOut('slow', function() {
			});
			
			$next.attr('src', active_slide);				
			$next.fadeIn('slow');
			window.next_container = current_container;
			
		}
		
    });
	
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
    cssAdjustments()
	Makes CSS adjustments for Prez, which are dynamic based on the size of the slides
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

/**
    Sets up the admin area, including navigation and click handlers.
*/
function adminSetup() {
	var admin 			= $("#admin").size() > 0;
    
	if (!admin) {
		return;
	}
	
	// Add in click handlers for thumbnails
	var thumbs = $("img.prez_thumb");
	$.each(thumbs, function(index, value) {
    	
    	$(value).click(function(event) {
        	var current = $('li[selected="selected"]');
        	var next    = $(value).parent();
        	current.removeAttr('selected');
        	next.attr('selected', 'selected');
        	setSlide();
    	});
	});
		
	// Key navigation
	$(document).keydown(function(e) {
    	var current     = $('li[selected="selected"]');        	
		if (e.which == 37) { // left key
    		var next    = current.prev();
		}
		else if (e.which == 39) { // right key
    		var next    = current.next();
		}
		
		current.removeAttr('selected');
		next.attr('selected', 'selected');
		setSlide();
	});
	
}

$(window).load(function() {

	var slideContainer 	    = $("#slideshow");
	window.admin 			= $("#admin").size() > 0;
	window.next_container   = "image";
	
	storeImageAttributes();
	cssAdjustments();
    
	if (admin) {	
		adminSetup();
		setTimeout("setSlideTimeout()", 200);	
	}
	
	// Start polling
    slidePoll();
	
	// Register for the window resize event
	$(window).resize(function() {	    
		cssAdjustments();
	});

});