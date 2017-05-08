(function(){
	const input_selector = 'input[type!=checkbox][type!=radio], textarea';
	const defaultOptions = {
		animatedBar: true,
		autoValidate: false,
		isValid: function(input){
			$(input).trigger('validate');
			return $(input).is(':valid');
		},
		validateField: function(field){
			return field.hasClass('validate');
		},
	};
	
	let overstrap = {
		
	};
	
	overstrap.init = function(options){
		
		let self = this;
		
		this.options = $.extend(true,defaultOptions,options);
		
		let observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				$.each(mutation.addedNodes,function(node){
					if($(node).hasClass('.input-field')){
						self.loadInputField(node);
					}
				});
			});    
		});

		observer.observe(document.body, {
			subtree: true,
			childList: true,
			attributes: false,
			characterData: false,
		});
		
		$(document.body).on('reset', 'form', function(){
			$(this).find('.input-field').each(function(){
				self.validateField(this, true);
			});
		});

		//bootstrap 4 bugfix !
		$(document.body).on('mousedown','.dropdown-menu *',function(e){
			return false;
		});

		Waves.init({
			duration: 500,
			delay: 200
		});
	};
	
	overstrap.inputFilled = function(el){
		if(el.tagName.toLowerCase()=='input'&&( el.type=='checkbox'||el.type=='radio' )){
			return $(el).prop('checked');
		}
		else{
			return Boolean( $(el).val().length );
		}
	};
	
	overstrap.validateField = function(field, isInit){
		if(this.options.validateField(field, isInit)===false){
			return;
		}
		this.validateFieldDefault(field, isInit);
	};
	overstrap.validateFieldDefault = function(field, isInit){
		let self = this;
		let isValid = true;
		let isFilled = false;

		field.find(':input[name]').each(function(){
			let input = $(this);
			if(isInit&&!isFilled&&self.inputFilled(this)){
				isFilled = true;
			}
			if(!self.options.isValid(this)){
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
	};
	overstrap.loadInputField = function(el){
		let self = this;
		
		let $el = $(el);
		let autofocus = $el.find('input[autofocus]');
		if(autofocus.length){
			autofocus.siblings('label, i').addClass('active');
		}

		let inputs = $el.find('input, textarea');
		
		if(self.options.autoValidate&&!$el.hasClass('no-validate')){
			$el.addClass('validate');
		}
		
		if(inputs.length){

			if(self.options.animatedBar){
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
			

			self.validateField($el, true);

			inputs.each(function(){
				let input = $(this);
				let val = self.inputFilled(this);
				let isFirstFilling = !val;
				
				if(this.type=='checkbox'){
					if(!input.next().is('label')){
						input.after('<label></label>');
					}
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
						if(self.inputFilled(this)){
							$el.addClass('active');
						}
						else{
							$el.removeClass('active');
						}
						isFirstFilling = false;
						self.validateField($el);
					})
					.on('input', function(e){
						if(!isFirstFilling&&$(this).is(input_selector)){
							self.validateField($el);
						}
					})
					.on('focus', function(){
						$el.addClass('active');
					})
				;
			});

		}



	};
	
	
	$.overstrap = overstrap;
	
}());
