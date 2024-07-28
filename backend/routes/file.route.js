import { Router } from "express";
import { createFile, deleteFile, updateFile, searchFiles } from "../controllers/file.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createFile);
router.delete("/:fileId", verifyJWT, deleteFile);
router.put("/:fileId", verifyJWT, updateFile);
router.get("/:query", verifyJWT, searchFiles);

export default router;