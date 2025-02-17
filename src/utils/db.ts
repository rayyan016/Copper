import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGO_URI);
  if (mongoose.connection.db) {
    await mongoose.connection.db.admin().command({ ping: 1 });
  }
};

export default connectDB;
