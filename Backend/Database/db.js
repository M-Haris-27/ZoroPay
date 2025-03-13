import mongoose from "mongoose";


export const connectDB = async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGO_DB_URL);

        if(connection){
            console.log("Database connected");
        } else {
            console.log("Database connection failed");
        }
    
    } catch (error){
        console.log("Error: ", error);
    }
}