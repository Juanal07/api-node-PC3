import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../database";
const router = express.Router();

// TODO: encapsular condigo de endpoints a controladores

router.get("/", async function (req, res) {
    res.send("Hello Mundo!");
});

router.get("/api/users", async function (req, res) {
    try {
        const sqlQuery = "SELECT * FROM user";
        const rows = await pool.query(sqlQuery);
        res.status(200).json(rows);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.get("/api/municipio", async function (req, res) {
    try {
        const { nombreMunicipio } = req.body;
        const sqlQuery = "SELECT * FROM municipality where name = ?";
        const result = await pool.query(sqlQuery, [nombreMunicipio]);
        console.log(result);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.post("/api/register", async function (req, res) {
    try {
        const { name, email, password } = req.body;
        const sqlQuery = "SELECT COUNT(email) FROM user WHERE email = ?";
        const result = await pool.query(sqlQuery, [email]);
        const invalidEmail = result[0]["COUNT(email)"];
        if (invalidEmail == 0) {
            const encryptedPassword = await bcrypt.hash(password, 10);
            const sqlQuery2 =
                "INSERT INTO user (name, email, password, active, admin) VALUES (?,?,?,1,0)";
            await pool.query(sqlQuery2, [name, email, encryptedPassword]);
            res.status(200).json({
                status: 200,
                data: { email, password, msg: "registered" },
            });
        } else {
            res.status(403).json({
                status: 403,
                data: { msg: "invalid email" },
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.post("/api/login", async function (req, res) {
    try {
        const { email, password } = req.body;
        const sqlQuery =
            "SELECT idUser, name, password FROM user WHERE email = ?";
        const result = await pool.query(sqlQuery, [email]);
        const db_psw = result[0].password;
        const db_name = result[0].name;
        const db_idUser = result[0].idUser;
        console.log(db_idUser);
        const match = await bcrypt.compare(password, db_psw);
        if (match) {
            const token = await jwt.sign({ db_idUser }, "secret", {
                expiresIn: "30m",
            });
            res.status(200).json({
                status: 200,
                data: { name: db_name, token },
            });
            console.log("autenfificado");
        } else {
            res.status(403).json({
                status: 403,
                data: { msg: "NO autenfificado" },
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.post("/api/profile", verifyToken, async function (req: any, res: any) {
    try {
        let id = jwt.verify(req.token, "secret");
        console.log(id);
        // console.log(id["db_idUser"]);
        const idUser: string = id["db_idUser"];
        const sqlQuery = "SELECT name, email FROM user WHERE idUser = ?";
        const result = await pool.query(sqlQuery, idUser);
        const name = result[0]["name"];
        const email = result[0]["email"];
        console.log(name);

        res.json({
            status: 200,
            data: {
                name,
                email,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
});

router.post("/api/post", verifyToken, async function (req: any, res: any) {
    await jwt.verify(req.token, "secret", (error: any, authData: any) => {
        if (error) {
            res.sendStatus(403);
        } else {
            res.json({
                mensaje: "post creado",
                authData,
            });
        }
    });
});

// Authorization: Bearer <token>
async function verifyToken(req: any, res: any, next: any) {
    const bearerHeader = req.headers["authorization"];
    // console.log(req.headers);
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        await jwt.verify(req.token, "secret", (error: any, authData: any) => {
            if (error) {
                res.sendStatus(403);
            } else {
                next();
            }
        });
    } else {
        res.sendStatus(403);
    }
}

module.exports = router;
