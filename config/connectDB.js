import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => console.log(`DB HOST :: ${conn.connection.host}`))
      .catch((err) => `DB ERROR :: ${err}`);
  } catch (error) {
    console.log(`Error in connecting DB :: ${error}`);
  }
};

export default connectDB;
