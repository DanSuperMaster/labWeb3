package utils;

public class SinleDataBase {
    private static DataBaseWorker dataBaseWorker;


    public static DataBaseWorker getInstance() {
        if (dataBaseWorker == null) {
            synchronized (DataBaseWorker.class) {
                if (dataBaseWorker == null) {
                    dataBaseWorker = new DataBaseWorker();
                    dataBaseWorker.setInitialize();
                }
            }
        }
        return dataBaseWorker;
    }
}
