pokeyjs
=======

A linear algebra/geometry library for JavaScript.

Current Version: 0.1 beta


Usage
=====

Points (2D Only)
----------------

### Creating Points
	var p1 = Point.create(5,6);
	var p2 = Point.create(5.7,6.2);
	var p3 = Point.create(p1);
	var p4 = Point.create("5.8,6.1");
	var p5 = Point.create({x: 17, y:19});


### Distance Between Points
	var distance = p1.distance(p2);


### Midpoint Between Points
	var mid = p1.midpoint(p2);


### Comparing Points
	if (p1.isLeftOf(p2)) { }
	if (p1.isRightOf(p2)) { }
	if (p1.isAbove(p2)) { }
	if (p1.isBelow(p2)) { }
	if (p1.equals(p2)) { }


### Reading Point Values
	var x = p1.x;
	var y = p1.y;
	var s = p1.toString(); // Returns a comma-delimited string like this: "5,7"


### Modifying Point Values
	p1.addX(5);
	p1.addY(6);
	p1.update(5,6);


Line Segments
-------------

### Creating Line Segments
	var line1 = LineSegment.create(startPoint, endPoint);
	var line2 = LineSegment.create({pointA: startPoint, pointB: endPoint});
	var line3 = LineSegment.create({pointA: startPoint, slope: 1, length: 12});
	var line4 = LineSegment.create({pointB: endPoint, directionVector: Point.create(0,-1), length: 100});
	var line5 = LineSegment.create({pointA: startPoint, angle: 180, length: 10});


### Retrieving Line Data
	var startPoint = line.pointA;
	var endPoint = line.pointB;
	var mid = line.midpoint();
	var length = line.length();
	var angle = line.angle(); // In Degrees
	var slope = line.slope();
	var yIntercept = line.yIntercept();
	var vector = line.directionVector(); // Returns a point object, such as (0,1) for vertical lines.


### Determining Distance from a Point
	var distance = line.distance(point);


### Retrieving a Point on a Line Segment
	var startPoint = line.point(0); // Same as: line.pointA;
	var endPoint = line.point(1); // Same as: line.pointB;
	var mid = line.point(0.5); // Same as: line.midpoint();
	var point75 = line.point(0.75); // Returns the point 75% of the way from pointA to pointB


### Retrieving Perpendicular Points off a Line Segment
	var line = LineSegment.create(Point.create(10,10), Point.create(20,10));
	var mid = line.midpoint(); // Returns (15,10)
	var points[] = line.pointsOffLine(mid, 5); // Returns: [(15,15), (15,5)];


### Building a Perpendicular Line Segment
	var line1 = LineSegment.create(Point.create(0,0), Point.create(10,0));
	var line2 = line1.perp(); // returns a line segment from (5,-5) to (5,5)

By default perp() returns a perpendicular line segment that shares the same midpoint as the original line. However, you can choose to rotate around any point:
	var line1 = LineSegment.create(Point.create(0,0), Point.create(10,0));
	var line2 = line1.perp(line1.pointA); // returns a line segment from (0,-5) to (0,5)

You can also change the length of the perpendicular line segment:
	var line1 = LineSegment.create(Point.create(0,0), Point.create(10,0));
	var line2 = line1.perp(line1.pointA, 20); // returns a line segment from (0,-10) to (0,10)


### Manipulating a Line Segment
	line.grow(10); // Increases the length of the line segment by 10 units
	line.grow("10%"); // Increases the length of the line segment by 10%
	line.shrink(5);
	line.shrink("5%");
	line.rotate(90);
	line.rotate(-45);


Bezier Curves
-------------

### Creating a Bezier Curve
	var anchor1 = Point.create(0,0);
	var control1 = Point.create(5,10);
	var control2 = Point.create(7,3);
	var anchor2 = Point.create(12,8);
	var bezier = BezierCurve.create(anchor1, control1, control2, anchor2);


### Obtaining a Point on the Curve
	var p1 = bezier.point(0); // returns the first anchor point
	var p2 = bezier.point(1); // returns the last anchor point
	var p3 = bezier.point(0.75); // demonstrating that you can request any arbitrary point along the path


### Obtaining the SVG Path for the Curve
	var svg = beizer.svg();


### Turning a Bezier Curve into an Array of Points
	var start = 0;
	var end = 1;
	var increment = 0.05;
	var points = bezier.points(start, end, increment);


Polygons
--------

### Creating a Polygon
	var poly = Polygon.create();


### Adding Points to a Polygon
	poly.addPoint(5,5);
	poly.addPoint(10,5);
	poly.addPoint(Point.create(10,10));
	poly.addPoint(Point.create(5,10));


### Determining if a Point Lies within a Polygon
	if (poly.surrounds(point)) { }


### Determining the Area of a Polygon
	var area = poly.area();


Release History
===============

* **August 7, 2011:**  (0.1 beta)  This library meets my needs at the moment, but it's far from being a complete linear algebra / vector math / geometry library.


License
=======

Copyright (c) 2011 Michael Righi

Released under the MIT License:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.