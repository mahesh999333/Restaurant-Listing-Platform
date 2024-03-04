const { boolean } = require('joi');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const businessSchema = new Schema({
    name: { type: String, required: true, trim: true },
    phone: { 
        type: String, 
        required: true, 
        trim: true,
        match: [/^\d{10}$/, 'Please enter a valid phone number'] 
    },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    images: [{ type: String, trim: true }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: {type: Boolean, default:false}
},{timestamps:true});

module.exports = mongoose.model('Business', businessSchema);
