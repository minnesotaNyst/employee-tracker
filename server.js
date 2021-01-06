const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection to database
const connection = mysql.createConnection({
	host: 'localhost',
	// port: 3005,
	user: 'user',
	// password: 'dolphinsarecool',
	database: 'employee_tracker'
});

// simple query
connection.query(
	'SELECT * FROM roles WHERE roles_id = 1',
	function (err, res, fields) {
		console.table(res); // results contains rows returned by server
		console.log(fields); // fields contains extra meta data about results, if available
	}
);
