import { Router } from "express";
import { createFolder, getFolders, deleteFolder, updateFolder } from "../controllers/folder.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/", verifyJWT, createFolder);
router.get("/:parentFolder?", verifyJWT, getFolders);
router.delete("/:folderId", verifyJWT, deleteFolder);
router.put("/:folderId", verifyJWT, updateFolder);

export default router;