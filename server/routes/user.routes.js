import mongoose from "mongoose";
import { register, login, logout, makeIdeal, getCommandByUser , getFullProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/authUser.js";
import express from "express";


const router = express.Router();
router.get("/checker", makeIdeal)
router.post("/register", register);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);
router.get("/getMyCommand", isAuthenticated, getCommandByUser);
router.get("/getFullProfile", isAuthenticated, getFullProfile);




export default router; 
