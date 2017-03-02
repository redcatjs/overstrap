(function(){
	const input_selector = 'input[type=text], input[type=password], input[type=email], input[type=url], input[type=tel], input[type=number], input[type=search], textarea';
	const defaultOptions = {
		animatedBar: true,
		validate: function(input){
			input.trigger('validate');
			return input.is(':valid');
		}
	};
	
	$.overstrap = function(options){
		options = $.extend(true,defaultOptions,options);
		
		function validate_field(input){
			if(input.hasClass('validate')){
				if(options.validate(input)){
					input.removeClass('invalid')
					input.addClass('valid');
				}
				else{
					input.removeClass('valid');
					input.addClass('invalid');
				}
			}
		}
		
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
					let val = input.val().length;
					if(val){
						validate_field(input);
					}
					if(val || this.hasAttribute('placeholder') || input.is(':focus')){
						$el.addClass('active');
					}
					
					var id = input.requiredId();
					input.nextUntil('input','label').each(function(){
						if(!this.hasAttribute('for')){
							this.setAttribute('for',id);
						}
					});
					 
					input
						.on('change blur reset', function(e){
							if(input.val()){
								$el.addClass('active');
							}
							else{
								$el.removeClass('active');
							}
							validate_field(input);
						})
						.on('reset', function(){
							$(this).removeClass('valid').removeClass('invalid');
						})
						.on('focus', function(){
							$el.addClass('active');
						})
					;
				});
				
			}
			
			
			
		});
		
		
		$.on('reset', 'form', function(){
			$(this).find(input_selector).trigger('reset');
		});
		
	};

}());