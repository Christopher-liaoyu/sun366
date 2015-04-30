package com.sun366.dao.common;

import java.io.Serializable;
import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;

@SuppressWarnings("unchecked")
public abstract class AbstractHibernateDao<T extends Serializable> implements IOperations<T> {

	private Class<T> clazz;

	@Autowired
	private SessionFactory sessionFactory;

	protected final void setClazz(final Class<T> clazzToSet) {
		this.clazz = null == clazzToSet ? null : clazzToSet;
	}

	protected final Session getCurrentSession() {
		return sessionFactory.getCurrentSession();
	}

	public T findOne(long id) {
		return (T) getCurrentSession().get(clazz, id);
	}

	public List<T> findAll() {
		return getCurrentSession().createQuery("from " + clazz.getName())
				.list();
	}

	public void create(T entity) {
		if(entity == null)return ;
		// getCurrentSession().persist(entity);
		getCurrentSession().saveOrUpdate(entity);
	}

	public T update(T entity) {
		if(entity == null)return null;
		getCurrentSession().update(entity);
		return entity;
	}

	public void delete(T entity) {
		if(entity == null)return ;
		getCurrentSession().delete(entity);
	}

	public void deleteById(long entityId) {
		final T entity = findOne(entityId);
		if(!(entity != null))return ;
		delete(entity);
	}

}
