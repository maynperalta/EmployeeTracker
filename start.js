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
    name: "choice",
    choices: [
      "View employees",
      "View departments",
      "View managers",
      "Add an employee",
      "Remove an employee",
      "Add a department",
      "Remove a department",
      "Add a role",
      "Remove a role",
      "Update an employee's role",
      "Exit"
    ]
  }).then(answer => {
      switch(answer.choice) {
        case "View employees":
          viewEmployees();
          break;
        case "View departments":
          viewDepartments();
          break;
        case "View managers":
          viewManagers();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Remove an employee":
          deleteEmployee();
          break;
        case "Add a department":
          createDepartment();
          break;
        case "Remove a department":
          deleteDepartmment();
          break;
        case "Add a role":
          createRole();
          break;
        case "Remove a role":
          deleteRole();
          break;
        case "Update an employee's role":
          updateRole();
          break;
        case "Exit":
          connection.end();
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

function viewManagers() {
  let query = `SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager, department.name AS department, employee.id, employee.first_name, employee.last_name, role.title FROM employee LEFT JOIN employee manager on manager.id = employee.manager_id INNER JOIN role ON (role.id = employee.role_id && employee.manager_id != 'NULL') INNER JOIN department ON (department.id = role.department_id) ORDER BY manager;`;
  connection.query(query, (err, res) => {
    console.log("Employees by manager:");
    console.table(res);
    start();
  })
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
    connection.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [res.first_name, res.last_name, res.role_id, res.manager_id], function(err) {
      if(err) throw err;
      console.log(`Employee ${res.first_name} ${res.last_name} added to roster!`);
      start();
    })
  });
}

function deleteEmployee() {
  inquirer.prompt([
    {
      message: "What is the employee's first name?",
      type: "input",
      name: "firstName"
    },
    {
      message: "What is the employee's last name?",
      type: "input",
      name: "lastName"
    }
  ]).then(function(res) {
      connection.query("DELETE FROM employee WHERE first_name = ? and last_name = ?", [res.firstName, res.lastName], function(err) {
        if(err) throw err;
        console.log(`Removed employee ${res.firstName} ${res.lastName} from roster.`)
        start();
      })
  })
}

function createDepartment() {
  inquirer.prompt([
    {
      message: 'What is the name of the new department?',
      type: "input",
      name: "department"
    }
  ]).then(function(res) {
    connection.query("INSERT INTO department(name) VALUES(?)", [res.department], function(err) {
      if(err) throw err;
      console.log(`${res.department} department created!`);
      start();
    })
  });
}

function deleteDepartmment() {
  inquirer.prompt([
    {
      message: "What is the department's name?",
      type: "input",
      name: "department"
    }
  ]).then(function(res) {
    connection.query("DELETE FROM department WHERE name = ?", [res.department], function(err) {
      if(err) throw err;
      console.log(`Removed department: ${res.department}.`);
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
    connection.query("INSERT INTO role (title, salary, department_id) values (?, ?, ?)", [res.jobTitle, res.salary, res.department_id], function(err) {
      if (err) throw err;
      console.log("Job created!");
      start();
    })
  });
}

function deleteRole() {
  inquirer.prompt([
    {
      message: "What is the role you wish to remove?",
      type: "input",
      name: "role"
    }
  ]).then(function(res) {
    connection.query("DELETE FROM role WHERE title = ?", [res.role], function(err) {
      if (err) throw err;
      console.log(`Role ${res.role} removed.`);
      start();
    })
  })
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
    connection.query("UPDATE employee SET role_id = ? WHERE first_name = ?", [res.role_id, res.name], function(err) {
      if(err) throw err;
      console.log(`${res.name}'s role has been updated.`);
      start();
    })
  })
}