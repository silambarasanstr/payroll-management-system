import dns from "dns";
import mongoose from "mongoose";

// 🌐 Force Node.js to use Google DNS (fixes querySrv ECONNREFUSED on Windows)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.warn(
      "⚠️ MONGO_URI is missing in environment variables. Please set it in your .env file.",
    );
    return;
  }

  try {
    console.log("Connecting to MongoDB...");
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // IPv4 only
    });

    console.log(`MongoDB Connected 🚀 : ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message || error);
  }
};

export default connectDB;

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI);
//     console.log("MongoDB Connected Successfully");
//   } catch (error) {
//     console.error("MongoDB Connection Failed:", error.message);
//     process.exit(1);
//   }
// };

// export default connectDB;
