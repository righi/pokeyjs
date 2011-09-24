/* 
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
