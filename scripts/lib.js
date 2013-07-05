function createElements(html) {
	var tmp = document.createElement('div');
	tmp.innerHTML = html;
	return tmp.children;
}

function appendHtml(el, html) {
	var children = createElements(html);

	var result = [];
	while (children.length > 0) {
		result.push(el.appendChild(children[0]));
	}

	return result;
}

function getCoords(el) {
	'use strict';
	var box = el.getBoundingClientRect();

	//NOTE IE > 9
	var scrollTop = window.pageXOffset;
	var scrollLeft = window.pageYOffset;

	var top = box.top + scrollTop;
	var left = box.left + scrollLeft;

	var style = getComputedStyle(el, '');
	var height = parseInt(style.height, 10) + parseInt(style.paddingTop, 10) + parseInt(style.paddingBottom, 10);
	var width = parseInt(style.width, 10) + parseInt(style.paddingLeft, 10) + parseInt(style.paddingRight, 10);

	return {top: Math.round(top), left: Math.round(left), width: Math.round(width), height: Math.round(height)};
}

function setStyle(list, css) {
	forEach(list.length == null ? [list] : list, function (el, i) {
		for (var prop in css) {
			if (css.hasOwnProperty(prop)) {
				el.style[prop] = css[prop];
			}
		}
	});
}

function forEach(arr, fn) {
	var a = Array.prototype.slice.call(arr);
	a.forEach(fn, a);
}

function hasClass(el, cls) {
	return el.classList.contains(cls);
}

function addClass(el, cls) {
	if (!el.classList.contains(cls)) {
		el.classList.add(cls);
	}
}

function removeClass(el, cls) {
	if (el.classList.contains(cls)) {
		el.classList.remove(cls);
	}

}

var Events = {
	/**
	 *
	 * @param [DomElement] container
	 * @param {String} events space separated eventNames
	 * @param {Function} [selectorFn]
	 * @param {Function} fn
	 */
	on: function (container, events, selectorFn, fn) {
		var eventList = events.split(' ');

		if (arguments.length < 4) {
			fn = selectorFn;
			selectorFn = function() {return true;}
		}

		forEach(events.split(' ') || [], function (eventName, i) {
			container.addEventListener(eventName, function (e) {
				var target = e.target;
				do {
					if (target.nodeType == 1 && selectorFn(target)) {
						return fn.call(target, e);
					}
					target = target.parentNode;
				} while (target != this);
			}, false);
		});
	},
	off: function() {
		//TODO
	}
};

function preventSelection(selectorFn) {
	Events.on(document, 'mousedown selectstart', selectorFn,
		function (e) {
			e.preventDefault();
		}
	);
}
