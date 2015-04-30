package com.sun366.action;

import java.util.HashMap;
import java.util.Map;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.convention.annotation.Results;
import org.springframework.beans.factory.annotation.Autowired;

import com.sun366.entity.Account;
import com.sun366.service.IAccountService;
import com.sun366.util.CommonUtil;

@ParentPackage("base")
@Namespace("/services")
@Results({ @Result(name = "json", type = "json", params = { "root", "msg" }) })
public class RegisterAction {
	@Autowired
	IAccountService accountService;
	int id;
	@Action(value = "sendSMSCode")
	public String sendSMSCode() {
		msg = new HashMap<String, Object>();
		Account entity = new Account();
		entity.setId(CommonUtil.uid());
		entity.setEmail(CommonUtil.uid());
		accountService.create(entity);
		msg.put("code", 0);
		msg.put("msg", "发送成功");
		msg.put("data", accountService.findAll());
		msg.put("id", id);
		return "json";
	}

	private Map<String, Object> msg;

	public Map<String, Object> getMsg() {
		return msg;
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}
}
