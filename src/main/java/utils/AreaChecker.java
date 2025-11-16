package utils;

public class AreaChecker {
    
    public boolean calculating(Double x, Double y, int r) {
        if ((x >= 0) && (y <= 0) && ((x * x + y * y) <= r * 1.0 / 2 * r / 2)){
            return true;
        }
        else if ((x <= 0) && (y >= 0) && (y <= r) && (x >= -r * 1.0 / 2)) {
            return true;
        }
        else return (x >= 0) && (y >= 0) && (y <= r - x);
    }
}
