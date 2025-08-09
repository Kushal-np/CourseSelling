import jwt from 'jsonwebtoken';


function userMiddleware(req,res,next){
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startWith("Bearer ")){
        return res.status(401).json({errors:"No token provided"});
    }
    const token = authHeader.split("")[1];
    try{
        const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY)
        req.userId = decoded.id;
        next();
    }
    catch(error){
        console.log("Invalid token or expired token")
    }
}