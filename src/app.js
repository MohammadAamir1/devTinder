const express = require("express");

const app = express();


app.get("/user/:userId/:name/:password", (req, res) => {
    // console.log(req.query)
    console.log(req.params);
    res.send({ firstName: "Aamir", lastName: "Khan" });
});
app.listen(7777, () => {
    console.log("Server is successfully listening on port 3000...");
});
