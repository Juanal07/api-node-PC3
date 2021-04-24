const express = require("express");
const connection = require('./connection')
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const app = express();

app.use(express.json());
/* var corsOptions = {
	origin: "http://localhost:8080",
}; */


app.use(cors());
app.set("port", process.env.PORT || 8080);

app.get("/", (req, res) => {
    res.send("Hi!");
});

app.post("/api/login", async (req, res) => {
    console.log("Se va a registrar un usuario");
    console.log("Usuario: ", req.body.email);
    console.log("Contraseña: ", req.body.password);
	const email = req.body.email;
    const secret = "This is a company secret 🤫";
    const sha256Hasher = crypto.createHmac("sha256", secret);
    const hash = sha256Hasher.update(req.body.password).digest("hex");
    console.log("Contraseña hasheada:", hash);
	const psw = await connection.query("SELECT password FROM user WHERE email= ?", [email]);
	console.log(psw);
    console.log("JSON Web Token de la contraseña:", bcrypt.hashSync(req.body.password, 10));
    // TODO: insert en tabla usuario de la bbdd para luego comparalo con el token

    // if (psw == login(req.body.email)) {
    // 	res.send("OK");
    // }
    res.send("alvarito");
});

app.listen(app.get("port"), () => {
    console.log("Server listening on port", app.get("port"));
});


/*----------------------------------------------------------------
const mariadb = require("mariadb");

const pool = mariadb.createPool({
    host: "2.139.176.212",
    user: "pr_softlusion",
    password: "Softlusion",
    database: "prsoftlusion"
});

async function main() {
    try {
        let conn = await pool.getConnection();
        let rows = await conn.query("SELECT * FROM user");
        // console.log(`Consulta: ${rows[0]}`);
        console.log(rows);
    } catch (err) {
        console.log("query incorrecta");
    }

}

async function login(email) {
    try {
        let conn = await pool.getConnection();
        let rows = await conn.query(
            "SELECT password FROM user WHERE email=" + email + ";"
        );
        // console.log(`Consulta: ${rows[0]}`);
        console.log(rows);
    } catch (err) {
        console.log(err);
    }
}
main();*/
