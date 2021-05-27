import express from "express";

import auth from "../controllers/auth";
import municipality from "../controllers/municipality";
import profile from "../controllers/profile";
import admin from "../controllers/admin";

// import community from "../controllers/community";

import middleware from "../middlewares/middleware";

const router = express.Router();

router.get("/", async function (req: any, res: any) {
    res.send("Hello Mundo!");
});

router.post("/api/auth/login", auth.login);
router.post("/api/auth/register", auth.register);
router.post("/api/auth/endSession", middleware.verifyToken, auth.endSession );

router.get("/api/municipality/listVillages", municipality.listaPueblos);
router.post(
    "/api/municipality/busqueda",
    middleware.verifyToken,
    municipality.busqueda
);
router.post("/api/municipality/infoPueblo", municipality.infoPueblo);
router.post("/api/municipality/stations", municipality.estaciones);
router.post("/api/municipality/medicalcenters", municipality.centrosMedicos);
router.post("/api/municipality/supermarkets", municipality.supermercados);
router.post("/api/municipality/restaurants", municipality.restaurantes);
router.post("/api/municipality/news", municipality.noticias);

router.post("/api/profile/infoUser", middleware.verifyToken, profile.infoUser);
router.post(
    "/api/profile/changeData",
    middleware.verifyToken,
    profile.changeData
);
router.post(
    "/api/profile/changePsw",
    middleware.verifyToken,
    profile.changePsw
);

router.get("/api/admin/user-all", admin.getUsers);
router.post("/api/admin/user", admin.user);
router.post("/api/admin/deleteUser", admin.deleteUser);
router.get("/api/admin/RegisterMes", admin.RegisterMes);



// router.post("/api/community", middleware.verifyToken, profile.community);

module.exports = router;
