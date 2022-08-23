const mongoose = require('mongoose');

// set up the properties of our schema 
const reviewSchema = new mongoose.Schema(
    {
        // every schema requires an ID 
        _id: mongoose.Schema.Types.ObjectId,
        text: String, 
        coffee_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Coffee'
        },
       
    });

module.exports = mongoose.model('Review', reviewSchema);