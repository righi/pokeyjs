$(document).ready(function() {

	module("creation");

	test("Ensures that line segments are created correctly based on different construction techniques", function () {

		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(10,10)}).length().toPrecision(13), "14.14213562373", "0,0 -> 10,10 length test" );
		equal(LineSegment.create({pointA: Point.create(5,5), pointB: Point.create(5,10)}).length(), 5, "5,5 -> 5,10 length test" );
		equal(LineSegment.create({pointB: Point.create(5,5), pointA: Point.create(5,10)}).length(), 5, "5,10 -> 5,5 length test" );
		equal(LineSegment.create({pointA: Point.create(5,5), pointB: Point.create(10,5)}).length(), 5, "5,5 -> 10,5 length test" );
		equal(LineSegment.create({pointB: Point.create(5,5), pointA: Point.create(10,5)}).length(), 5, "10,5 -> 5,5 length test" );
		
		var line = LineSegment.create({pointA: Point.create(0,5), slope: 0, length: 5});
		var pointB = Point.create(5,5);
		equal(line.pointB.toString(), pointB.toString(), "0,5 slope:0 length:5 pointB test" );
		

		line = LineSegment.create({pointA: Point.create(5,5), slope: -1, length: 7.071067811865476});
		pointB = Point.create(10,0);
		equal(line.pointB.toString(), pointB.toString(), "5,5 slope:-1 length: 7.071067811865476 pointB test" );

		
		line = LineSegment.create({pointA: Point.create(5,5), slope: Infinity, length: 10});
		pointB = Point.create(5,15);
		equal(line.pointB.toString(), pointB.toString(), "5,5 slope: Infinity length: 10 pointB test" );

		line = LineSegment.create({pointA: Point.create(5,5), slope: -Infinity, length: 10});
		pointB = Point.create(5,-5);
		equal(line.pointB.toString(), pointB.toString(), "5,5 slope: -Infinity length: 10 pointB test" );


		line = LineSegment.create({pointA: Point.create(210,210), slope: -1, length: Math.sqrt(200)});
		pointB = Point.create(220,200);
		equal(line.pointB.toString(), pointB.toString(), "210,210 slope: -1 length: Math.sqrt(200) pointB test" );
		
	});
	
	module("slope");

	test("Ensures that line slopes are correct based on different LineSegment construction techniques", function () {

		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(10,10)}).slope(), 1, "0,0 -> 10,10" );
		equal(LineSegment.create({pointB: Point.create(0,0), pointA: Point.create(10,10)}).slope(), 1, "10,0 -> 0,0" );
		
		equal(LineSegment.create({pointA: Point.create(0,10), pointB: Point.create(10,0)}).slope(), -1, "0,10 -> 10,0" );
		equal(LineSegment.create({pointB: Point.create(0,10), pointA: Point.create(10,0)}).slope(), -1, "10,0 -> 0,10" );
		
		equal(LineSegment.create({pointA: Point.create(17,6.5), pointB: Point.create(45,6.5)}).slope(), 0, "17,6.5 -> 45,6.5" );
		equal(LineSegment.create({pointB: Point.create(17,6.5), pointA: Point.create(45,6.5)}).slope(), 0, "45,6.5 -> 17,6.5" );
		
		equal(LineSegment.create({pointA: Point.create(12.99,3), pointB: Point.create(12.99,1000)}).slope(), Infinity, "12.99,3 -> 12.99,1000" );
		equal(LineSegment.create({pointB: Point.create(12.99,3), pointA: Point.create(12.99,1000)}).slope(), -Infinity, "12.99,1000 -> 12.99,3" );
		
		equal(LineSegment.create({pointA: Point.create(231,170), pointB: Point.create(200,200)}).slope(), -0.967741935483871, "231,170 -> 200,200 slope test" );
		
	});
	
	module("perp");

	test("Ensures that perpendicular lines are created correctly.", function () {

		var line = LineSegment.create({pointA: Point.create(100,100), pointB: Point.create(200,200)});
		var perp = line.perp();
		var pointA = Point.create(200,100);
		var pointB = Point.create(100,200);
		
		
		equal(line.length(), perp.length(), "Perpendicular length" );
		equal(perp.pointA.toString(), pointA.toString(), "pointA of perpendicular" );
		equal(perp.pointB.toString(), pointB.toString(), "pointB of perpendicular" );
		
	});
	
	module("angle");

	test("Ensures that angles are calculated correctly.", function () {

		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(100,0)}).angle(), 	0, 		"0 Degrees" );
		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(100,100)}).angle(), 	45,		"45 Degrees" );
		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(0,100)}).angle(), 	90,		"90 Degrees" );
		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(-100,100)}).angle(), 	135,	"135 Degrees" );
		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(-100,0)}).angle(), 	180,	"180 Degrees" );
		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(-100,-100)}).angle(), 225,	"225 Degrees" );

		
		equal(LineSegment.create({pointA: Point.create(0,0), angle: 0, length: 100}).pointB.toString({numDecimals: 4}), Point.create(100,0).toString({numDecimals: 4}), 		"Building Line from pointA with angle 0" );
		equal(LineSegment.create({pointA: Point.create(0,0), angle: 90, length: 100}).pointB.toString({numDecimals: 4}), Point.create(0,100).toString({numDecimals: 4}), 		"Building Line from pointA with angle 90" );
		equal(LineSegment.create({pointA: Point.create(0,0), angle: 180, length: 100}).pointB.toString({numDecimals: 4}), Point.create(-100,0).toString({numDecimals: 4}), 		"Building Line from pointA with angle 180" );

	});
	
	module("directionVector");

	test("Ensures that direction vectors are calculated correctly.", function () {

		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(100,0)}).directionVector().toString(), 	Point.create(1,0).toString());
		equal(LineSegment.create({pointA: Point.create(100,0), pointB: Point.create(0,0)}).directionVector().toString(), 	Point.create(-1,0).toString());
		
		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(100,100)}).directionVector().toString(), 	Point.create(0.7071067811865475,0.7071067811865475).toString());
		equal(LineSegment.create({pointA: Point.create(100,100), pointB: Point.create(0,0)}).directionVector().toString(), 	Point.create(-0.7071067811865475,-0.7071067811865475).toString());
		
		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(0,100)}).directionVector().toString(), 	Point.create(0,1).toString());
		equal(LineSegment.create({pointA: Point.create(0,100), pointB: Point.create(0,0)}).directionVector().toString(), 	Point.create(0,-1).toString());
		
		equal(LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(-100,100)}).directionVector().toString(), 	Point.create(-0.7071067811865475,0.7071067811865475).toString());
		equal(LineSegment.create({pointA: Point.create(-100,100), pointB: Point.create(0,0)}).directionVector().toString(), 	Point.create(0.7071067811865475,-0.7071067811865475).toString());

	});
	
	module("rotate");

	test("Ensures that lines are rotated correctly.", function () {
		var delta = 0.00001;
		var line = LineSegment.create({pointA: Point.create(0,0), pointB: Point.create(100,0)});
		
		line.rotate(45);
		equal(line.angle(), 	45,		"0 degrees rotated +45 to 45 Degrees", delta);
		
		line.rotate(-10);
		equal(line.angle(), 	35,		"45 degrees rotated -10 to 35 Degrees", delta);
		
		line.rotate(360);
		equal(line.angle(), 	35,		"35 degrees rotated +360 to 35 Degrees", delta);

		line.rotate(-360);
		equal(line.angle(), 	35,		"35 degrees rotated -360 to 35 Degrees", delta);

		line.rotate(725);
		equal(line.angle(), 	40,		"35 degrees rotated +725 to 40 Degrees", delta);

		line.rotate(-725);
		equal(line.angle(), 	35,		"40 degrees rotated -725 to 35 Degrees", delta);

		equal(line.length(), 100, "line length should still be 100 after much rotation");
		
		line.rotate(-35);
		equal(line.angle(), 0, "35 degrees rotated -35 to 0 degrees", delta);
						
		equal(line.pointA.toString({numDecimals: 4}), Point.create(0,0).toString({numDecimals: 4}), "line.PointA back to 0,0");
		equal(line.pointB.toString({numDecimals: 4}), Point.create(100,0).toString({numDecimals: 4}), "line.PointB back to 100,0");

		line = LineSegment.create({pointA: Point.create(5,5), pointB: Point.create(5,21)});
		var p25 = line.point(0.25);
		line.rotate(90, p25);
		equal(line.pointA.toString({numDecimals: 4}), Point.create(9,9).toString({numDecimals: 4}), "line rotated around 0.25 pt");
		equal(line.pointB.toString({numDecimals: 4}), Point.create(-7,9).toString({numDecimals: 4}), "line rotated around 0.25 pt");
		
	});
	
	module("midpoint() to relocate a line.");
	
	test("Tests midpoint() to relocate a horizontal line segment, along a new line path.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(10,0);
		var line = LineSegment.create(pt1, pt2);
		line.midpoint(Point.create(5,5));
		equal(line.pointA.toString(), Point.create(0,5).toString(), "pointA");
		equal(line.pointB.toString(), Point.create(10,5).toString(), "pointB");
	});

	test("Tests midpoint() to relocate a horizontal line segment, along the same line path.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(10,0);
		var line = LineSegment.create(pt1, pt2);
		line.midpoint(Point.create(8,0));
		equal(line.pointA.toString(), Point.create(3,0).toString(), "pointA");
		equal(line.pointB.toString(), Point.create(13,0).toString(), "pointB");
	});

	test("Tests midpoint() to relocate a vertical line segment, along a new line path.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(0,10);
		var line = LineSegment.create(pt1, pt2);
		line.midpoint(Point.create(5,5));
		equal(line.pointA.toString(), Point.create(5,0).toString(), "pointA");
		equal(line.pointB.toString(), Point.create(5,10).toString(), "pointB");
	});

	test("Tests midpoint() to relocate a vertical line segment, along the same line path.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(0,10);
		var line = LineSegment.create(pt1, pt2);
		line.midpoint(Point.create(0,10));
		equal(line.pointA.toString(), Point.create(0,5).toString(), "pointA");
		equal(line.pointB.toString(), Point.create(0,15).toString(), "pointB");
	});

	test("Tests midpoint() to relocate a diagonal line segment, along a new line path.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(10,10);
		var line = LineSegment.create(pt1, pt2);
		line.midpoint(Point.create(5,7));
		equal(line.pointA.toString(), Point.create(0,2).toString(), "pointA");
		equal(line.pointB.toString(), Point.create(10,12).toString(), "pointB");
	});

	test("Tests midpoint() to relocate a diagonal line segment, along the same line path.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(10,10);
		var line = LineSegment.create(pt1, pt2);
		line.midpoint(Point.create(9,9));
		equal(line.pointA.toString(), Point.create(4,4).toString(), "pointA");
		equal(line.pointB.toString(), Point.create(14,14).toString(), "pointB");
	});

				
	module("length() to shrink and grow");
	
	test("Tests length() to grow a line segment, with no new midPoint", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(10,0);
		var line = LineSegment.create(pt1, pt2);
		line.length(20);
		equal(line.length(), 20, "Length");
		equal(line.pointA.toString(), Point.create(-5,0).toString(), "pointA");
		equal(line.pointB.toString(), Point.create(15,0).toString(), "pointB");
	});
	
	test("Tests length() to grow a line segment, with a new midPoint", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(10,0);
		var line = LineSegment.create(pt1, pt2);
		line.length(20, Point.create(10,0));
		equal(line.length(), 20, "Length");
		equal(line.pointA.toString(), Point.create(0,0).toString(), "pointA");
		equal(line.pointB.toString(), Point.create(20,0).toString(), "pointB");
	});
	
	test("Tests length() to shrink a line segment, with no new midPoint", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(20,0);
		var line = LineSegment.create(pt1, pt2);
		line.length(10);
		equal(line.length(), 10, "Length");
		equal(line.pointA.toString(), Point.create(5,0).toString(), "pointA");
		equal(line.pointB.toString(), Point.create(15,0).toString(), "pointB");
	});
	
	test("Tests length() to shrink a line segment, with a new midPoint", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(20,0);
		var line = LineSegment.create(pt1, pt2);
		line.length(10, Point.create(18,0));
		equal(line.length(), 10, "Length");
		equal(line.pointA.toString(), Point.create(13,0).toString(), "pointA");
		equal(line.pointB.toString(), Point.create(23,0).toString(), "pointB");
	});

	
	module("grow");
	
	test("Tests growing lines without a growthPoint specified and a number provided for the size of growth on a horizontal line.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(10,0);
		var line = LineSegment.create(pt1, pt2);
		line.grow(5);
		equal(line.length(), 15, "Length");
	});

	test("Tests growing lines without a growthPoint specified and a number provided for the size of growth on a vertical line.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(0,10);
		var line = LineSegment.create(pt1, pt2);
		line.grow(5);
		equal(line.length(), 15, "Length");
	});

	test("Tests growing lines without a growthPoint specified and a number provided for the size of growth.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(10,10);
		var line = LineSegment.create(pt1, pt2);
		line.grow(5);
		var originalLength = 14.14213562373095;
		equal(line.length(), originalLength + 5, "Length");
	});

	test("Tests growing lines without a growthPoint specified and a string containing a number provided for the size of growth.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(10,10);
		var line = LineSegment.create(pt1, pt2);
		line.grow("5");
		var originalLength = 14.14213562373095;
		equal(line.length(), originalLength + 5, "Length");
	});

	test("Tests growing lines without a growthPoint specified and a string containing a percent provided for the size of growth.", function () {
		var pt1 = Point.create(0,0);
		var pt2 = Point.create(10,10);
		var line = LineSegment.create(pt1, pt2);
		line.grow("25%");
		equal(line.length(), 17.677669529663688, "Length");
	});

	
	module("x and y functions");
	
	test("Tests the x() and y() functions on a line with a normal slope.", function () {
		var p1 = Point.create(0,0);
		var p2 = Point.create(10,10);
		var line = LineSegment.create(p1, p2);
		equal(line.y(0),		0,		"0,0");
		equal(line.y(4),		4,		"4,4");
		equal(line.y(7.8),		7.8,	"7.8,7.8");
		equal(line.y(10),		10,		"10,10");
		equal(line.y(15),		15,		"15,15");
		
		equal(line.x(0),		0,		"0,0");
		equal(line.x(4),		4,		"4,4");
		equal(line.x(7.8),		7.8,	"7.8,7.8");
		equal(line.x(10),		10,		"10,10");
		equal(line.x(15),		15,		"15,15");
	});
	
	test("Tests the x() and y() functions on a vertical line.", function () {
		var p1 = Point.create(10,0);
		var p2 = Point.create(10,10);
		var line = LineSegment.create(p1, p2);
		
		equal(line.x(0),		10,		"x(0) should be 10");
		equal(line.x(4),		10,		"x(4) should be 10");
		equal(line.x(10),		10,		"x(10) should be 10");

		equal(line.y(10) + "",	"NaN",	"y(10) should be NaN");
		equal(line.y(5),		null,	"y(5) should be null");
	});

	test("Tests the x() and y() functions on a horizontal line.", function () {
		var p1 = Point.create(0,10);
		var p2 = Point.create(10,10);
		var line = LineSegment.create(p1, p2);
		
		equal(line.x(10) + "",	"NaN",	"x(10) should be NaN");
		equal(line.x(5),		null,	"x(5) should be null");

		equal(line.y(0),		10,		"0,10");
		equal(line.y(5),		10,		"5,10");
		equal(line.y(10),		10,		"10,10");
		equal(line.y(15),		10,		"15,10");
	});
	
});
