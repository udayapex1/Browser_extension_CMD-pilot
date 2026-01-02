import express from "express";
import conncetDatabase from "./database/db.js";
import userRoutes from "./routes/user.routes.js"
import 'dotenv/config'
import cookieParser from "cookie-parser";
import commandRoutes from "./routes/command.routes.js"
import cors from "cors"
const app = express();






app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (origin === 'http://localhost:5173') return callback(null, true);
      if (origin.startsWith('chrome-extension://')) return callback(null, true);
      if (origin.startsWith('moz-extension://')) return callback(null, true);

      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.send('Hello World!');
})

console.log("dd")
conncetDatabase();
app.use(cookieParser())

app.use("/api/user", userRoutes);
app.use("/api/command", commandRoutes)



app.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});   
