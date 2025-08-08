import mongoose from 'mongoose'
import dotenv from 'dotenv'
export const connectDB = async() =>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongo db has started")
    }
    catch(error){
        console.log(error.message);
    }
}