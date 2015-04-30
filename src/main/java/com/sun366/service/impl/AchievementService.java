package com.sun366.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sun366.dao.IAchievementDao;
import com.sun366.dao.common.IOperations;
import com.sun366.entity.Achievement;
import com.sun366.service.IAchievementService;
import com.sun366.service.common.AbstractService;

@Service("achievementService")
public class AchievementService extends AbstractService<Achievement> implements IAchievementService {

	@Autowired
	private IAchievementDao dao;

	public AchievementService() {
		super();
	}

	@Override
	protected IOperations<Achievement> getDao() {
		return this.dao;
	}
}
