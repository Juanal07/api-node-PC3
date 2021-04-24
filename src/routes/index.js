const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const pool = require("../database");

router.get("/", (req, res) => {
	res.send("Hello world!");
});

router.get("/api/users", async function (req, res) {
	try {
		const sqlQuery = "SELECT * FROM user";
		const rows = await pool.query(sqlQuery);
		console.log(rows);
		res.status(200).json(rows);
	} catch (err) {
		console.log(err);
		res.status(400).send(error.message);
	}
	// res.status(200).json(rows);
});

router.post("/api/register", async function (req, res) {
	// TODO: hacer la logica del registro
	// try {
	// 	const { email, password } = req.body;
	// 	const sqlQuery = "SELECT password FROM user WHERE email = ?";
	// 	const result = await pool.query(sqlQuery, [email]);
	// 	console.log(result[0].password);
	// 	const ddbb_psw = result[0].password;
	// 	if (ddbb_psw === password) {
	// 		console.log("autenfificado");
	// 	}
	// 	res.status(200).json({ msg: "autenfificado" });
	// } catch (err) {
	// 	console.log(err);
	// 	res.status(400).send(error.message);
	// }
});

router.post("/api/login", async function (req, res) {
	try {
		const { email, password } = req.body;
		const sqlQuery = "SELECT password FROM user WHERE email = ?";
		const result = await pool.query(sqlQuery, [email]);
		console.log(result[0].password);
		const ddbb_psw = result[0].password;
		const sha256Hasher = crypto.createHmac("sha256", password);
		const hashed_psw = sha256Hasher.update(password).digest("hex");
		console.log(hashed_psw);
		if (ddbb_psw === password) {
			console.log("autenfificado");
			// SEND TOKEN
			res.status(200).json({ msg: "autenfificado" });
		} else {
			res.status(200).json({ msg: "NO autenfificado" });
		}
	} catch (err) {
		console.log(err);
		res.status(400).send(error.message);
	}
});

module.exports = router;

