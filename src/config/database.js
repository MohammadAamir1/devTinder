const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(
    "mongodb+srv://saeed113918saeed_db_user:geIIBuxLeiKGzl5Y@hellonode.omc9ezk.mongodb.net/devTinder"
 );
};

module.exports = connectDB;

/*connectDB()
    .then(() => {
    console.log("Database connection established...")
    })
    .catch((err) => {
    console.error("database cannot be connected!!");
});*/

