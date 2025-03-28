import express from "express";
import connectDB from "./database/db.js"
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import uploadRoute from "./routes/uploadRoute.js";
import aiRoute from "./routes/aiRoute.js";
import ttsRoute from "./routes/ttsRoute.js"; 
import bookroute from "./routes/bookRoutes.js";
import ChatbotRoute from "./routes/Chatbot.js";

dotenv.config({});

const app = express();

// In your server setup (index.js)
app.use(express.json({ limit: '50mb' })); // Increase payload limit
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] // Add PATCH here
  }));
app.use(cookieParser());

//apis
app.use("/api/v1/user", userRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api", uploadRoute);
app.use("/api", aiRoute);
app.use("/api", ttsRoute); 
app.use("/", bookroute);
app.use("/api", ChatbotRoute);

connectDB();
const PORT =3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});