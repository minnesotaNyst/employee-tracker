// ******* DEPENDENCIES ******* \\
const inquirer = require('inquirer');
const menu = require('./assets/js/menu');
const ops = require('./assets/js/ops');

// let us get the party started...
function startApp() {
	console.log('\n** Options Menu **\n');

	inquirer.prompt(menu).then(answers => {
		// use a switch statement to determine which function to call based on the response (answer)
		switch (answers.options) {
			case 'View All Departments':
				ops.viewAllDepartments();
				startApp();
				break;
			case 'View All Roles':
				ops.viewAllRoles();
				startApp();
				break;
			case 'View All Employees':
				ops.viewAllEmployees();
				startApp();
				break;
			case 'Add a Department':
				ops.addDepartment();
				viewAllDepartments();
				break;
			case 'Add a Role':
				ops.addRole();
				viewAllRoles();
				break;
			case 'Add an Employee':
				ops.addEmployee();
				viewAllEmployees();
				break;
			case 'Update Employee Role':
				ops.updateEmployee();
				viewAllEmployees();
				break;

			case 'Exit Application':
				ops.endApp();
				break;
			// close the database connection
		}
	});
}

startApp();
