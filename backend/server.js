import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import helmet from "helmet";
import authRoutes from "./routes/authRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";

dotenv.config();

const app = express();

const allowedOrigins = [
  "http://localhost:7001",
  "http://127.0.0.1:7001",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "https://payroll-management-system-jet.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all during development to avoid blocking
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

// Routes
app.get("/api", (req, res) => {
  res.status(200).json({
    success: true,
    data: [{ message: "Welcome to the Payroll Management System API" }],
    message: "Welcome to the Payroll Management System API",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/payrolls", payrollRoutes);




// Start Server
app.listen(PORT, () => {
  console.log(`
====================================
🚀 Payroll Backend Started
====================================
🌐 Server : http://localhost:${PORT}
📦 Environment : ${process.env.NODE_ENV}
====================================
`);
});
