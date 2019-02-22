(function($,sr) {
	// debouncing function from John Hann
	// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
	var debounce = function (func, threshold, execAsap) {
		var timeout;
		
		return function debounced () {
			var obj = this, args = arguments;
			function delayed () {
				if (!execAsap)
					func.apply(obj, args);
					timeout = null;
			};
	
			if (timeout)
				clearTimeout(timeout);
			else if (execAsap)
				func.apply(obj, args);
	
			timeout = setTimeout(delayed, threshold || 100);
		};
	}
	// smartresize 
	jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };
	
	function changeFBPagePlugin(width, height) {

		if (!isNaN(width) && !isNaN(height)) {
			$(".fb-page").attr("data-width", width).attr("data-height", height);
		}
		if(typeof(FB) != 'undefined' && FB != null) {
			FB.XFBML.parse();
		}
	}

	$(window).smartresize(function(){
		changeFBPagePlugin($('#block-block-8').width(), $('#block-system-main').height());
	});
	
	$(document).ready(function() {
		// Find a Clinic styling adjustment
		function fixClinicStyles() {
			$('.view-find-a-clinic .view-grouping-header').replaceWith(function() {
				return $('<h2 />').append($(this).contents());
			});
		}
		$('.page-find-clinic-print .view-find-a-clinic p').each(function(i){
			var p = $(this);
			if(p.text().trim() == ""){
				p.remove();
			}
		});

		fixClinicStyles();

		$('.view-patient-service-data-charts img').each(function(index){
			$(this).wrap('<a href="'+$(this).attr('src')+'" class="chart-image"></a>');
			$(this).closest('.views-row').append('<span class="close">Close</span>');
		});
		$('.view-patient-service-data-charts .chart-image').click(function(e){
			e.preventDefault();
			$('html').toggleClass('zoom');
			$(this).closest('.views-row').toggleClass('active');
		});
		$('.view-patient-service-data-charts .close').click(function(e){
			e.preventDefault();
			$('html').toggleClass('zoom');
			$(this).closest('.views-row').toggleClass('active');
		});


		// if there are more than one image associated with clinics, display them all, and rotate through
		var numImages = $('#clinic-images div').children().length;
		if (numImages > 1) {
			// copy images to hidden div to display all images in new #all-images element
			$('#clinic-images').after('<div id="all-images" />');
			$('#clinic-images div').children().clone().removeAttr('style').appendTo('#all-images');
			$('#clinic-images div').cycle({
				fx: 'fade',
				timeout: 2000
			});
			$('#clinic-images').prepend('<p>[<a href="#" class="view-all">View Picture List</a>]</p>');
			$('#all-images').prepend('<p>[<a href="#" class="view-slideshow">View Slideshow</a>]</p>');
			$('.view-all').click(function(f) {
				f.preventDefault();
				$('#clinic-images').hide();
				$('#all-images').show();
			});
			$('.view-slideshow').click(function(e) {
				e.preventDefault();
				$('#all-images').hide();
				$('#clinic-images').show();
			});
		}
		// open map / directions links in new tab
		$('.node-clinic .map-link').attr('target', '_blank');
		// remove link from table captions
		$('caption a').contents().unwrap();
		// Notifications Setup
		$('#block-block-4 a').attr('title', $('#block-block-4 span').text()).append('!');
		$('#block-block-4').append('<div id="notifications-window"><div class="arrow" /><div class="header"><h2>Notifications</h2></div><div class="footer"><a href="/members/all-notifications">See All</a></div></div>');
		$('.view-display-id-new_notifications_display,.view-display-id-dismissed_notifications_display').detach().insertAfter('#notifications-window .header');
		// move the count up by the notification icon
		$('#notifications-window .view-header .count').detach().insertBefore('#block-block-4 .click');
		$('#block-block-4 .count').prepend('<span class="left-arrow" />');
		// notification dropdown interaction
		$('#block-block-4 .click').click(function(e) {
			e.preventDefault();
			$('#notifications-window').toggle();
			e.stopPropagation();
		});
		$(document.body).click(function() {
			$('#notifications-window').hide();
		});
		$('#notifications-window').click(function(e) {
			e.stopPropagation();
		});
		$('#notifications-window .flagged, #notifications-window .unflag-action').parent().hide();
		var $listItems = $('ul.nice-menu > li');
		var $select = $('<select/>', {
			id: 'nav-dropdown'
		});
		var $label = $('<label/>', {
			'for': 'nav-dropdown',
			text: 'Navigation: '
		});
		$listItems.each(function() {
			addOption(this, '');
		});
		$('ul.nice-menu').parent().append($('<div/>', {
			'class': 'portable'
		}));
		$('.portable').append($select);
		$select.before($label);
		$select.change(function() {
			window.location = $(this).find('option:selected').val();
		});

		function addOption(obj, prefix) {
			var $option = $('<option/>', {
				html: prefix + $('<span/>').text($(obj).children('a').text()).html(),
				value: $(obj).children('a').attr('href'),
				selected: $(obj).children('a').hasClass('active')
			});
			$select.append($option);
			if ($(obj).children('ul').length > 0) {
				prefix += '&nbsp;&nbsp;&nbsp;';
				$(obj).children('ul').children('li').each(function() {
					addOption(this, prefix);
				});
			}
		}

		if ($('form#views-exposed-form-find-a-clinic-find-clinic #edit-reset').length) {
			$(document).ajaxComplete(function() {
				fixClinicStyles();

				$('#edit-reset').replaceWith($('<input/>', {type:'button', id:'custom-edit-reset', value:'Reset', 'class':'form-submit'}));
				$('#custom-edit-reset').click(function(event) {
					event.preventDefault();
					$('#edit-field-city-value').val('');
					$('#edit-field-county-value').val('');
					$('#edit-submit-find-a-clinic').click();
				});
  			});
		}

		$('.view-donor-list .views-row .donor').each(function(i){
			var donor = $(this);
			var donor_name = $('.donor-name',donor);
			if(donor.attr('data-logo') != ""){
				donor.prepend('<div class="donor-logo"><img src="'+donor.attr('data-logo')+'" alt="" /></div>');
			}
			if(donor.attr('data-url') != ""){
				donor.wrapAll('<a href="'+donor.attr('data-url')+'" target="_blank"></a>');
			}
			if(donor_name.hasClass('Premier')){
				donor_name.text(donor_name.attr('data-program-title'));
			}
		});

	});

	setTimeout(function(){
		$('form#store-login').each(function(){
			var url = $(this).find('input[name=Store_URL]').attr('value');
			var inputs = $(this).find('input')
			$(this).attr('action', url);

			url = url + '?';
			for (var i = 0; i < inputs.length; i++) {
				var input = inputs[i];
				if ($(input).attr('name') == 'Store_URL') continue;
				url = url + encodeURIComponent($(input).attr('name')) + '=' + encodeURIComponent($(input).attr('value')) + '&';
			}
			$('<a/>', {href:url, text:$(this).find('input[type=submit]:first').attr('value')}).insertAfter($(this));
			$(this).find('input[type=submit]:first').hide();

			$(this).submit();
		});
	}, 1000);
})(jQuery, 'smartresize');
;
