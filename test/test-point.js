$(document).ready(function() {

	module("point");

	test("Tests points.", function () {
		var pointA = Point.create(0, 5);
		var pointB = Point.create(pointA);
		
		equal(pointB.x, 0, "point.x");
		equal(pointB.y, 5, "point.y");
	});

});
