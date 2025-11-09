package additionalClasses;

public class Dot {
    private double x;
    private double y;
    private int r;
    private int inArea;

    public Dot(double x, double y, int r, int inArea) {
        this.r = r;
        this.y = y;
        this.x = x;
        this.inArea = inArea;



    }

    public void setX(double x) {
        this.x = x;
    }

    public void setY(double y) {
        this.y = y;
    }

    public void setR(int r) {
        this.r = r;
    }

    public void setInArea(int inArea) {
        this.inArea = inArea;
    }

    public double getX() {
        return x;
    }

    public double getY() {
        return y;
    }

    public int getR() {
        return r;
    }

    public int getInArea() {
        return inArea;
    }
}
