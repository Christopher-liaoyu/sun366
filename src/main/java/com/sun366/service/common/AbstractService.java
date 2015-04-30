package com.sun366.service.common;

import java.io.Serializable;
import java.util.List;

import org.springframework.transaction.annotation.Transactional;

import com.sun366.dao.common.IOperations;

@Transactional
public abstract class AbstractService<T extends Serializable> implements IOperations<T> {
    
    protected abstract IOperations<T> getDao();

    public T findOne(long id) {
        return getDao().findOne(id);
    }

    public List<T> findAll() {
        return getDao().findAll();
    }

    public void create(T entity) {
        getDao().create(entity);
    }

    public T update(T entity) {
        return getDao().update(entity);
    }

    public void delete(T entity) {
        getDao().delete(entity);
    }

    public void deleteById(long entityId) {
        getDao().deleteById(entityId);
    }

}
