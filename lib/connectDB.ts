import mongoose from "mongoose";

let isConnect = false;

export const connectDB = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGODB_URL) console.log("No URL");
  if (isConnect) console.log("Already Connected");

  try {
    mongoose.connect(process.env.MONGODB_URL!);
    console.log("Connect");
    isConnect = true;
  } catch (error: any) {
    console.log(`Failed connect ${error.message} `);
  }
};
