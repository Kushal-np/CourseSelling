import { Course } from "../models/course.model.js";
import cloudinary from 'cloudinary'
import { Purchase } from "../models/purchase.model.js";

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
        //if by any chance the server is not able to access cloudinary , or any other error circumstances , this message will get prompted , preveting from the server to not work or crash
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const { title, description, price, image } = req.body;

  try {
    // Check if course exists first
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ errors: "Course not found" });
    }

    // Prepare image object only if valid, else skip update for image
    let imageUpdate;
    if (image && image.public_id && image.url) {
      imageUpdate = {
        public_id: image.public_id,
        url: image.url,
      };
    }

    // Build update object dynamically
    const updateData = {
      title,
      description,
      price,
    };
    if (imageUpdate) {
      updateData.image = imageUpdate;
    }

    // Update the course
    const updatedCourse = await Course.findByIdAndUpdate(courseId, updateData, {
      new: true, // return the updated document
      runValidators: true, // enforce schema validations
    });

    res.status(200).json({
      message: "Course updated successfully",
      course: updatedCourse,
    });
  } catch (error) {
    console.error("Error updating course:", error);
    res.status(500).json({ errors: "Error in course updating" });
  }
};

export const deleteCourse = async(req , res) =>{
    const {courseId} = req.params;
    try{
        const course = await Course.findByIdAndDelete({
            _id: courseId,
        })
        if(!course){
            return res.status(404).json({
                error:"Course not found"
            })
        }
        return res.status(200).json({
            message:"Course deleted successfully"
        })
    }
    catch(error){
        res.json({
            success:false,
            message:"Error while deleting course"
        })
    }
};

export const getCourses = async(req,res) =>{
    try{
        //this will get us all the courses
        const courses = await Course.find({})
        // this will display all the courses
        res.status(200).json({courses})
    }
    catch(error){
        res.status(500).json({
            errors : "Error in getting courses"
        })
        console.log("Error to get courses" , error)
    }
}

export const getCourseDetails = async(req,res) =>{
    const {courseId} = req.params;
    try{
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                error:"Course not found"
            })
        } 
        res.status(200).json({
            course
        })
    }
    catch(error){
        res.status(500).json({errors: "Error in gettig course Details"});
        console.log("Error in getting coures details" , error);
    }
}

export const buyCourses = async(req , res) =>{
    const {userId} = req;
    const {courseId} = req.params;
    try{
        const course = await Course.findById(courseId);
        if(!course){
            return res.status(404).json({
                error:"course not found"
            })
        }
        const existingPurchase = await Purchase.findOne(userId , courseId)
        if(existingPurchase){
            return res.status(400).json({
                error:"User has already purchased this course"
            })
        }
        const newPurchase =await new Purchase({userId,courseId}).save();
        res.status(201).json({
            message:"Course purchased successfully"
        })
    }
    catch(error){
        console.log("Error in course" , error)
    }
}