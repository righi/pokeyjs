SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

modules =   ${SRC_DIR}/Point.js\
            ${SRC_DIR}/Line.js\
            ${SRC_DIR}/LineSegment.js\
            ${SRC_DIR}/Polygon.js\
			${SRC_DIR}/Circle.js\
			${SRC_DIR}/BezierCurve.js\
			${SRC_DIR}/Pokey.js

pokey.js: ${modules}
	cat > ${BUILD_DIR}/$@ $^