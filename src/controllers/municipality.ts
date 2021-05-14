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

async function infoPueblo(req: any, res: any){
    try{
        const { idMunicipality } = req.body;
        const sqlQuery = "SELECT * FROM municipality WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        const nombre = result[0].name;
        const escudo = result[0].shield;
        const region = result[0].region;
        const provincia = result[0].province;
        const ccaa = result[0].ccaa;
        const poblacion = result[0].population;
        const superficie = result[0].surface;
        const altitud = result[0].altitude;
        const densidad = result[0].density;
        res.status(200).json({
            status: 200,
            data: { nombre, escudo, region, provincia, ccaa, poblacion, superficie, altitud, densidad},
            });
    } catch (err) {
    console.log("Error al obtener municipio", err);
    res.status(400).send(err);
    }
}

async function estaciones(req: any, res: any){
    try{
        const { idMunicipality } = req.body;
        const sqlQuery = "SELECT name, address, cercanias, feve FROM station WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        // const nombre = result[0].name;
        // const direccion = result[0].address;
        // const cercanias = result[0].cercanias.toString();
        // const feve = result[0].feve.toString();
        // console.log(nombre)
        // console.log(direccion)
        // console.log(cercanias)
        // console.log(feve)
        // console.log(result)
        // res.json(result)
        res.status(200).json({
            status: 200,
            data: result,
            });

    } catch (err) {
    console.log("Error al obtener municipio", err);
    res.status(400).send(err);
    }
}

async function centrosMedicos(req: any, res: any){
    try{
        const { idMunicipality } = req.body;
        const sqlQuery = "SELECT name, type, address FROM medicalcenter WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        console.log(result)
        // res.json(result)
        res.status(200).json({
            status: 200,
            data: result,
            });

    } catch (err) {
    console.log("Error al obtener municipio", err);
    res.status(400).send(err);
    }
}

async function supermercados(req: any, res: any){
    try{
        // console.log("hoooola");
        const { idMunicipality } = req.body;
        // console.log(idMunicipality);
        const sqlQuery = "SELECT * FROM municipality WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        const nombre = result[0].name;
        const provincia = result[0].province;
        const subprocessSupermercados = spawn("python", [
            "scrapers/ws_supermercados.py",
            nombre,
            provincia,
        ]);
        subprocessSupermercados.stdout.on("data", (data) => {
            const respuesta = JSON.parse(data);
            console.log(respuesta);
            res.status(200).json({
                status: 200,
                data: respuesta,
                });
        });

    } catch (err) {
    console.log("Error al obtener municipio", err);
    res.status(400).send(err);
    }
}

async function restaurantes(req: any, res: any){
    try{
        // console.log("hoooola");
        const { idMunicipality } = req.body;
        // console.log(idMunicipality);
        const sqlQuery = "SELECT * FROM municipality WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        const nombre = result[0].name;
        const provincia = result[0].province;
        const subprocessRestaurantes = spawn("python", [
            "scrapers/ws_opiniones.py",
            nombre,
            provincia,
        ]);
        subprocessRestaurantes.stdout.on("data", (data) => {
            const respuesta = JSON.parse(data);
            console.log(respuesta);
            res.status(200).json({
                status: 200,
                data: respuesta,
                });
        });

    } catch (err) {
    console.log("Error al obtener municipio", err);
    res.status(400).send(err);
    }
}

async function noticias(req: any, res: any){
    try{
        // console.log("hoooola");
        const { idMunicipality } = req.body;
        // console.log(idMunicipality);
        const sqlQuery = "SELECT * FROM municipality WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        const nombre = result[0].name;
        // const provincia = result[0].province;
        const subprocessNoticias = spawn("python", [
            "scrapers/ws_noticias.py",
            nombre,
        ]);
        subprocessNoticias.stdout.on("data", (data) => {
            const respuesta = JSON.parse(data);
            console.log(respuesta);
            res.status(200).json({
                status: 200,
                data: respuesta,
                });
        });

    } catch (err) {
    console.log("Error al obtener municipio", err);
    res.status(400).send(err);
    }
}

async function scrapings(req: any, res: any) {
    try {
        // console.log("hoooola");
        const { idMunicipality } = req.body;
        // console.log(idMunicipality);
        const sqlQuery = "SELECT * FROM municipality WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        const nombre = result[0].name;
        const provincia = result[0].province;
        // const nombre = "Mula";
        // const provincia = "murcia";
        // console.log(provincia);
        // console.log(nombre);
        console.log(result[0]);
        var gRes = { data: [] };
        let newData = { p1: "hola" };
        // gRes.data.push(newData);
        // gRes.data.push(result[0]);

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
            // gRes.data.push(respuesta);
            res.json(gRes);
            // res.json(respuesta);
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
export default { municipality, scrapings, infoPueblo, estaciones, centrosMedicos, supermercados, restaurantes, noticias};
