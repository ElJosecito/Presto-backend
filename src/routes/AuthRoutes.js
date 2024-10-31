import { Router } from "express";
import  AuthController  from "../controllers/AuthController.js";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);
router.post("/auth/validate", AuthController.isAuth);



export default router;