package myServlet;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;

import JavaBean.User;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

public class userListServlet extends HttpServlet {

	/**
	 * Constructor of the object.
	 */
	public userListServlet() {
		super();
	}

	/**
	 * Destruction of the servlet. <br>
	 */
	public void destroy() {
		super.destroy(); // Just puts "destroy" string in log
		// Put your code here
	}

	/**
	 * The doGet method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to get.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		doPost(request, response);
	}

	/**
	 * The doPost method of the servlet. <br>
	 *
	 * This method is called when a form has its tag value method equals to post.
	 * 
	 * @param request the request send by the client to the server
	 * @param response the response send by the server to the client
	 * @throws ServletException if an error occurred
	 * @throws IOException if an error occurred
	 */
	public void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		 String[][] users = {{"Xb13620114","123","小张","男"},{"Xb13620204","123","小李","女"}
	               };
		
		ArrayList<User> list=new ArrayList<User>();
		for(int i=0;i<users.length;i++){
			User user=new User();
			user.setUserId(users[i][0]);
			user.setPassword(users[i][1]);
			user.setUserName(users[i][2]);
			user.setUserSex(users[i][3]);
			user.setUserTel("666666");
			list.add(user);
		}
		request.setAttribute("list",list);
		//HttpSession session = request.getSession();
		//session.setAttribute("list", list);
		request.getRequestDispatcher("/userList2.jsp").forward(request, response);
		//response.sendRedirect("/moban2/main.jsp");
	}

	/**
	 * Initialization of the servlet. <br>
	 *
	 * @throws ServletException if an error occurs
	 */
	public void init() throws ServletException {
		// Put your code here
		
	}

}
