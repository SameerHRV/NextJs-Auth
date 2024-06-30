import createHttpError from "http-errors";
import mongoose from "mongoose";

const connToDb = async () => {
  try {
    mongoose.connection.on("error", (err) => {
      console.log("Mongoose connection error: " + err);
      process.exit(1);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("Mongoose disconnected");
      process.exit(1);
    });

    mongoose.connection.on("connected", () => {
      console.log("Mongoose connected");
    });

    const dbIntance = await mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_NAME!,
    });

    console.log("Connected to MongoDB And Its Host", dbIntance.connection.host);
  } catch (error: any) {
    const errMsg = createHttpError(500, "Somthing went worng while to connet to Db", error.message);
    throw errMsg;
  }
};

export default connToDb;
