
/*********************Task ROUTES***************************/
const express = require('express');
const router = express.Router();
const taskModel = require("../models/Task");
const moment= require('moment');
const isAuthenticated = require("../middleware/auth");

//Route to direct use to Add Task form
router.get("/add",isAuthenticated,(req,res)=>
{
    res.render("Task/taskAddForm");
});

//Route to process user's request and data when the user submits the add task form
router.post("/add",isAuthenticated,(req,res)=>
{    
    const newUser = 
    {
        title : req.body.title
        , description: req.body.description
        , dueDate: req.body.dueDate
        , priority: req.body.priority
    }
    
    //Rules for inserting into a MongoDB database using mongoose:
    //1. To create an instance of the model you must pass the data you want to  insert in the form of an object 
        //the keyword NEW is used to create the instance; 
        //taskModel is the constructor, that receives the date you want inserted (newUser)
    const task = new taskModel(newUser);
 
    //2. From the instance, you call the save method
    //Save is an asynchronous operation
    task.save()
    .then(()=>{
        res.redirect("/task/list")
    })
    .catch(err=>console.log(`Error happened when inserting in the database :${err}`));
    
});

////Route to fetch all tasks
router.get("/list",isAuthenticated,(req,res)=>
{
    //pull from the database, get the results and then inject the results into the dask dashboard 
    //example to pull all the open tasks {property:value} >> this is how to search
    //taskModel.find({status:"Open"})
    taskModel.find()
    .then((tasks)=>{
        //Filter out the information that you want from the array of documents that was returned into a new array
        //Map is a method to filter an array without having to traverse the whole array
        //Map method receives a callback function that is called in each iteration
        //task is each element of tasks. For convetion, singular name for hte plural name of the array. Each element is an object
        //Map works similar to forEach 
            //similar: traverse an array without a counter
            //difference: forEach does not return an array; map allows you to filter out and return the filtered result into a new array
            const filteredTask = tasks.map(task=>{
            return {
                id: task._id
                , title: task.title
                , description: task.description
                , dueDate: moment(task.dueDate).format('DD-MMM-YYYY')
                , status: task.status
                , priority: task.priority
            }
        });
         
        res.render("Task/taskDashboard",{
            data:filteredTask
        });
    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
});

//Route to direct user to the task profile page
router.get("/description",isAuthenticated,(req,res)=>{

    
})


//Route to direct user to edit task form
router.get("/edit/:id", (req,res)=>{
    //return an array. Use the find when you want to pull all the document from a data collection
    //taskModel.find() 
    
    //id here means the same as :id in the route; this means it is getting a parameter from the URL
    taskModel.findById(req.params.id)
    .then((task)=>{
        const {_id, title, description, priority, status} = task;
        const formattedDueDate = moment(task.dueDate).format('YYYY-MM-DD');
        res.render("Task/taskEditForm", {
            _id
            , title
            , description
            , formattedDueDate
            , priority
            , status
        })
    })
    .catch(err=>console.log(`Error happened when pulling from the database :${err}`));
})

//Route to update user data after they submit the form
//A form cannot send a put or a delete request; only get and post 
//Html links natively perform only get requests
router.put("/update/:id",(req, res)=>{
    const task = 
    {
        title: req.body.title
        , description: req.body.description
        , dueDate: req.body.dueDate
        , priority: req.body.priority
        , status: req.body.status
    }

    //an object with the conditions, an object with the updated object;
    taskModel.updateOne({_id:req.params.id},task)
    .then(()=>{
        res.redirect("/task/list")
    })
    .catch(err=>console.log(`Error happened when updating data from the input :${err}`));
});

//router to delete user
router.delete("/delete/:id",(req, res)=>{
    //one parameter: the object you want to delete
    taskModel.deleteOne({_id:req.params.id})
    .then(()=>{
        res.redirect("/task/list")
    })
    .catch(err=>console.log(`Error happened when deleting data from the database :${err}`));
});

module.exports=router;