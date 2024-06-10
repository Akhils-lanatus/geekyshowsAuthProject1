import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

//MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//DB CONNECTION
connectDB();

//IMPORTING ROUTES
import UserRoutes from "./routes/user.routes.js";

//USING ROUTES
app.use("/api/v1/auth", UserRoutes);

//LISTENING
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Server running at port :: ${port}`);
});

// MXCeqlu83CVXPJs7
// zvzc jkih ialw asst
