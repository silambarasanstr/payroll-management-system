import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimiter.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// ✅ Middleware
const allowedOrigins = [
  "http://localhost:7001",
  
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

const PORT = process.env.PORT || 7000;

// Database Connection
connectDB();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(apiLimiter);

// Routes
app.get("/api", (req, res) => {
  res
    .status(200)
    .json({
      success: true,
      data: [],
      message: "Welcome to the Payroll Management System",
    });
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
