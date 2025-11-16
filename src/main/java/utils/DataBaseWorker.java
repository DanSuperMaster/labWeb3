package utils;

import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import java.sql.*;
import java.util.ArrayList;

import additionalClasses.Dot;


public class DataBaseWorker {
    private DataSource dataSource;


    public void setInitialize() {
        initializeDataSource();
        createTables();
    }

    private void initializeDataSource() {
        try {
            InitialContext ctx = new InitialContext();
            dataSource = (DataSource) ctx.lookup("java:/jdbc/PostgresDS");
            System.out.println("DataSource успешно инициализирован!");
        } catch (NamingException e) {
            System.out.println("Не удалось найти DataSource в JNDI: " + e.getMessage());
            e.printStackTrace();
        }
    }

    // Получаем соединение для каждого запроса
    private Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }

    private void createTables() {
        try (Connection conn = getConnection();
             PreparedStatement preparedStatement = conn.prepareStatement(
                     "CREATE TABLE IF NOT EXISTS Points (" +
                             "    id SERIAL PRIMARY KEY," +
                             "    x DOUBLE PRECISION NOT NULL," +
                             "    y DOUBLE PRECISION NOT NULL," +
                             "    r INTEGER NOT NULL," +
                             "    InArea INTEGER NOT NULL" +
                             ");")) {
            preparedStatement.executeUpdate();
            System.out.println("Таблица создана/проверена успешно");
        } catch (SQLException e) {
            throw new RuntimeException("Ошибка создания таблицы", e);
        }
    }

    public void addPoint(double x, double y, Integer r, Boolean inArea) {
        String query = "INSERT INTO Points(x, y, r, InArea) VALUES(?, ?, ?, ?)";
        try (Connection conn = getConnection();
             PreparedStatement preparedStatement = conn.prepareStatement(query)) {

            preparedStatement.setDouble(1, x);
            preparedStatement.setDouble(2, y);
            preparedStatement.setInt(3, r);
            preparedStatement.setInt(4, inArea ? 1 : 0);
            preparedStatement.executeUpdate();
            System.out.println("Точка добавлена успешно");

        } catch (SQLException e) {
            throw new RuntimeException("Ошибка добавления точки", e);
        }
    }

    public ArrayList<Dot> getPoints() {
        ArrayList<Dot> dotList = new ArrayList<>();
        String query = "SELECT * FROM Points";

        try (Connection conn = getConnection();
             PreparedStatement pst = conn.prepareStatement(query);
             ResultSet rs = pst.executeQuery()) {

            while (rs.next()) {
                dotList.add(new Dot(
                        rs.getDouble("x"),
                        rs.getDouble("y"),
                        rs.getInt("r"),
                        rs.getInt("InArea")
                ));
            }
            System.out.println("Получено " + dotList.size() + " точек");
            return dotList;

        } catch (SQLException e) {
            throw new RuntimeException("Ошибка получения точек", e);
        }
    }
}