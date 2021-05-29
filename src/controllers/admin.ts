import { pool } from "../database";


async function getUsers(req: any, res: any) {
    try {
        const sqlQuery =
            "SELECT name FROM user where admin=0";
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
        const { idUser } = req.body;
        
        const sqlQuery = "SELECT name, email, dateSignIn FROM user WHERE idUser = ?";
        const result = await pool.query(sqlQuery, idUser);
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
        const idUser = req.body.idUser;
        
        const sqlQuery = "delete from user where idUser=?";
        const result = await pool.query(sqlQuery, [idUser]);
        console.log(result)

        
        res.status(200).json({ 
            status:200, 
            
        });   
    } catch (err) {
        console.log(err);
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

//Municipios mas buscados


export default {
    getUsers,
    user,
    deleteUser,
    RegisterMes,

};