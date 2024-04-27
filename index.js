const path = require("path");
const fs = require("fs");
const inquirer = require('inquirer');

const questions = [
    {
        type: "list",
        name: "start",
        message: "Which of the following options would you like to select?",
        choices: ["View all Departments", "View all Roles", "View all Employees", 
            "Add a Department", "Add a Role", "Add an Employee", 
            "Update an Employee Role"]
    }
];

