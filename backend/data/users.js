const bcrypt = require("bcryptjs");

const users = [
  {
    name: "Dharvesh",
    email: "dharvesh@example.com",
    password: bcrypt.hashSync("123456", 10),
    isAdmin: true,
  },
  {
    name: "Vishal",
    email: "vishal@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
  {
    name: "Chandan",
    email: "chandan@example.com",
    password: bcrypt.hashSync("123456", 10),
  },
];

module.exports = users;
