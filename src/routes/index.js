const express = require('express');
const router = express.Router();

const pool = require("../database");

router.get('/api', (req, res) => {
  res.send('Hello world!');
});

router.get('/login', (req, res) => {
  res.send('HOLLLAAAA');
});

router.get("/api/users", async (req, res) => {
	console.log('asdfa');
	const users = await pool.query('SELECT * FROM user');
	console.log(users);
	res.json(users);
});

module.exports = router;
