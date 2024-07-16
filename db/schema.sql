DROP DATABASE IF EXITS employeeTracker_db;
CREATE DATABASE employeeTracker_db;
USE employeeTracker_db;

CREATE TABLE departments (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    departments_name VARCHAR(255) NOT NULL
);

CREATE TABLE roles (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    SALARY DECIMAL(10,2),
    departments_id INT,
    FOREIGN KEY (departments_id)
    REFERENCES departments(id)
    ON DELETE SET NULL
    );

    CREATE TABLE employee (
        id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(30) NOT NULL,
        last_name VARCHAR(30) NOT NULL,
        role_id INT,
        manager_id INT NOT NULL
    );