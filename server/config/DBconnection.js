import mongoose from "mongoose";
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection error", error);
    process.exit(1);
  }
};
