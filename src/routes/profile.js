const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req,res) => {
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

module.exports = profileRouter;