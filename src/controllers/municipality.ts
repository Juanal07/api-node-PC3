import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../database";
import middleware from "../middlewares/middleware";
import { spawn } from "child_process";
const path = require("path");

async function municipality(req: any, res: any) {
    try {
        //const { nombreMunicipio } = req.body;
        //const sqlQuery = "SELECT * FROM municipality where name = ?";
        const sqlQuery = "SELECT * FROM municipality LIMIT 10";
        //const result = await pool.query(sqlQuery, [nombreMunicipio]);
        const rows = await pool.query(sqlQuery);
        //console.log(result);
        //res.status(200).json(result);
        res.status(200).json(rows[0]);
    } catch (err) {
        console.log("Error al obtener municipio", err);
        res.status(400).send(err);
    }
}

function runScript() {
    return spawn("python", [
        "-u",
        path.join(__dirname, "../scrapers/ws_noticias.py"),
    ]);
}
async function scrapings(req: any, res: any) {
    try {
        console.log("hoooola");
        const { idMunicipality } = req.body;
        console.log(idMunicipality);
        const sqlQuery = "SELECT * FROM municipality WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        const nombre = result[0].name;
        console.log(nombre);

        const subprocess = spawn("python", [
            "-u",
            path.join(__dirname, "../../scrapers/ws_noticias.py"),
            nombre,
        ]);
        // print output of script
        subprocess.stdout.on("data", (data) => {
            console.log(`data:${data}`);
            res.send(data);
        });
        subprocess.stderr.on("data", (data) => {
            console.log(`error:${data}`);
        });
        subprocess.stderr.on("close", () => {
            console.log("Closed");
        });
        // res.status(200).json(result[0]);

        // const pythonProcess = spawn("python", ["../scrapers/ws_noticias.py"]);
        // pythonProcess.stdout.on("data", (data) => {
        //     res.send(data);
        // });
    } catch (err) {
        console.log("Error al obtener municipio", err);
        res.status(400).send(err);
    }
}
export default { municipality, scrapings };
