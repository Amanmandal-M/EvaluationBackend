const jwt = require('jsonwebtoken'); 
require('dotenv').config();   

const validator = async (req,res,next) => {
    const token =req.headers.authorization
    if(token){
        const decoded = jwt.verify(token,process.env.key)
        if(decoded){
            const userID = decoded.UserID;
            req.body.UserID = userID;
            next();
        }else{
            res.send("Please Login First")
        }
    }else{
        console.log(`Error in Middleware`);
        res.send("Please Login First")
    }
}

module.exports = {validator}