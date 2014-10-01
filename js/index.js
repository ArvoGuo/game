(function($) {
	$.prototype.intersection = function(obj) {
		var self = $(this);
		if (obj.position().top + obj.height() >= self.position().top && obj.position().top  <= self.position().top + (self.height()*3/5)) {
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
	$.prototype.disappear = function(scoreDiv) {
		var self = $(this);
		var scoreVal = parseInt(self.data('score'));
		var scoreNow = parseInt(scoreDiv.text());
		scoreDiv.text(scoreNow+scoreVal);
		var score = $('<div>' + self.data('score') + '</div>').css({
			'position':'absolute',
			'top':'-20px',
			'left':'-20px',
			'color': scoreVal > 0 ? 'yellow' : 'red' 
		});
		self.append(score);
		score.animate({
			'font-size':'40px',
			top: $(this).top - 50
		}, 'slow', function() {
			//$(this).remove();
		});
		self.css('background','#D1E7AA').stop().animate({
			top: self.position().top - 20,
			'opacity': '0.3'
		}, 'slow', function() {
			self.remove();
		});
		
	}
	Array.prototype.remove = function(from, to) {
		var rest = this.slice((to || from) + 1 || this.length);
		this.length = from < 0 ? this.length + from : from;
		return this.push.apply(this, rest);
	};
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
	var scoreDiv = $('<div>0</div>').css({
		'position':'absolute',
		'top':0,
		'right':'20px','color':'#81C0B1','font-size':'25px'
	}).appendTo(screen);

	//fruits
	var fruits = [],
		shiftFruits = [],
		i,
		name = ['apple', 'banana'];
	var downFruits = setInterval(function() {
		if (fruits.length > 0) {
			for (i = 0; i < fruits.length; i++) {
				(function(i) {
					if (fruits[i].attr('status') == 'ready') {
						fruits[i].animate({
							top: screen.height()
						}, fruits[i].speed(), function() {
							$(this).remove();
							fruits[i] && fruits[i].attr('status', 'loss');
						});
						fruits[i].attr('status', 'falling');
					}
					if (fruits[i].attr('status') == 'falling') {
						if (bowl.intersection(fruits[i])) {
							fruits[i].disappear(scoreDiv);
							fruits[i].attr('status', 'got');
						}
					}
					if (fruits[i].attr('status') == 'loss' || fruits[i].attr('status') == 'got') {
						//fruits[i].css('background', 'red')
						//console.log(fruits[i].attr('status'))
						//fruits.remove(i);
					};
				})(i)
			}
		};
	}, 100);

	var addFruits = setInterval(function() {
		fruits.push(fruitsFactory('apple'));
		fruits.push(fruitsFactory('banana'));
		fruits.push(fruitsFactory('orange'));

	}, 2000)


	

	function fruitsFactory(name) {
		var fruit;
		switch (name) {
			case 'apple':
				fruit = $('<div></div>').css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'background': '#FFA366',
					'width': '20px',
					'height': '20px',
					'border': 'solid 1px #000'
				}).speed(6000).data('score', '+20');
				break;
			case 'banana':
				fruit = $('<div>炸弹</div>').css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'background': '#923B9E',
					'width': '40px',
					'height': '20px',
					'border': 'solid 1px #000'
				}).speed(3000).data('score', '-15');
				break;
			case 'orange':
				fruit = $('<div></div>').css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'background': '#EED550',
					'width': '30px',
					'height': '30px',
					'border-radius':'15px',
					'border': 'solid 1px #000'
				}).speed(2500).data('score', '+10');
				break;	
		}
		fruit.attr('status', 'ready').css('left', getRandomInt(0, screen.width() - fruit.width()))
		return fruit.appendTo(screen);
	}

	function boomScore(obj) {
		var score = obj.data('score');
		var scoreDiv = $('<div>' + score + '</div>');
		scoreDiv.appendTo(obj);
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