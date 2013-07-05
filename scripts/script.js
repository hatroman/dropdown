(function (window) {
	"use strict";
	function Dropdown(btn) {
		if (!btn) {
			return;
		}
		var elements = btn.getElementsByClassName('dropdown-list');
		if (elements.length < 1) {
			return;
		}
		var dropdownList = elements[0];
		var opened = false;
		var _this = this;


//		preventSelection(btn, function (elem) {
//			return hasClass(elem, 'btn') || hasClass(elem, 'dropdown-item');
//		});
//
		preventSelection(dropdownList, function (elem) {
			return hasClass(elem, 'btn') || hasClass(elem, 'dropdown-item');
		});
//
		var coords = getCoords(btn);
		console.log(coords);
		Events.on(btn, 'click',
			function (e) {
				opened ? _this.close() : _this.open();
				e.dropdownHandled = true;
			}
		);

		Events.on(dropdownList, 'click', function (el) {
				return hasClass(el, 'dropdown-item')
			},
			function (e) {
				//TODO сделать кастомные события и триггерить тут 'change', вместо вывода в консоль

				window.console && console.log('change event, new value: \'' + getText(e.target) + '\'');

				removeClass(dropdownList.querySelector('.dropdown-item__active'), 'dropdown-item__active');
				addClass(e.target, 'dropdown-item__active');

				e.dropdownHandled = true;
				_this.close();
			}
		);

		//TODO global static event
		Dropdown.attachCloseOnDoc();

		this.open = function () {
			if (Dropdown.openedDropdown) {
				Dropdown.openedDropdown.close();
			}


			addClass(btn, 'dropdown__opened');

			document.body.appendChild(dropdownList);
			setStyle(dropdownList, {
				top: coords.top + coords.height + 1 +  'px',
				left: coords.left + 'px',
				display: 'block'
			});
			opened = true;
			Dropdown.openedDropdown = _this;
		};

		this.close = function () {
			removeClass(btn, 'dropdown__opened');
			btn.appendChild(dropdownList);
			setStyle(dropdownList, {
				top: -9999 + 'px',
				left: -9999 + 'px',
				display: 'none'
			});
			opened = false;
			Dropdown.openedDropdown = null;
		};
	}

	Dropdown.attachCloseOnDoc = function () {
		if (this.inited) {
			return;
		}
		Events.on(document, 'click',
			function (elem) {
				return elem == document.documentElement;
			},
			function (e) {
				if (!e.dropdownHandled && Dropdown.openedDropdown) {
					Dropdown.openedDropdown.close();
				}
			}
		);

		this.inited = true;
	};

	forEach(document.querySelectorAll('.dropdown'), function(el, i) {
		var d = new Dropdown(el);
	});

}(window));

