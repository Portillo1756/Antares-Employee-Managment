INSERT INTO department (department_name)
VALUES
('Executive Board'),
('Marketing'),
('Human Resources'),
('Finance'),
('Engineering'),
('Information Technology'),
('Customer Relations'),
('Research and Development'),
('Legal'),
('Maintenance');

INSERT INTO role (title, salary, department_id)
VALUES
('Chief Executive Officer', 500000.00, 1),
('Marketing Manager', 110000.00, 2),
('HR Director', 114000.00, 3),
('Finance Manager', 170000.00, 4),
('Senior Engineer', 125000.00, 5),
('IT Manager', 110000.00, 6),
('Customer Relations Manager', 65000.00, 7),
('Research & Development Manager', 100000.00, 8),
('Legal Manager', 120000.00, 9),
('Maintenance Manager', 74000, 10);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Andres', 'Portillo', 1, 1),
('William', 'Gamez', 2, 2),
('Sandra', 'Gamez', 3, 3),
('Jose', 'Portillo', 4, 4),
('Mishell', 'Escobar', 5, 5),
('Juan', 'Escobar', 6, 6),
('Naomi', 'Gonzalez', 7, 7),
('Sheyla', 'Gonzalez', 8, 8),
('Daniel', 'Ponce', 9, 9),
('William', 'Portillo', 10, 10);