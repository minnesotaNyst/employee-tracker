DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS employees;

--*is there a standard order to create the db tables? it appears that we should be creating smaller tables first OR we should be creating the tables that do not have an foreign keys... 

CREATE TABLE IF NOT EXISTS departments(
    id INT AUTO_INCREMENT PRIMARY KEY,
    department_name VARCHAR(30) NOT NULL
);

CREATE TABLE IF NOT EXISTS roles(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    -- the DECIMAL data type references the number of digits and how many can be a decimal place
    salary DECIMAL(8,2),
    department_id INT NOT NULL
);

CREATE TABLE IF NOT EXISTS employees(
   id INT AUTO_INCREMENT PRIMARY KEY,
   first_name VARCHAR(30) NOT NULL,
   last_name VARCHAR(30) NOT NULL,
   role_id INT NOT NULL,
   manager_id INT NOT NULL
);