import { Course } from "../models/course.model.js";

export const createCourse = async(req , res) =>{
    try{
        const {title,description , price} = req.body;
        if(!title || !description || !price ){
            res.status(401).json({
                success:false,
                message:"All fields required"
            })
        }
        const courseData = {
            title,
            description,
            price,
            image
        }
        const savedUser =  await Course.create(courseData);
        res.json({
            success:true,
            savedUser

        })
    }
    catch(error){
        res.status(401).json({
            success:false,
            message:"Internal server error"
        })
    }
}