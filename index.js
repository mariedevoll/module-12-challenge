
const inquirer = require('inquirer');

//prompt user for choices
const promptUser = () => {
    inquirer.prompt([
        {
        name: 'choices',
        type: 'list',
        message: 'Please choose one of the following options:',
        choices: [
            'View all Departments', //presented with a formatted table showing department names and department ids
            'View all Roles', //presented with the job title, role id, the department that role belongs to, and the salary for that role
            'View all Employees', //presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
            'Add a Department', //prompted to enter the name of the department and that department is added to the database
            'Add a Role', //prompted to enter the name, salary, and department for the role and that role is added to the database
            'Add an Employee', //prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
            'Update an Employee Role', //prompted to select an employee to update and their new role and this information is updated in the database
            'View All Employees by Department',
            'Remove an Employee',
            'Update an Employee Manager',
            'Remove Role',
            'View Department Budgets',
            'Remove Department'
        ]
    }
])
.then((answers) => {
    const {choices} = answers;

        if (choices === 'View all Departments') {
            viewAllDepartments();
        }
        if (choices === 'View all Roles') {
            viewAllRoles();
        } 
        if (choices === 'View all Employees') {
            viewAllEmployees();
        }
        if (choices === 'Add a Department') {
            addDepartment();
        }
        if (choices === 'Add a Role') {
            addRole();
        }
        if (choices === 'Add an Employee') {
            addEmployee();
        }
        if (choices ===  'Update an Employee Role') {
            updateEmployeeRole();
        }
        if (choices === 'View All Employees by Department') {
            viewEmployeesByDepartment();
        }
        if (choices === 'Remove an Employee') {
            removeEmployee();
        }
        if (choices === 'Update an Employee Manager') {
            udpateEmployeeManager();
        }
        if (choices === 'Remove Role') {
            removeRole();
        }
        if (choices === 'View Department Budgets') {
            viewDepartmentBudget();
        }
        if (choices === 'Remove Department') {
            removeDepartment();
        }
    });
};