/* 
* pokeyjs version 0.1 beta
* https://github.com/righi/pokeyjs
*/

// TODO Right now this only supports cubic Bezier curves.  Add support for quadratic and others.
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
			for (var t = min; t <= max; t+= increment) {
				pts.push(this.point(t));
			}
			return pts;
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