const express = require("express");

const app = express();

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
app.use("/user", [
    (req,res,next) => {
    //route handler
    //res.send("Route Handle 1");
    console.log("Handling the route user!")
    next();
    // res.send("Response!!");
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
]);

app.listen(7777, () => {
    console.log("Server is successfully listening on port 3000...");
});
