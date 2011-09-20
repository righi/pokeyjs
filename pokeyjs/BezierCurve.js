/* 
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
};