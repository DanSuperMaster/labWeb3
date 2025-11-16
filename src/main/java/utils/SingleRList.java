package utils;

public class SingleRList {
    private static RListAbstraction rListAbstraction;


    public static RListAbstraction getInstance() {
        if (rListAbstraction == null) {
            synchronized (DataBaseWorker.class) {
                if (rListAbstraction == null) {
                    rListAbstraction = new RListAbstraction();
                }
            }
        }
        return rListAbstraction;
    }
}
