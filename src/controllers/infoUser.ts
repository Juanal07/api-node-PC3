import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../database";

async function infoUser(req: any, res: any) {
    try {
        const { idUser } = req.body;
        console.log(idUser);
        if (idUser == "unverified") {
            console.log(idUser);
            res.status(403).send();
        } else {
            const sqlQuery = "SELECT name, email FROM user WHERE idUser = ?";
            const result = await pool.query(sqlQuery, idUser);
            const name = result[0]["name"];
            const email = result[0]["email"];
            res.json({
                status: 200,
                data: {
                    name,
                    email,
                },
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

async function changeData(req: any, res: any) {
    try {
        const { name, email, idUser } = req.body;
        if (idUser == "unverified") {
            console.log(idUser);
            res.status(403).send();
        } else {
            const sqlQuery =
                "UPDATE user SET name = ?, email = ? WHERE idUser = ?";
            await pool.query(sqlQuery, [name, email, idUser]);
            console.log("actualizado");
            res.json({
                status: 200,
                data: {},
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

export default { changeData, infoUser };
