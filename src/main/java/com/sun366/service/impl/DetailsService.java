package com.sun366.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sun366.dao.IDetailsDao;
import com.sun366.dao.common.IOperations;
import com.sun366.entity.Details;
import com.sun366.service.IDetailsService;
import com.sun366.service.common.AbstractService;

@Service("detailsService")
public class DetailsService extends AbstractService<Details> implements IDetailsService {

	@Autowired
	private IDetailsDao dao;

	public DetailsService() {
		super();
	}

	@Override
	protected IOperations<Details> getDao() {
		return this.dao;
	}
}
