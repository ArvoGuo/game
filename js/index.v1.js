(function($) {
	$.prototype.intersection = function(obj) {
		var self = $(this);
		if (obj.position().top + obj.height() >= self.position().top) {
			if ((obj.position().left + obj.width()) >= self.position().left && obj.position().left <= self.position().left + self.width()) {
				return true;
			}
		}
		return false;
	};
	$.prototype.speed = function(val) {
		if (typeof val == 'number') {
			this.speedval = val;
			return this;
		} else if (typeof val == 'undefined') {
			if ('speedval' in this) {
				return this.speedval
			} else {
				return 0
			}
		} else {
			return 'undefined';
		}
	}
})($)



$(function() {
	var screen = $('#screen');
	var bowl = $('#bowl');
	screen.mousemove(function(event) {
		event.preventDefault();
		if (event.target.id == 'bowl') {
			return
		};
		var x, y, limit = {},
			position = {};
		limit.minX = screen.offset().left;
		limit.maxX = screen.offset().left + screen.width();
		limit.minY = screen.offset().top;
		limit.maxY = screen.offset().top + screen.height();
		position = getPage(event);
		x = position.PageX;
		y = position.PageY;
		if (x < limit.minX) {
			x = limit.minX;
		};
		if (x + bowl.width() > limit.maxX) {
			x = limit.maxX - bowl.width();
		};
		if (y < limit.minY) {
			y = limit.minY;
		};
		if (y + bowl.height() > limit.maxY) {
			y = limit.maxY - bowl.height();
		}
		//default y 
		y = limit.maxY - bowl.height();
		bowl.css({
			'left': x - limit.minX, //for margin-left or left
			'top': y - limit.minY
		});
	})

	//fruits
	var fruits = [],shiftFruits = [],
		i,
		name = ['apple', 'banana'];
	fruits.push(fruitsFactory('apple'));



	var downFruits = setInterval(function() {
		if (fruits.length > 0) {
			for (i = 0; i < fruits.length; i++) {
				(function(i) {
					fruits[i].animate({
						top: screen.height() 
					}, fruits[i].speed(), function() {
						//$(this).remove();
					});
					shiftFruits.push(fruits.shift().attr('status','falling'));
				})(i)
			}
		};
	}, 200);

	// var addFruits = setInterval(function(){
	// 	fruits.push(fruitsFactory('apple'));

	// },5000)

	var checkInter = setInterval(function() {
		var length = shiftFruits.length,
			i;
		for (i = 0; i < length; i++) {
			// if(shiftFruits[i].attr('status')&&shiftFruits[i].attr('status') == 'loss'){
			// 	shiftFruits.shift();
			// 	continue;
			// }
			if (bowl.intersection(shiftFruits[i])) {
				shiftFruits[i].stop().animate({
					top: shiftFruits[i].position().top - 20,
					'opacity': 0
				}, 'slow', function() {
					//$(this).remove();
					shiftFruits.shift();

				});
			}
		}
	}, 100);
	var listen  = setInterval(function(){
		for( i = 0;i < shiftFruits.length ;i++){
			console.log(shiftFruits[i].position().top)
		}
		
	},1000)


	function fruitsFactory(name) {
		var fruit;
		switch (name) {
			case 'apple':
				fruit = $('<div></div>').css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'background': '#fff',
					'width': '20px',
					'height': '20px',
					'border': 'solid 1px #000'
				}).speed(6000);
				break;
			case 'banana':
				fruit = $('<div></div>').css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'background': '#fff',
					'width': '40px',
					'height': '20px',
					'border': 'solid 1px #000'
				}).speed(3000);
				break;
		}
		fruit.css('left', getRandomInt(0, screen.width() - fruit.width()))
		return fruit.appendTo(screen);
	}

	function getPage(e) {
		if (e.pageX || e.pageY) {
			return {
				PageX: e.pageX,
				PageY: e.pageY
			}
		}
		return {
			PageX: e.clientX + document.body.scrollLeft - document.body.clientLeft,
			PageY: e.clientY + document.body.scrollTop - document.body.clientTop
		}

	}

	function getRandomInt(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	}
})