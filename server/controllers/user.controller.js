import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { z } from "zod";
export const signUp = async (req, res) => {
  try {
    // Taking the values of firstName,lastName,email,password from the frontend, that is also the body
    const { firstName, lastName, email, password } = req.body;
    //using zod to validate the above credentials , I mean these are like schemas for the objects(credentials)
    const userSchema = z.object({
      firstName: z
        .string()
        .min(2, { message: "firstName must be atleast 6 characters long" }),
      lastName: z
        .string()
        .min(2, { message: "lastName must be atleast 6 characters long" }),
      email: z.string().email(),
      password: z
        .string()
        .min(8, { message: "Password must be atleast 8 characters long" }),
    });
    // After defining the schema , validating the data now and if not validated next step will run
    const validateData = userSchema.safeParse(req.body);
    // In case if it doesn't follow the schema , the code below will run
    if (!validateData.success) {
      return res.status(200).json({
        errors: validateData.error.issues.map((err) => err.message),
      });
    }
    //checking if firstName , lastName, email and password are atleast entered or not
    if (!firstName || !lastName || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields required",
      });
    }
    //checking if the user exists or not , using email to find out the availability
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    //hashing the password using bcrypt , using password and the 10 is for salt
    const hashedPassword = await bcrypt.hash(password, 10);
    //after entered the value , then we should save the user in the database , so declaring the variable and then the hashedpassword is placed interms of the password
    //new user is saved from the line below
    const newUser = await new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).save();
    // in case of success !
    res.status(200).json({
      success: true,
      newUser,
    }); //New user saved in the database with the success message true ;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal server errror",
      error,
    });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ errors: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ errors: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ errors: "error in login" });
    console.log("error in login", error);
  }
};
