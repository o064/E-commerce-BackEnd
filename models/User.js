const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
require('dotenv').config();
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First name is required"],
        minlength: [3, "First name should be more than 3 characters"],
        trim:true,
        validate: [validator.isAlpha, "First name should contain only alphabetic characters"],
    },
    lastName: {
        type: String,
        required: [true, "Last name is required"],
        minlength: [3, "Last name should be more than 3 characters"],
        trim:true,
        validate: [validator.isAlpha, "Last name should contain only alphabetic characters"]
    },
    userName: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "userName already exists"],
        minlength: [3, "Username should be more than 3 characters"],
        trim:true,
        // unique: [true, "usename already exists"],
        validate: [validator.isAlphanumeric, "Username should contain only letters and numbers"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"],
        lowercase: true,
        trim:true,
        validate: [validator.isEmail, "Enter a valid email address"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password should be more than 6 characters"],
        // validate: [validator.isStrongPassword, "Enter a stronger password: At least 8 characters, including 1 lowercase, 1 uppercase, 1 number, and 1 symbol"]
    },
    mobileNumber: {
        type: String,
        required: [true, "Mobile number is required"],
        trim:true,
        validate: [(value) => validator.isMobilePhone(value, 'ar-EG'), "Enter a valid Egyptian mobile number"]
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        trim:true,
        minlength: [4, "Address should be more than 4 characters"]
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
},{
    toJSON:{
        transform: (doc,retuDoc)=> _.omit(retuDoc,['__v','password','isAdmin','_id','createdAt','updatedAt'])
    }
},{timestamps:true});
userSchema.pre('save',async function(next){
    if (this.isModified('password')) {  
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);  
    }
    next();
})
userSchema.statics.logIn = async function(email,password){
    if(!email || !password){
        throw new Error("Email and password is required");
    }
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth){
            return user;
        }
        throw new Error("password is not correct");
    }
    throw new Error("email or password is not correct");
}

userSchema.methods.generateToken =  function (){  
    const maxage = 3*24*60*60;
    return jwt.sign({
        id: this.id,
        email : this.email,
        isAdmin: this.isAdmin
    }, process.env.SECRET,{expiresIn:maxage});
}
const User = mongoose.model("User", userSchema);
module.exports = User;




















