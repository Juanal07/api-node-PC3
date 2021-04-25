import express from "express";
// const bodyParser = require("body-parser");
const router = express.Router();
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

import { pool } from "../database";

router.get("/", async function (req, res) {
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
		res.status(400).send(err);
	}
	// res.status(200).json(rows);
});

router.post("/api/register", async function (req, res) {
	try {
		const { name, email, password } = req.body;
		const sqlQuery = "SELECT COUNT(email) FROM user WHERE email = ?";
		const result = await pool.query(sqlQuery, [email]);

		console.log(result);
		if (result == 1) {
			res.status(200).json({ result });
		} else {
			res.status(200).json({ result });
		}
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
});

router.post("/api/login", async function (req, res) {
	try {
		const { email, password } = req.body;
		const sqlQuery = "SELECT password FROM user WHERE email = ?";
		const result = await pool.query(sqlQuery, [email]);

		console.log(result[0].password);
		const ddbb_psw = result[0].password;
		const sha256Hasher = crypto.createHmac("sha256", "secreto");
		const hashed_psw = sha256Hasher.digest("hex");
		console.log(hashed_psw);
		console.log("adiosss");
		if (ddbb_psw === password) {
			jwt.sign({ email, password }, "secret", function (err: any, token: any) {
				console.log(token);
				res.json({ token });
			});

			console.log("autenfificado");
			// SEND TOKEN
			// res.status(200).json({ msg: "autenfificado" });
		} else {
			res.status(200).json({ msg: "NO autenfificado" });
		}
	} catch (err) {
		console.log(err);
		res.status(400).send(err);
	}
});

// router.post("/api/post", verifyToken, (req, res) => {
// 	jwt.verify(req.token, "secret", (error: any, authData: any) => {
// 		if (error) {
// 			res.sendStatus(403);
// 		} else {
// 			res.json({
// 				mensaje: "post creado",
// 				authData,
// 			});
// 		}
// 	});
// });

// // Authorization: Bearer <token>
// function verifyToken(req: any, res: any, next: any) {
// 	const bearerHeader = req.headers["authorization"];
// 	if (typeof bearerHeader !== "undefined") {
// 		const bearerToken = bearerHeader.split(" ")[1];
// 		req.token = bearerToken;
// 		next();
// 	} else {
// 		res.sendStatus(403);
// 	}
// }

module.exports = router;
