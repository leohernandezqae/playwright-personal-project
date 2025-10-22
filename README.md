Node.js + Express + SQLite MVC with Sequelize CLI

1. Install dependencies
npm install express body-parser sequelize sqlite3
npm install --save-dev sequelize-cli


Dependencies: express, body-parser, sequelize, sqlite3

Dev dependencies: sequelize-cli

2. Initialize Sequelize CLI
npx sequelize-cli init


This creates the default folders:

config/
models/
migrations/
seeders/


config/config.json → DB configs for dev/test/prod

models/index.js → auto-load models

migrations/ → store migration files

seeders/ → store seed files

3. Configure SQLite

Edit config/config.json:

{
  "development": {
    "dialect": "sqlite",
    "storage": "userdb.sqlite"
  },
  "test": {
    "dialect": "sqlite",
    "storage": "userdb_test.sqlite"
  },
  "production": {
    "dialect": "sqlite",
    "storage": "userdb.sqlite"
  }
}

4. Create User model & migration
npx sequelize-cli model:generate --name User --attributes cpf:string,firstName:string,lastName:string,birthDate:date,occupation:string,salary:decimal


Edit the generated migration file (migrations/XXXXXXXX-create-user.js) to set required fields and constraints:

await queryInterface.createTable('Users', {
  id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
  cpf: { type: Sequelize.STRING, allowNull: false, unique: true },
  firstName: { type: Sequelize.STRING, allowNull: false },
  lastName: { type: Sequelize.STRING, allowNull: false },
  birthDate: { type: Sequelize.DATE, allowNull: false },
  occupation: { type: Sequelize.STRING, allowNull: false },
  salary: { type: Sequelize.DECIMAL(12,2), allowNull: false },
  createdAt: { allowNull: false, type: Sequelize.DATE },
  updatedAt: { allowNull: false, type: Sequelize.DATE }
});

5. Run migration
npx sequelize-cli db:migrate


Creates Users table in userdb.sqlite.

6. Create Seeder for Demo User
npx sequelize-cli seed:generate --name demo-user


Edit the generated seeder (seeders/XXXXXXXX-demo-user.js):

'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Users', [{
      cpf: "33750650004",
      firstName: "Usuario",
      lastName: "Teste",
      birthDate: new Date("1990-05-20"),
      occupation: "Software Engineer",
      salary: 12000.50,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};


Run the seeder:

npx sequelize-cli db:seed:all

7. Project Structure (MVC + Sequelize CLI)
project/
 ├─ config/
 │   └─ config.json
 ├─ controllers/
 │   └─ userController.js
 ├─ models/
 │   ├─ index.js
 │   └─ user.js
 ├─ migrations/
 │   └─ XXXXX-create-user.js
 ├─ seeders/
 │   └─ XXXXX-demo-user.js
 ├─ routes/
 │   └─ userRoutes.js
 ├─ public/
 │   └─ index.html   ← frontend
 ├─ index.js         ← API entry point
 └─ package.json

8. User Controller (controllers/userController.js)
const User = require("../models").User;

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.findAll();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

exports.updateUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  try {
    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  await user.destroy();
  res.status(204).end();
};

9. User Routes (routes/userRoutes.js)
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;

10. Main Server (index.js)
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = 3000;

app.use(bodyParser.json());

// Serve frontend
app.use(express.static(path.join(__dirname, "public")));

// API Routes
app.use("/users", userRoutes);

// Start server
app.listen(port, () => {
  console.log(`🚀 MVC API + Frontend running at http://localhost:${port}`);
});

11. Frontend

Keep your public/index.html from before. It will continue to work with /users API endpoints.

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>User Management</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 20px; }
    h1 { color: #333; }
    form { margin-bottom: 20px; }
    input, button { margin: 5px; padding: 8px; }
    table { border-collapse: collapse; width: 100%; margin-top: 20px; }
    th, td { border: 1px solid #ccc; padding: 10px; text-align: left; }
    th { background: #f4f4f4; }
    .actions button { margin-right: 5px; }
  </style>
</head>
<body>
  <h1>User Management</h1>

  <form id="userForm">
    <input type="hidden" id="userId">
    <input type="text" id="cpf" placeholder="CPF" required>
    <input type="text" id="firstName" placeholder="First Name" required>
    <input type="text" id="lastName" placeholder="Last Name" required>
    <input type="date" id="birthDate" required>
    <input type="text" id="occupation" placeholder="Occupation" required>
    <input type="number" step="0.01" id="salary" placeholder="Salary" required>
    <button type="submit">Save User</button>
  </form>

  <table>
    <thead>
      <tr>
        <th>ID</th>
        <th>CPF</th>
        <th>Name</th>
        <th>Birth Date</th>
        <th>Occupation</th>
        <th>Salary</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody id="userTable"></tbody>
  </table>

  <script>
    const API_URL = "/users";

    const userForm = document.getElementById("userForm");
    const userTable = document.getElementById("userTable");

    async function fetchUsers() {
      const res = await fetch(API_URL);
      const users = await res.json();
      userTable.innerHTML = "";
      users.forEach(user => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${user.id}</td>
          <td>${user.cpf}</td>
          <td>${user.firstName} ${user.lastName}</td>
          <td>${new Date(user.birthDate).toLocaleDateString()}</td>
          <td>${user.occupation}</td>
          <td>${user.salary}</td>
          <td class="actions">
            <button onclick="editUser(${user.id})">Edit</button>
            <button onclick="deleteUser(${user.id})">Delete</button>
          </td>
        `;
        userTable.appendChild(tr);
      });
    }

    userForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("userId").value;
      const user = {
        cpf: document.getElementById("cpf").value,
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        birthDate: document.getElementById("birthDate").value,
        occupation: document.getElementById("occupation").value,
        salary: document.getElementById("salary").value
      };

      if (id) {
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user)
        });
      }

      userForm.reset();
      fetchUsers();
    });

    async function editUser(id) {
      const res = await fetch(`${API_URL}/${id}`);
      const user = await res.json();
      document.getElementById("userId").value = user.id;
      document.getElementById("cpf").value = user.cpf;
      document.getElementById("firstName").value = user.firstName;
      document.getElementById("lastName").value = user.lastName;
      document.getElementById("birthDate").value = user.birthDate.split("T")[0];
      document.getElementById("occupation").value = user.occupation;
      document.getElementById("salary").value = user.salary;
    }

    async function deleteUser(id) {
      if (confirm("Are you sure you want to delete this user?")) {
        await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        fetchUsers();
      }
    }

    fetchUsers();
  </script>
</body>
</html>
