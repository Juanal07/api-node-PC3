import express from "express";
import auth from "../controllers/auth";
import municipality from "../controllers/municipality";
import infoUser from "../controllers/infoUser";
// import community from "../controllers/community";
import middleware from "../middlewares/middleware";

const router = express.Router();

router.get("/", async function (req: any, res: any) {
    res.send("Hello Mundo!");
});

router.post("/api/login", auth.login);
router.post("/api/register", auth.register);

router.post("/api/scrapings", municipality.scrapings);

router.post("/api/profile", middleware.verifyToken, infoUser.infoUser);

module.exports = router;
