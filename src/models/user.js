const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: { type: String, required: true, unique: true, trim: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] 
    },
    password: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['BUSINESS OWNER', 'USER', 'ADMIN'], 
        default: 'User', 
        required: true 
    }
},{timestamps:true});

module.exports = mongoose.model('User', userSchema);
