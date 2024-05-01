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


//function to view all employees
const viewAllEmployees = () => {
    const sqlQuery = `SELECT * FROM employee`;
    pool.query(sqlQuery, (error, results) => {
        if (error) throw error;
        console.log("\n");
        console.table(results.rows);
        console.log("\n");
        promptUser();
    });
};

//function to view all departments
const viewAllDepartments = () => {
    const sqlQuery = `SELECT * FROM department.id AS id, department.department_name 
        AS department FROM department`;
    pool.query(sqlQuery, (error, response) => {
        if (error) throw error;
        console.log("\n");
        console.table(results.rows);
        console.log("\n");
        promptUser();
    });
};

//view all roles
const viewAllRoles = () => {
    const sqlQuery = `SELECT role.id, role.title, department.department_name AS department 
            FROM role INNER JOIN department ON role department_id = department.id`;
    pool.query(sqlQuery, (error, response) => {
        if (error) throw error;
        console.log("\n");
        console.table(results.rows);
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
        const sqlQuery = `INSERT INTO department(name) VALUES ('${answer.department}');`
        const values = [answer.newDepartment];
        pool.query(sqlQuery, values, (error) => {
            if (error) throw error;
            console.log("\nDepartment added!\n");
            viewAllDepartments();
        });
    });
};

//add a role
const addRole = () => {
    const sqlQuery = `SELECT * FROM department`
    pool.query(sqlQuery, (error, response) => {
        if (error) throw error;
        const deptChoices = results.rows.map(dept => ({ name: dept.name, value: dept.id}));
        deptChoices.push({ name: 'Create New Department', value: 'newDepartment'});
        inquirer.prompt([
            {
                name: 'department',
                type: 'list',
                message: 'Which department is this new role in?',
                choices: deptChoices
            },
            {
                name: 'title',
                type: 'input',
                message: 'What is the title of the new role?'
            },
            {
                name: 'salary',
                type: 'input',
                message: 'What is the salary of the new role?'
            }
        ])
        .then((answers) => {
            if (answers.department === 'newDepartment') {
                addDepartment().then((departmentId) => {
                    insertRole(answers.title, answers.salary, departmentId);
                });
            } else {
                insertRole(answers.title, answers.salary, answers.department);
            }
        });
    });
}

//function to insert role into database
    const insertRole = (title, salary, departmentId) => {
    const sqlQuery = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
    const values = [title, salary, departmentId];
    pool.query(sqlQuery, values, (error) => {
        if (error) throw error;
        console.log("\nRole added!\n")
        viewAllRoles();
    });
};

//function to add an employee
const addEmployee = () => {
    const roleSql = `SELECT * FROM role`;
    pool.query(roleSql, (error, data) => {
        if (error) throw error;
        const roles = data.rows.map(role => ({ name: role.title, value: role.id }));
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
        },
        {
            type: 'list',
            name: 'roleId',
            message: 'What is the employee role?',
            choices: roles
        }
    ])
    .then(answer => {
        const sqlQuery = `INSERT INTO employee (first_name, last_name, role_id) VALUES (???)`;
        const values = [answer.firstName, answer.lastName, answer.roleId];
        pool.query(sqlQuery, values, (error) => {
            if (error) throw error;
            console.log("\nEmployee Added!\n");
                    viewAllEmployees();
                });
            });
        });
    };

//function to update an employee's role
const updateEmployeeRole = () => {
    const employeeSql = `SELECT * FROM employee`;
    pool.query(employeeSql, (error, employeesData) => {
        if (error) throw error;
        const employees = employeesData.rows.map(employee  => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }));

        const roleSql = `SELECT * FROM role`;
        pool.query(roleSql, (error, rolesData) => {
            if (error) throw error;
            const roles = rolesData.rows.map(role => ({ name: role.title, value: role.id }));
        })
    })



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
            const sqlQuery = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
            const values = [answer.roleId, answer.employeeId];
            pool.query(sqlQuery, values, (error) => {
                if (error) throw error 
                    console.log("\nEmployee Role Updated\n");
                    viewAllEmployees();
                });
            });
        });
    });
};

promptUser();