import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URL);
    console.log(
      `Connected to mongo database ${mongoose.connection.host}`.bgMagenta.white
    );
  } catch (error) {
    console.log(`Mongodb Error ${error}`.bgRed.white);
  }
};

export default connectDB;
