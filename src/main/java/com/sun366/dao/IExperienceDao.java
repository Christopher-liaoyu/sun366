package com.sun366.dao;

import com.sun366.dao.common.IOperations;
import com.sun366.entity.Experience;

public interface IExperienceDao extends IOperations<Experience> {
	// 让所有的DAO都实现基本的操作接口IOperations
	// 除了实现IOperations中的基本操作之外，特定的DAO要实现其他操作可以在对应的接口DAO中定义方法，
	// 此处UserDao的接口IUserDao不需要实现其他方法
}