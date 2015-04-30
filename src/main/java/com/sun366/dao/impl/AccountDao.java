package com.sun366.dao.impl;

import org.springframework.stereotype.Repository;

import com.sun366.dao.IAccountDao;
import com.sun366.dao.common.AbstractHibernateDao;
import com.sun366.entity.Account;

@Repository("accountDao")
public class AccountDao extends AbstractHibernateDao<Account> implements IAccountDao {

    public AccountDao() {
        super();
        
        setClazz(Account.class);
    }
}