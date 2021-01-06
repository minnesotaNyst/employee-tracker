// WHEN I start the application
// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role

module.exports = [
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
];
