import { Course } from "../models/course.model.js";
import cloudinary from 'cloudinary'

export const createCourse = async (req, res) => {
    try {
        const { title, description, price } = req.body; // requesting the text format input 

        // checking if the input is done in all fields
        if (!title || !description || !price) {
            return res.status(400).json({
                success: false,
                message: "All fields required"
            });
        }

        //Taking the image independently because image is a file and not text format

        const { image } = req.files;

        //Checking if the file's length is not 0
        
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                error: "No file uploaded"
            });
        }

        // allowed file formats

        const allowedFormat = ["image/png", "image/jpg", "image/jpeg"];

        // checking the file formats , where mimetype is used to compare the extension of file

        if (!allowedFormat.includes(image.mimetype)) {
            return res.status(400).json({
                error: "Invalid file format"
            });
        }

        // after the file is uploaded , waiting for the cloud response and then uploading it using cloudianry's specific code
        
        const cloud_response = await cloudinary.uploader.upload(image.tempFilePath)

        //checking if we got a reponse or not , if not , then file isn't uploaded
        if(!cloud_response || cloud_response.error){
            return res.status(400).json({
                errors:"Error uploading file to cloudinary"
            })
        }

        //finally saving the full detail of a course
        const courseData = {
            title,
            description,
            price,
            image:{
                public_id : cloud_response.public_id, // public id designed in the schema
                url: cloud_response.url,// url which will be given by the cloudinary
            }
        };

        const savedCourse = await Course.create(courseData); //saving the final details
        res.json({
            success: true,
            savedCourse
        });//success message
    } 
    catch (error) {

        //if by any chanc the server is not able to access cloudinary , or any other error circumstances , this message will get prompted , preveting from the server to not work or crash
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
