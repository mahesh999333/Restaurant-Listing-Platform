const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    business: { type: Schema.Types.ObjectId, ref: 'Business', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    response: {type: String, trim:true},
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
