(function(){
	const input_selector = 'input[type!=checkbox][type!=radio], textarea';
	const defaultOptions = {
		animatedBar: true,
		autoValidate: false,
		validate: function(input){
			$(input).trigger('validate');
			return $(input).is(':valid');
		}
	};

	$.overstrap = function(options){
		options = $.extend(true,defaultOptions,options);

		function field_validate(field, isInit){

			field = $(field);

			if(!field.hasClass('validate')){
				return;
			}

			let isValid = true;
			let isFilled = false;

			field.find(':input[name]').each(function(){
				let input = $(this);
				if(isInit&&!isFilled&&input_filled(this)){
					isFilled = true;
				}
				if(!options.validate(this)){
					isValid = false;
					input.removeClass('form-control-success').addClass('form-control-danger');
				}
				else{
					input.removeClass('form-control-danger').addClass('form-control-success');
				}
			});

			if(!isInit||isFilled){
				if(isValid){
					field.removeClass('has-danger invalid').addClass('has-success valid');
				}
				else{
					field.removeClass('has-success valid').addClass('has-danger invalid');
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
			
			let el = this;
			let $el = $(this);
			let autofocus = $el.find('input[autofocus]');
			if(autofocus.length){
				autofocus.siblings('label, i').addClass('active');
			}

			let inputs = $el.find('input, textarea');
			
			if(options.autoValidate&&!$el.hasClass('no-validate')){
				$el.addClass('validate');
			}
			
			if(inputs.length){

				if(options.animatedBar){
					let underlinableInputs = inputs.filter(input_selector);
					if(underlinableInputs.length){
						$el.addClass('animated-bar');
						if(!$el.find('.bar').length){
							underlinableInputs.each(function(){
								$(this).next('label').after('<span class="bar" />');
							});
						}
					}
				}

				field_validate(el, true);

				inputs.each(function(){
					let input = $(this);
					let val = input_filled(this);
					let isFirstFilling = !val;

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
							isFirstFilling = false;
							field_validate(el);
						})
						.on('input', function(e){
							if(!isFirstFilling&&$(this).is(input_selector)){
								field_validate(el);
							}
						})
						.on('focus', function(){
							$el.addClass('active');
						})
					;
				});

			}



		});


		$.on('reset', 'form', function(){
			$(this).find('.input-field').each(function(){
				field_validate(this, true);
			});
		});

		//bootstrap 4 bugfix !
		$.on('mousedown','.dropdown-menu *',function(e){
			return false;
		});
	};

}());
