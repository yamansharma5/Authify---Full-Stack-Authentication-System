import mongoose from "mongoose";

const connectDB = async () => {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
        console.error("❌ MONGODB_URI is not defined in environment variables!");
        process.exit(1); // Fail fast — don't silently hang
    }

    // Append database name if not already in the URI
    const dbUri = uri.includes("/mern-auth") ? uri : `${uri}/mern-auth`;

    mongoose.connection.on("connected", () => {
        console.log("✅ MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
        console.error("❌ MongoDB connection error:", err.message);
    });

    mongoose.connection.on("disconnected", () => {
        console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
    });

    try {
        await mongoose.connect(dbUri, {
            serverSelectionTimeoutMS: 10000, // Fail if no server found in 10s
            socketTimeoutMS: 45000,           // Close sockets after 45s of inactivity
            connectTimeoutMS: 10000,          // Give up initial connection after 10s
        });
    } catch (error) {
        console.error("❌ Failed to connect to MongoDB:", error.message);
        // Retry after 5 seconds instead of crashing the whole server
        console.log("🔄 Retrying MongoDB connection in 5 seconds...");
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;