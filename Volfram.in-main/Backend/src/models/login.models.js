const mongoose = require('mongoose');
const LoginSchema =new mongoose.Schema({
    email:{
        type:String,    
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
},{timestamps:true});
const Login=mongoose.model("Login",LoginSchema);
module.exports=Login;