// here is our first schema 
// every schema needs a mongoose dependency 

const mongoose = require('mongoose');

// set up the properties of our schema 
const coffeeSchema = new mongoose.Schema(
    {
        // every schema requires an ID 
        _id : mongoose.Schema.Types.ObjectId,
        name: String, 
        price: Number,
        image_url: String
    }, 
    {
        //version keys can help us with udpated schemas for larger projects
        versionKey: false
    }
);

// set up an export telling this .js file to be sent to our main index.js
// First argument is the name of the schema
// this word is up to us but it should reflect the type of data were working with (and singular e.g coffee not coffees)
// The second argument is the schema variable we declared above.

module.exports = mongoose.model('Coffee', coffeeSchema);