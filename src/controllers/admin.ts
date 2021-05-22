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
//falta token
async function createUser(req: any, res: any) {
    try {
        const data = req.body;
        // const respuesta = JSON.parse(data);
        const sqlQuery = "INSERT INTO user(name, email, password, active, admin) VALUES (?,?,?,1,0)";
        await pool.query(sqlQuery, [
            [data.name],
            [data.email],
            [data.password],
        ]);
        
        res.status(200).json({ 
            status:200,    
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
//falta  
async function updateUser(req: any, res: any) {
    try {
        
        const data = req.body;
        const sqlQuery = "UPDATE user SET name = ?, email = ?, password = ? WHERE idUser = 28";
        await pool.query(sqlQuery, [
            [data.name],
            [data.email],
            [data.password],
        ]);
        res.status(200).json({ 
            status:200, 
        });   
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

export default {
    getUsers,
    user,
    createUser,
    deleteUser,
    updateUser,
};
