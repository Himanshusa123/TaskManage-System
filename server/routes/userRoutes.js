import express from "express";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import {  getUserId, getUsers } from "../controllers/userController.js";

const router=express.Router()

// user management routes
router.get("/",protect,adminOnly,getUsers)
router.get("/:id",protect,getUserId)

export default router;