const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const menu = require('./assets/js/menu');
// const { establishConnection } = require('./assets/js/connection'); //do not use this right now, working on a way to reduce the cloudiness of this file
// const viewAllDepartments = require('./assets/queries/departments');

// create the connection to database
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'user',
	password: 'dolphinsarecool',
	database: 'employee_tracker'
});
// establishConnection(); //do not use this right now, working on a way to reduce the cloudiness of this file

// return the connection id (threadID) for the connection to the database or throw an error if there was an issue
// this can also be used to start the application by calling a function that will return all employees before the inquire prompt starts or simply present them with a menu
// reference: https://github.com/mysqljs/mysql#establishing-connections
connection.connect(err => {
	if (err) throw err;
	console.log('connected as id ' + connection.threadId + '\n');
	startApp();
});

// here we will start the application by executing the called funtion from the established connection above
/* look into MySQL2's documentation (Using Promise Wrapper) to make your queries asynchronous - https://www.npmjs.com/package/mysql2#api-and-configuration
----------------------  ^^reccomendation comes from the challenge^^ ---------------------- */
async function startApp() {
	console.log('\n** Options Menu **\n');

	let answer = await inquirer.prompt(menu);
	// console.log(answers);

	// use a switch statement to determine which function to call based on the response (answer)
	switch (answer.options) {
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
				console.log('Bye');
			});
	}
}

// execute the view all departments function
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
function viewAllDepartments() {
	// this is a variable assigned to the query that will run against the database that a connection has been established between
	// modify this query to modify the results, but also update the queries.sql file to ensure ease of access to all queries used
	const sql =
		'SELECT departments.department_id AS ID, departments.department_name AS Department from departments';

	connection.query(sql, [], (err, res) => {
		// console.log('got here'); // use this if you run into an error and need to see if the application is making it to this point in the code
		if (err) throw err;
		console.log('\n** Departments **\n');
		console.table(res); // results contains rows returned by server
		// console.log(fields); // fields contains extra meta data about results, if available

		// display the menu options again
		startApp();
	});
}

// execute the view all roles function
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
function viewAllRoles() {
	// this is a variable assigned to the query that will run against the database that a connection has been established between
	// modify this query to modify the results, but also update the queries.sql file to ensure ease of access to all queries used
	const sql =
		'SELECT roles.roles_id AS ID, roles.title AS Title, roles.salary AS Salary, departments.department_name AS Department FROM roles LEFT JOIN departments ON roles.department_id = departments.department_id ORDER BY roles_id ASC';
	connection.query(sql, [], (err, res) => {
		// console.log('got here'); // use this if you run into an error and need to see if the application is making it to this point in the code
		if (err) throw err;
		console.log('\n** Roles **\n');
		console.table(res); // results contains rows returned by server
		// console.log(fields); // fields contains extra meta data about results, if available

		// display the menu options again
		startApp();
	});
}

// execute the view all employees function
// WHEN I choose to view all employees THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
function viewAllEmployees() {
	// this is a variable assigned to the query that will run against the database that a connection has been established between
	// modify this query to modify the results, but also update the queries.sql file to ensure ease of access to all queries used
	const sql =
		'SELECT employees.emp_id, employees.first_name, employees.last_name, roles.title, departments.department_name AS department, roles.salary, CONCAT(e.first_name, " ", e.last_name) AS manager FROM employees INNER JOIN roles ON (employees.roles_id = roles.roles_id) INNER JOIN departments ON roles.department_id = departments.department_id LEFT JOIN employees AS e ON employees.manager_id = e.emp_id ORDER BY emp_id ASC';
	connection.query(sql, [], (err, res) => {
		// console.log('got here'); // use this if you run into an error and need to see if the application is making it to this point in the code
		if (err) throw err;
		console.log('\n** Employees **\n');
		console.table(res); // results contains rows returned by server
		// console.log(fields); // fields contains extra meta data about results, if available

		// display the menu options again
		startApp();
	});
}

// execute the add a department function
async function addDepartment() {
	// if the end user chooses to add a department, we need to ask them what the name of the department is...
	let qPrompt = [
		{
			type: 'input',
			message: 'Department Name: ',
			name: 'deptName'
		}
	];
	const answer = await inquirer.prompt(qPrompt);
	// this is a variable assigned to the query that will run against the database that a connection has been established between
	// modify this query to modify the results, but also update the queries.sql file to ensure ease of access to all queries used
	let sql = 'INSERT INTO departments (department_name) VALUES (?)';
	connection.query(sql, answer.deptName, (err, res) => {
		// console.log('got here'); // use this if you run into an error and need to see if the application is making it to this point in the code
		if (err) throw err;
		console.log(`${answer.deptName} added to Departments!`);
		// console.log(fields); // fields contains extra meta data about results, if available

		// display the menu options again
		startApp();
	});
}
