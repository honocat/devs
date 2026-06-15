<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ page import="java.sql.*" %>
<%@ page import="common.DBManager" %>
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>DB接続テスト</title>
    </head>
    <body>
        <h1>MySQL 接続テスト</h1>

        <%
            Connection con = null;
            Statement stmt = null;
            ResultSet rs = null;
            try {
                con = DBManager.getConnection();
                if (con != null) {
                    out.println("<p style='color:green;'>データベースへの接続に成功しました！</p>");

                    stmt = con.createStatement();
                    rs = stmt.executeQuery("SELECT * FROM Products");

                    while (rs.next()) {
                        int id = rs.getInt("ProductID");
                        int code = rs.getInt("ProductCode");
                        String name = rs.getString("ProductName");
                        int price = rs.getInt("Price");
                        int categoryId = rs.getInt("CategoryID");

                        out.println("<p>ID：" + id + ", Code：" + code + ", 名前：" + name + ", 価格：" + price + ", カテゴリID：" + categoryId);
                    }
                } else {
                    out.println("<p style='color:red;'>接続に失敗しました（Connectionがnullです）。</p>");
                }
            } catch (Exception e) {
                out.println("<p style='color:red;'>エラーが発生しました：" + e.getMessage() + "</p>");
                e.printStackTrace();
            } finally {
                if (rs != null) rs.close();
                if (stmt != null) stmt.close();
                if (con != null) con.close();
            }
        %>
    </body>
</html>