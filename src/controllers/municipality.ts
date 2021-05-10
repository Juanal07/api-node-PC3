import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../database";
import middleware from "../middlewares/middleware";
import { spawn } from "child_process";

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

async function scrapings(req: any, res: any) {
    try {
        console.log("hoooola");
        const { idMunicipality } = req.body;
        console.log(idMunicipality);
        const sqlQuery = "SELECT * FROM municipality WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        const nombre = result[0].name;
        const provincia = result[0].province;
        // const nombre = "Mula";
        // const provincia = "murcia";
        console.log(provincia);
        console.log(nombre);

        const subprocessNoticias = spawn("python", [
            "scrapers/ws_noticias.py",
            nombre,
        ]);
        const subprocessSupermercados = spawn("python", [
            "scrapers/ws_supermercados.py",
            nombre,
            provincia,
        ]);
        const subprocessRestaurantes = spawn("python", [
            "scrapers/ws_opiniones.py",
            nombre,
            provincia,
        ]);
        subprocessNoticias.stdout.on("data", (data) => {
            const respuesta = JSON.parse(data);
            console.log(respuesta);
            // res.send(respuesta);
        });
        subprocessSupermercados.stdout.on("data", (data) => {
            const respuesta = JSON.parse(data);
            console.log(respuesta);
            // res.send(respuesta);
        });
        subprocessRestaurantes.stdout.on("data", (data) => {
            const respuesta = JSON.parse(data);
            console.log(respuesta);
            res.send(respuesta);
        });
        // subprocessNoticias.stderr.on("close", () => {
        //     console.log("Closed");
        // });
        // res.status(200).json(result[0]);
    } catch (err) {
        console.log("Error al obtener municipio", err);
        res.status(400).send(err);
    }
}
export default { municipality, scrapings };
