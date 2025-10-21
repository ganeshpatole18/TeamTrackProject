package com.tka.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tka.dao.EmployeeDao;
import com.tka.entity.Employee;

@Service
public class EmployeeService {

	@Autowired
	private EmployeeDao dao;

	public boolean saveEmployee(Employee employee) {
		return dao.save(employee);
	}

	public Employee login(String username, String password) {
		return dao.login(username, password);
	}

	public Employee findByEmail(String email) {
		return dao.findByEmail(email);
	}

	public List<Employee> getAll() {
		return dao.getAll();

	}

	public Employee getById(int id) {
		return dao.getById(id);
	}

	public boolean update(Employee employee) {
		return dao.update(employee);
	}

	public boolean delete(int id) {
		return dao.delete(id);
	}

}
