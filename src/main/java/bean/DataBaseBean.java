package bean;

import additionalClasses.Dot;
import utils.DataBaseWorker;

import javax.enterprise.context.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import java.io.Serializable;
import java.util.ArrayList;

@ManagedBean
@ApplicationScoped
public class DataBaseBean implements Serializable {

    private ArrayList<Dot> dots;

    public ArrayList<Dot> getDots() {
        DataBaseWorker dataBaseWorker = new DataBaseWorker();
        dots = dataBaseWorker.getPoints();
        return dots;
    }

    public void refreshDots() {
        DataBaseWorker dataBaseWorker = new DataBaseWorker();
        dots = dataBaseWorker.getPoints();
    }
}
