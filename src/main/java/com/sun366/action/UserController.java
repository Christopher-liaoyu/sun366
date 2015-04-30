package com.sun366.action;

import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;

import com.opensymphony.xwork2.ActionSupport;
import com.sun366.entity.User;
import com.sun366.service.IUserService;

@ParentPackage("base")
@Namespace("/services")
@Results({ @Result(name = "json", type = "json", params = { "root", "msg" }) })
public class UserController extends ActionSupport {

	private static final long serialVersionUID = 1L;

	private int id;
	private User user;

	@Autowired
	private IUserService userService;

	@Action(value = "add", results = { @Result(name = "*", type = "velocity", params = {
			"location", "/vm/{1}.vm" }) })
	public String add() {
		msg.put("root", userService.findAll());
		return "json";
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	private Map<String, Object> msg;

	public Map<String, Object> getMsg() {
		return msg;
	}
}
