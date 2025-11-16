package bean;

import additionalClasses.Dot;
import utils.DataBaseWorker;
import utils.SinleDataBase;

import javax.enterprise.context.ApplicationScoped;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import java.io.Serializable;
import java.util.ArrayList;

@ManagedBean
@ApplicationScoped
public class DataBaseBean implements Serializable {
    private DataBaseWorker dataBaseWorker = SinleDataBase.getInstance();
    private ArrayList<Dot> dots;

    public ArrayList<Dot> getDots() {

        dots = dataBaseWorker.getPoints();
        return dots;
    }

    public void refreshDots() {
        dots = dataBaseWorker.getPoints();
    }



}
