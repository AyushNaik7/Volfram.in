const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true, 
        unique: true,
        lowercase: true,
        trim: true
    },
    number: {
        type: String,
        required: true,
        match: [/^[0-9]{10}$/, "Please enter a valid phone number"]
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    isVerified: {
  type: Boolean,
  default: false
},
verificationToken: String,
}, { timestamps: true });

const Register = mongoose.model("Register", registerSchema);

module.exports = Register;