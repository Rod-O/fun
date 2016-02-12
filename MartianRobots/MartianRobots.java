import java.util.HashSet;
import java.util.Set;
import java.awt.Point;
/**
 * Created by rod on 2/11/2016.
 */

public class MartianRobots {

    static final char LEFT = 'L';
    static final char RIGHT = 'R';
    static final char FORWARD = 'F';

    // I prefer to use the string representation of points - simpler
    static Set<String> lostRobots = new HashSet<>();

    boolean lost = false;
    private Point position;
    private Point bounds;
    private DirectionVector direction;

    MartianRobots(int upper, int right, int initX, int initY, char initialDirection) {
        direction = new DirectionVector(initialDirection);
        position = new Point(initX, initY);
        bounds = new Point(right, upper);
    }

    public void executeAction(char action) {
        switch (action) {
            case FORWARD:
                Point newPosition = direction.forward(position);
                // avoid LOST point
                if (!lostRobots.contains(newPosition.toString())) {
                    position = newPosition;

                    // out of bounds ?
					if(!lost)
                    if ((position.x > bounds.x) || (position.x < 0) ||
                            (position.y > bounds.y) || (position.y < 0)) {
                        lost = true;
                        lostRobots.add(position.toString()); // add all lost positions
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

    public String getLocation() {
        StringBuilder result = new StringBuilder();
        result.append(position.x + " " + position.y + " " + direction.getOrientation() + " ");
        if (lost)
            result.append("LOST");
        return  result.toString();
    }

}
