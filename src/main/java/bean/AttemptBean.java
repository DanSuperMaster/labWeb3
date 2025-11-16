package bean;

import utils.*;

import javax.enterprise.context.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ManagedProperty;
import java.io.Serializable;
import java.util.ArrayList;

@ManagedBean
@ApplicationScoped
public class AttemptBean implements Serializable {
    private RListAbstraction rListAbstraction = SingleRList.getInstance();
    private double y;
    private double x;
    @ManagedProperty("#{dataBaseBean}")
    private DataBaseBean dataBaseBean;

    private DataBaseWorker dataBaseWorker = SinleDataBase.getInstance();


    public void setXValue(String xValue) {
        try {
            if (xValue == null || xValue.trim().isEmpty()) {
                System.err.println("Ошибка: X значение пустое!");
                return;
            }
            this.x = Double.parseDouble(xValue.trim());
            System.out.println("X успешно установлен: " + this.x);
        } catch (NumberFormatException e) {
            System.err.println("Ошибка парсинга X: '" + xValue + "'");
        }
    }

    public void setYValue(String yValue) {
        try {
            if (yValue == null || yValue.trim().isEmpty()) {
                System.err.println("Ошибка: Y значение пустое!");
                return;
            }
            this.y = Double.parseDouble(yValue.trim());
            System.out.println("Y успешно установлен: " + this.y);
        } catch (NumberFormatException e) {
            System.err.println("Ошибка парсинга Y: '" + yValue + "'");
        }
    }

    public void submit() {

        for (int i = 0; i < rListAbstraction.getArray().size(); i++) {

            System.out.println(123);
            dataBaseWorker.addPoint(x, y, rListAbstraction.getArray().get(i), new AreaChecker().calculating(x, y, rListAbstraction.getArray().get(i)));
        }
        if (dataBaseBean != null) {

            dataBaseBean.refreshDots();
        }

    }

    public DataBaseBean getDataBaseBean() {
        return dataBaseBean;
    }

    public void setDataBaseBean(DataBaseBean dataBaseBean) {
        this.dataBaseBean = dataBaseBean;
    }

    public void setrList(Integer r) {
        System.out.println(987);
        System.out.println(rListAbstraction);
        System.out.println(r);
        if (rListAbstraction.getArray().contains(r)) {
            System.out.println(6);
            rListAbstraction.removeEl(r);
        } else {
            System.out.println(5);
            rListAbstraction.addEl(r);

        }
        System.out.println(rListAbstraction.getArray().toString());
    }
    public ArrayList<Integer> getrList() {
        return rListAbstraction.getArray();
    }

    public double getY() { return y; }
    public void setY(double y) { this.y = y; }

    public double getX() { return x; }
    public void setX(double x) { this.x = x; }
}