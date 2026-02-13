const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../modals/user");
const bcrypt = require("bcrypt");

// const app = express();


// app.use("/test", authMiddleware, () => {}); // both are same thing
// router.use("/test", authMiddleware, () => {});

authRouter.post("/signup", async (req,res) => {
    /*const userObj = {
        firstName : "Aman",
        lastName : "Soam",
        emailId: "Aman@gmail.com",
        password: "aman@123",
    }
    // creating a new instance of the user modal
    const user = new User(userObj);*/

    /*const user = new User({
        firstName : "Ms",
        lastName : "Dhoni",
        emailId: "msdhoni@gmail.com",
        password: "dhoni@123",
    });
    try {
        await user.save();
        res.send("User Added successfully");
    } catch (err) {
        res.status(400).send("Error saying the user:" + err.message);
    }*/

   try {
   // Validation of data
    validateSignUpData(req);

    const { firstName,lastName, emailId, password } = req.body;
   
   // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);
   
   // console.log(req.body);
        // creating a new instance of the user model
    // const user = new User(req.body); // it is bad way,good way -> explicity mension all fiels
    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
    })
    await user.save();
    res.send("User Added successfully!");
}   catch (err){
    res.status(400).send("ERROR :  " + err.message);
    }
});

authRouter.post("/login", async (req,res) => {
    try {
        const { emailId,password } = req.body;
        
        const user = await User.findOne({ emailId: emailId});
        if(!user) {
            // throw new Error("EmailId is not present in DB");
            throw new Error("invalid credentials");
        }

        // const isPasswordValid = await bcrypt("Punjab#123","$2b$10$KoKxZAlPsTYTTIpymQnh6eXxJ6K8aEPt/p7514EcS6fhYk06hvnvy");
        // const isPasswordValid = await bcrypt.compare(password,user.password); use in user.js
        
        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid){
            // create a JWT Token
            const token = await user.getJWT();

            /*const token = await jwt.sign({ _id: user._id },"DEV@Tinder$790", { 
                expiresIn: "7d",
            });*/ // for clean code, we use this func in user.js
            // console.log(token);

            //Add the token to cookie and send the response back to the user

            // res.cookie("token","jhjsuehjhvxqibuijhassjhx");
            res.cookie("token", token, {
                expires: new Date(Date.now() + 8 * 3600000),
            });
            res.send("Login Successfull!!!");
        }
        else {
            // throw new Error("Password is not correct");
            throw new Error("invalid credentials");
        }
    } catch (err) {
        res.status(400).send("ERROR : " + err.message);
    }
});

module.exports = authRouter;