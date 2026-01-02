import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"


const createToken = async (userId, res) => {
    try {
        const token = jwt.sign({
            userId
        }, process.env.JWT_SECRET_KEY, { expiresIn: "3d" });

        res.cookie("jwt", token, {
            httpOnly: true, // Prevent XSS attacks
            secure: process.env.NODE_ENV === "production", // Enable secure cookies in production
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Adjust for local vs. production
            path: "/",
        })

        await User.findByIdAndUpdate(userId, { token })
        return token;
    } catch (error) {
        console.log("unable to genrate token", error)
    }
}


export default createToken;