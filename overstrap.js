(function(){
	const input_selector = 'input[type!=checkbox][type!=radio], textarea';
	const defaultOptions = {
		animatedBar: true,
		autoValidate: false,
		validate: function(input){
			input.trigger('validate');
			return input.is(':valid');
		}
	};
	
	$.overstrap = function(options){
		options = $.extend(true,defaultOptions,options);
		
		function input_validate(el){
			el = $(el);
			if((options.autoValidate && !el.hasClass('no-validate')) || el.hasClass('validate')){
				if(options.validate(el)){
					el.removeClass('invalid').addClass('valid');
				}
				else{
					el.removeClass('valid').addClass('invalid');
				}
			}
		}
		
		function input_filled(el){
			if(el.tagName.toLowerCase()=='input'&&( el.type=='checkbox'||el.type=='radio' )){
				return $(el).prop('checked');
			}
			else{
				return Boolean( $(el).val().length );
			}
		}
		
		jstack.loader('.input-field',function(){
			let $el = $(this);
			let autofocus = $el.find('input[autofocus]');
			if(autofocus.length){
				autofocus.siblings('label, i').addClass('active');
			}
			
			let inputs = $el.find('input, textarea');
			
			if(inputs.length){
				
				if(options.animatedBar && inputs.filter(input_selector).length){
					$el.addClass('animated-bar');
					if(!$el.find('.bar').length){
						$el.append('<span class="bar" />');
					}
				}
				
				inputs.each(function(){
					let input = $(this);
					let val = input_filled(this);
					
					if(val){
						input_validate(this);
					}
					if(val || input.is(':focus')){
						$el.addClass('active');
					}
					
					let id = input.requiredId();

					input.nextUntil('input','label').each(function(){
						if(!this.hasAttribute('for')){
							this.setAttribute('for',id);
						}
					});
					 
					input
						.on('change blur reset', function(e){
							if(input_filled(this)){
								$el.addClass('active');
							}
							else{
								$el.removeClass('active');
							}
							input_validate(this);
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
		
		//bootstrap 4 bugfix !
		$.on('mousedown','.dropdown-menu *',function(e){
			return false;
		});
	};

}());