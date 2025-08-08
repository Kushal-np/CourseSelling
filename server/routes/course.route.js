import express from 'express';
import { createCourse } from '../controllers/course.controller.js';
const route = express.Router();


route.post("/create" , createCourse) ; 


export default route;