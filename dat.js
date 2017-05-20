function $(selector) {
	if (window === this) return new $(selector);

	if (typeof selector === 'object')
		this.element = selector;
	else {
		var elements = document.querySelectorAll(selector);
		if (elements.length == 1) this.element = document.querySelector(selector);
		else this.elements = elements;
	}

	return this;
}

var touchVars = {};

$.prototype = {
	ready: function (f) { this.element.addEventListener("DOMContentLoaded", f); },

	attr: function (name, value) {
		if (value === undefined) return this.element.getAttribute(name);

		if (this.elements) [].forEach.call(this.elements, function(el){ el.setAttribute(name, value); });
		else this.element.setAttribute(name, value);

		return this;
	},

	data: function (name, value) {
		if (value === undefined) return this.element.getAttribute('data-' + name);

		if (this.elements) [].forEach.call(this.elements, function(el){ el.setAttribute('data-' + name, value); });
		else this.element.setAttribute('data-' + name, value);

		return this;
	},

	html: function (value) {
		if (value === undefined) return this.element.innerHTML;

		if (this.elements) [].forEach.call(this.elements, function(el){ el.innerHTML = value; });
		else this.element.innerHTML = value;

		return this;
	},

	append: function(value) {
		if(this.elements) [].forEach.call(this.elements, function(el){ el.innerHTML += value; });
		else this.element.innerHTML += value;

		return this;
	},

	val: function (value) {
		if (value === undefined) return this.element.value;

		if (this.elements) [].forEach.call(this.elements, function(el){ el.value = value; });
		else this.element.value = value;

		return this;
	},

	find: function(selector) {
		var obj = $();
		var $elements = this.element.querySelectorAll(selector);
		if($elements.length == 1) obj.element = $elements[0];
		else obj.elements = $elements;

		return obj;
	},

	disableInputs: function () {
		if (this.elements)
			[].forEach.call(this.elements, function(el){
				[].forEach.call(el.querySelectorAll('input'), function(input){
					input.style.pointerEvents = 'none';
				});
				[].forEach.call(el.querySelectorAll('select'), function(input){
					input.style.pointerEvents = 'none';
				});
				[].forEach.call(el.querySelectorAll('textarea'), function(input){
					input.style.pointerEvents = 'none';
				});
			});
		else {
			[].forEach.call(this.element.querySelectorAll('input'), function(input){
				input.style.pointerEvents = 'none';
			});
			[].forEach.call(this.element.querySelectorAll('select'), function(input){
				input.style.pointerEvents = 'none';
			});
			[].forEach.call(this.element.querySelectorAll('textarea'), function(input){
				input.style.pointerEvents = 'none';
			});
		}

		return this;
	},

	enableInputs: function () {
		if (this.elements)
			[].forEach.call(this.elements, function(el){
				[].forEach.call(el.querySelectorAll('input'), function(input){
					input.style.pointerEvents = 'inherit';
				});
				[].forEach.call(el.querySelectorAll('select'), function(input){
					input.style.pointerEvents = 'inherit';
				});
				[].forEach.call(el.querySelectorAll('textarea'), function(input){
					input.style.pointerEvents = 'inherit';
				});
			});
		else {
			[].forEach.call(this.element.querySelectorAll('input'), function(input){
				input.style.pointerEvents = 'inherit';
			});
			[].forEach.call(this.element.querySelectorAll('select'), function(input){
				input.style.pointerEvents = 'inherit';
			});
			[].forEach.call(this.element.querySelectorAll('textarea'), function(input){
				input.style.pointerEvents = 'inherit';
			});
		}

		return this;
	},

	reset: function () {
		if (this.elements)
			[].forEach.call(this.elements, function(el){
				el.scrollTop = 0;
				[].forEach.call(el.querySelectorAll('form'), function(form){
					form.reset();
				});
			});
		else {
			this.element.scrollTop = 0;
			[].forEach.call(this.element.querySelectorAll('form'), function(form){
				form.reset();
			});
		}

		return this;
	},

	addClass: function (name) {
		if (this.elements) {
			for (var i = 0, l = this.elements.length; i < l; i++) {
				this.elements[i].classList.add(name);
			}
		} else
			this.element.classList.add(name);

		return this;
	},

	removeClass: function (name) {
		if (this.elements) [].forEach.call(this.elements, function(el){ el.classList.remove(name); });
		else this.element.classList.remove(name);

		return this;
	},

	hasClass: function (name) {
		return this.element.classList.contains(name);
	},

	on: function(type, callback) {
		if(type === 'touchstart'){
			function onTouchEnd(e) {
				if (touchVars.dist < 3) callback(touchVars.evnt, touchVars.src);
				this.removeEventListener("touchmove", onTouchMove);
				this.removeEventListener("touchend", onTouchEnd);
			}
			function onTouchMove(e) {
				touchVars.dist++;
				if (navigator.userAgent.match(/Android/i))
					this.removeEventListener("touchend", onTouchEnd);
			}
			function onTouchStart(e) {
				touchVars.evnt = e;
				touchVars.dist = 0;
				touchVars.src = this;
				this.addEventListener("touchmove", onTouchMove);
				this.addEventListener("touchend", onTouchEnd);
			}

			if(this.elements) [].forEach.call(this.elements, function(el){
				el.removeEventListener('touchstart', onTouchStart);
				el.addEventListener('touchstart', onTouchStart);
			});
			else {
				this.element.removeEventListener('touchstart', onTouchStart);
				this.element.addEventListener('touchstart', onTouchStart);
			}
		} else {
			if(this.elements) [].forEach.call(this.elements, function(el){ el['on' + type] = callback; });
			else this.element['on' + type] = callback;
		}
	},

	activate: function() {
		var active = $('.panel.active');
		var previous = $('.panel.previous');
		if(this.element && active.element != this.element){
			if(active.element) {
				active.removeClass('active').addClass('previous');
				if(previous.element || previous.elements.length > 0) {
					previous.removeClass('previous');
					previous.disableInputs();
				}
			}
			var activated = $(this.element);
			activated.addClass('active');
			setTimeout(function(){
				activated.enableInputs();
			}, 1000);
		}
		return this;
	},
}

$.serialize = function(selector) {
	var i, j, len, jLen, formElement, q = [];
	this.element = $(selector).element;
	this.elements = $(selector).elements;

	function addNameValue(name, value) {
		q.push(encodeURIComponent(name) + '=' + encodeURIComponent(value));
	}
	if (!this.element || !this.element.nodeName || this.element.nodeName.toLowerCase() !== 'form') {
		if (this.element) {
			function serializeObj(obj, prefix) {
				var str = [];
				for (var p in obj) {
					if (obj.hasOwnProperty(p)) {
						var k = prefix ? prefix + "[" + p + "]" : p,
							v = obj[p];
						str.push(typeof v == "object" ?
								 serializeObj(v, k) :
								 encodeURIComponent(k) + "=" + encodeURIComponent(v));
					}
				}
				return str.join("&");
			}
			return serializeObj(this.element);
		}
	} else {
		var form = this.element;
		for (i = 0, len = form.elements.length; i < len; i++) {
			formElement = form.elements[i];
			if (formElement.name === '') {
				continue;
			}
			switch (formElement.nodeName.toLowerCase()) {
				case 'input':
					switch (formElement.type) {
						case 'text':
						case 'hidden':
						case 'password':
						case 'button':
						case 'submit':
							addNameValue(formElement.name, formElement.value);
							break;
						case 'checkbox':
						case 'radio':
							if (formElement.checked) {
								addNameValue(formElement.name, formElement.value);
							}
							break;
						case 'file':
							break;
						case 'reset':
							break;
					}
					break;
				case 'textarea':
					addNameValue(formElement.name, formElement.value);
					break;
				case 'select':
					switch (formElement.type) {
						case 'select-one':
							addNameValue(formElement.name, formElement.value);
							break;
						case 'select-multiple':
							for (j = 0, jLen = formElement.options.length; j < jLen; j++) {
								if (formElement.options[j].selected) {
									addNameValue(formElement.name, formElement.options[j].value);
								}
							}
							break;
					}
					break;
			}
		}
		return q.join('&');
	}
}

$.post = function (url, data, callback, err) {
	if(url === undefined || url === null) throw 'URL is required';

	callback = (callback === undefined || callback === null) ? function(){ return false; } : callback;
	err = (err === undefined || err === null) ? function(){ return false; } : err;

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) callback(JSON.parse(xmlhttp.responseText));
			else if (err(xmlhttp.status)) this.element.post(url, data, callback, err);
		}
	}
	xmlhttp.timeout = 10000;
	xmlhttp.open("POST", url, true);
	xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	if(data === undefined || data === null ) xmlhttp.send();
	else xmlhttp.send(data);
}
