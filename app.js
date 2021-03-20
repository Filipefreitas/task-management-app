const express= require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const moment = require('moment');
const fileUpload = require('express-fileupload');

//This loads all our environment variables from the keys.env
require("dotenv").config({path:'./config/keys.env'});

//import your router objects
const userRoutes = require("./controllers/User");
const taskRoutes = require("./controllers/Task");
const generalRoutes = require("./controllers/General");

//creation of app object
const app = express();

//bodyParser middleware
app.use(bodyParser.urlencoded({extended:false}));

//express static middleware
app.use(express.static("public"));

//Handlebars middlware
app.engine("handlebars",exphbs(
    {
        helpers:
        {
            isSelected: function(value, priority)
            {
                return value === priority ? 'selected' : '';
            }
        }
    }
));
app.set("view engine","handlebars");

//this is to allow specific forms and or/links that were submitted/pressed to send PUT and DELETE requests
//next = move to the next middleware function
app.use((req,res,next)=>{
    if(req.query.method == "PUT")
    {
        //changing the method of the request
        req.method="PUT"
    }
    else if(req.query.method == "DELETE")
    {
        req.method="DELETE"
    }
    next();
})

app.use(fileUpload());
    
//MAPs EXPRESS TO ALL OUR  ROUTER OBJECTS
app.use("/",generalRoutes);
app.use("/user",userRoutes);
app.use("/task",taskRoutes);
app.use("/",(req,res)=>{
    res.render("General/404");
});

mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log(`Connected to MongoDB Database`)
})
.catch(err=>console.log(`Error occured when connecting to database ${err}`));

const PORT = process.env.PORT;
//Creates an Express Web Server that listens for incomin HTTP Requests
app.listen(PORT,()=>{
    console.log(`Your Web Server has been connected`);
    
});