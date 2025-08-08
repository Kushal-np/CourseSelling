import express from "express"
import dotenv from 'dotenv'
import { connectDB } from "./config/db.js";
import courseRoutes from "./routes/course.route.js"
dotenv.config();
const app = express();
const PORT = process.env.PORT ; 

app.use(express.json())

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.use("/api/v1/course" , courseRoutes )
app.get("/",(req,res)=>{
    res.send("Hello world")
})

app.listen(PORT  , ()=>{
    console.log(`Example app listening on port ${PORT }`)
    connectDB();
})