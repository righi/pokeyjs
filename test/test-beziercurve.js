$(document).ready(function() {

	module("Bezier Curves");

	test("Misc. Bezier Functions", function () {

		var anchor1 = Point.create(0, 0);
		var control1 = Point.create(10, 10);
		var control2 = Point.create(20, 10);
		var anchor2 = Point.create(30, 0);
		
		var curve = BezierCurve.create(anchor1, control1, control2, anchor2);
		
		equal(curve.anchor1.toString(), Point.create(0, 0).toString(), "Anchor Point 1")
		equal(curve.control1.toString(), Point.create(10, 10).toString(), "Control Point 1")
		equal(curve.control2.toString(), Point.create(20, 10).toString(), "Control Point 2")
		equal(curve.anchor2.toString(), Point.create(30, 0).toString(), "Anchor Point 2")
		
		var svg = "M 0,0 C 10,10 20,10 30,0";
		equal(curve.svg().trim(), svg, "SVG");
		
		var delta = 0.001;
		QUnit.close(curve.startSlope(), 0.99, delta, "Start Slope");
		QUnit.close(curve.endSlope(),  -0.99, delta, "End Slope");
		
		equal(curve.point(0).toString(), Point.create(0, 0).toString(), "curve.point(0)");
		equal(curve.point(0.5).toString(), Point.create(15, 7.5).toString(), "curve.point(0.5)");
		equal(curve.point(1).toString(), Point.create(30, 0).toString(), "curve.point(1)");
		
	});
	
	test("Splitting a Bezier Curve", function () {
		
		var anchor1 = Point.create(50, 50);
		var control1 = Point.create(120, 170);
		var control2 = Point.create(100, 30);
		var anchor2 = Point.create(300, 140);
		
		var curve = BezierCurve.create(anchor1, control1, control2, anchor2);

		var curves = curve.split(0.5);
		
		equal(curves[0].anchor1.toString(), Point.create(50, 50).toString(), "First Half Curve, Anchor Point 1")
		equal(curves[0].control1.toString(), Point.create(85, 110).toString(), "First Half Curve, Control Point 1")
		equal(curves[0].control2.toString(), Point.create(97.5, 105).toString(), "First Half Curve, Control Point 2")
		equal(curves[0].anchor2.toString(), Point.create(126.25, 98.75).toString(), "First Half Curve, Anchor Point 2")

		equal(curves[1].anchor1.toString(), Point.create(126.25, 98.75).toString(), "Second Half Curve, Anchor Point 1")
		equal(curves[1].control1.toString(), Point.create(155, 92.5).toString(), "Second Half Curve, Control Point 1")
		equal(curves[1].control2.toString(), Point.create(200, 85).toString(), "Second Half Curve, Control Point 2")
		equal(curves[1].anchor2.toString(), Point.create(300, 140).toString(), "Second Half Curve, Anchor Point 2")		
		
	});
	
	
	test("Finding a point on a Bezier Curve", function() {
	
		var anchor1 = Point.create(50, 50);
		var control1 = Point.create(120, 170);
		var control2 = Point.create(100, 30);
		var anchor2 = Point.create(300, 140);
		var curve = BezierCurve.create(anchor1, control1, control2, anchor2);

		var tolerance = 0.1;
		var ts = curve.locationsOnPath(Point.create(50,50), tolerance);
		equal(ts.length, 1, "One result found");
		equal(ts[0], 0, "Anchor1 found on curve");
		
		var midPoint = curve.point(0.5);
		var ts = curve.locationsOnPath(midPoint, tolerance);
		equal(ts.length, 1, "One result found");

		var delta = 0.001;
		QUnit.close(ts[0], 0.5, delta, "Midpoint on a curve");
		
		// TODO Add tests for overlapping curves
		
	});

	
});
