/*
package utils;

import itmo.programming.data.Coordinates;
import itmo.programming.data.Country;
import itmo.programming.data.Location;
import itmo.programming.data.Movie;
import itmo.programming.data.MpaaRating;
import itmo.programming.data.Person;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.Date;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Properties;
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;


public class DataBase {
    private Connection connection;
    private final ReadWriteLock lock = new ReentrantReadWriteLock();
    private final int one = 1;
    private final int two = 2;
    private final int three = 3;
    private final int four = 4;
    private final int five = 5;
    private final int six = 6;
    private final int seven = 7;
    private final int eight = 8;
    private final int nine = 9;
    private final int ten = 10;


    public DataBase() {
        final Properties prop = new Properties();
        final InputStream input;
        try {
            input = new FileInputStream("Properties.properties");
            prop.load(input);
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        final String url = "jdbc:postgresql://localhost:5433/studs";
        final String user = prop.getProperty("user");
        final String password = prop.getProperty("password");
        try {
            connection = DriverManager.getConnection(url, user, password);
            final Statement st = connection.createStatement();
        } catch (SQLException e) {
            System.out.println("Не удалось подключиться к базе данных!");
        }
    }

    */
/**
     * Add movie.
     *
     * @param movie    the movie
     * @param username the username
     *//*

    public void addMovie(Movie movie, String username) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final String query = "INSERT INTO Movie(name, coordinates, creationDate, oscarsCount,"
                    + " usaBoxOffice, tagline, mpaaRating, director, owner)"
                    + " VALUES(?, ?, ?, ?, ?, ?, ?::mpaaRating, ?, ?)";
            final PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, movie.getName());
            preparedStatement.setInt(2, addCoordinates(movie.getCoordinates(), username));
            preparedStatement.setDate(three, Date.valueOf(movie.getCreationDate().toLocalDate()));
            preparedStatement.setInt(four, movie.getOscarsCount());
            preparedStatement.setInt(five, movie.getUsaBoxOffice());
            preparedStatement.setString(six, movie.getTagline());
            preparedStatement.setString(seven, String.valueOf(movie.getMpaaRating()));
            preparedStatement.setInt(eight, addPerson(movie.getDirector(), username));
            preparedStatement.setString(nine, username);
            preparedStatement.executeUpdate();
            updateCollection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        lock.writeLock().unlock();
        lock.readLock().unlock();

    }

    private Integer addPerson(Person person, String username) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {

            final String query = "INSERT INTO Person(name, birthday, nationality,"
                    + " location, owner)"
                    + " VALUES(?, ?, ?::country, ?, ?) Returning id";
            final PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setString(1, person.getName());
            preparedStatement.setDate(2, Date.valueOf(person.getBirthday().toLocalDate()));
            preparedStatement.setString(three, String.valueOf(person.getNationality()));
            preparedStatement.setInt(four, addLocation(person.getLocation(), username));
            preparedStatement.setString(five, username);
            final ResultSet rs = preparedStatement.executeQuery();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            lock.writeLock().unlock();
            lock.readLock().unlock();
            return generatedId;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }



    }

    private Integer addLocation(Location location, String username) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final String query = "INSERT INTO Location(x, y, name, owner)"
                    + " VALUES(?, ?, ?, ?) Returning id";
            final PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setLong(1, location.getX1());
            preparedStatement.setLong(2, location.getY1());
            preparedStatement.setString(three, location.getName());
            preparedStatement.setString(four, username);
            final ResultSet rs = preparedStatement.executeQuery();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            lock.writeLock().unlock();
            lock.readLock().unlock();
            return generatedId;

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    private Integer addCoordinates(Coordinates coordinates, String username) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final String query = "INSERT INTO Coordinate(x, y, owner) VALUES(?, ?, ?) Returning id";
            final PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setLong(1, coordinates.getX1());
            preparedStatement.setLong(2, coordinates.getY1());
            preparedStatement.setString(three, username);
            final ResultSet rs = preparedStatement.executeQuery();
            Integer generatedId = null;
            if (rs.next()) {
                generatedId = rs.getInt(1);
            }
            lock.writeLock().unlock();
            lock.readLock().unlock();
            return generatedId;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    */
/**
     * Remove by id.
     *
     * @param id       the id
     * @param username the username
     *//*

    public void removeById(Integer id, String username) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final String query = "DELETE FROM Movie WHERE id="
                    + id.toString() + " and owner='" + username + "'";
            final PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.executeUpdate();
            updateCollection();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        lock.writeLock().unlock();
        lock.readLock().unlock();
    }

    */
/**
     * Update collection.
     *//*

    public void updateCollection() {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            movies.clear();
            final String query = "SELECT * FROM Movie";
            final PreparedStatement preparedStatement = connection.prepareStatement(query);
            final ResultSet rs = preparedStatement.executeQuery();
            while (rs.next()) {
                final Movie m = new Movie(rs.getInt(1), rs.getString(2),
                        getCoordinates(rs.getInt(three)), rs.getDate(four).toLocalDate()
                        .atStartOfDay(),
                        rs.getInt(five), rs.getInt(six),
                        rs.getString(seven), MpaaRating.valueOf(rs.getString(eight)),
                        getPerson(rs.getInt(nine)));
                movies.add(m);
            }
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        lock.writeLock().unlock();
        lock.readLock().unlock();
    }

    private Coordinates getCoordinates(Integer id) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final PreparedStatement pst = connection.prepareStatement("SELECT * FROM Coordinate");
            final ResultSet rs = pst.executeQuery();
            while (rs.next()) {
                if (rs.getInt(1) == id) {
                    lock.writeLock().unlock();
                    lock.readLock().unlock();
                    return new Coordinates(rs.getLong(2), rs.getInt(three));
                }
            }
            lock.writeLock().unlock();
            lock.readLock().unlock();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }

    }

    private Location getLocation(Integer id) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final PreparedStatement pst = connection.prepareStatement("SELECT * FROM Location");
            final ResultSet rs = pst.executeQuery();
            while (rs.next()) {
                if (rs.getInt(1) == id) {
                    lock.writeLock().unlock();
                    lock.readLock().unlock();
                    return new Location(rs.getLong(2), rs.getLong(three), rs.getString(four));
                }
            }
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private Person getPerson(Integer id) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final PreparedStatement pst = connection.prepareStatement("SELECT * FROM Person");
            final ResultSet rs = pst.executeQuery();
            while (rs.next()) {
                if (rs.getInt(one) == id) {
                    lock.writeLock().unlock();
                    lock.readLock().unlock();
                    return new Person(rs.getString(two), rs.getDate(three).toLocalDate()
                            .atStartOfDay(),
                            Country.valueOf(rs.getString(four)), getLocation(rs.getInt(five)));
                }
            }
            lock.writeLock().unlock();
            lock.readLock().unlock();
            return null;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    */
/**
     * Clear.
     *
     * @param username the username
     *//*

    public void clear(String username) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final PreparedStatement pst = connection.prepareStatement(
                    "Delete from Movie where owner='"
                            + username + "'");
            pst.executeUpdate();
            final PreparedStatement pst1 = connection.prepareStatement(
                    "Delete from Person where owner='"
                            + username + "'");
            pst1.executeUpdate();
            final PreparedStatement pst2 = connection.prepareStatement(
                    "Delete from Location where owner='"
                            + username + "'");
            pst2.executeUpdate();
            final PreparedStatement pst3 = connection.prepareStatement(
                    "Delete from Coordinate where owner='"
                            + username + "'");
            pst3.executeUpdate();
            updateCollection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        lock.writeLock().unlock();
        lock.readLock().unlock();
    }

    */
/**
     * Remove first.
     *
     * @param username the username
     *//*

    public void removeFirst(String username) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final PreparedStatement pst = connection.prepareStatement("DELETE FROM Movie "
                    + "WHERE owner='" + username + "' and id IN (SELECT id"
                    + "                         FROM Movie"
                    + "                         LIMIT 1) ");
            pst.executeUpdate();
            updateCollection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        lock.writeLock().unlock();
        lock.readLock().unlock();
    }

    */
/**
     * Remove greater.
     *
     * @param username the username
     * @param id       the id
     *//*

    public void removeGreater(String username, Integer id) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final PreparedStatement pst = connection.prepareStatement("DELETE FROM Movie "
                    + "WHERE owner='" + username + "' and id>" + id.toString());
            pst.executeUpdate();
            updateCollection();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        lock.writeLock().unlock();
        lock.readLock().unlock();
    }

    */
/**
     * Update id.
     *
     * @param username the username
     * @param movie    the movie
     *//*

    public void updateId(String username, Movie movie) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            lock.writeLock().lock();
            final PreparedStatement pst = connection.prepareStatement("Delete"
                    + " from Movie where owner='"
                    + username + "' and id=" + movie.getId());
            pst.executeUpdate();
            final String query = "INSERT INTO Movie(id, name, coordinates,"
                    + " creationDate, oscarsCount, usaBoxOffice, tagline,"
                    + " mpaaRating, director, owner) VALUES(?, ?, ?, ?, ?, ?, ?,"
                    + " ?::mpaaRating, ?, ?)";
            final PreparedStatement preparedStatement = connection.prepareStatement(query);
            preparedStatement.setInt(one, movie.getId());
            preparedStatement.setString(two, movie.getName());
            preparedStatement.setInt(three, addCoordinates(movie.getCoordinates(), username));
            preparedStatement.setDate(four, Date.valueOf(movie.getCreationDate().toLocalDate()));
            preparedStatement.setInt(five, movie.getOscarsCount());
            preparedStatement.setInt(six, movie.getUsaBoxOffice());
            preparedStatement.setString(seven, movie.getTagline());
            preparedStatement.setString(eight, String.valueOf(movie.getMpaaRating()));
            preparedStatement.setInt(nine, addPerson(movie.getDirector(), username));
            preparedStatement.setString(ten, username);
            preparedStatement.executeUpdate();
            updateCollection();
            lock.writeLock().unlock();

        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        lock.writeLock().unlock();
        lock.readLock().unlock();
    }

    */
/**
     * Check user boolean.
     *
     * @param name     the name
     * @param password the password
     * @return the boolean
     *//*

    public boolean checkUser(String name, String password) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {

            final PreparedStatement pst = connection
                    .prepareStatement("select count(id) from users where name='"
                            + name + "' and password='" + password + "'");
            final ResultSet rs = pst.executeQuery();
            if (rs.next()) {  // Перемещаем курсор на первую строку
                lock.writeLock().unlock();
                lock.readLock().unlock();
                return rs.getInt(1) > 0;  // Если count > 0, пользователь существует
            }
            lock.writeLock().unlock();
            lock.readLock().unlock();
            return false;
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    */
/**
     * Add user.
     *
     * @param name     the name
     * @param password the password
     *//*

    public void addUser(String name, String password) {
        lock.writeLock().lock();
        lock.readLock().lock();
        try {
            final PreparedStatement pst = connection
                    .prepareStatement("insert into Users (name, password) values(?, ?)");
            pst.setString(1, name);
            pst.setString(2, password);
            pst.executeUpdate();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        lock.writeLock().unlock();
        lock.readLock().unlock();
    }
}*/
