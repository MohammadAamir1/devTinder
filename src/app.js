const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./modals/user");
const { validateSignUpData } = require("./utils/validation")
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());


/*app.use("/hello/2", (req,res) => {
    res.send("Abracadarab");
})
app.use("/hello", (req,res) => {
    res.send("Hello Hello Hello!");
})
app.use("/", (req,res) => {
    res.send("Hello Amir");
})*/
/*app.use("/user", (req,res) => {
    res.send("HAHAHAHAHAHAHA");
})

// This will only handle GET call to /user
app.get("/user", (req,res) => {
    res.send({firstName: "Aamir", lastName: "Khan"});
});

app.post("/user", (req,res) => {
    // saving data to the db
    res.send("Data successfully saved to the database");
});

app.delete("/user", (req,res) => {
    res.send("Deleted successfully")
})

// this will match all the HTTP method API calls to /test
app.use("/test", (req,res) => {
    res.send("Hello from the server!");
})*/

/* /ac, /abc for =>  /ab?c
 /ab.*cd/ => for abAKSHAYcd
 /a(bc)?d/ => for optional bc
 /a/ for any words should be a
 /.*fly$/ end should be with fly*/

 /*app.get("/user/:userId/:name/:password", (req, res) => {
    // console.log(req.query)
    console.log(req.params);
    res.send({ firstName: "Aamir", lastName: "Khan" });
});*/

// app.use("/route", [rH1, rH2,rH3, rH4, rH5]);
// app.use("/route", [rH1, rH2],rH3, rH4, rH5);
/*app.get("/user", [
    (req,res,next) => {
    //route handler
    //res.send("Route Handle 1");
    console.log("Handling the route user!")
    next();
    res.send("Response!!");
}, 
   (req,res,next) => {
    // route handler 2
    console.log("Handling the route user 2 !!")
    // res.send("2nd Response!!");
    next();
},
   (req,res,next) => {
    // route handler 2
    console.log("Handling the route user 3 !!")
    // res.send("3rd Response!!");
    next();
},
]);*/


/*app.get("/user", (req,res,next) => {
    console.log("Handling the route user 2 !!");
    // res.send("2nd Route Handler");
    next();
});
app.get("/user", (req,res, next) => {
    console.log("Handling the route user!!");
    next();
});*/


// GET /users => it checks all the app.xxx("matching route") functions
// GET /users => middleware chain => request handlet

/*app.use("/", (req,res,next) => {
    // res.send("Handling / route");
    next();
})

app.get(
    "/user",
    (req,res,next) => {
        console.log("Handling / user route");
        next();
    },
    (req,res,next) => {
        next();
    },
    (req,res, next) => {
    res.send("2nd Route Handler");
    }
);*/

/*const { adminAuth, userAuth } = require("./middlewares/auth");

// Handle Auth MIddleware for all GET, POST, ...request 
app.use("/admin", adminAuth);

app.post("/user/login", (req,res) => {
    res.send("User logged in successfully!");
})

app.get("/user", userAuth, (req,res) => {
    // logic of checking if the request is authorized
        res.send("User data sent");
})
app.get("/admin/getAllData", (req,res) => {
    // logic of checking if the request is authorized
        res.send("All data sent");
})

app.get("/admin/deleteUser", (req,res) => {
    res.send("Delete a user");
})*/

// app.use("/", (err, req, res, next) => {
//     if(err) {
//         res.status(500).send("something went wrong");
//     }
// });
/*app.get("/getUserData", (req,res) => {
    // try {
        // logic of Db call and get user data
        throw new Error("dvbzhjf");
        res.send("User Data sent");

    // } catch (err) {
    //     res.status(500).send("Some Error contact support team")
    // }

});

app.use("/", (err, req, res, next) => {
    if(err) {
        res.status(500).send("something went wrong");
    }
});*/

app.post("/signup", async (req,res) => {
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

app.post("/login", async (req,res) => {
    try {
        const { emailId,password } = req.body;
        
        const user = await User.findOne({ emailId: emailId});
        if(!user) {
            // throw new Error("EmailId is not present in DB");
            throw new Error("invalid credentials");
        }

        // const isPasswordValid = await bcrypt("Punjab#123","$2b$10$KoKxZAlPsTYTTIpymQnh6eXxJ6K8aEPt/p7514EcS6fhYk06hvnvy");
        const isPasswordValid = await bcrypt.compare(password,user.password);
        if(isPasswordValid){
            // create a JWT Token
            const token = await jwt.sign({ _id: user._id },"DEV@Tinder$790");
            // console.log(token);

            //Add the token to cookie and send the response back to the user

            // res.cookie("token","jhjsuehjhvxqibuijhassjhx");
            res.cookie("token", token);
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

app.get("/profile", async (req,res) => {
    try {const cookies = req.cookies;

    const {token} = cookies;
    // validate my token
    if(!token) {
        throw new Error("Invalid Token");
    }

    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");
    // console.log(decodedMessage);

    const { _id } = decodedMessage;
    // console.log("Logged In User is : " + _id);

    const user = await User.findById(_id);
    if(!user){
        throw new Error("User does not exist");
    }

    // console.log(cookies);
    // res.send("Reading Cookie");
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//get user by email
app.get("/user", async (req,res) => {
    const userEmail = req.body.emailId;

    try {
        // if same data
        const user = await  User.findOne({ emailId: userEmail});
        if(!user){
            res.status(404).send("user not found");
        } else {
            res.send(user);
        }

        // if not same data use this
        /*const users = await User.find({ emailId: userEmail });
        if (users.length === 0){
            res.status(404).send("User not found");
        } else {
            res.send(users);
        }*/
    }
    catch (err) {
        res.status(400).send("Something went wrong")
    }
})
// Feed AP - GET /feed - get all the users from the database
app.get("/feed",async (req,res) => {
    try {
        const users = await User.find({});
        res.send(users);
    }
    catch (err) {
        res.status(400).send("Something went wrong");
    }
});

//delete a user from the database
app.delete("/user", async (req,res) => {

    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete({ _Id: userId });
        // const user = await User.findByIdAndDelete(userId);

        res.send("User deleted successfully");
    } catch (err) {
        res.status(400).send("Something went wrong");
    }
});

// update data of the user
// app.patch("/user", async (req,res) => {
app.patch("/user/:userId", async (req,res) => {
    // const userId = req.body.userId;
    const userId = req.params?.userId;
    const data = req.body;
    console.log(data);
    try {
        const ALLOWED_UPDATES = [
        "userId",
        "photoUrl", 
        "about", 
        "gender", 
        "age",
        "skills"
        ]
        const isUpdateAllowed = Object.keys(data).every( k => 
            ALLOWED_UPDATES.includes(k)
        );
        if(!isUpdateAllowed){
        throw new Error("UPdate not allowed");
        }
        if(data?.skills.length > 10){
            throw new Error("Skills cannot be more than 10");
        }
        // await User.findByIdAndUpdate({ _id: userId}, data);
        const user = await User.findByIdAndUpdate({ _id: userId}, data, {
            // returnDocument: "before",
            returnDocument: "after",
            runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully");
    } catch (err) {
        // res.status(400).send("Something went wrong");
        res.status(400).send("UPDATE FAILED:" + err.message);
    }
})
connectDB()
    .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");
    });
    })
    .catch((err) => {
    console.error("database cannot be connected!!");
    });

/*app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");
});*/
