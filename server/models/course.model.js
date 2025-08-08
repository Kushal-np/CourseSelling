import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: { // since we are doing a file upload , we need publc id and url of the image that is going to be uploaded in the website

    //public id 
    public_id: {
      type: String,
      required: true,
    },
    //url of the image , that will be of type string and given by cloudinary
    url: {
      type: String,
      required: true,
    },
  },
});

export const Course = mongoose.model("Course", courseSchema);
