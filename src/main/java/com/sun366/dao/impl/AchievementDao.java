package com.sun366.dao.impl;

import org.springframework.stereotype.Repository;

import com.sun366.dao.IAchievementDao;
import com.sun366.dao.common.AbstractHibernateDao;
import com.sun366.entity.Achievement;

@Repository("achievementDao")
public class AchievementDao extends AbstractHibernateDao<Achievement> implements
		IAchievementDao {

	public AchievementDao() {
		super();

		setClazz(Achievement.class);
	}
}