import { User } from "../models/user.model.js";
import { Command } from "../models/command.model.js";
import bcrypt, { compare } from "bcrypt";
import createToken from "../jwt/AuthToken.js";


export const makeIdeal = async (req, res) => {
    return res.status(200).json({ message: "Api work " });

}

export const register = async (req, res) => {
    try {

        const { username, email, password } = req.body;

        console.log(req.body)

        console.log("email", email)
        console.log("password", password)
        console.log("name", username)





        if (!email || !password || !username) {
            return res.status(400).json({ message: "Please fill required fields" });
        }

        const user = await User.findOne({ email });


        if (user) {
            return res.status(409).json({
                "message": "User Already Exist Try With Diffrent Email Address"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            username,
            password: hashedPassword,
        })

        await newUser.save();

        if (newUser) {
            let token = await createToken(newUser._id, res);
            if (token) {
                console.log("Singup: ", token);
                res.status(200).json(
                    {

                        "message": "User Register Successfully",

                        user: {
                            id: newUser._id,
                            userName: newUser.username,
                        }, token: token,
                    }
                )
            }
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal Server error" });
    }
}
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Please enter you email Id"
            })
        }
        if (!password) {
            return res.status(400).json({
                message: "Please enter you password"
            })
        }

        const user = await User.findOne({ email }).select("+password");

        if (!user.password) {
            return res.status(400).json({
                message: "Please enter Valid Password"
            })
        }

        const isMatch = await compare(password, user.password);

        if (!user || !isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }


        const token = await createToken(user._id, res);
        console.log("Login :", token);
        res.status(200).json({
            message: "User logged in successfully",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
            },
            token: token,
        });



    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: "Internal Server error" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("jwt");
        console.log("Logout Successfull")
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Server Error" });

    }
}

export const getCommandByUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const userCommands = await Command.find({ user: userId });

        console.log("User ID:", userId);
        console.log("User Commands:", userCommands);

        res.status(200).json({ userCommands });
    } catch (error) {
        console.error("Fetch Commands Error:", error);
        res.status(500).json({ message: "Unable to fetch commands" });
    }
};

export const getFullProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        
        const user = await User.findById(userId)
            .select("-password")
            .populate({
                path: "savedCommands",
                options: { sort: { createdAt: -1 } }
            });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Fetch all commands created by user
        const commands = await Command.find({ user: userId })
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "User profile fetched successfully",
            profile: {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                totalCommands: commands.length,
                commands: commands
            }
        });

    } catch (error) {
        console.error("Get Profile Error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
};

