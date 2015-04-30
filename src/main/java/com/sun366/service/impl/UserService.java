package com.sun366.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sun366.dao.IUserDao;
import com.sun366.dao.common.IOperations;
import com.sun366.entity.User;
import com.sun366.service.IUserService;
import com.sun366.service.common.AbstractService;

@Service("userService")
public class UserService extends AbstractService<User> implements IUserService {

	@Autowired
	private IUserDao dao;

	public UserService() {
		super();
	}

	@Override
	protected IOperations<User> getDao() {
		return this.dao;
	}
}
