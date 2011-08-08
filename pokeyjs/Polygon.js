/* 
* pokeyjs version 0.1 beta
* https://github.com/righi/pokeyjs
*/

function Polygon() {}
Polygon.prototype = {
		addPoint : function() {
			var args = Array.prototype.slice.apply(arguments);
			var point = null;
			if (args.length == 0) {
				point = args[0];
			} else {
				point = Point.create.apply(null, args);
			}
			
			if (point) {
				this.points.push(point);
			}
		},
		surrounds : function(point) {
			var odd = false;
			
			var x = point.x;
			var y = point.y;
			
			var lastIdx = this.points.length - 1;
			for (var i = 0; i < this.points.length; i++) 
			{
				var p = this.points[i];
				var lastP = this.points[lastIdx];
				
				if ((p.y < y && lastP.y >= y || lastP.y < y && p.y >=y) && (p.x <= x || lastP.x <= x))
				{
			      if (p.x + (y - p.y) / (lastP.y - p.y) * (lastP.x - p.x) < x) 
			      {
			    	  odd = !odd; 
			      }
				}
			    lastIdx = i; 
			}
		  return odd;
		},
		area : function() {
			var area = 0;
			var lastIdx = this.points.length - 1;
			for (var i = 0; i < this.points.length; i++) 
			{
				var p = this.points[i];
				var lastP = this.points[lastIdx];				
				area += (lastP.x * p.y) - (p.x*lastP.y); 
				lastIdx = i;
			}
			return Math.abs(area / 2);
		}
};
Polygon.create = function() {
	var poly = new Polygon();
	poly.points = [];
	return poly;
};