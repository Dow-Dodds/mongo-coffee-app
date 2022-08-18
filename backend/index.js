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
// bcrypt for encrypting data (passwords) 
const bcrypt = require('bcryptjs');
//grab our config file 
const config = require('./config.json');


//Schemas 
// every schema needs a capital letter
const Coffee = require('./models/coffee.js');
const User = require('./models/user.js');
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

//=====================================================
//----------!!! ADD NEW PRODUCT SECTION !!!!-----------
//=====================================================
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

//=====================================================
//----------!!! GET METHOD !!!!-----------
//=====================================================
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

//=====================================================
//----------!!! DELETE PRODUCT METHOD !!!!-----------
//=====================================================
// set up delete route 
app.delete('/deleteCoffee/:id', (req, res) => {
    //the request variable here (req) contains the ID, and you can access it using the req.param.id
    const coffeeID = req.params.id;
    console.log("The following coffee was deleted:")
    console.log(coffeeID);
    //findbyID() looks up a piece of data based on the id of the argument which we give to it first 
    // we're giving it the coffeeId variable
    // if it's successful it will run a function
    // then function will provide us the details on that coffee or an error if it doesnt work

    Coffee.findById(coffeeID, (err, coffee) => {
        if (err) {
            console.log(err);
        } else {
            console.log(coffee);
            //deleteOne 
            Coffee.deleteOne({_id: coffeeID})
            .then(() => {
                console.log("success! actually deleted from MongoDB")
                //res.send will end the process and print this data in the terminal 
                 res.send(coffee);
            })
            .catch ((error)=>{
                console.log(err);
            })
           
        }
    });

});

//=====================================================
//----------!!! UPDATE/EDIT PRODUCT METHOD !!!!-----------
//=====================================================
app.patch('/updateProduct/:id', (req, res) => {
    const idParam = req.params.id;
    Coffee.findById(idParam, (err, coffee) => {
        const updatedProduct = {
            name: req.body.name,
            price: req.body.price,
            image_url: req.body.image_url
        }
        Coffee.updateOne({
            _id: idParam
        },updatedProduct)
        .then(result => {
            res.send(result); 
        })
        .catch(err => res.send(err));
    });

});

//=====================================================
//                     USERS  
//=====================================================

// registering a new user on mongoDB

app.post('/registerUser',(req, res)=>{ // Checking if user is in the DB already
  
    User.findOne({username:req.body.username}, (err, userResult)=>{
  
      if(userResult){
        // send back a string so we can validate the user
        res.send('username exists');
      } else {
        const hash = bcrypt.hashSync(req.body.password); // Encrypt User Password
        const user = new User({
          _id: new mongoose.Types.ObjectId,
          username: req.body.username,
          password: hash,
          profile_img_url: req.body.profile_img_url
        });
        
        user.save().then(result=>{ // Save to database and notify userResult
          res.send(result);
        }).catch(err=>res.send(err));
      } // Else
    })
  }) // End of Create Account
  
  // Logging in
  
  // ============
  //     Log In
  // =============
  app.post('/loginUser', (req, res)=>{
    // firstly look for a user with that username
    User.findOne({username:req.body.username}, (err, userResult) => {
      if (userResult){
        if(bcrypt.compareSync(req.body.password, userResult.password)){
          res.send(userResult);
        } else{
          res.send('not authorised');
        } // inner if
      } else{
        res.send('user not found');
      } // outer if
    }) // Find one ends
  }); // end of post login
  