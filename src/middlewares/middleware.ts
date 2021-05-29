import jwt from "jsonwebtoken";

async function verifyAdmin(req: any, res: any, next: any) {
    const {idUser} = req.body;
    console.log("idUser "+idUser);
    if(idUser!=43){
        console.log("Error");
        res.status(400).send();
    }else{
        next();
    }
    
}

// Authorization: Bearer <token>
async function verifyToken(req: any, res: any, next: any) {
    console.log("...Verificando Token...");
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        await jwt.verify(req.token, "secret", (error: any, authData: any) => {
            if (error) {
                req.body.idUser = null;
                console.log("Token invalido");
                next();
            } else {
                req.body.idUser = authData.db_idUser;
                console.log("Token verificado");
                next();
            }
        });
    } else {
        req.body.idUser = null;
        console.log("No hay token");
        next();
    }
}

export default { verifyToken, verifyAdmin };
