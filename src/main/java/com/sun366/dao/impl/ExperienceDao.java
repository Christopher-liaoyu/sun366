package com.sun366.dao.impl;

import org.springframework.stereotype.Repository;

import com.sun366.dao.IExperienceDao;
import com.sun366.dao.common.AbstractHibernateDao;
import com.sun366.entity.Experience;

@Repository("experienceDao")
public class ExperienceDao extends AbstractHibernateDao<Experience> implements
		IExperienceDao {

	public ExperienceDao() {
		super();

		setClazz(Experience.class);
	}
}