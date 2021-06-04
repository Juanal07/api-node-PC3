import { pool } from "../database";
import { spawn } from "child_process";

async function getUsers(req: any, res: any) {
    try {
        const sqlQuery =
            "SELECT idUser, name, email, dateSignIn FROM user where admin=0";
        const result = await pool.query(sqlQuery);
        console.log(result);
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (err) {
        console.log("Error al obtener los usuarios", err);
        res.status(400).send(err);
    }
}

async function user(req: any, res: any) {
    try {
        // const { idUser } = req.body;
        
        const sqlQuery = "SELECT name, email, dateSignIn FROM user";
        const result = await pool.query(sqlQuery);
        const name = result[0]["name"];
        const email = result[0]["email"];
        const dateSignIn = result[0]["dateSignIn"];
        res.json({
            status: 200,
            data: {
                name,
                email,
                dateSignIn,
            },
        });
        
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}


async function deleteUser(req: any, res: any) {
    try {
        const { idUsuario } = req.body;
        
        const sqlQuery = "UPDATE user SET active = 0 WHERE idUser = ?";
        const result = await pool.query(sqlQuery, [idUsuario]);
        console.log(result)
        
        res.status(200).json({ 
            status:200, 
            
        });   
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

//Poblaciones Escrapeadas
async function muniScrapeados (req: any, res: any) {
    try {
        const sqlQuery =
            "SELECT (particular*100/total) porcentaje FROM (SELECT COUNT(IdMunicipality) total FROM municipality) QUERY_a LEFT JOIN (SELECT COUNT(IdMunicipality) particular FROM search WHERE expDate>NOW())query_b ON (1=1)";
        const result = await pool.query(sqlQuery);
        console.log(result);
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (err) {
        console.log("Error al obtener los usuarios", err);
        res.status(400).send(err);
    }
}

//Usuarios registrados por mes
async function RegisterMes (req: any, res: any) {
    try {
        const sqlQuery =
            "SELECT count(NAME) AS Usuarios, month(dateSignIn) AS Mes FROM user where admin=0 GROUP BY month(dateSignIn)";
        const result = await pool.query(sqlQuery);
        console.log(result);
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (err) {
        console.log("Error al obtener los usuarios", err);
        res.status(400).send(err);
    }
}

//Cuentas en porcentaje de usuarios activadas y desactivadas
async function activosInactivos (req: any, res: any) {
    try {
        const sqlQuery =
            "SELECT (activos*100/total) activos,  (100 - (activos*100/total)) inactivos FROM ((SELECT COUNT(idUser) total FROM user) AS querytotal LEFT JOIN (SELECT COUNT( DISTINCT (idUser))activos FROM log WHERE logout is NULL) AS querylog ON (1=1))";
        const result = await pool.query(sqlQuery);
        console.log(result);
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (err) {
        console.log("Error al obtener los usuarios", err);
        res.status(400).send(err);
    }
}

//rankings de usuarios activos y tiempo total de cada uno 
async function rankingsActivos (req: any, res: any) {
    try {
        const sqlQuery =
            "SELECT user.name, SEC_TO_TIME(SUM(timediff(logout, login))) AS activos " +
            "FROM log INNER JOIN user ON user.idUser=log.idUser GROUP BY log.idUser ORDER BY activos DESC";
        const result = await pool.query(sqlQuery);
        console.log(result);
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (err) {
        console.log("Error al obtener los usuarios", err);
        res.status(400).send(err);
    }
}

//media de horas por dia
async function actividadDiaria (req: any, res: any) {
    try {
        const sqlQuery =
            "(SELECT date(logout) AS fecha,sec_to_time(sum(timeDIFF(logout, login)))as actividadTotal, count(distinct(idUser))as usuariosConectados, sec_to_time(sum(timeDIFF(logout, login)) /COUNT(distinct(idUser))) AS media " +
            "FROM log WHERE logout IS NOT null GROUP BY fecha)";
        const result = await pool.query(sqlQuery);
        console.log(result);
        res.status(200).json({
            status: 200,
            data: result,
        });
    } catch (err) {
        console.log("Error al obtener los usuarios", err);
        res.status(400).send(err);
    }
}
//Municipios mas buscados
async function muniBuscados (req: any, res: any) {
    // const {idUser} = req.body;
    // console.log("idUser "+idUser);
    // if(idUser!=43){
    //     console.log("Error");
    //     res.status(400).send();
        
    // }else{
        try {
            const sqlQuery =
                "SELECT municipality.name, COUNT(search.idMunicipality) AS numBusquedas " +
                "FROM search JOIN municipality ON search.idMunicipality = municipality.idMunicipality GROUP BY search.idMunicipality ORDER BY numBusquedas DESC";
            const result = await pool.query(sqlQuery);
            // console.log(result);
            res.status(200).json({
                status: 200,
                data: result,
            });
        } catch (err) {
            console.log("Error al obtener los usuarios", err);
            res.status(400).send(err);
        }
    // }
}

async function actData(req: any, res: any) {
    try {
        const subprocessNoticias = spawn("python", [
            "scrapers/actData.py"]);
        res.status(200);
    } catch (err) {
        console.log("Error en la ejecución de la actualización", err);
        res.status(400).send(err);
    }
}

export default {
    getUsers,
    user,
    deleteUser,
    muniScrapeados,
    RegisterMes,
    activosInactivos,
    rankingsActivos,
    actividadDiaria,
    muniBuscados,
    actData,

};
