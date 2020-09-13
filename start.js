var mysql = require("mysql");
var inquirer = require("inquirer");

//Connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "employee_db"
});

//Connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  //Run the start function after the connection is made to prompt the user
  console.log("employee_db connected")
  start()
});

connection.query("SELECT * FROM employee; ", function(err) {
    if(err) throw err;
});

function start() {
  inquirer.prompt ({
    message: "Please select an option: ",
    type: "list",
    choices: [
      "View employees",
      "View departments",
      "Add an employee",
      "Add a department",
      "Add a role",
      "Update an employee's role",
      "Exit"
    ],
    name: "choice"
  }).then(answers => {
    console.log(answers.choice);
      switch(answers.choice){
        case "View employees":
          viewEmployees();
          break;
        case "View departments":
          viewDepartments();
          break;
        case "Add an employee":
          addEmployee()
          break;
        case "Add a department":
          createDepartment()
          break;
        case "Add a role":
          createRole()
          break;
        case "Update an employee's role":
          updateRole()
          break;
        case "Exit":
          connection.end();
          default:
            break;
      }
  });
}

function viewEmployees() {
  connection.query("SELECT * FROM employee", function(err, res) {
    if(err) throw err;
    console.table(res)
    start();
  });
}

function viewDepartments() {
  connection.query("SELECT * FROM department", function(err, res) {
    if(err) throw err;
    console.table(res)
    start();
  });
}

function addEmployee() {
  inquirer.prompt([
    {
      message: "What is the employee's first name?",
      type: "input",
      name: "first_name"
    },
    {
      message: "What is the employee's last name?",
      type: "input",
      name: "last_name"
    },
    {
      message: "What is the employee's role ID?",
      type: "number",
      name: "role_id"
    },
    {
      message: "What is the employee's manager ID?",
      type: "number",
      name: "manager_id"
    }
  ]).then(function(res) {
    connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.first_name, res.last_name, res.role_id, res.manager_id], function(err, res) {
      if(err) throw err;
      console.log("Employee added!");
      start();
    })
  });
}

function createDepartment() {
  inquirer.prompt([
    {
      message: 'What is the name of the new department?',
      type: "input",
      name: "department"
    },
  ]).then(function(res) {
    connection.query("INSERT INTO department(name) VALUES(?)", [res.department], function(err, res) {
      if(err) throw err;
      console.log("Department created!");
      start();
    })
  });
}

function createRole() {
  inquirer.prompt ([
    {
      message: "What is the job title?",
      type: "input",
      name: "jobTitle"
    },
    {
      message: "What is the job's salary?",
      type: "number",
      name: "salary"
    },
    {
      message: "What is the department ID?",
      type: "number",
      name: "department_id"
    }
  ]).then(function(res) {
    connection.query("INSERT INTO role (title, salary, department_id) values (?, ?, ?)", [res.jobTitle, res.salary, res.department_id], function(err, res) {
      if (err) throw err;
      console.log("Job created!");
      start();
    })
  });
}

function updateRole() {
  inquirer.prompt([
    {
      message: "Which employee would you like to update?",
      type: "input",
      name: "name"
    },
    {
      message: "What is the new role ID?",
      type: "number",
      name: "role_id"
    }
  ]).then(function(res) {
    connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [res.role_id, res.name], function(err, res) {
      console.log(res);
      start();
    })
  })
}