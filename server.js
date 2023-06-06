// packages imports
import express from "express";
import "express-async-errors";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";

// file imports
import connectDB from "./config/mongoose.connection.js";

//routes imports
import authRoutes from "./routes/auth.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";

//dotenv config
dotenv.config();

//mongo connection
connectDB();

//rest object
const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const api = process.env.API_END_POINT;

//routes
app.use(api + "users/auth/", authRoutes);

//validation middleware
app.use(errorMiddleware);

// port
const PORT = process.env.PORT || 8080;

//listen
app.listen(PORT, () => {
  console.log(
    `Node Server Running In ${process.env.NODE_ENV} Mode on port no ${PORT}`
      .bgCyan.white
  );
});
