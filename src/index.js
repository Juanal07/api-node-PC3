const express = require("express");
// const bodyParser = require("body-parser");
// const crypto = require("crypto");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcrypt");
// const morgan = require("morgan");
// const pool = require("./database");

// initializations
const app = express();

// var corsOptions = {
// 	origin: "http://localhost:8080",
// }; 
// app.use(cors());

// settings
app.set("port", process.env.PORT || 8080);

//middleware para visualizar peticiones
// app.use(morgan("dev"));

// app.use(express.json);

// Global Variables
// app.use((req, res, next) => {
   
// 	next();
// });

// Routes
// app.use(require("./routes"));

app.get('/api', (req, res) =>{
    res.send('Hello you!')
});
// Public

// Starting the server
app.listen(app.get("port"), () => {
	console.log("Server listening on port", app.get("port"));
});

// app.get("/api/users", async (req, res) => {
// 	const users = await pool.query("SELECT * FROM user");
// 	res.json(users);
// });

// app.post("/api/login", (req, res) => {
// 	console.log("Se va a registrar un usuario");
// 	console.log("Usuario: ", req.body.email);
// 	console.log("Contraseña: ", req.body.password);
// 	const email = req.body.email;
// 	const secret = "This is a company secret 🤫";
// 	const sha256Hasher = crypto.createHmac("sha256", secret);
// 	const hash = sha256Hasher.update(req.body.password).digest("hex");
// 	console.log("Contraseña hasheada:", hash);

// 	const sql = "SELECT * FROM user";
// 	connection.query(sql, function (err, results, fields) {
// 		if (err) throw err;

// 		console.log("here are your results", results);
// 	});

// 	// connection.end();
// 	// const psw = connection.then((conn) => {
// 	// 	query("SELECT password FROM user WHERE email= ?", [email]);
// 	// });

// 	// console.log("Contraseña de bbdd: ", psw);
// 	// conn.query("SELECT * FROM user", email, (err, result) => {
// 	// 	console.log(result);
// 	// });
// 	// try {
// 	// 	const psw = await connection.conn.query(
// 	// 		"SELECT password FROM user WHERE email= ?",
// 	// 		[email]
// 	// 	);
// 	// 	// const psw = await connection.query("SELECT password FROM user WHERE email= 'jjrr1307@gmail.com'");
// 	// 	console.log("Contraseña de bbdd: ", psw);
// 	// } catch (err) {
// 	// 	console.log(err);
// 	// }
// 	// console.log("JSON Web Token de la contraseña:", bcrypt.hashSync(req.body.password, 10));
// 	// TODO: insert en tabla usuario de la bbdd para luego comparalo con el token

// 	// if (psw == login(req.body.email)) {
// 	// 	res.send("OK");
// 	// }
// 	res.send("alvarito");
// });
