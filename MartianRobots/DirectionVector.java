import java.awt.Point;
/**
 * Created by rod on 2/11/2016.
 */
public class DirectionVector extends Point {
    // binary representation
    //  E S W N
    //  8 4 2 1
    static final int NORTH = 1;
    static final int WEST  = 2;
    static final int SOUTH = 4;
    static final int EAST  = 8;

    private int direction = 0;

    DirectionVector(char d) {
        switch (d) {
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
    }
    public void rotateRight() {
        // Adjust vector
        int tmp = -x;
        x = y;
        y = tmp;
        direction = direction >> 1;
        if (direction < NORTH) direction = EAST;
    }

    public void rotateLeft() {
        // Adjust vector
        int tmp = -y;
        y = x;
        x = tmp;
        direction = direction << 1;
        if (direction > EAST) direction = NORTH;
    }

    public Point forward(Point p) {
        Point result = new Point(p);
        result.x += x;
        result.y += y;
        return result;
    }

    public char getOrientation() {
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

}
