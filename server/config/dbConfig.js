import mongoose from "mongoose";

const connectDB = () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        console.log("MongoDB Connected");
    } catch (error) {
        console.error("MongoDB Connection Error:", error);
    } finally {
        mongoose.connection.on("error", (err) => {
            console.error("MongoDB Connection Error:", err);
        });
    }
}

export default connectDB;