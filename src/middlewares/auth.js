const jwt  = require("jsonwebtoken");
const User = require("../modals/user");
/*const adminAuth = (req,res,next) => {
    console.log("Admin auth is getting checked !!")
    const token = "xyz";
    const isAdminAuthorized = token == "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send("Unauthorized request");
    } else {
        next();
    }
};*/

/*const userAuth = (req,res,next) => {
    console.log("User auth is getting checked !!")
    const token = "xyz";
    const isAdminAuthorized = token == "xyz";
    if (!isAdminAuthorized) {
        res.status(401).send("Unauthorized request");
    } else {
        next();
    }
};*/

const userAuth =async (req,res,next) => {
    // read the token from the req cookies
    // const cookies = req.cookies;
    try {
        const {token} = req.cookies;
        if(!token){
            throw new Error("Token is not valid!!!");
        }

    // const decodedObj = await jwt.verify(token, process.env.JWT_SECRET) // use in future
    const decodedObj = await jwt.verify(token, "DEV@Tinder$790");

    const{_id} = decodedObj;
    const user = await User.findById(_id);
    if(!user){
        throw new Error("User not found");
    }

    req.user = user;
    next();
   } catch (err){
    res.status(400).send("ERROR: " + err.message);
   }

    // validate the token
    // find the user
}

module.exports = {
    userAuth,
}