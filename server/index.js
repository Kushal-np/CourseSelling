import express from "express"
import dotenv from 'dotenv'
import { connectDB } from "./config/db.js";
import courseRoutes from "./routes/course.route.js"
import userRoutes from "./routes/user.route.js"
import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload";
dotenv.config();
const app = express();
const PORT = process.env.PORT ; 

app.use(express.json())


// using express file uploader for the file sharing purpose
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use("/api/v1/course" , courseRoutes )
app.use("/api/v1/user" , userRoutes)
//cloudinary config , to save the shared files into cloudinary over the cloud
cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key : process.env.api_key,
    api_secret : process.env.api_secret
})

app.listen(PORT  , ()=>{
    console.log(`Example app listening on port ${PORT }`)
    connectDB();
})