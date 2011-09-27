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
};/* 
* pokeyjs version 0.1.1 beta
* https://github.com/righi/pokeyjs
*/

function Line() {}
Line.prototype = {
	x : function(y) {
		if (this.slope == 0) {
			if (y === this.yIntercept) {
				return Number.NaN;
			} else {
				return null;
			}
		} else if (isFinite(this.slope)) {
			return (y - this.yIntercept) / this.slope;
		} else {
			return this.xIntercept;
		}
	},
	y : function(x) {
		if (isFinite(this.slope)) {
			return (this.slope * x) + this.yIntercept;
		} else {
			if (x === this.xIntercept) {
				return Number.NaN;
			} else  {
				return null;
			}
		}
	},
	intersection : function(line) {
		// TODO Handle 0 slopes and Infinite slopes
		var x = (line.yIntercept - this.yIntercept) / (this.slope - line.slope);
		var y = line.y(x);
		return Point.create(x, y);
	}
};

Line.create = function(args) {
	var line = new Line();
	line.slope = args.slope || null;
	line.dv = args.dv || null; 
	line.yIntercept = args.yIntercept || null;
	line.xIntercept = args.xIntercept || null;
	return line;
};/* 
* pokeyjs version 0.1.1 beta
* https://github.com/righi/pokeyjs
*/

function LineSegment() {}
LineSegment.prototype = {
		distance: function(point) {
			if (this.yIntercept != null) {
				var tempLine = LineSegment.create({pointA: point, slope: this.slope});
				return Math.abs(this.yIntercept() - tempLine.yIntercept());
			} else {
				return point.x - this.pointA.x;
			}
		},
		x : function(y) {
			var slope = this.slope();
			if (slope === 0) {
				if (y == this.pointA.y) {
					return Number.NaN;
				} else {
					return null;
				}
			} else if (isFinite(slope)) {
				return (y - this.yIntercept()) / slope;
			} else {
				return this.pointA.x;
			}
		},
		y : function(x) {
			var slope = this.slope();
			if (isFinite(slope)) {
				return (slope * x) + this.yIntercept();
			} else {
				if (x === this.pointA.x) {
					return Number.NaN;
				} else  {
					return null;
				}
			}
		},
		point : function(t) {
			if (t < 0 || t > 1) throw "Illegal value " + t + " for 't' in getPoint.  Value must be: 0>=t<=1";
			var m = this.length() * t;
			var dv = this.directionVector();
			var x = this.pointA.x + (m * dv.x);
			var y = this.pointA.y + (m * dv.y);
			return Point.create(x,y);
		},
		pointsOffLine: function(point, distance) {
			var dv = this.directionVector();
			var x1 = point.x + (distance * dv.y);
			var y1 = point.y - (distance * dv.x);

			var x2 = point.x - (distance * dv.y);
			var y2 = point.y + (distance * dv.x);

			return [Point.create(x1,y1), Point.create(x2,y2)];
		},
		intersection : function(line) {
			var x = (line.yIntercept() - this.yIntercept()) / (this.slope() / line.slope());
			var y = line.y(x);
			return Point.create(x, y);
		},
		perp: function(rotatePoint, length) {
			rotatePoint = rotatePoint || this.midpoint();
			length = length || this.length();
			
			var pts = this.pointsOffLine(rotatePoint, length / 2);
			return LineSegment.create(pts[0], pts[1]);
		},
		magnitude: function() {
			return LineSegment.calculateMagnitude(this.pointA, this.pointB);
		},
		directionVector: function() {
			return LineSegment.calculateDirectionVector(this.pointA, this.pointB);
		},
		slope: function() {
			return LineSegment.calculateSlope(this.pointA, this.pointB);
		},
		length: function(newLength, newMidPoint) {
			var currentLength = this.pointA.distance(this.pointB);
			if (newLength != null) {
				this.grow(newLength - currentLength);				
				if (newMidPoint) {
					this.midpoint(newMidPoint);
				}
				currentLength = this.pointA.distance(this.pointB);
			}
			return currentLength;
		},
		yIntercept: function() {
			var slope = this.slope();
			if (slope == Infinity || slope == -Infinity) {
				return null;
			} else {
				return this.pointA.y - (slope * this.pointA.x);
			}
		},
		midpoint: function(newMidPoint) {
			var midpoint = this.pointA.midpoint(this.pointB);
			if (newMidPoint) {
				var dv1 = LineSegment.calculateDirectionVector(midpoint, this.pointA);
				var dv2 = LineSegment.calculateDirectionVector(midpoint, this.pointB);
				var halfLength = this.length() / 2;
				
				this.pointA.x = newMidPoint.x + (dv1.x * halfLength);
				this.pointA.y = newMidPoint.y + (dv1.y * halfLength);
				this.pointB.x = newMidPoint.x + (dv2.x * halfLength);
				this.pointB.y = newMidPoint.y + (dv2.y * halfLength);
				midpoint = newMidPoint;
			}
			return midpoint;
		},
		clone: function() {
			return LineSegment.create(this.pointA.clone(), this.pointB.clone());
		},
		angle: function() {
		    var deltaY = this.pointB.y - this.pointA.y;
		    var deltaX = this.pointB.x - this.pointA.x;
		    var deg = 180 * Math.atan2(deltaY, deltaX) / Math.PI; 
		    if (deg < 0) {
		    	deg += 360;
		    }
		    return deg;
		},
		rotate: function(degrees, rotatePoint) {
			rotatePoint = rotatePoint || this.midpoint();

			var angle = this.angle();
			
			var radianA = Pokey.degToRad(angle + 180 + degrees);			
			var radianB = Pokey.degToRad(angle + degrees);
			
			var deltaXA = Math.cos(radianA) * rotatePoint.distance(this.pointA);
			var deltaYA = Math.sin(radianA) * rotatePoint.distance(this.pointA);

			var deltaXB = Math.cos(radianB) * rotatePoint.distance(this.pointB);
			var deltaYB = Math.sin(radianB) * rotatePoint.distance(this.pointB);

			this.pointA.update(rotatePoint.x + deltaXA, rotatePoint.y + deltaYA);
			this.pointB.update(rotatePoint.x + deltaXB, rotatePoint.y + deltaYB);
		},
		grow: function(num, growthPoint) {
			var newLength = this.length();
			growthPoint = growthPoint || this.midpoint();

			if (num.indexOf && num.indexOf("%") != -1) {
				var pct = new Number(num.substring(0, num.indexOf("%"))) / 100;
				newLength += (newLength * pct);
			} else {
				newLength += new Number(num);
			}
			
			var addition = newLength - this.length(); 
			
			var midpoint = this.midpoint();
			var dv1 = LineSegment.calculateDirectionVector(midpoint, this.pointA);
			var dv2 = LineSegment.calculateDirectionVector(midpoint, this.pointB);
			
			var pointAFactor = this.pointA.distance(growthPoint) / this.length();
			var pointBFactor = this.pointB.distance(growthPoint) / this.length();
			
			this.pointA.addX(pointAFactor * addition * dv1.x);
			this.pointA.addY(pointAFactor * addition * dv1.y);
			this.pointB.addX(pointBFactor * addition * dv2.x);
			this.pointB.addY(pointBFactor * addition * dv2.y);
		},
		shrink: function(args, shrinkPoint) {
			// TODO This isn't robust.  What if their shrinkPoint is "-5"?
			this.grow("-" + args, shrinkPoint);
		},
		toString: function() {
			return "LineSegment[pointA: (" + this.pointA.toString() + "), pointB: (" + this.pointB.toString() + "), length: " + this.length() + ", slope: " + this.slope() + ", directionVector: (" + this.directionVector().toString({precision: 6}) + "), yIntercept: " + this.yIntercept() + ", magnitude: " + this.magnitude() + "]";
		}
};

LineSegment.create = function(args) {
	var pointA, pointB, slope, directionVector, yIntercept, length, angle;
	if (arguments.length == 2) {
		pointA = arguments[0];
		pointB = arguments[1];
	} else {
		pointA = args.pointA;
		pointB = args.pointB;
		slope = args.slope;
		directionVector = args.directionVector;
		yIntercept = args.yIntercept;
		length = args.length || 1;
		angle = args.angle;
		
		if (args.line) {
			pointA = args.line.pointA;
			pointB = args.line.pointB;
		}
	}
	
	if (pointA && pointB) {
		return LineSegment.createFromPoints(pointA, pointB);
	} else if (pointA || pointB) {
		if (slope != null) {
			return LineSegment.createFromPointSlopeLength(pointA, pointB, slope, length);
		} else if (directionVector != null) {
			return LineSegment.createFromPointVectorLength(pointA, pointB, directionVector, length);
		} else if (angle != null) {
			return LineSegment.createFromPointAngleLength(pointA, pointB, angle, length);
		}
	}
	
	throw "Unable to build line segment, likely due to missing data.";
};

LineSegment.createFromPoints = function(pointA, pointB) {
	var line = new LineSegment();
	line.pointA = pointA;
	line.pointB = pointB;
	return line;
};

LineSegment.createFromPointAngleLength = function(pointA, pointB, angle, length) {
	var rad = Pokey.degToRad(angle);
	var line = LineSegment.create(Point.create(0,0), Point.create(Math.cos(rad), Math.sin(rad)));
	var dv = line.directionVector();
	if (pointA) {
		pointB = Point.create(pointA.x + dv.x * length, pointA.y + dv.y * length);
	} else {
		pointB = Point.create(pointA.x + dv.x * length, pointA.y + dv.y * length);		
	}
	
	return LineSegment.create({pointA: pointA, pointB: pointB, directionVector: line.directionVector(), length: length});
};

LineSegment.createFromPointSlopeLength = function(pointA, pointB, slope, length) {
	var missingA = (pointA == null);
	var directionVector = LineSegment.calculateDirectionVector(pointA, pointB, slope);
	var point = (missingA) ? pointB : pointA;
	var otherPoint = null;

	if (slope == Infinity) {
		otherPoint = Point.create(point.x, point.y + ((missingA) ? -length : length)); 
	} else if (slope == -Infinity) {
		otherPoint = Point.create(point.x, point.y + ((!missingA) ? -length : length));
	} else {
		var len = ((directionVector.x > 0 && missingA) || (directionVector.x < 0 && !missingA)) ? -length : length;
		otherPoint = Point.create(point.x + directionVector.x * len, point.y + directionVector.y * len);
	}
	
	if (missingA) {
		return LineSegment.createFromPoints(otherPoint, point);
	} else {
		return LineSegment.createFromPoints(point, otherPoint);
	}
};

LineSegment.createFromPointVectorLength = function(pointA, pointB, vector, length) {
	var slope = vector.y / vector.x;
	return LineSegment.createFromPointSlopeLength(pointA, pointB, slope, length);
};

LineSegment.calculateSlope = function(pointA, pointB) {
	return (pointB.y - pointA.y) / (pointB.x - pointA.x);
};

LineSegment.calculateMagnitude = function(pointA, pointB, slope) {
	if (slope == null) {
		slope = LineSegment.calculateSlope(pointA, pointB);
	}
	if (slope == Infinity || slope == -Infinity) {
		return 0;
	} else {
		return Math.pow((1 + Math.pow(slope,2)), 0.5);
	}
};

LineSegment.calculateDirectionVector = function(pointA, pointB, slope) {
	if (slope == null) {
		slope = LineSegment.calculateSlope(pointA, pointB);
	}
	if (slope == Infinity) {
		return Point.create(0,1);
	} else if (slope == -Infinity) {
		return Point.create(0,-1);
	} else if (slope == 0) {
		if (pointA && pointB) {
			return pointA.isLeftOf(pointB) ? Point.create(1,0) : Point.create(-1,0);
		} else if (pointA) {
			return Point.create(1,0);
		} else {
			return Point.create(-1,0);
		}
	} else {
		var magnitude = LineSegment.calculateMagnitude(pointA, pointB, slope);
		var x = 1 / magnitude;
		var y = slope / magnitude;
		if (pointA && pointB && pointA.isRightOf(pointB)) {
			return Point.create(-x,-y);
		} else {
			return Point.create(x,y);
		}
	}
};
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
	className : "Rectangle",
	polygon : function() {
		return Polygon.create(this.points());
	},
	points : function() {
		return [this.pointA, this.pointB, this.pointC, this.pointD];
	},
	surrounds : function(arg) {
		var points = [];
		if (arg.className && arg.className === "Rectangle") {
			points = arg.points(); 
		} else  {
			points.push(arg);
		}
		return this.surroundsPoints(points);
	},
	surroundsPoints : function(pts) {
		for (var a = 0; a < pts.length; a++) {
			if (!this.surroundsPoint(pts[a])) {
				return false;
			}
		}
		return true;
	},
	surroundsPoint : function(point) {
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
	},
	bottomY : function() {
		return this.pointC.y;
	},
	topY : function() {
		return this.pointA.y;
	},
	leftX : function() {
		return this.pointA.x;
	},
	rightX : function() {
		return this.pointC.x;
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

/* 
* pokeyjs version 0.1.1 beta
* https://github.com/righi/pokeyjs
*/

function Circle() {}
Circle.prototype = {
	radius : function(radius)  {
		if (radius != null) {
			this.radius = radius;
		} else {
			return this.radius;
		}
	},
	diameter : function(diameter) {
		if (diameter != null) {
			this.radius = diameter / 2;
		} else {
			return this.radius * 2;
		}
	}
};

Circle.create = function(center, radius) {
	var circ = new Circle();
	circ.center = center;
	circ.radius = radius;
	return circ;
};

Circle.radiusFromPoints = function(pointA, pointB, pointC) {
	var line1 = LineSegment.create(pointA, pointB);
	var line2 = LineSegment.create(pointB, pointC);
	var line1Perp = line1.clone();
	line1Perp.rotate(-90);
	var line2Perp = line2.clone();
	line2Perp.rotate(-90);
	
	var lineA = Line.create({slope: line1Perp.slope(), yIntercept: line1Perp.yIntercept()});
	var lineB = Line.create({slope: line2Perp.slope(), yIntercept: line2Perp.yIntercept()});
	var intersect = lineA.intersection(lineB);
	var radius = intersect.distance(pointB);

	return radius;
}/* 
* pokeyjs version 0.1.1 beta
* https://github.com/righi/pokeyjs
*/

function BezierCurve() {}
BezierCurve.prototype = {
		point: function(t) {
			var x = Math.pow(t, 3) * (this.anchor2.x+3 * (this.control1.x-this.control2.x)-this.anchor1.x) + 3 * Math.pow(t,2) * (this.anchor1.x - 2 * this.control1.x + this.control2.x) + 3 * t * (this.control1.x-this.anchor1.x) + this.anchor1.x;
			var y = Math.pow(t, 3) * (this.anchor2.y+3 * (this.control1.y-this.control2.y)-this.anchor1.y) + 3 * Math.pow(t,2) * (this.anchor1.y - 2 * this.control1.y + this.control2.y) + 3 * t * (this.control1.y-this.anchor1.y) + this.anchor1.y;
			return Point.create(x,y);
		},
		points: function(min,max,increment) {
			min = min || 0;
			max = max || 1;
			increment = increment || this.increment;
			var pts = [];
			for (var t = min; t <= max; t += increment) {
				pts.push(this.point(t));
			}
			return pts;
		},
		locationsOnPath : function(point, tolerance, increment) {
			var result = [];
			var increment = increment || this.increment;
			for (t = 0; t <= 1; t += increment) {
				if (this.point(t).distance(point) <= tolerance) {
					result.push(t);
				}
			}
			return result;
		},
		svg: function() {
			var svg = "M " + this.anchor1 + " ";
			svg += "C " + this.control1 + " ";
			svg += this.control2 + " ";
			svg += this.anchor2 + " ";
			return svg;
		},
		startSlope : function() {
			var p1 = this.point(0);
			var p2 = this.point(this.increment);
			var line = LineSegment.create(p1, p2);
			return line.slope();
		},
		endSlope : function() {
			var p1 = this.point(1);
			var p2 = this.point(1 - this.increment);
			var line = LineSegment.create(p1, p2);
			return line.slope();			
		},
		extremePoints : function() {
			var ax = 3 * (this.anchor2.x - 3 * this.control2.x + 3 * this.control1.x - this.anchor1.x);
			var bx = 2 * (3 * this.control2.x - 6 * this.control1.x + 3 * this.anchor1.x); 
			var cx = 3 * this.control1.x - 3 * this.anchor1.x;

			var ay = 3 * (this.anchor2.y - 3 * this.control2.y + 3 * this.control1.y - this.anchor1.y);
			var by = 2 * (3 * this.control2.y - 6 * this.control1.y + 3 * this.anchor1.y); 
			var cy = 3 * this.control1.y - 3 * this.anchor1.y;
			
			var derivs = [(-bx + Math.sqrt((bx*bx) - (4 * ax * cx))) / (2 * ax),
			              (-bx - Math.sqrt((bx*bx) - (4 * ax * cx))) / (2 * ax),
			              (-by + Math.sqrt((by*by) - (4 * ay * cy))) / (2 * ay),
			              (-by - Math.sqrt((by*by) - (4 * ay * cy))) / (2 * ay)];

			var extremes = [];
			for (var a = 0; a < derivs.length; a++) {
				var deriv = derivs[a];
				if (deriv >= 0 && deriv <= 1) {
					extremes.push(this.point(deriv));
				}
			}
			
			return extremes;
		},
		boundingBox : function() {
			var points = this.extremePoints();
			points.push(this.anchor1);
			points.push(this.anchor2);
			
			var minX = minY = Number.MAX_VALUE;
			var maxX = maxY = Number.MIN_VALUE;
			for (var a = 0; a < points.length; a++) {
				var pt = points[a];
				minX = Math.min(minX, pt.x);
				minY = Math.min(minY, pt.y);
				
				maxX = Math.max(maxX, pt.x);
				maxY = Math.max(maxY, pt.y)
			}
			
			return Rectangle.create(Point.create(minX, minY), Point.create(maxX, maxY));
		},
		split : function(t) {
			// Merci, Paul de Casteljau!
			var midPt1 = Point.create(this.anchor1.x + t * (this.control1.x - this.anchor1.x), this.anchor1.y + t * (this.control1.y - this.anchor1.y));
		    var midPt2 = Point.create(this.control1.x + t * (this.control2.x - this.control1.x), this.control1.y + t * (this.control2.y - this.control1.y));
			var midPt3 = Point.create(this.control2.x + t * (this.anchor2.x - this.control2.x), this.control2.y + t * (this.anchor2.y - this.control2.y));
			var midPt4 = Point.create(midPt1.x + t * (midPt2.x - midPt1.x), midPt1.y + t * (midPt2.y - midPt1.y));
			var midPt5 = Point.create(midPt2.x + t * (midPt3.x - midPt2.x), midPt2.y + t * (midPt3.y - midPt2.y));
			var sharedAnchor = Point.create(midPt4.x + t * (midPt5.x - midPt4.x), midPt4.y + t * (midPt5.y - midPt4.y));
			return [BezierCurve.create(this.anchor1.clone(), midPt1, midPt4, sharedAnchor), BezierCurve.create(sharedAnchor.clone(), midPt5, midPt3, this.anchor2.clone())];
		}
};

BezierCurve.create = function() {
	var anchor1, control1, control2, anchor2;
	var increment = 0.01;
	if (arguments.length == 1) {
		anchor1 = arguments[0].anchor1;
		control1 = arguments[0].control1;
		control2 = arguments[0].control2;
		anchor2 = arguments[0].anchor2;
		increment = arguments[0].increment || increment;
	} else if (arguments.length == 4) {
		anchor1 = arguments[0];
		control1 = arguments[1];
		control2 = arguments[2];
		anchor2 = arguments[3];
	} else {
		throw "Incorrect number of parameters passed.  Must pass four points or a JSON object.";
	}
	var bc = new BezierCurve();
	bc.anchor1 = anchor1;
	bc.control1 = control1;
	bc.control2 = control2;
	bc.anchor2 = anchor2;
	bc.increment = increment;	
	return bc;
};

// Thank you Vincent: http://polymathprogrammer.com/2007/06/27/reverse-engineering-bezier-curves/
BezierCurve.interpolateControls = function(anchor1, anchor2, p1, p2, u, v) {
		var a = 3*(1-u)*(1-u)*u; 
		var b = 3*(1-u)*u*u;
		var c = 3*(1-v)*(1-v)*v; 
		var d = 3*(1-v)*v*v;
		var det = a*d - b*c;

		var q1x = p1.x - ( (1-u)*(1-u)*(1-u)*anchor1.x + u*u*u*anchor2.x );
		var q1y = p1.y - ( (1-u)*(1-u)*(1-u)*anchor1.y + u*u*u*anchor2.y );

		var q2x = p2.x - ( (1-v)*(1-v)*(1-v)*anchor1.x + v*v*v*anchor2.x );
		var q2y = p2.y - ( (1-v)*(1-v)*(1-v)*anchor1.y + v*v*v*anchor2.y );

		var control1 = Point.create((d*q1x - b*q2x) / det, (d*q1y - b*q2y) / det);
		var control2 = Point.create(((-c)*q1x + a*q2x) / det, ((-c)*q1y + a*q2y) / det);
		
		return [control1, control2];
};/* 
* pokeyjs version 0.1 beta
* https://github.com/righi/pokeyjs
*/

var Pokey = {
		roundFloat : function(num, numDecimals) {
			numDecimals = numDecimals || 0;
			return new Number((new Number(num)).toFixed(numDecimals)) * 1;
		},
		degToRad : function(degrees) {
			return degrees * Math.PI/180;
		} 
};