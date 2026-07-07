import express from "express";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import helmet from "helmet";
import { apiLimiter } from "./middleware/rateLimiter.js";
import productRoutes from "./routes/productRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env",
});

const app = express();

const PORT = process.env.PORT || 7000;

// Database Connection
connectDB();

// Middleware
app.use(helmet());
app.use(express.json());
app.use(apiLimiter);

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to the Payroll Management System");
});

app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});