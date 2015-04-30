package com.sun366.dao.impl;

import org.springframework.stereotype.Repository;

import com.sun366.dao.ICourseDao;
import com.sun366.dao.common.AbstractHibernateDao;
import com.sun366.entity.Course;

@Repository("courseDao")
public class CourseDao extends AbstractHibernateDao<Course> implements ICourseDao {

    public CourseDao() {
        super();
        
        setClazz(Course.class);
    }
}