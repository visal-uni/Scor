import express from "express";
import {requestCode, verifyCode, } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/request-code", requestCode);
router.post("/verify-code", verifyCode);

export default router;