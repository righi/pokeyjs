/* 
* pokeyjs version 0.1.1 beta
* https://github.com/righi/pokeyjs
*/

function Polygon() {}
Polygon.prototype = {
		addPoint : function() {
			var args = Array.prototype.slice.apply(arguments);
			var point = null;
			if (args.length == 0) {
				point = args[0];
			} else {
				point = Point.create.apply(null, args);
			}
			
			if (point) {
				this.points.push(point);
			}
		},
		surrounds : function(point) {
			var odd = false;
			
			var x = point.x;
			var y = point.y;
			
			var lastIdx = this.points.length - 1;
			for (var i = 0; i < this.points.length; i++) 
			{
				var p = this.points[i];
				var lastP = this.points[lastIdx];
				
				if ((p.y < y && lastP.y >= y || lastP.y < y && p.y >=y) && (p.x <= x || lastP.x <= x))
				{
			      if (p.x + (y - p.y) / (lastP.y - p.y) * (lastP.x - p.x) < x) 
			      {
			    	  odd = !odd; 
			      }
				}
			    lastIdx = i; 
			}
		  return odd;
		},
		area : function() {
			var area = 0;
			var lastIdx = this.points.length - 1;
			for (var i = 0; i < this.points.length; i++) 
			{
				var p = this.points[i];
				var lastP = this.points[lastIdx];				
				area += (lastP.x * p.y) - (p.x*lastP.y); 
				lastIdx = i;
			}
			return Math.abs(area / 2);
		}
};
Polygon.create = function(pts) {
	var poly = new Polygon();
	pts = pts || [];
	poly.points = pts;
	return poly;
};



function Rectangle() {}
Rectangle.prototype = {
	polygon : function() {
		return Polygon.create(this.points());
	},
	points : function() {
		return [this.pointA, this.pointB, this.pointC, this.pointD];
	},
	surrounds : function(point) {
		return (point.x > this.pointA.x && point.x < this.pointB.x) && (point.y < this.pointA.y && point.y > this.pointC.y);
	},
	area : function() {
		return this.width() * this.height();
	},
	width : function() {
		return this.pointB.x - this.pointA.x;
	},
	height : function() {
		return this.pointA.y - this.pointC.y;
	},
	isSquare : function() {
		return (this.width() === this.height());
	}
};
Rectangle.create = function(p1, p2) {
	var r = new Rectangle();
	if (p1.isAbove(p2)) {
		if (p1.isLeftOf(p2)) {
			r.pointA = p1;
			r.pointB = Point.create(p2.x, p1.y);
			r.pointC = p2;
			r.pointD = Point.create(p1.x, p2.y);
		} else if (p1.isRightOf(p2)) {
			r.pointA = Point.create(p2.x, p1.y);
			r.pointB = p1;
			r.pointC = Point.create(p1.x, p2.y);
			r.pointD = p2;
		} else {
			throw "Can't build a rectangle with two points containing the same x values: [ " + p1 + " and " + p2 + " ]";
		}
	} else if (p1.isBelow(p2)) {
		if (p1.isLeftOf(p2)) {
			r.pointA = Point.create(p1.x, p2.y);
			r.pointB = p2;
			r.pointC = Point.create(p2.x, p1.y);
			r.pointD = p1;
		} else if (p1.isRightOf(p2)) {
			r.pointA = p1;
			r.pointB = Point.create(p2.x, p1.y);
			r.pointC = p2;
			r.pointD = Point.create(p1.x, p2.y);
		} else {
			throw "Can't build a rectangle with two points containing the same x values: [ " + p1 + " and " + p2 + " ]";
		}
	} else {
		throw "Can't build a rectangle with two points containing the same y values: [ " + p1 + " and " + p2 + " ]";
	}

	return r;
};

