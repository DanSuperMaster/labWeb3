package utils;

import javax.persistence.criteria.CriteriaBuilder;
import java.awt.*;
import java.sql.*;
import java.util.ArrayList;

import additionalClasses.Dot;


public class DataBaseWorker {
    private Connection connection;

    public DataBaseWorker() {
        this.connection();
        this.createTables();
    }


    public void connection() {
        final String url = "jdbc:postgresql://database:5432/mydb";
        try {
            connection = DriverManager.getConnection(url, "postgres", "postgres");
            final Statement st = connection.createStatement();

        } catch (SQLException e) {
            System.out.println("Не удалось подключиться к базе данных!");
        }
    }


    private void createTables() {
        try {
            final String query = "CREATE TABLE IF NOT EXISTS Points (\n"
                    + "    id SERIAL PRIMARY KEY,\n"
                    + "    x DOUBLE PRECISION NOT NULL,\n"
                    + "    y DOUBLE PRECISION NOT NULL,\n"
                    + "    r INTEGER NOT NULL,\n"
                    + "    InArea INTEGER NOT NULL\n"
                    + ");\n";
            final PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.executeUpdate();
            System.out.println("all good1");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void addPoint(double x, double y, Integer r, Boolean inArea) {
        try {
            int q = 0;
            if (inArea) {
                q = 1;
            }
            final String query = "INSERT INTO Points(x, y, r, InArea"
                    + ")"
                    + " VALUES(?, ?, ?, ?)";
            final PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setDouble(1, x);
            preparedStatement.setDouble(2, y);
            preparedStatement.setInt(3, r);
            preparedStatement.setInt(4, q);
            preparedStatement.executeUpdate();
            System.out.println("1234");
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public ArrayList<Dot> getPoints() {
        try {
            final PreparedStatement pst = connection.prepareStatement("SELECT * FROM Points");
            final ResultSet rs = pst.executeQuery();
            ArrayList<Dot> dotList = new ArrayList<Dot>();
            while (rs.next()) {
                dotList.add(new Dot(rs.getDouble(2), rs.getDouble(3),
                        rs.getInt(4), rs.getInt(5)));

            }
            System.out.println("12345");
            return dotList;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }






}
