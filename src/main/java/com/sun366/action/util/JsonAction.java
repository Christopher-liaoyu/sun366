package com.sun366.action.util;

import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;

@ParentPackage("base")
@Namespace("/services")
@Results({ @Result(name = "json", type = "json", params = { "root", "msg" }) })
public class JsonAction {

	@Action(value = "json")
	public String json() {

		msg = new HashMap<String, Object>();
		msg.put("flag", "success");

		Map<String, String> user = new HashMap<String, String>();
		user.put("name", "张三");
		user.put("age", "34");
		msg.put("user", user);
		return "json";
	}

	@Action(value = "vm", results = { @Result(name = "*", type = "velocity", params = {
			"location", "/vm/login.vm" }) })
	public String vm() {
		msg = new HashMap<String, Object>();
		msg.put("flag", "success");

		Map<String, String> user = new HashMap<String, String>();
		user.put("name", "张三");
		user.put("age", "34");
		msg.put("user", user);
		return "velocity";
	}

	private Map<String, Object> msg;

	public Map<String, Object> getMsg() {
		return msg;
	}

}