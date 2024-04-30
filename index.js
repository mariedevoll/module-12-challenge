const { response } = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');
const consoleTable = require('console.table');

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: 'Shadow907',
    database: 'business_db',
    port: 5432  // the default PostGres local CONNECTION PORT
});
console.log("Connected to the database")
pool.connect();

function quit() {
    console.log("Leaving the application now...");
    process.exit();
}

//prompt user for choices
const promptUser = () => {
    inquirer.prompt([
    {
        name: 'choice',
        type: 'list',
        message: 'Please choose one of the following options:',
        choices: [
            {name: 'View all Employees', value: 'viewAllEmployees'},
            {name: 'View all Departments', value:'viewAllDepartments'},
            {name: 'View all Roles', value: 'viewAllRoles'},
            {name: 'Add a Department', value: 'addDepartment'},
            {name: 'Add a Role', value: 'addRole'},
            {name: 'Add an Employee', value: 'addEmployee'},
            {name: 'Update an Employee Role', value: 'updateEmployeeRole'},
            {name: 'Quit', value: 'quit'}
        ]
    }
])
.then((answers) => {
    console.log(answers, "Great Choice!");
    if (answers.choice === 'quit') {
        quit();
    } else {
        executeAction(answers.choice);
    }
});
}
const executeAction = (choice) => {
    switch (choice) { 
        case 'View all Employees':
            viewAllEmployees();
            break;
        case 'View all Departments': 
            viewAllDepartments();
            break;
        case 'View all Roles':
            viewAllRoles();
            break;
        case 'Add a Department':
            addDepartment();
            break;
        case 'Add a Role':
            addRole();
            break;
        case 'Add an Employee':
            addEmployee();
            break;
        case 'Update an Employee Role':
            updateEmployeeRole();
            break;
        default: 
            console.log('Invalid Choice');
            break;
    }
};


//view all employees
const viewAllEmployees = () => {
    sqlQuery = `SELECT * FROM employee`;
    pool.query(sqlQuery, (error, results) => {
        console.log(results)
        if (error) throw error;
        console.log("\n");
        console.table(results);
        console.log("\n");
        promptUser();
    });
};

//view all departments
const viewAllDepartments = () => {
    sqlQuery = `SELECT department.id AS id, department.department_name 
        AS department FROM department`;
    pool.query(sqlQuery, (error, response) => {
        if (error) throw error;
        console.log("\n");
        console.table(results);
        console.log("\n");
        promptUser();
    });
};

//view all roles
const viewAllRoles = () => {
    sqlQuery = `SELECT role.id, role.title, department.department_name AS department 
            FROM role INNER JOIN department ON role department_id = department.id`;
    pool.query(sqlQuery, (error, response) => {
        if (error) throw error;
        response.forEach((role) => {console.log(role.title);
        });
        console.log("\n");
        console.table(results);
        console.log("\n");
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
        }
    ])
    .then((answer) => {
        sqlQuery = `INSERT INTO department(name) VALUES ('${answer.department}');`
        pool.query(sqlQuery, (error, response) => {
            if (error) throw error;
            console.log("\n");
            console.table(results);
            console.log("\n");
            viewAllDepartments();
        });
    });
};

//add a role
const addRole = () => {
    sqlQuery = `SELECT * FROM department`
    pool.query(sqlQuery, (error, response) => {
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
        lsqlQuery =  `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
        let crit = [createdRole, answer.salary, departmentId];

        pool.query(sqlQuery, crit, (error) => {
            if (error) throw error;
            console.log("\n");
            console.table(results);
            console.log("\n");
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
        pool.query(roleSql, (error, data) => {
            if (error) throw error
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
                managerSql = `SELECT * FROM employee`;
                pool.query(managerSql, (error, data) => {
                    if (error) throw error;
                    console.log("\n");
                    console.table(results);
                    console.log("\n");
                    viewAllEmployees();
                });
            });
        });
    });
};

//update an employee's role
const updateEmployeeRole = () => {
    sqlQuery = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id" 
            FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
    pool.query(sqlQuery, (error, response) => {
        if (error) throw error;
        let employeeNamesArray = [];
        response.forEach((role) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

        sqlQuery = `SELECT role.id, role.title FROM role`;
        pool.query(sqlQuery, (error, response) => {
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
            sqlQuery = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            pool.query(
                sqlQuery, [newTitleId, employeeId],
                (error) => {
                    if (error) throw error;
                    console.log("\n");
                    console.table(results);
                    console.log("\n");
                    console.log(`Employee Role Updated`);
                    promptUser();
                }
            );
        });
        });
    });
};

promptUser();