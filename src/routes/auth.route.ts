import { Router } from "express";
import { refreshToken } from "../controllers/auth.controller";

const router = Router();

router.post("/refresh", refreshToken);

export default router;
