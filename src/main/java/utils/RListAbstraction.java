package utils;

import java.util.ArrayList;

public class RListAbstraction {
    private ArrayList<Integer> rList = new ArrayList<Integer>();



    public void addEl(Integer r) {
        rList.add(r);
    }

    public void removeEl(Integer r) {
        rList.remove(r);
    }

    public ArrayList<Integer> getArray() {
        return rList;
    }
}
