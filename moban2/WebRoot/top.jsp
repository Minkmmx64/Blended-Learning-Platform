<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
 <%@ page import="java.text.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>top菜单</title>
    <link rel="stylesheet" type="text/css" href="css/common.css"/>
    <link rel="stylesheet" type="text/css" href="css/main.css"/>
</head>
<body>
  <%!
    	String s="";
    	Date d = new Date();
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		 String now = df.format(d); 
		//String now=(1900+d.getYear())+"年"+(d.getMonth()+1)+"月"+d.getDate()+"日";
     %>
<div class="topbar-wrap white">
    <div class="topbar-inner clearfix">
        <div class="topbar-logo-wrap clearfix">
            <h1 class="topbar-logo none"><a href="main.html" class="navbar-brand">后台管理</a></h1>
            <ul class="navbar-list clearfix">
                <li>欢迎光临我的网站</li>
               
            </ul>
        </div>
       
        <div class="top-info-wrap">
            <ul class="top-info-list clearfix">
                
                <li>当前时间：<%out.print(now); %></li>
                <li><a href="login.jsp">退出</a></li>
            </ul>
        </div>
    </div>
</div>
</body>
</html>