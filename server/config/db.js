import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI
            .replace("<db_user>", process.env.DB_USER)
            .replace("<db_password>", encodeURIComponent(process.env.DB_PASSWORD)));
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;