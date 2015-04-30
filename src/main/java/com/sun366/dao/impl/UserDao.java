package com.sun366.dao.impl;

import org.springframework.stereotype.Repository;

import com.sun366.dao.IUserDao;
import com.sun366.dao.common.AbstractHibernateDao;
import com.sun366.entity.User;

@Repository("userDao")
public class UserDao extends AbstractHibernateDao<User> implements IUserDao {

    public UserDao() {
        super();
        
        setClazz(User.class);
    }
}