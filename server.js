const inquirer = require("inquirer");
const cfonts = require('cfonts');
const connection = require('./config/connection')

// connect to the database
connection.connect((err) => {
    if (err) throw err;
    console.log("connected to the database!");
// start the app
    start();
});

// function to start the app of CFONT
cfonts.say('Antares Employee Tracker', {
    font: 'block',                  //define the font face
    align: 'center',                  //define text aligment
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
        .prompt({
            type: "list",
            name: "action",
            message: "what would you like to do?",
            choices: [
                "View all department",
                "view all role",
                "View all employee",
                "Add a department",
                "Add a role",
                "Add an employee",
                "Add a manager",
                "Update an employee role",
                "View employee by manager",
                "View employee by department",
                "Delete Department | Role | Employee",
                "View the total utilized budget of a department",
                "Exit",
            ],
        })
        .then((answer) => {
            switch (answer.action) {
                case "View all department":
                    viewAllDepartment();
                    break;
                case "View all role":
                    viewAllRole();
                    break;
                case "View all employee":
                    viewAllEmployee();
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
                case "View employee by manager":
                    viewEmployeeByManager();
                    break;
                case "View employee by department":
                    viewEmployeeByDepartment();
                    break;
                case "Delete Department | Role | Employee":
                    deleteDepartmentRoleEmployee();
                    break;
                case "View the total utilized budget of a department":
                    viewTotalUtilizedBudgetOfDepartment();
                    break;
                case "Exit":
                    connection.end();
                    console.log("Have A Great Day!");
                    break;
            }
        });
}

// function to view all department
function viewAllDepartment() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        // restart the application
        start();
    });
}

//  function to view all role
function viewAllRole() {
    const query = "SELECT role.title, role.id, department.department_name, role.salary fromm role join department on role.department_id = department.id";
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
        // restart appliction
        start();
    });
}

//  function to view all employee
function viewAllEmployee() {
    const query = `
    SELECT e.id, e.first_name, e.last_name, r.title, d.depatment_name, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager_name
    FROM employee e
    LEFT JOIN role r ON en.role_id = r.id
    LEFT JOIN department d ON r.department_id = d.id
    LEFT JOIN employee m ON e.manager_id = m.id;
    `;
    connection.query(query, (err, res) => {
        if (err) throw err;
        console.table(res.rows);
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
            const query = `INSERT INTO department (department_name) VALUES ("${answer.name}")`;
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
    const query ="SELECT * FROM department";
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
            const query = "INSERT INTO role SET ?";
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
                        `Add role ${answers.title} with salary ${answers.salary} to the ${answers.department} department in the database!`
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
    //  retrieve list of role form the database
    connection.query ("SELECT id, title FROM role", (error, result) => {
        if (error) {
            console.error(error);
            return;
        }

        const role = results.map(({ id, title }) => ({
            name: title,
            value: id,
        }));

        // retrieve list of employee from the database to use as managers
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
                        choices: role,
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
//  function to add a manager
function addManager() {
    const queryDepartment = "SELECT * FROM department";
    const queryEmployee = "SELECT * FROM employee";

    connection.query(queryDepartment, (err, resDepartment) => {
        if (err) throw err;
        connection.query(queryEmployee, (err, resEmployee) => {
            if (err) throw err;
            inquirer
            .prompt([
                {
                    type: "list",
                    name: "department",
                    message: "Select the department:",
                    choices: resDepartment.map(
                        (department) => department.department.department_name
                    ),
                },
                {
                    type: "list",
                    name: "employee",
                    message: "Select the employee to add a manager to:",
                    choices: resEmployee.map(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}`
                    ),
                },
                {
                    type: "list",
                    name: "manager",
                    message: "Select the employee manager:",
                    choices: resEmployee.map(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}`
                    ),
                },
            ])
            .then((answers) => {
                const department = resDepartment.find(
                    (department) =>
                        department.department_name === answers.department
                );
                const employee = resEmployee.find(
                    (employee) =>
                        `${employee.first_name} ${employee.last_name}` ===
                        answers.employee
                );
                const manager = resEmployee.find(
                    (employee) =>
                        `${employee.first_name} ${employee.last_name}` ===
                        answers.manager 
                );
                const query =
                    "UPDATE employee SET manager_id = ? WHERE id = ? AND role_id IN (SELECT id FROM role WHERE department_id = ?)";
                connection.query(
                    query,
                    [manager.id, employee.id, department.id],
                    (err, res) => {
                        if (err) throw err;
                        console.log(
                            `add manager ${manager.first_name} ${manager.last_name} to employee ${employee.first_name} ${employee.last_name} in department ${department.deparmtent_name}!`
                        );
                        // restart the application
                        start();
                    }
                );
            })
        });
    });
}

// function to update an employee role
function updateEmployeeRole() {
    const queryEmployee =
        "SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN role ON employee.role_id = role.id";
    const queryRole = "SELECT * FROM role";
    connection.query(queryEmployee, (err, resEmployee) => {
        if (err) throw err;
        connection.query(queryRole, (err, resRole) => {
            if (err) throw err;
            inquirer
                .prompt([
                    {
                        type: "list",
                        name: "employee",
                        message: "Select the employee to update:",
                        choices: resEmployee.map(
                            (employee) =>
                                `${employee.first_name} ${employee.last_name}`
                        ),
                    },
                    {
                        type: "list",
                        name: "role",
                        message: "Select the new role:",
                        choices: resRole.map((role) => role.title),
                    },
                ])
                .then((answers) => {
                    const employee = resEmployee.find(
                        (employee) =>
                            `${employee.first_name} ${employee.last_name}` ===
                            answers.employee
                    );
                    const role = resRole.find(
                    (role) => role.title === answers.role 
                    );
                    const query =
                        "UPDATE employee SET role_id = ? WHERE id = ?";
                    connection.query(
                        query,

                        [role.id, employee.id],
                        (err, res) => {
                            console.log(
                                `Update ${employee.first_name} ${employee.last_name}'s role to ${role.title} in the database!`
                            );
                            // restart the application
                            start();
                        }
                    );
            });
        });
    });
}

// function to view employee by manager
function viewEmployeeByManager() {
    const query = `
        SELECT
            e.id,
            e.first_name,
            e.last_name,
            r.title,
            d.department_name,
            CONCAT (m.first_name, ' ', m.last_name) AS manager_name
        FROM
            employee e
            INNER JOIN role r ON e.role_id = r.id
            INNER JOIN deparments d ON r.department_id = d.id
            LEFT JOIN employee m ON e.manager_id = m.id
        ORDER BY
        manager_name,
        e.last_name,
        e.first_name
        `;

        connection.query(query, (err, res) => {
            if (err) throw err;

            // group employee by manager
            const employeeByManager = res.reduce((acc, cur) => {
                const managerName = cur.manager_name;
                if (acc[managerName]) {
                    acc[managerName].push(curl);
                } else {
                    acc[managerName] = [curl];
                }
                return acc;
            }, {});

            // display employee by manager
            console.log("Employee by manager:");
            for (const managerName in employeeByManager) {
                console.log(`\n${managerName}:`);
                const employee = employeeByManager [managerName];
                employee.forEach((employee) => {
                    console.log(
                        `${employee.first_name} ${employee.last_name} | ${employee.title} | ${employee.deparmtent_name}`
                    );
                });
            }

            // restart the application
            start();
        });
}
// function to view wmployees by department
function viewEmployeeByDepartment() {
    const query = 
        "SELECT department.department_name, employee.first_name, employee.last_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id ORDER BY department.department_name ASC";

        connection.query(query(query, (err, res) => {
            if (err) throw err;
            console.log("|nEmployee by department:");
            console.table(res);
            // restart the application
            start();
        }));
}
// function to DELETE department role employee
function deleteDepartmentRoleEmployee() {
    inquirer
        .prompt({
            type: "list",
            name: "data",
            message: "what would you like to delete?",
            choices: ["Employee", "Role", "Department"],
        })
        .then((answer) => {
            switch (answer.data) {
                case "Employee":
                    deleteEmployee();
                    break;
                case "Role":
                    deleteRole();
                    break;
                case "Department":
                    deleteDepartment();
                    break;
                default:
                    console.log(`Invalid data: ${answer.data}`);
                    start();
                    break;
            }
        });
}
// funnction to DELETE employee
function deleteEmployee() {
    const query = "SELECT * FROM employee";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const employeeList = res.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
        }));
        employeeList.push({ name: "Go Back", value: "back" }); // add a "back" option
        inquirer
            .prompt({
                type: "list",
                name: "id",
                message: "Select the employee you want to delete:",
                choices: employeeList,
            })
            .then((answer) => {
                if (answer.id === "back") {
                    // check if user selected "back"
                    deleteDepartmentRoleEmployee();
                    return;
                }
                const query = "DELETE FROM employee WHERE id = ?";
                connection.query(query, [answer.id], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Delete employee with ID ${answer.id} from the database!`
                    );
                    // restart the application
                    start();
                });
            });
    });
}
// function to DELETE ROLE
function deleteRole() {
    // retrieve all available role from the database
    const query = "SELECT * FROM role";
    connection.query(query, (err, res) => {
        if (err) throw err;
        // map through the retrieved role to create an array of choices
        const choices = res.map((role) => ({
            name: `${role.title} (${role.id}) - $(role.salary)`,
            value: role.id,
        }));
        // add a "GO BACK" option to the list of choices
        choices.push({ name: "Go Back", value: null });
        inquirer
            .prompt({
                type: "list",
                name: "roleId",
                message: "Select the role you want to delete:",
                choices: choices,
            })
            .then((answer) => {
                // check if the user chose the "GO BACK" option
                if (answer.roleId === null) {
                    // go back to the deleteDepartmentRoleEmployee function
                    deleteDepartmentRoleEmployee();
                    return;
                }
                const query = "DELETE FROM role WHERE id = ?";
                connection.query(query, [answer.roleId], (err, res) => {
                    if (err) throw err;
                    console.log(
                        `Delete role with ID ${answer.roleid} from the database!`
                    );
                    start();
                });
            });
    });
}
// function to DELETE Department
function deleteDepartment() {
    // get the list of department
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.deparment_name,
            value: department.id,
        }));
        // prompt the user to select a department
        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message: "which department do you want to delete?",
                choices: [
                    ... departmentChoices,
                    {name: "Go Back", value: "back" },
                ]
            })
            .then((answer) => {
                if (answer.departmentId === "back") {
                    // go back to the previous menu
                    deleteDepartmentRoleEmployee();
                } else {
                    const query = "DELETE FROM department WHERE id = ?";
                    connection.query(
                        query,
                        [answer.deparmentId],
                        (err, res) => {
                            if (err) throw err;
                            console.log(
                                `Delete deparmtent with ID ${answer.departmentId} from the database!`
                            );
                            // restart the application
                            start();
                        }
                    );
                }
            });
    });
}
// function to view total utilized budget of department
function viewTotalUtilizedBudgetOfDepartment() {
    const query = "SELECT * FROM department";
    connection.query(query, (err, res) => {
        if (err) throw err;
        const departmentChoices = res.map((department) => ({
            name: department.department_name,
            value: department.id,
        }));
        // prompt the user to select a department
        inquirer
            .prompt({
                type: "list",
                name: "departmentId",
                message: 
                    "Which department do you want to calculate the total salary for?",
                choices: departmentChoices,
            })
            .then((answer) => {
                // calculate the total salary for the selected department
                const query = 
                `SELECT
                    department.department_name AS department,
                    SUM(role.salary) AS total_salary
                FROM
                    department
                    INNER JOIN role ON department.id = role.department_id
                    INNER JOIN employee ON role.id = employee.role_id
                WHERE
                    department.id = ?
                GROUP BY
                    department.id;`;
                connection.query(query, [answer.departmentId], (err, res) => {
                    if (err) throw err;
                    const totalSalary = res[0].total_salary;
                    console.log(
                        `The total salary for employee in this department is $${totalSalary}`
                    );
                    // restart the application
                    start();
                });
            });
    });
}