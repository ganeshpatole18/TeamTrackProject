package com.tka.dao;

import java.util.List;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.Transaction;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.tka.entity.Employee;

@Repository
public class EmployeeDao {

	@Autowired
	private SessionFactory sf;

	public boolean save(Employee emp) {
		Transaction tx = null;
		try (Session session = sf.openSession()) {
			
			tx = session.beginTransaction();
			session.save(emp);
			tx.commit();
			return true;
		}
		catch (ConstraintViolationException e) {
			throw new RuntimeException("Email already exists: " + emp.getEmail(), e);
			
		}
		catch (Exception e) {
			throw new RuntimeException("Something went wrong ", e);
		}
		
	}
	
	public Employee login(String email, String password) {
		try (Session session = sf.openSession()) {
			return session.createQuery("FROM Employee WHERE email = :email AND password = :password", Employee.class)
					.setParameter("email", email).setParameter("password", password).uniqueResult();
		}
	}

	public Employee findByEmail(String email) {
		try (Session session = sf.openSession()) {
		 List<Employee> list = session.createQuery("FROM Employee WHERE email = :email", Employee.class)
					.setParameter("email", email).list();
			if (list != null && !list.isEmpty()) {
				return list.get(0);
			}
		}
		return null;
	}

	public List<Employee> getAll() {
		try (Session session = sf.openSession()) {
			return session.createQuery("FROM Employee", Employee.class).list();
		}
	}

	public Employee getById(int id) {
		try (Session session = sf.openSession()) {
			return session.get(Employee.class, id);
		}
	}

	public boolean update(Employee emp) {
		boolean isUpdated = false;
		Transaction tx = null;
		try (Session session = sf.openSession()) {
			tx = session.beginTransaction();
			session.update(emp);
			tx.commit();
			isUpdated = true;
		} catch (Exception e) {
			e.printStackTrace();
			isUpdated = false;
		}
		return isUpdated;
	}

	public boolean delete(int id) {
		Transaction tx = null;
		boolean isDeleted = false;
		try (Session session = sf.openSession()) {
			Employee emp = session.get(Employee.class, id);
			if (emp != null) {
				tx = session.beginTransaction();
				session.delete(emp);
				tx.commit();
				isDeleted = true;
			}
		} catch (Exception e) {
			if (tx != null)
				tx.rollback();
			isDeleted = false;
		}
		return isDeleted;
	}
}
