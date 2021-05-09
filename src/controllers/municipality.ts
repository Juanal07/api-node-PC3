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

// function runScript() {
//     return spawn("python", [
//         "-u",
//         path.join(__dirname, "../scrapers/ws_noticias.py"),
//     ]);
// }
async function scrapings(req: any, res: any) {
    try {
        console.log("hoooola");
        const { idMunicipality } = req.body;
        console.log(idMunicipality);
        const sqlQuery = "SELECT * FROM municipality WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        const nombre = result[0].name;
        const provincia = result[0].province;
        console.log(provincia)
        console.log(nombre);

        // const subprocessNoticias = spawn("python", ["scrapers/ws_noticias.py", nombre,]);
        const subprocessSupermercados = spawn("python", ["scrapers/ws_supermercados.py", nombre, provincia]);
        // print output of script
        // subprocessNoticias.stdout.on("data", (data) => {
        //     const texto = '{"data": "' + data;
        //     const texto2 = texto.concat('"}')
        //     console.log(texto2);
        //     const respuesta = JSON.parse(texto2);
        //     res.send(respuesta);
        // });
        subprocessSupermercados.stdout.on("data", (data) => {
            // const texto = '{"data": "' + data;
            // const texto2 = texto.concat('"}')
            // console.log(texto2);
            const respuesta = JSON.parse(data);
            console.log(data)
            res.send(respuesta);
        });
        // subprocess.stderr.on("close", () => {
        //     console.log("Closed");
        // });
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
