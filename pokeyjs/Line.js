/* 
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
};