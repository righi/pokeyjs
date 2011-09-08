$(document).ready(function() {

	module("polygon");

	test("Tests polygons.", function () {
		var poly = Polygon.create();
		poly.addPoint(10,10);
		poly.addPoint(10,20);
		poly.addPoint(Point.create(20,20));
		poly.addPoint(Point.create(20,10));
		
		equal(poly.points[0].toString(), Point.create(10,10).toString());
		equal(poly.points[1].toString(), Point.create(10,20).toString());
		equal(poly.points[2].toString(), Point.create(20,20).toString());
		equal(poly.points[3].toString(), Point.create(20,10).toString());
		
		equal(poly.surrounds(Point.create(15,15)), true, "Point inside the polygon");
		equal(poly.surrounds(Point.create(10,10)), false, "Point on the perimeter");
		equal(poly.surrounds(Point.create(150,15)), false, "Point outside the polygon");
		
		equal(poly.area(), 100, "Polygon area");
		
		poly.addPoint(15,5);
		equal(poly.area(), 125, "Polygon area");
	});
	
	module("rectangle");

	test("Tests rectangles.", function () {
		var p1 = Point.create(10,10);
		var p2 = Point.create(30,0);
		var rect = Rectangle.create(p1, p2);
		
		equal(rect.pointA.toString(), Point.create(10,10).toString());
		equal(rect.pointB.toString(), Point.create(30,10).toString());
		equal(rect.pointC.toString(), Point.create(30, 0).toString());
		equal(rect.pointD.toString(), Point.create(10, 0).toString());
		equal(rect.width(), 20, "rectangle width");
		equal(rect.height(), 10, "rectangle height");
		equal(rect.area(), 200, "rectangle area");
		
		equal(rect.surrounds(Point.create(15,5)), true, "Point inside the rectangle");
		equal(rect.surrounds(Point.create(10,10)), false, "Point on the perimeter");
		equal(rect.surrounds(Point.create(150,15)), false, "Point outside the rectangle");
		equal(rect.surrounds(Rectangle.create(Point.create(12,8), Point.create(17,5))), true, "Rectangle inside rectangle")
		equal(rect.surrounds(Rectangle.create(Point.create(0,0), Point.create(200,200))), false, "Rectangle outside rectangle")
		
		equal(rect.isSquare(), false, "Rectangle is not a square");

	});
	
	test("Tests square rectangles.", function () {
		var p1 = Point.create(10,10);
		var p2 = Point.create(20,20);
		var rect = Rectangle.create(p1, p2);
		
		equal(rect.pointA.toString(), Point.create(10,20).toString(), "Point A");
		equal(rect.pointB.toString(), Point.create(20,20).toString(), "Point B");
		equal(rect.pointC.toString(), Point.create(20,10).toString(), "Point C");
		equal(rect.pointD.toString(), Point.create(10,10).toString(), "Point D");
		equal(rect.width(), 10, "square width");
		equal(rect.height(), 10, "square height");
		equal(rect.area(), 100, "square area");
		
		equal(rect.surrounds(Point.create(15,15)), true, "Point inside the rectangle");
		equal(rect.surrounds(Point.create(20,20)), false, "Point on the perimeter");
		equal(rect.surrounds(Point.create(150,15)), false, "Point outside the rectangle");				
		
		equal(rect.isSquare(), true, "Rectangle is a square");

	});

});
