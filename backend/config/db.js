import dns from "dns";
import mongoose from "mongoose";

// 🌐 Force Node.js to use Google DNS (fixes querySrv ECONNREFUSED on Windows)
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    console.log("Connecting to:", process.env.MONGO_URI);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      family: 4, // IPv4 only
    });

    console.log(`MongoDB Connected 🚀 : ${conn.connection.host}`);
  } catch (error) {
    console.error(error); // 👈 முழு error print ஆகட்டும்
    process.exit(1);
  }
};

export default connectDB;
