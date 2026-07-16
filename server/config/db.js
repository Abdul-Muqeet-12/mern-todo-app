import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/mern-todo-app`);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;
