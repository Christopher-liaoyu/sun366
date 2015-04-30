package com.sun366.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sun366.dao.ICourseDao;
import com.sun366.dao.common.IOperations;
import com.sun366.entity.Course;
import com.sun366.service.ICourseService;
import com.sun366.service.common.AbstractService;

@Service("courseService")
public class CourseService extends AbstractService<Course> implements
		ICourseService {

	@Autowired
	private ICourseDao dao;

	public CourseService() {
		super();
	}

	@Override
	protected IOperations<Course> getDao() {
		return this.dao;
	}
}
