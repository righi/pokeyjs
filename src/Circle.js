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
}