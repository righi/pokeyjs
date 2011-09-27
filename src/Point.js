/* 
* pokeyjs version 0.1.1 beta
* https://github.com/righi/pokeyjs
*/

function Point() {}
Point.prototype = {
		className: 'Point',
		distance: function(point) {
			var xDiff = (this.x - point.x);
			var yDiff = (this.y - point.y);
			return Math.sqrt((xDiff * xDiff) + (yDiff * yDiff));
		},
		midpoint: function(point) {
			return Point.create((this.x + point.x) / 2.0, (this.y + point.y) / 2.0);
		},		
		isLeftOf: function(point) {
			return this.x < point.x;
		},
		isRightOf: function(point) {
			return this.x > point.x;
		},
		isAbove: function(point) {
			return this.y > point.y;
		},
		isBelow: function(point) {
			return this.y < point.y;
		},
		update: function(x,y) {
			this.x = x;
			this.y = y;
		},
		add: function(point) {
			return this.addX(point.x).addY(point.y);
		},
		addX: function(amt) {
			this.x += amt;
			return this;
		},
		addY: function(amt) {
			this.y += amt;
			return this;
		},
		clone: function() {
			return Point.create(this.x, this.y);
		},
		toString: function(args) {
			var scale = 1;
			var precision, numDecimals;
			if (args != null) {
				scale = args.scale || scale;
				precision = args.precision;
				numDecimals = args.numDecimals;
			}

			var x = this.x * scale;
			var y = this.y * scale;

			if (precision != null) {
				return x.toPrecision(precision) + "," + y.toPrecision(precision);
			} else if (numDecimals) { 
				return Pokey.roundFloat(x, numDecimals) + "," + Pokey.roundFloat(y, numDecimals);
			} else {
				return x + "," + y;
			}
		},
		equals: function(point, tolerance) {
			if (tolerance) {
				return this.distance(point) <= tolerance;
			} else {
				return point && this.x === point.x && this.y === point.y;
			}
		}
};

/*
 * Ways to build a point:
 * 
 *	var p1 = Point.create(5,6);
 *	var p2 = Point.create(5.7,6.2);
 *	var p3 = Point.create(p1);
 *	var p4 = Point.create("5.8,6.1");
 *	var p5 = Point.create({x: 17, y:19});
 * 
 */
Point.create = function() {
	var args = Array.prototype.slice.call(arguments);
	var p = new Point();
	
	if (args.length == 1) {
		var point = args[0];
		if (point.x && point.y) { // It's a point, or point-like object
			p.x = new Number(point.x) * 1.0;
			p.y = new Number(point.y) * 1.0;
		} else if (point.split) { // It's a comma delimited string
			var tokens = point.split(",");
			if (tokens.length == 2) {
				p.x = new Number(tokens[0].trim()) * 1.0;
				p.y = new Number(tokens[1].trim()) * 1.0;
			}
		}
	} else if (args.length == 2) { // x,y passed in
		p.x = new Number(args[0]) * 1.0;
		p.y = new Number(args[1]) * 1.0;
	}

	if (p.x == null || p.y == null) {
		throw "Error: Unable to create point from arguments: " + args.join();
	}
	
	return p;
};