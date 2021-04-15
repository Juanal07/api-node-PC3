const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
const app = express();
// var corsOptions = {
//     origin: "http://localhost:8080"
// };
// app.use(cors(corsOptions));

app.set("port", process.env.PORT || 8080);

app.get("/", (req, res) => {
	res.send("Hi!");
});

app.get("/about", function (req, res) {
	res.send("adiios");
});

app.listen(app.get("port"), () => {
	console.log("Server listening on port", app.get("port"));
});

const mariadb = require("mariadb");

const pool = mariadb.createPool({
	host: "2.139.176.212",
	user: "pr_softlusion",
	password: "Softlusion",
	database: "prsoftlusion",
});

async function main() {
	try {
		let conn = await pool.getConnection();
		let rows = await conn.query("SELECT * FROM user");
		console.log(rows);
	} catch (err) {}
}

main();
