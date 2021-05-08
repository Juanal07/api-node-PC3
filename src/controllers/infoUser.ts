import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../database";

async function infoUser(req: any, res: any) {
    try {
        const id = await jwt.verify(req.token, "secret");
        console.log("id usuario es: ", id);
        const idUser = (<any>id).db_idUser;
        console.log(idUser);
        const sqlQuery = "SELECT name, email FROM user WHERE idUser = ?";
        const result = await pool.query(sqlQuery, idUser);
        const name = result[0]["name"];
        const email = result[0]["email"];
        // const name = "pedro";
        // const email = "asdf@gmail.com";
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
}

async function changeData(req: any, res: any) {
    try {
        const { name, email } = req.body;
        console.log(name);
        const id = await jwt.verify(req.token, "secret");
        console.log("id usuario es: ", id);
        const idUser = (<any>id).db_idUser;
        console.log(idUser);
        const sqlQuery = "UPDATE user SET name = ?, email = ? WHERE idUser = ?";
        await pool.query(sqlQuery, [name, email, idUser]);
        console.log("actualizado");
        res.json({
            status: 200,
            data: {},
        });
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

export default { changeData, infoUser };
