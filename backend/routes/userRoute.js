import express from "express";
import {register, login, logout, me, refreshToken} from "../controllers/userController.js";
import { authenticate } from "../middleware/authenticate.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, me);

export default router;