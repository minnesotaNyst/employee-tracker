const mysql = require('mysql2');
const promise = require('mysql2/promise');
const inquirer = require('inquirer');
const cTable = require('console.table');
const menu = require('./assets/js/menu');

// creating an object with connection properties to use for mysql2 and mysql2/promise
const conProperties = {
	host: 'localhost',
	user: 'user',
	password: 'dolphinsarecool',
	database: 'employee_tracker'
};

// create the connection to database
const connection = mysql.createConnection(conProperties);

// reference: https://github.com/mysqljs/mysql#establishing-connections
connection.connect(err => {
	if (err) throw err;
	// start the application from here
	startApp();
});

// here we will start the application by executing the called funtion from the established connection above
/* look into MySQL2's documentation (Using Promise Wrapper) to make your queries asynchronous - https://www.npmjs.com/package/mysql2#api-and-configuration
----------------------  ^^reccomendation comes from the challenge^^ ---------------------- */
function startApp() {
	console.log('\n** Options Menu **\n');

	inquirer
		.prompt([
			{
				type: 'list',
				name: 'options',
				message: 'What would you like to accomplish?',
				choices: [
					'View All Departments',
					'View All Roles',
					'View All Employees',
					'Add a Department',
					'Add a Role',
					'Add an Employee',
					'Update Employee Role',
					'Exit Application'
				]
			}
		])
		.then(answers => {
			// console.log(answers);

			// use a switch statement to determine which function to call based on the response (answer)
			switch (answers.options) {
				case 'View All Departments':
					viewAllDepartments();
					break;
				case 'View All Roles':
					viewAllRoles();
					break;
				case 'View All Employees':
					viewAllEmployees();
					break;
				case 'Add a Department':
					addDepartment();
					break;
				case 'Add a Role':
					addRole();
					break;

				case 'Exit Application':
					// close the database connection
					connection.end(err => {
						if (err) throw err;
						console.log('See you again soon...');
					});
			}
		});
}

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

			// display the menu options again
			startApp();
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
			// console.log(fields); // fields contains extra meta data about results, if available

			// display the menu options again
			startApp();
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
			// console.log(fields); // fields contains extra meta data about results, if available

			// display the menu options again
			startApp();
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
				name: 'deptName'
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
					// console.log(fields); // fields contains extra meta data about results, if available

					// display the menu options again
					startApp();
				}
			);
		});
}

// execute the add roles function
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
function addRole() {
	// want will want to create an array where the names of the departments are stored so we can reference the options in the inquirer prompt
	let deptChoices = [];

	// since we will be
	promise
		.createConnection(conProperties)
		.then(db => {
			return Promise.all([db.query('SELECT * FROM departments')]);
		})
		.then(([dept]) => {
			// !need to make this a foreach loop, might be more clean
			for (var i = 0; i < dept.length; i++) {
				deptChoices.push(dept[i].department_name);
			}
			return Promise.all([dept]);
		})
		.then(([dept]) => {
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
					{
						type: 'list',
						name: 'department',
						message: 'Department: ',
						choices: deptChoices
					}
				])
				.then(answers => {
					// Set empty variable to insert the Department ID
					let departmentID;

					// Assign a department ID based on the user input choice
					for (var i = 0; i < dept.length; i++) {
						if (answers.department == dept[i].department_name) {
							departmentID = dept[i].id;
						}
					}

					connection.query(
						'INSERT INTO roles (title, salary, department_id) VALUES (?,?,?);',
						{
							title: answers.role,
							salary: answers.salary,
							department_id: departmentID
						},
						function (err) {
							if (err) throw err;
							console.log(
								`${answers.role} with a salary of $${answers.salary} added successfully!`
							);

							startAPP();
						}
					);
				});
		});
}
