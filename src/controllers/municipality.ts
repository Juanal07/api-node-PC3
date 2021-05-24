import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../database";
import { spawn } from "child_process";

async function listaPueblos(req: any, res: any) {
    try {
        const sqlQuery =
            // "SELECT idMunicipality, name, province FROM municipality";
            "SELECT idMunicipality, name, province FROM municipality";
        const result = await pool.query(sqlQuery);
        // const id = result[0].idMunicipality;
        // const nombre = result[0].name;
        // const provincia = result[0].province;
        console.log(result);
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (err) {
        console.log("Error al obtener municipio", err);
        res.status(400).send(err);
    }
}

//Solucionar

async function busqueda(req: any, res: any) {
    try {
        const { idMunicipality, idUser } = req.body;
        const searchQuery =
            "SELECT * FROM search WHERE idMunicipality = ? and expDate > now() ORDER BY date DESC LIMIT 1";
        const result = await pool.query(searchQuery, [idMunicipality]);
        console.log("Resultado de la consulta: " + result[0]);

        //const idUser = 25;

        if (result[0] == null) {
            console.log("HOLAA", result[0] == null);
            const insertNullQuery =
                "INSERT INTO search (idMunicipality, date, expDate, searcher) VALUES (?, NOW(),DATE_ADD(NOW(),interval 1 week), ?)";
            await pool.query(insertNullQuery, [idMunicipality, idUser]);
            console.log("insertado");
            //Datos de la tabla municipality
            const idSearchConsulta =
                "SELECT idsearch FROM search ORDER BY idSearch DESC LIMIT 1";
            const busqueda = await pool.query(idSearchConsulta);
            console.log(busqueda[0].idsearch);
            // devolver el idSearch
            res.status(200).json({
                status: 206,
                data: { idSearch: busqueda[0].idsearch, idMunicipality },
            });
        } else {
            const idSearch = result[0].idSearch;
            const nRestaurants = result[0].nRestaurants;
            const media = result[0].media;
            const unpopulated = result[0].unpopulated;
            const date = result[0].date;
            const expDate = result[0].expDate;
            const insertQuery =
                "INSERT INTO search (searcher, idMunicipality, nRestaurants, media, unpopulated, date, expDate) VALUES (?,?,?,?,?,now(),?)";
            await pool.query(insertQuery, [
                idUser,
                idMunicipality,
                nRestaurants,
                media,
                unpopulated,
                expDate,
            ]);
            console.log(idSearch);
            //Obtenermos el idSearch de la nueva busqueda
            const newIdSearch =
                "SELECT idSearch FROM search WHERE idMunicipality = ? ORDER BY idSearch DESC LIMIT 1";
            const idNueva = await pool.query(newIdSearch, [idMunicipality]);
            // console.log(idNueva[0])
            const newID = idNueva[0].idSearch;
            console.log(newID);
            //Se actualiza el idSearch de la tabla de supermercados para no duplicar los datos
            const updateSupermarket =
                "UPDATE supermarket SET idSearch = ? WHERE idSearch = ?";
            await pool.query(updateSupermarket, [newID, idSearch]);
            //Datos de la tabla municipality
            const municipio =
                "SELECT * FROM municipality WHERE idMunicipality = ?";
            const municipality = await pool.query(municipio, [idMunicipality]);
            //Datos de la tabla supermarket
            const supermercados =
                "SELECT name, address, distance FROM supermarket WHERE idSearch = ?";
            const supermarkets = await pool.query(supermercados, [newID]);
            //Datos de la tabla station
            const estaciones =
                "SELECT cercanias, name, address FROM station WHERE idMunicipality = ?";
            const stations = await pool.query(estaciones, [idMunicipality]);
            //Datos de la tabla medicalcenter
            const centrosMedicos =
                "SELECT name, type, address FROM medicalcenter WHERE idMunicipality = ?";
            const medicalcenters = await pool.query(centrosMedicos, [
                idMunicipality,
            ]);
            res.status(200).json({
                status: 200,
                data: {
                    name: municipality[0].name,
                    shield: municipality[0].shield,
                    region: municipality[0].region,
                    province: municipality[0].province,
                    ccaa: municipality[0].ccaa,
                    population: municipality[0].population,
                    surface: municipality[0].surface,
                    altitude: municipality[0].altitude,
                    density: municipality[0].density,
                    nRestaurants: nRestaurants,
                    media: media,
                    unpopulated: unpopulated,
                    supermarkets: supermarkets,
                    stations: stations,
                    medicalcenters: medicalcenters,
                },
            });
        }
    } catch (err) {}
}

async function infoPueblo(req: any, res: any) {
    try {
        const { idMunicipality } = req.body;
        const sqlQuery = "SELECT * FROM municipality WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        const name = result[0].name;
        const shield = result[0].shield;
        const region = result[0].region;
        const province = result[0].province;
        const ccaa = result[0].ccaa;
        const population = result[0].population;
        const surface = result[0].surface;
        const altitude = result[0].altitude;
        const density = result[0].density;

        res.status(200).json({
            status: 200,
            data: {
                name,
                shield,
                region,
                province,
                ccaa,
                population,
                surface,
                altitude,
                density,
            },
        });
    } catch (err) {
        console.log("Error al obtener municipio", err);
        res.status(400).send(err);
    }
}

async function estaciones(req: any, res: any) {
    try {
        const { idMunicipality } = req.body;
        const sqlQuery =
            "SELECT name, address, cercanias, feve FROM station WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (err) {
        console.log("Error al obtener municipio", err);
        res.status(400).send(err);
    }
}

async function centrosMedicos(req: any, res: any) {
    try {
        const { idMunicipality } = req.body;
        const sqlQuery =
            "SELECT name, type, address FROM medicalcenter WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        console.log(result);
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (err) {
        console.log("Error al obtener municipio", err);
        res.status(400).send(err);
    }
}

async function supermercados(req: any, res: any) {
    try {
        const { idMunicipality, idSearch } = req.body;
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
            let i;
            for (i = 0; i < respuesta.length; i++) {
                const insertarNoticias =
                    "INSERT INTO supermarket (name, address, distance, idSearch) VALUES(?,?,?,?)";
                pool.query(insertarNoticias, [
                    respuesta[i]["nombre"],
                    respuesta[i]["direccion"],
                    respuesta[i]["distancia"],
                    idSearch,
                ]);
            }
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

async function restaurantes(req: any, res: any) {
    try {
        const { idMunicipality, idSearch } = req.body;
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
            const insertarNoticias =
                "UPDATE search SET media = ?, nRestaurants = ? WHERE idSearch = ?";
            pool.query(insertarNoticias, [
                respuesta["media"],
                respuesta["nRestaurants"],
                idSearch,
            ]);
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

async function noticias(req: any, res: any) {
    try {
        const { idMunicipality, idSearch } = req.body;
        const sqlQuery = "SELECT * FROM municipality WHERE idMunicipality = ?";
        const result = await pool.query(sqlQuery, [idMunicipality]);
        const nombre = result[0].name;
        const subprocessNoticias = spawn("python", [
            "scrapers/ws_noticias.py",
            nombre,
        ]);
        subprocessNoticias.stdout.on("data", (data) => {
            const respuesta = JSON.parse(data);
            console.log(respuesta["populated"]);
            const insertarNoticias =
                "UPDATE search SET unpopulated = ? WHERE idSearch = ?";
            pool.query(insertarNoticias, [respuesta["populated"], idSearch]);

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

export default {
    listaPueblos,
    busqueda,
    infoPueblo,
    estaciones,
    centrosMedicos,
    supermercados,
    restaurantes,
    noticias,
};
