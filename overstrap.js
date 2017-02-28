(function(){
	const input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
	
	function validate_field(object) {
		var hasLength = object.attr('length') !== undefined;
		var lenAttr = parseInt(object.attr('length'));
		var len = object.val().length;

		if (object.val().length === 0 && object[0].validity.badInput === false) {
			if (object.hasClass('validate')) {
				object.removeClass('valid');
				object.removeClass('invalid');
			}
		}
		else {
			if (object.hasClass('validate')) {
				// Check for character counter attributes
				if ((object.is(':valid') && hasLength && (len < lenAttr)) || (object.is(':valid') && !hasLength)) {
					object.removeClass('invalid');
					object.addClass('valid');
				}
				else {
					object.removeClass('valid');
					object.addClass('invalid');
				}
			}
		}
	}
	
	$.overstrap = function(options){
		options = $.extend(true,{
			animatedBar: true,
		},options);
		
		
		jstack.loader('.input-field',function(){
			let $el = $(this);
			let autofocus = $el.find('input[autofocus]');
			if(autofocus.length){
				autofocus.siblings('label, i').addClass('active');
			}
			
			let input = $el.find(input_selector);
			if(input.length){
				if(options.animatedBar){
					$el.addClass('animated-bar');
					if(!$el.find('.bar').length){
						$el.append('<span class="bar" />');
					}
				}
				
				input.each(function(){
					var $el = $(this);
					var elements = $el.siblings('label, i');
					if($el.val().length > 0 || $el.attr('placeholder') !== undefined || this.validity.badInput === true){
						elements.addClass('active');
					}
					else{
						elements.removeClass('active');
					}
					$el.on('change', function(){
						if ($el.val().length !== 0 || $el.attr('placeholder') !== undefined) {
							elements.addClass('active');
						}
						validate_field($el);
					});
					$el.on('focus', function () {
						elements.addClass('active');
					});
					$el.on('blur', function () {
						if ($el.val().length === 0 && this.validity.badInput !== true && $el.attr('placeholder') === undefined) {
							elements.removeClass('active');
						}
						validate_field($el);
					});
				});
				
			}
			
			
			
		});
		
		
		
		$.on('reset', 'form', function (e) {
			var formReset = $(e.target);
			formReset.find(input_selector).removeClass('valid').removeClass('invalid');
			formReset.find(input_selector).each(function () {
				if ($(this).attr('value') === '') {
					$(this).siblings('label, i').removeClass('active');
				}
			});

			// Reset select
			formReset.find('select.initialized').each(function () {
				var reset_text = formReset.find('option[selected]').text();
				formReset.siblings('input.select-dropdown').val(reset_text);
			});
		});
		
	};

}());