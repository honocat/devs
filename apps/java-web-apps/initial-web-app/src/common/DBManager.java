package common;

import java.sql.Connection;
import java.sql.DriverManager;

public class DBManager {
    public static Connection getConnection() {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");

            String url = "jdbc:mysql://localhost:3306/tecnos?serverTimezone=Asia/Tokyo&useSSL=false";
            String user = "root";
            String password = "081921";

            return DriverManager.getConnection(url, user, password);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}