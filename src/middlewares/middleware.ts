import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Authorization: Bearer <token>
async function verifyToken(req: any, res: any, next: any) {
    const bearerHeader = req.headers["authorization"];
    // console.log(req.headers);
    if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        await jwt.verify(req.token, "secret", (error: any, authData: any) => {
            if (error) {
                // res.sendStatus(403);
                next();
            } else {
                req.idUser = authData.db_idUser;
                next();
            }
        });
    } else {
        // res.sendStatus(403);
        next();
    }
}

export default { verifyToken };
