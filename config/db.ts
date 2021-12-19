import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";


dotenv.config();

colors.enable();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI!, {
      //    useCreateIndex: true,
      //    useFindAndModify: false,
      //    useUnifiedTopology: true,
      //    useNewUrlParser: true,
    });
    console.log("DB Connected".green.bold);
  } catch (error) {
    console.log("Error Connection DB".red.bold, error);
  }
};

export default connectDB;
