import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
    try {
        let token = req.cookies.jwt;
        if (!token && req.headers.authorization?.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        }
        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Auth Error:", error);
        return res.status(401).json({ error: "User not authenticated" });
    }
}

export const optionalAuth = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>

    if (!token) {
        return next(); // No token — just move on
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        if (user) {
            req.user = user; // set req.user if valid
        }
    } catch (err) {
        console.log("Invalid or expired token"); // don't block the request
    }

    next(); // Always move to next middleware or handler
};