const inquirer = require("inquirer");
const mysql = require("mysql2");
const cfonts = require('cfonts');

// creating my sql connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3006,
    user: "root",
    password: "",
    database: "employeeTracker_db",
});

// connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log("connected to the database!");
// start the app
    StaticRange();
});

// function to start the app of CFONT
cfonts.say('Antares SQL Employee Tracker', {
    font: 'block',                  //define the font face
    align: 'left',                  //define text aligment
    color: ['blue'],                //define all colors
    background: 'transparent',      //define the background color, you can also use 'backgeound color'
    letterSpacing: 1,               //define letter spacing
    lineHeight: 1,                  //define the line heigh
    space: 'true',                  //define if the output text should have empty lines on top and on the bottom
    maxLenght: '0',                 //define how mant character can be on one line
    gradient: false,                //define your two gradient colors
    independentGradient: false,     //define if you want to recalculate the gradient for each new line
    transitionGradient: false,      //define if this is a transition between color directly
    env: 'node'                     //define the environment cfonts is being executed in
    });

// function to start SQL Employrr
function start() {
    inquirer
        .createPromptModule({
            type: "list",
            name: "action",
            message: "what would you like to do?",
            choices: [
                "View all deparments",
                "view all roles",
                "View all employees",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Add a manager",
                "Update an employee role",
                "View employees by manager",
                "View employees by department",
                "Delete Departments | Roles | Employees",
                "View the total utilized budget of a deparrment",
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View all departments":
                    viewAllDepartments();
                    break;
                case "View all roles":
                    viewAllRoles();
                    break;
                case "View all employees":
                    viallAllEmployees();
                    break;
                case "Add a department":
                    addDepartment();
                    break;
                case "Add a role":
                    addRole();
                    break;
                case "Add an employee":
                    addEmployee();
                    break;
                case "Add a manager":
                    addManager();
                    break;
                case "Update an employee role":
                    updateEmployeeRole();
                    break;
                case "View employees by manager":
                    viewEmployeesByManager();
                    break;
                case "View employees by department":
                    viewEmployeesByDepartment();
                    break;
                case "Delete Departments | Roles | Employees":
                    deleteDepartmentsRolesEmployees();
                    break;
                case "View the total utilized budget of a deparrment":
                    viewTotaUtilizedBudgetOfDeparrment();
                    break;
                case "Exit":
                    connection.end();
                    console.log("Have A Great Day1");
                    break;
            }
        });
}

// function to view all departments
function viewAllDepartments() {
    const query = "SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // restart the application
        start();
    });
}

//  function to view all roles
function viewAllRoles() {
    const query = "SELECT roles.title, roles.id, departments.department_name, roles.salary fromm roles join departments on role.department_id = departments.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // restart appliction
        start();
    });
}

//  function to view all employees
function viewAllEmployees() {;
    const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.depatment_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN roles r ON en.role_id = r.id
    LEFT JOIN departments d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res);
        // restart the application
        start();
    });
}

// function to add a department
function addDepartment() {
    inquirer
        .prompt ({
            type: "input",
            name: "name",
            message: "Enter the name of the new department:",
        })
        .then((answer) => {
            console.log(answer.name);
            const query = `INSERT INTO departments (department_name) VALUES ("${answer.name}")`;
            connection.query(query, (err, res) => {
                if (err) throw err;
                console.log(`Added department ${answer.name} to the database!`);
                //restart the application
                start();
                console.log(answer.name);
            });
        });
    }

function addRole() {
    const query ="SELECT * FROM departments";
    connection.query(query, (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([
            {
                type: "input",
                name: "title",
                message: "Enter the title of the new role:",
            },
            {
                type: "type",
                name: "salary",
                message: "Enter the salary of the new role:",
            },
            {
                type: "list",
                name: "department",
                message: "Select the department for the new role:",
                choices: res.map(
                    (department) => department.department_name
                ),
            },
        ])
        .then((answers) => {
            const department = res.find(
                (department) => department.name === answer.deparment
            );
            const query = "INSERT INTO roles SET ?";
            connection.query(
                query,
                {
                    title: answers.title,
                    salary: answers.salary,
                    department_id: department,
                },
                (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Added role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
                    );
                    // restart the application
                    start();
                }
            );
        });
    });
}

// function to add an employee
function addEmployee() {
    //  retrieve list of roles form the database
    connection.query ("SELECT id, title FROM roles", (error, result) => {
        if (error) {
            console.error(error);
            return;
        }

        const roles = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        // retrieve list of employees from the database to use as managers
        connection.query(
            'SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employee',
            (error, results) => {
                if (error) {
                    console.error(error);
                    return;
                }

                const managers = results.map(({ id, name }) => ({
                    name,
                    value: id,
                }));

                // Promt the user for employee information
                inquirer
                .prompt([
                    {
                        type: "input",
                        name: "firstName",
                        message: "Enter the employee's first name:",
                    },
                    {
                        type: "input",
                        name: "lastName",
                        message: "Enter the employee's last name:",
                    },
                    {
                        type: "input",
                        name: "roleId",
                        message: "Select the employee role:",
                        choices: roles,
                    },
                    {
                        type: "list",
                        name: "managerId",
                        message: "Select the employee manager:",
                        choices: [
                            { name: "none", values: null },
                            ...managers,
                        ],
                    },
                ])
                .then((answers) => {
                    // insert the employee into the database
                    const sql = 
                        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
                    const values =[
                        answers.firstName,
                        answers.lastName,
                        answers.roleId,
                        answers.managerId,
                    ];
                    connection.query(sql, values, (error) => {
                        if (error) {
                            console.error(error);
                            return;
                        }

                        console.log("Employee added successfully");
                        start();
                    });
                })
                .catch((error) => {
                    console.error(error);
                });
            }
        );
    });
}