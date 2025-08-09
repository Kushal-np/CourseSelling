import express from 'express';
import { buyCourses, createCourse, deleteCourse, getCourseDetails, getCourses, updateCourse } from '../controllers/course.controller.js';
const route = express.Router();

//route for post creation
route.post("/create" , createCourse) ; 
//route for updating an individual course
route.put("/update/:courseId" , updateCourse)
//route for deleting an course
route.delete("/delete/:courseId" , deleteCourse)
//route for seeing all the courses
route.get("/courses" , getCourses);
//route for course details 
route.get("/:courseId" , getCourseDetails)

route.post("/buy/:courseId", buyCourses)


export default route; 