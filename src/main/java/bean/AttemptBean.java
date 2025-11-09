package bean;

import utils.AreaChecker;
import utils.DataBaseWorker;

import javax.enterprise.context.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import javax.faces.bean.ViewScoped;
import java.io.Serializable;

@ManagedBean
@ApplicationScoped
public class AttemptBean implements Serializable {
    private int r;
    private double y;
    private double x;
    @ManagedProperty("#{dataBaseBean}")
    private DataBaseBean dataBaseBean;

    public AttemptBean() {}

    public void setXValue(String xValue) {
        try {
            this.x = Double.parseDouble(xValue.trim());
        } catch (NumberFormatException e) {
            System.err.println("Ошибка парсинга X: " + xValue);
        }
    }

    public void setYValue(String yValue) {
        try {
            this.y = Double.parseDouble(yValue.trim());
        } catch (NumberFormatException e) {
            System.err.println("Ошибка парсинга X: " + yValue);
        }
    }

    public String submit() {
        System.out.println("R: " + r + ", X: " + x + ", Y: " + y);
        DataBaseWorker dataBaseWorker = new DataBaseWorker();
        dataBaseWorker.addPoint(x, y, r, new AreaChecker().calculating(x, y, r));
        if (dataBaseBean != null) {
            dataBaseBean.refreshDots();
        }

        return null; // остаться на той же странице
    }

    public DataBaseBean getDataBaseBean() {
        return dataBaseBean;
    }

    public void setDataBaseBean(DataBaseBean dataBaseBean) {
        this.dataBaseBean = dataBaseBean;
    }

    public int getR() { return r; }
    public void setR(int r) { this.r = r; }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }
}