const mongoose = require("mongoose")

export const ConnectDB = async() =>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log("Database Connected successfully 😂")
    }
    catch(error){
        console.log("Database connection failed" , error.message)
    }
}