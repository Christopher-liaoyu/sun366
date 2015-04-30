package com.sun366.dao.impl;

import org.springframework.stereotype.Repository;

import com.sun366.dao.IDetailsDao;
import com.sun366.dao.common.AbstractHibernateDao;
import com.sun366.entity.Details;

@Repository("detailsDao")
public class DetailsDao extends AbstractHibernateDao<Details> implements
		IDetailsDao {

	public DetailsDao() {
		super();

		setClazz(Details.class);
	}
}