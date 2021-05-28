import bcrypt from "bcrypt";
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
        console.log(idUser);
        if (idUser == "unverified") {
            console.log(idUser);
            res.status(403).send();
        } else {
            const sqlQuery =
                "UPDATE user SET name = ?, email = ? WHERE idUser = ?";
            await pool.query(sqlQuery, [name, email, idUser]);
            console.log("actualizado");
            console.log(name);
            res.json({
                status: 200,
                data: { name, email },
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}
async function changePsw(req: any, res: any) {
    try {
        console.log("holaa");
        const { old_psw, new_psw, new_psw2, idUser } = req.body;
        console.log(idUser);
        if (idUser == "unverified") {
            console.log(idUser);
            res.status(403).send();
        } else {
            let sqlQuery = "SELECT password FROM user WHERE idUser = ?";
            let bbdd_psw = await pool.query(sqlQuery, [idUser]);
            const match = await bcrypt.compare(old_psw, bbdd_psw[0].password);

            if (match && new_psw == new_psw2) {
                const encryptedPassword = await bcrypt.hash(new_psw, 10);
                const sqlQuery2 =
                    "UPDATE user SET password = ? WHERE idUser = ?";
                await pool.query(sqlQuery2, [encryptedPassword, idUser]);
                console.log("actualizado");
                res.json({
                    status: 200,
                    data: "actualizada contraseña",
                });
            } else {
                res.json({
                    status: 403,
                    data: "contraseña equivocada",
                });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

async function showSearches(req: any, res: any) {
    try {
        const { idUser } = req.body;
        console.log(idUser);
        if (idUser == null) {
            console.log(idUser);
            res.status(403).send();
        } else {
            const sqlQuery = "SELECT * FROM search WHERE searcher=?";
            const response = await pool.query(sqlQuery, [idUser]);
            console.log("Busquedas: ", response);
            res.json({
                status: 200,
                data: response,
            });
        }
    } catch (err) {
        console.log(err);
        res.status(400).send(err);
    }
}

export default { changeData, infoUser, changePsw, showSearches };
