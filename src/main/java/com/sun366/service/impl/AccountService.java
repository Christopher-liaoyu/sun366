package com.sun366.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sun366.dao.IAccountDao;
import com.sun366.dao.common.IOperations;
import com.sun366.entity.Account;
import com.sun366.service.IAccountService;
import com.sun366.service.common.AbstractService;

@Service("accountService")
public class AccountService extends AbstractService<Account> implements IAccountService {

	@Autowired
	private IAccountDao dao;

	public AccountService() {
		super();
	}

	@Override
	protected IOperations<Account> getDao() {
		return this.dao;
	}
}
