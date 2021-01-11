const mysql = require('mysql2');
const promise = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');

// creating an object with connection properties
const conProperties = {
	host: 'localhost',
	user: 'user',
	password: 'dolphinsarecool',
	database: 'employee_tracker'
};

// create the connection to database
const connection = mysql.createConnection(conProperties);

connection.connect(err => {
	if (err) throw err;
	// console.log('connected as id ' + connection.threadId);
});

// execute the view all departments function
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
function viewAllDepartments() {
	connection.query(
		'SELECT departments.department_id AS ID, departments.department_name AS Department from departments;',
		(err, res) => {
			// console.log('got here'); // use this if you run into an error and need to see if the application is making it to this point in the code
			if (err) throw err;
			console.log('\n** Departments **\n');
			console.table(res); // results contains rows returned by server
		}
	);
}

// execute the view all roles function
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles() {
	connection.query(
		'SELECT roles.roles_id AS ID, roles.title AS Title, roles.salary AS Salary, departments.department_name AS Department FROM roles LEFT JOIN departments ON roles.department_id = departments.department_id ORDER BY roles_id ASC;',
		(err, res) => {
			// console.log('got here'); // use this if you run into an error and need to see if the application is making it to this point in the code
			if (err) throw err;
			console.log('\n** Roles **\n');
			console.table(res); // results contains rows returned by server
		}
	);
}

// execute the view all employees function
// WHEN I choose to view all employees THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
	connection.query(
		'SELECT employees.emp_id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary, CONCAT(e.first_name, " ", e.last_name) AS manager FROM employees INNER JOIN roles ON (employees.roles_id = roles.roles_id) INNER JOIN departments ON roles.department_id = departments.department_id LEFT JOIN employees AS e ON employees.manager_id = e.emp_id ORDER BY emp_id ASC;',
		(err, res) => {
			// console.log('got here'); // use this if you run into an error and need to see if the application is making it to this point in the code
			if (err) throw err;
			console.log('\n** Employees **\n');
			console.table(res); // results contains rows returned by server
		}
	);
}

// execute the add a department function
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
function addDepartment() {
	// if the end user chooses to add a department, we need to ask them what the name of the department is...
	inquirer
		.prompt([
			{
				type: 'input',
				message: 'Department Name: ',
				name: 'deptName',
				validate: function (input) {
					if (input === '') {
						console.log('Department Name Required');
						return false;
					} else {
						return true;
					}
				}
			}
		])
		.then(answer => {
			connection.query(
				'INSERT INTO departments (department_name) VALUES (?);',
				answer.deptName,
				(err, res) => {
					// console.log('got here'); // use this if you run into an error and need to see if the application is making it to this point in the code
					if (err) throw err;
					console.log(`${answer.deptName} added to Departments!`);
				}
			);
		});
}

// execute the add roles function
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole() {
	connection.query(
		'SELECT department_id AS ID, department_name AS Department from departments;',
		(err, res) => {
			console.log('\n** Department Options **\n');
			console.table(res);
			inquirer
				.prompt([
					{
						type: 'input',
						name: 'role',
						message: 'Employee Role: ',
						validate: function (input) {
							if (input === '') {
								console.log('Employee Role Required');
								return false;
							} else {
								return true;
							}
						}
					},
					{
						type: 'input',
						name: 'salary',
						message: 'Salary: ',
						validate: function (value) {
							if (isNaN(value) === false) {
								return true;
							}
							return false;
						}
					},
					// !need to figure out how to dynamically generate this list for the end user to select from...
					{
						name: 'deptId',
						type: 'number',
						message: 'Departmend ID:'
					}
				])
				.then(answers => {
					connection.query(
						'INSERT INTO roles SET ?',
						{
							title: answers.role,
							salary: answers.salary,
							department_id: answers.deptId
						},
						function () {
							console.log(`Role ${answers.role} was created successfully!`);
							// displays table of roles
							viewAllRoles();
						}
					);
				});
		}
	);
}

// execute the fuction to add an employee
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
function addEmployee() {
	console.log('\n** Enter New Employee **\n');
	connection.query(
		'SELECT roles_id as ID, title as ROLE from roles;',
		(err, res) => {
			console.table(res);
			inquirer
				.prompt([
					{
						type: 'input',
						name: 'fName',
						message: "What is the employee's first name?"
					},
					{
						type: 'input',
						name: 'lName',
						message: "What is the employee's last name?"
					},
					{
						type: 'input',
						name: 'roleId',
						message: 'Which role does this employee belong to?'
					},
					{
						type: 'input',
						name: 'managerId',
						// !this should be dynamically generated, in addition to split into a validated prompt where they can response with yes/no
						// !i am being lazy here, short on time and will need to refactor this at another point in time
						message:
							"Does this employee have a manager? If so, then input Manager's Employee ID. If not, press 'Enter'!"
					}
				])
				.then(function (answers) {
					var data = {
						first_name: answers.fName,
						last_name: answers.lName,
						roles_id: answers.roleId
					};
					if (answers.managerId) {
						data.manager_id = answers.managerId;
					}
					connection.query(
						'INSERT INTO employees SET ?',
						data,
						function (err, res) {
							console.log('error:' + err);
							console.log(
								`${answers.fName} ${answers.lName}'s profile was created successfully!`
							);
							// displays the table of employees.
							viewAllEmployees();
						}
					);
				});
		}
	);
}

//execute the function to update an employee role
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
function updateEmployee() {
	connection.query('SELECT * FROM employees', (err, res) => {
		console.log('\n** Change Employee Role **\n');
		console.table(res);

		inquirer
			.prompt([
				{
					type: 'number',
					name: 'eId',
					message: 'Please input the id of the employee you want to update.'
				},
				{
					type: 'number',
					name: 'eRole',
					message: "Please update employee's role by selecting a new role ID."
				}
			])
			.then(answers => {
				connection.query(
					'UPDATE employees SET ? WHERE ?',
					[{ roles_id: answers.eRole }, { emp_id: answers.eId }],
					function (err, res) {
						console.log('error:' + err);
						viewAllEmployees();
					}
				);
			});
	});
}

function endApp() {
	connection.end(err => {
		if (err) throw err;
		console.log('See you again soon...');
	});
}

module.exports = {
	viewAllDepartments: viewAllDepartments,
	viewAllRoles: viewAllRoles,
	viewAllEmployees: viewAllEmployees,
	addDepartment: addDepartment,
	addRole: addRole,
	addEmployee: addEmployee,
	updateEmployee: updateEmployee,
	endApp: endApp
};
