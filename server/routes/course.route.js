import express from 'express';
import { buyCourses, createCourse, deleteCourse, getCourseDetails, getCourses, updateCourse } from '../controllers/course.controller.js';
import userMiddleware from '../middlewares/user.mid.js';
const route = express.Router();



route.post("/create" , createCourse) ; 
//route for updating an individual course
route.put("/update/:courseId" , updateCourse)
//route for deleting an course
route.delete("/delete/:courseId" , deleteCourse)
//route for seeing all the courses
route.get("/courses" , getCourses);
//route for course details 
route.get("/:courseId" , getCourseDetails)

route.post("/buy/:courseId",userMiddleware, buyCourses)


export default route; 