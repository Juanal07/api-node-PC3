import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../database";
// const router = express.Router();

async function register(req: any, res: any) {
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
}

async function login(req: any, res: any) {
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
            const sqlQuery =
                "INSERT INTO log (login, logout, idUser) VALUES(NOW(),NULL,?)";
            await pool.query(sqlQuery, [db_idUser]);
            const token = await jwt.sign({ db_idUser }, "secret", {
                expiresIn: "30m",
            });
            res.status(200).json({
                status: 200,
                data: { name: db_name, token, db_idUser },
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
}

async function endSession(req: any, res: any) {
    try {
        console.log("HOLAA");
        const { idUser } = req.body;
        const sqlQuery =
            "UPDATE log SET logout = NOW() WHERE idUser = ? ORDER BY idLog DESC LIMIT 1";
        //UPDATE log SET logout = NOW() WHERE idUser = ?
        //UPDATE log SET logout = NOW() WHERE idUser = 7 ORDER BY idLog DESC LIMIT 1
        await pool.query(sqlQuery, [idUser]);
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

export default { register, login, endSession };

// module.exports = { login };
