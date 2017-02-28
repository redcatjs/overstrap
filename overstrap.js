(function(){
	const input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
	const defaultOptions = {
		animatedBar: true,
	};
	
	$.overstrap = function(options){
		options = $.extend(true,defaultOptions,options);
		
		
		jstack.loader('.input-field',function(){
			let $el = $(this);
			let autofocus = $el.find('input[autofocus]');
			if(autofocus.length){
				autofocus.siblings('label, i').addClass('active');
			}
			
			let inputs = $el.find(input_selector);
			if(inputs.length){
				if(options.animatedBar){
					$el.addClass('animated-bar');
					if(!$el.find('.bar').length){
						$el.append('<span class="bar" />');
					}
				}
				
				inputs.each(function(){
					let input = $(this);
					if(input.val().length>0 || this.hasAttribute('placeholder') || input.is(':focus')){
						$el.addClass('active');
					}
					input.on('change blur', function(){
						if($el.val().length){
							$el.addClass('active');
						}
						else{
							$el.removeClass('active');
						}
					}).on('focus', function(){
						$el.addClass('active');
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