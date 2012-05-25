/**
	slidePoll()
 	Polling function. Polls every |timeout| milliseconds to see if the active slide has changed. If so, changes the slide to the appropriate one.
*/
function slidePoll() {
	var slideContainer 	= $("#image");	
 	var poll_url 		= slideContainer.attr('data-poll-url');
	var image_key 		= 'current_slide';
	var index_key       = 'index';
	var timeout         = 2000;
	
    $.get(poll_url,
    function(data) {

		// Default in case no data yet
		if (!data) {
			data = { current_slide: '' , 
			         index: 0 }
		} 

        // Get the active slide from JSON and on the page
        var active_slide      = data[image_key];
        var active_index      = data[index_key];
		var current_container;
		var next_container    = window.next_container; 
		
		if (next_container == "#image") {
			current_container = "#image_swap";
		} else {
			current_container = "#image";
		}
		
		var $current = $(current_container);
		var $next    = $(next_container);

		// Update the images
		if ($current.attr('src') != active_slide) {
		    $next.attr('width','').attr('height','');
    		$next.attr('src', active_slide);
    		$next.load(function() { 
    		  // TODO: This isn't loading the next one for some reason occasionally
        		window.current_container = next_container;
        		window.next_container    = current_container;

        		// Adjust the size of the container and image as necessary
        		imageAdjustments();

        		$current.fadeOut('slow');
        		$next.fadeIn('slow');
        		                    
    		});	
    		
    		// Update the active li element
            var selected = $("li[selected='selected']");
            var next     = $("li[data-index='" + active_index + "']");
            selected.removeAttr('selected');
            next.attr('selected','selected');				
		}
		
		setTimeout("slidePoll()", timeout);
    });	
}

/**
	setSlide()
	Sets the slide, server-side. Checks for appropriate permissions first.
*/
function setSlide() {
    var admin     = $("#admin").size() > 0;
	var post_url  = $("#navigation").attr('data-post-url');
    var selected  = $("li[selected='selected']");
    var index     = selected.attr('data-index');	
	var data      = { current_slide: index };
	
	if (!admin) {
		return;
	}

	
	$.ajax({
		type: "PUT",
		url: post_url, 
		data: data});	

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
    imageAdjustments()
	Makes CSS adjustments for Prez, which tries to present the image at native size, but will scale down to window
	size if necessary.
*/
function imageAdjustments() {
	var container         = $("#container");
	var navigation        = $("#navigation");
	var current_container = $(window.current_container);

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

	var imageWidth		= current_container.width();
	var imageHeight		= current_container.height();
	
	var maxHeight 		= winH;
	var maxWidth		= winW;
	
	// Adjust for navigation if admin
	if (navigation.length) {
    	maxHeight -= navigation.height();
	}

	// Adjust width and height
	if (imageWidth > maxWidth) {
		width = maxWidth;
	} else {
		width = imageWidth;
	} 
	
	if (imageHeight > maxHeight) {
		height = maxHeight;
	} else {
		height = imageHeight;
	}
	
	// Height/width setup
	container.css('height', height).css('width', width);
	current_container.attr('height', height).attr('width', width);	
}

/**
    adminSetup()
    
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
    	var current      = $('li[selected="selected"]');
    	var next         = [];
    	
    	if (e.which == 37) { // left key
        	next = current.prev();
    	} else if (e.which == 39) { // right key
        	next = current.next();
    	} else {
        	return true;
    	}
    	
    	e.preventDefault();
        			
		if (next.length) {
	   	    current.removeAttr('selected');
    		next.attr('selected', 'selected');
    		setSlide();
		} 
	});
	
}

$(window).load(function() {

	window.admin 			 = $("#admin").size() > 0;
	window.current_container = "#image_swap"
	window.next_container    = "#image";
	
	imageAdjustments();
    
	if (admin) {	
		adminSetup();
		setTimeout("setSlide()", 200);	
	}
	
	// Start polling
    slidePoll();
	
	// Register for the window resize event
	$(window).resize(function() {	    
		imageAdjustments();
	});

});