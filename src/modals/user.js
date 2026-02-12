const mongoose = require('mongoose');
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
   {
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 20,
    },
    lastName: {
        type: String,
    },
    emailId: {
        type: String,
        lowercase:true,
        required: true,
        unique: true,
        trim:true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("invalid email address" + value);
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong Password : " + value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value){ //it work only new object
            if(!["male", "female", "others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        },
    },
    photoUrl: {
        type: String,
        default: "https://cdn.vectorstock.com/i/500p/46/76/gray-male-head-placeholder-vector-23804676.jpg",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("invalid  photo url : " + value);
            }
        },
    },
    about: {
        type: String,
        default: "This is a default about of the user!",
    },
    skills: {
        type: [String],
    },
    }, 
    {
        timestamps: true,
    }
);

userSchema.methods.getJWT = async function () {
    const user = this; // this = function not work on arrow function
    const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", { 
        expiresIn: "7d",
    });

  return token;
};

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(
        passwordInputByUser,
        passwordHash
    );

    return isPasswordValid;
};

// const User = mongoose.model("user", userSchema);
// module.exports = User;
module.exports = mongoose.model("User", userSchema);
