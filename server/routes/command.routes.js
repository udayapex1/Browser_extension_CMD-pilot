import { getCliCommandGuest, getCliCommandForAuthenticatedUser, deleteCommand } from "../controllers/command.controller.js";
import express from "express";
import { isAuthenticated, optionalAuth } from "../middleware/authUser.js";


const router = express.Router();
router.post("/forGuest", getCliCommandGuest)
router.post("/authenticUserCommand", isAuthenticated, getCliCommandForAuthenticatedUser)
router.delete("/delete/:id", isAuthenticated, deleteCommand)


export default router; 
