//Setting up our dependencies 
const express = require('express');
//were grabing the express function and then linking it to our app var so that we can use it throughout the script 
const app = express();
const port = 3100;
const cors =  require('cors');
// passes information from the frontend to the backend
const bodyParser =  require('body-parser');
// this is our middleware for talking to mongo db
const mongoose =  require('mongoose');

//grab our config file 
const config = require('./config.json');


//Schemas 
// every schema needs a capital letter
const Coffee = require('./models/coffee.js')
//console.log(Coffee);

// Start our dependencies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors()); 

//start our server 
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

//lets connect to mongoDB cloud 

mongoose.connect(
    `mongodb+srv://${config.username}:${config.password}@mycluster.pr1cg5f.mongodb.net/?retryWrites=true&w=majority`,
    //.then is a chaining method used with proises 
    //in simple terms, it will run something after the function before it 
).then(() => {
    console.log("you've connected to Mongo DB")
    //.catch is a method to "catch" any errors
}).catch((err) => {
    console.log(`DB connection error ${err.message}`)
})

// Set up a route/endpoint which the frontend will access
//app.post will send data to the database - in this case mycluster
app.post('/addCoffee', (req, res) => {
    //create a new instance of the coffee schema 
    const newCoffee = new Coffee({
        // give our new coffee the details we sent from the frontend 
        _id : new mongoose.Types.ObjectId,
        // the data will always be sent to req.body 
        name: req.body.name,
        price: req.body.price,
        image_url: req.body.image_url
    });
    //to save the new coffee to the database 
    //use the vairable declared above 
    newCoffee.save()
    .then((result) => {
        console.log(`Added a new coffee successfully!`)
        //return back to the frontend what just happened 
        res.send(result)
    })
    //catch any errors 
    .catch( (err) => {
        console.log(`Error: ${err.message}`) 
    })
});

app.get('/allCoffee',(req, res) => {
    Coffee.find()
    // .then is a method in which we can chain functions on 
    //chaining means that once something has run, then we can run another thing 
    // the result cariable is being returned by the .find we ran earlier 
    .then(result => {
        //send back the result of the search to the frontend 
        res.send(result)
    })
})

