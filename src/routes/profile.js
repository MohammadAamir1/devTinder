const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile/view", userAuth, async (req,res) => {
    try {
        // do not necessary below this , becoz use in auth.js
        /*const cookies = req.cookies;

        const {token} = cookies;
        // validate my token
        if(!token) {
        throw new Error("Invalid Token");
        }

        const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
        // console.log(decodedMessage);

        const { _id } = decodedMessage;
        // console.log("Logged In User is : " + _id);

        // const user = await User.findById(_id); // use of below instead of this
        // const user = req.user;
        if(!user){
        throw new Error("User does not exist");
        }*/
        
        
        const user = req.user;
        // console.log(cookies);
        // res.send("Reading Cookie");
        res.send(user);
    } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});
profileRouter.patch("/profile/edit", userAuth, async (req,res) => {
  try {
    if(!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
  
    };
    
    const loggedInUser= req.user;
    // console.log(loggedInUser);

    // loggedInUser.firstName = req.body.firstName; this is not good methods
    Object.keys(req.body).forEach(key => (loggedInUser[key] = req.body[key]));
    // console.log(loggedInUser);

    await loggedInUser.save();

    res.send({ 
      message: `${loggedInUser.firstName}, your profile updated Successfully`,
      data: loggedInUser,
    });
  }
  catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
})

module.exports = profileRouter;