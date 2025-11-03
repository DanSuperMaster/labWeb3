package bean;

import javax.faces.bean.ManagedBean;
import javax.faces.bean.SessionScoped;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.TimeZone;

@ManagedBean
@SessionScoped
public class ClockBean implements Serializable {
    private static final long serialVersionUID = 1L;

    private Date currentTime;

    public ClockBean() {
        updateTime();
    }

    public void updateTime() {
        this.currentTime = new Date();
    }

    public Date getCurrentTime() {
        updateTime();
        return currentTime;
    }

    public String getFormattedTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("Europe/Moscow"));
        return sdf.format(getCurrentTime());
    }

    public String getCurrentDate() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy");
        return sdf.format(getCurrentTime());
    }

    public String getFullDateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd.MM.yyyy HH:mm:ss");
        sdf.setTimeZone(TimeZone.getTimeZone("Europe/Moscow"));
        return sdf.format(getCurrentTime());
    }
}
