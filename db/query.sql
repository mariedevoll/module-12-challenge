--! retrieve all departments
SELECT * FROM department;

--! retrieve all roles along with their corresponding department name
SELECT role.*, department.name AS department_name
FROM role
JOIN department ON role.department_id = department.id;

--! retrieve all employees along with their corresponding roles and departments
SELECT employee.id, employee.first_name, employee.last_name, 
    role.title AS role_title, department.name AS department_name
FROM employee
JOIN role ON employee.role_id = role.id
JOIN department ON role.department_id = department.id;

--! retrieve the total salary expense for each department
SELECT department.name AS department_name, SUM(role.salary) AS total_salary_expense
FROM role JOIN department ON role.department_id = department.id
GROUP BY department.name;

--! retireve the names of managers along with the names of their direct reports
SELECT manager.first_name AS manager_first_name, manager.last_name AS manager_last_name, 
    direct_report.first_name AS direct_report_first_name, 
    direct_report.last_name AS direct_report_last_name
FROM employee AS direct_report
JOIN employee AS manager ON direct_report.manager_id = manager.id;