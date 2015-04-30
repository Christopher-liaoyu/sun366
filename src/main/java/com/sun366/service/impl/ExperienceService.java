package com.sun366.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sun366.dao.IExperienceDao;
import com.sun366.dao.common.IOperations;
import com.sun366.entity.Experience;
import com.sun366.service.IExperienceService;
import com.sun366.service.common.AbstractService;

@Service("experienceService")
public class ExperienceService extends AbstractService<Experience> implements
		IExperienceService {

	@Autowired
	private IExperienceDao dao;

	public ExperienceService() {
		super();
	}

	@Override
	protected IOperations<Experience> getDao() {
		return this.dao;
	}
}
