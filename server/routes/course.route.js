import express from 'express';
import { createCourse } from '../controllers/course.controller.js';
const route = express.Router();

//route for post creation
route.post("/create" , createCourse) ; 
//route for updating an individual course
route.put("/update/:cousreId" , updateCoures)


export default route;