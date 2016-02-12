'use strict';
var fs = require('fs');

var lostRobots = [];
var LEFT = 'L';
var RIGHT = 'R';
var FORWARD = 'F';
var NORTH = 1;
var WEST  = 2;
var SOUTH = 4;
var EAST  = 8;

var Point = function Point(/*Number*/ x, /*Number*/ y) {
    var self = this;
    this.x = parseInt(x, 10);
    this.y = parseInt(y, 10);
    this.toString = function toString() {
        return ("(" + self.x + ", " + self.y + ")")
    }
};

var DirectionVector = function DirectionVector(/*String*/ initialDirection) {
    var direction = 0;
    var x = 0;
    var y = 0;
    switch (initialDirection) {
    case 'S':
        direction = SOUTH;
        y = -1;
        break;
    case 'E':
        direction = EAST;
        x = 1;
        break;
    case 'W':
        direction = WEST;
        x = -1;
        break;
    case 'N':
    default:
        direction = NORTH;
        y = 1;
        break;
    }
    this.rotateRight = function rotateRight() {
        // Adjust vector
        var tmp = -x;
        x = y;
        y = tmp;
        direction = direction >> 1;
        if (direction < NORTH) direction = EAST;
    }
    this.rotateLeft = function rotateLeft() {
        // Adjust vector
        var tmp = -y;
        y = x;
        x = tmp;
        direction = direction << 1;
        if (direction > EAST) direction = NORTH;
    }
    this.forward = function forward(/*Point*/ p) {
        var result = new Point(p.x, p.y);
        result.x += x;
        result.y += y;
        return result;
    }
    this.getOrientation = function getOrientation() {
        switch (direction) {
            case NORTH:
                return 'N';
            case SOUTH:
                return 'S';
            case WEST:
                return 'W';
            case EAST:
                return 'E';
            default:
                return 'X';
        }
    }
};

var MartianRobot = function MartianRobot (
        /*Number*/ upper, /*Number*/ right, /*Number*/ initX, /*Number*/ initY,
        /*String*/ initialDirection) {


    // I prefer to use the string representation of points - simpler

    var lost = false;
    var position = new Point(0, 0);
    var bounds = new Point(0, 0);
    var direction;

    direction = new DirectionVector(initialDirection);
    position = new Point(initX, initY);
    bounds = new Point(right, upper);

    this.executeAction = function executeAction(/*String*/ action) {
        switch (action) {
            case FORWARD:
                var newPosition = direction.forward(position);
                // avoid LOST point
                var strSearch = newPosition.toString();
                if ( lostRobots.indexOf(strSearch)<0 ) {
                    position = newPosition;

                    // out of bounds ?
                    if (!lost)
                    if ((position.x > bounds.x) || (position.x < 0) ||
                        (position.y > bounds.y) || (position.y < 0)) {
                        lost = true;
                        lostRobots.push(position.toString()); // add all lost positions
                    }
                }
                break;
            case RIGHT:
                direction.rotateRight();
                break;
            case LEFT:
                direction.rotateLeft();
                break;
        }
    }

    this.getLocation = function getLocation() {
        var result = position.x + " " + position.y + " " + direction.getOrientation() + " ";
        if (lost)
            result = result + "LOST";
        return  result;
    }

};



if (process.argv.length > 2) {

    fs.readFile(process.argv[2], (err, data) => {
        if (err)
            return console.log(err);

        var lines = data.toString().split(/\r?\n/);
        var bounds = lines[0].split(" ");
        var uBound = bounds[0];
        var rBound = bounds[1];

        for (var i=1; i<lines.length; i+=2) {

            var nextRobot = lines[i];
            var sequence = lines[i+1].split('');

            var poistion = nextRobot.split(" ");

            var robot = new MartianRobot(
                rBound,
                uBound,
                poistion[0],
                poistion[1],
                poistion[2]
            );

            for (var a in sequence) {
                robot.executeAction(sequence[a]);
            }

            var location = robot.getLocation();
            console.log(location);

        }


    });
} else {
    console.log("ERROR: No file provided.")
}