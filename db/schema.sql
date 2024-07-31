DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
-- USE employeeTracker_db;

CREATE TABLE departments (
    id SERIAL PRIMERY KEY,
    departments_name VARCHAR(255) NOT NULL
);

CREATE TABLE roles (
    id SERIAL PRIMERY KEY,
    title VARCHAR(255),
    SALARY DECIMAL(10,2),
    departments_id INT,
    FOREIGN KEY (departments_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
    );

    CREATE TABLE employee (
        id SERIAL PRIMERY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INT,
        manager_id INT NOT NULL
    );