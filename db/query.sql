SELECT * FROM department;

SELECT role.*, department.name AS department_name
FROM role
JOIN department ON role.department_id = department.id;

SELECT employee.id, employee.first_name, employee.last_name, 
    role.title AS role_title, department.name AS department_name
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;