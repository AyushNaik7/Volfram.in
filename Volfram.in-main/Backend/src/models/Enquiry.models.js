
const mongoose = require("mongoose");
 const EnquirySchema=new mongoose.Schema({
    fullname:{
        type:String,
        required:true,
          trim: true

    },
    email:{ 
        type: String,
  required: true,
  lowercase: true,
  trim: true
    },
    phone:{
         type: String,
  required: true,
  match: [/^(\+91)?[6-9][0-9]{9}$/, "Please enter valid phone number"]
    },
    companyName:{
        type:String,
        required:true
    },
    serviceOfInterest:{
        type:String,
        required:true
    },
    subject:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    },
    
 },
  { timestamps: true }
);
 const Enquiry=mongoose.model("Enquiry",EnquirySchema);
 module.exports=Enquiry;
