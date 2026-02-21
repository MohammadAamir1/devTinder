const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../modals/connectionRequest");
const User = require("../modals/user");

requestRouter.post("/request/send/:status/:toUserId",userAuth, async(req,res) => {
    // const user = req.user;
    // // sending a connection request
    // console.log("Sending a connection request");

    try {
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res
            .status(400)
            .json({ message: "Invalid status type: " + status })
        }



        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({ message: "User not found!" });
        }

        // if there is an existing ConnectionRequest
        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest){
            return res
            .status(400)
            .send({ message: "Connection Request Already Exists!! "});
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });

        const data = await connectionRequest.save();

        res.json({
            message:
                req.user.firstName + " is " + status + " to " + toUser.firstName,
            data,
        });
    }
    catch(err) {
        res.status(400).send("ERROR: " + err.message);
    }
    // res.send(user.firstName + " connection request send");
});

requestRouter.post("/request/review/:status/:requestedId", 
    userAuth, 
    async (req,res) => {
        try {
            const loggedInUser = req.user;
            const { status, requestedId } = req.params;
            console.log("Logged user:", loggedInUser._id.toString());

            const allowedStatus = ["accepted", "rejected"];
            if(!allowedStatus.includes(status)){
                return res.status(400).json({
                    message: "Status not allowed! "
                });
            }

            // console.log("Params:", req.params);
            // console.log("Logged user:", loggedInUser._id);
            const connectionRequest = await ConnectionRequest.findOne({
                _id:requestedId,
                toUserId: loggedInUser._id,
                status: "interested",
            });

            if(!connectionRequest) {
                return res
                .status(404)
                .json({ message: "Connection request not found" });
            }
            // const connectionRequest = await ConnectionRequest.findById(requestedId);

            // if (!connectionRequest) {
            //     return res.status(404).json({ message: "No request with this ID" });
            // }

            console.log("Full document:", connectionRequest);
            connectionRequest.status = status;

            const data = await connectionRequest.save();
            res.json({ message: "Connection request " + status, data });
            // validate the status
            // Akshay => Elon
            // is Elon loggedIn == toUserId
            // status = interested
            // request Id should be valid

        } catch (err) {
            res.status(400).send("ERROR: " + err.message);
        }
})

module.exports = requestRouter;