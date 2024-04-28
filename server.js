const inquirer = require('inquirer');
const mysql = require("mysql2/promise")

//prompt user for choices
const promptUser = () => {
    inquirer.prompt([
        {
        name: 'choices',
        type: 'list',
        message: 'Please choose one of the following options:',
        choices: [
            'View all Employees', //presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
            'View all Departments', //presented with a formatted table showing department names and department ids
            'View all Roles', //presented with the job title, role id, the department that role belongs to, and the salary for that role
            'Add a Department', //prompted to enter the name of the department and that department is added to the database
            'Add a Role', //prompted to enter the name, salary, and department for the role and that role is added to the database
            'Add an Employee', //prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
            'Update an Employee Role', //prompted to select an employee to update and their new role and this information is updated in the database
            //'View All Employees by Department',
            //'Remove an Employee',
            //'Update an Employee Manager',
            //'Remove Role',
           // 'View Department Budgets',
           // 'Remove Department'
        ]
    }
])
.then((answers) => {
    const {choices} = answers;

        if (choices === 'View all Employees') {
        viewAllEmployees();
         }   
        if (choices === 'View all Departments') {
            viewAllDepartments();
        }
        if (choices === 'View all Roles') {
            viewAllRoles();
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
        // if (choices === 'View All Employees by Department') {
        //     viewEmployeesByDepartment();
        // }
        // if (choices === 'Remove an Employee') {
        //     removeEmployee();
        // }
        // if (choices === 'Update an Employee Manager') {
        //     udpateEmployeeManager();
        // }
        // if (choices === 'Remove Role') {
        //     removeRole();
        // }
        // if (choices === 'View Department Budgets') {
        //     viewDepartmentBudget();
        // }
        // if (choices === 'Remove Department') {
        //     removeDepartment();
        // }
    });
};


//view all employees
const viewAllEmployees = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.title, 
            department.department_name AS 'department', role.salary FROM employee, role, department 
            WHERE department.id = role.department_id AND role.id = employee.role_id 
            ORDER BY employee.id ASC`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        promptUser();
    });
};

//view all departments
const viewAllDepartments = () => {
    const sql = `SELECT department.id AS id, department.department_name 
        AS department FROM department`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        promptUser();
    });
};

//view all roles
const viewAllRoles = () => {
    const sql = `SELECT role.id, role.title, department.department_name AS department 
            FROM role INNER JOIN department ON role department_id = department.id`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        response.forEach((role) => {console.log(role.title);
        });
        promptUser();
    });
};

//add a department
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'newDepartment',
            type: 'input',
            message: 'What is the name of the new department?',
            validate: validate.validateString
        }
    ])
    .then((answer) => {
        let sql = `INSERT INTO department (department_name VALUES (?)`;
        connection.query(sql, answer.newDepartment, (error, response) => {
            if (error) throw error;
            viewAllDepartments();
        });
    });
};

//add a role
const addRole = () => {
    const sql = `SELECT * FROM department`
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let deptNamesArray = [];
        response.forEach((department) => {deptNamesArray.push(department.department_name);
        });
        deptNamesArray.push('Create Department');
        inquirer.prompt([
            {
                name: 'departmentName',
                type: 'list',
                message: 'Which department is this new role in?',
                choices: deptNamesArray
            }
        ])
        .then((answer) => {
            if (answer.departmentName === 'Create Department') {
                this.addDepartment();
            } else {
                addRoleDescription(answer);
            }
        });
const addRoleDescription = (departmentData) => {
    inquirer.prompt([
        {
            name: 'newRole',
            type: 'input',
            message: 'What is the name of the new role?',
            validate: validate.validateString
        }, {
            name: 'salary',
            type: 'input',
            message: 'What is the salary of this new role?',
            validate: validate.validateString
        }
    ])
    .then((answer) => {
        let createdRole = answer.newRole;
        let departmentId;

        response.forEach((department) => {
         if (departmentData.departmentName === department.department_name) {departmentId = department.id;}
        });
        let sql =  `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        let crit = [createdRole, answer.salary, departmentId];

        connection.promise().query(sql, crit, (error) => {
            if (error) throw error;
            viewAllRoles();
        });
    });
};
    });
};

//add an employee
const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'firstName',
            message: 'What is the employee first name?',
            validate: addFirstName => {
                if (addFirstName) {
                    return true;
                } else {
                    console.log('Please enter a first name');
                    return false;
                }
            }
        },
        {
            type:'input',
            name: 'lastName',
            message: 'What is the employee last name?',
            validate: addLastName => {
                if (addLastName) {
                    return true;
                } else {
                    console.log('Please enter a last name');
                    return false;
                }
            }
        }
    ])
    .then(answer => {
        const crit = [answer.firstName, answer.lastName]
        const roleSql = `SELECT role.id, role.title FROM role`;
        connection.promise().query(roleSql, (error, data) => {
            if (error) throw errorl
            const roles = data.map(({ id, title }) => ({ name: title, value: id }));
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'role',
                    message: 'What is the employee role?',
                    choices: roles
                }
            ])
            .then(roleChoice => {
                const role = roleChoice.role;
                crit.push(role);
                const managerSql = `SELECT * FROM employee`;
                connection.promist().query(managerSql, (error, data) => {
                    if (error) throw error;
                    viewAllEmployees();
                });
            });
        });
    });
};

//update an employee's role
const updateEmployeeRole = () => {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" 
            FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    connection.promise().query(sql, (error, response) => {
        if (error) throw error;
        let employeeNamesArray = [];
        response.forEach((role) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

        let sql = `SELECT role.id, role.title FROM role`;
        connection.promise().query(swl, (error, response) => {
            if (error) throw error;
            let rolesArray = [];
            response.forEach((role) => {rolesArray.push(role.title);});

            inquirer.prompt([
                {
                    name: 'chosenEmployee',
                    type: 'list',
                    message: 'Which employee has a new role?',
                    choices: employeeNamesArray
                },{
                    name: 'chosenRole',
                    type: 'list',
                    message: 'What is their new role?',
                    choices: rolesArray
                }
        ])
        .then((answer) => {
            let newTitleId, employeeId;

            response.forEach((role) => {
                if (answer.chosenRole === role.title) {
                    newTitleId = role.id;
                }
            });
            response.forEach((employee) => {
                if (answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`) {
                    employeeId = employee.id;
                }
            });
            let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            connection.query(
                sqls, [newTitleId, employeeId],
                (error) => {
                    if (error) throw error;
                    console.log(`Employee Role Updated`);
                    promptUser();
                }
            );
        });
        });
    });
};