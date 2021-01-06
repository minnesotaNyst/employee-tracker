// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database

module.exports = [
	{
		type: 'input',
		message: 'Department Name: ',
		name: 'deptName'
	}
];
