import mongoose from 'mongoose'


const userSchema = new mongoose.Schema({


    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true
    },
    name : {
        type : String,
        default : ""
    },
    phone : {
        type : String,
        default : ""
    },
    location : {
        type : String,
        default : ""
    },
    bio : {
        type : String,
        maxlength : 300,
        default : ""
    },
    role : {
        type : String,
        default : "user",
        enum : ["user","moderator", "admin"]
    },
    skills : [String],
    resetOtp : {
        type : String,
        default : null
    },
    resetOtpExpiry : {
        type : Date,
        default : null
    },
    isOtpVerified : {
        type : Boolean,
        default : false
    }

}, {timestamps : true}) 


const User =  mongoose.model("User",userSchema)

export default User