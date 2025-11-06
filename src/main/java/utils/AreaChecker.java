package utils;

public class AreaChecker {
    
    public boolean calculating(Double x, Double y, Double r) {
        if ((x <= 0) && (y <= 0) && ((x * x + y * y) <= r / 2 * r / 2)){
            return true;
        }
        else if ((x <= 0) && (y >= 0) && (y <= r / 2) && (x >= -r)) {
            return true;
        }
        else return (x >= 0) && (y <= 0) && (y >= -r / 2 + 0.5 * x);
    }
}
