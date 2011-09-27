/* 
* pokeyjs version 0.1 beta
* https://github.com/righi/pokeyjs
*/

var Pokey = {
		roundFloat : function(num, numDecimals) {
			numDecimals = numDecimals || 0;
			return new Number((new Number(num)).toFixed(numDecimals)) * 1;
		},
		degToRad : function(degrees) {
			return degrees * Math.PI/180;
		} 
};