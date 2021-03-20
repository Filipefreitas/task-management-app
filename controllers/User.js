/*********************USER ROUTES***************************/
const express = require('express');
const { isValidObjectId } = require('mongoose');
const router = express.Router();
const userModel = require("../models/User");
const path = require("path"); //native. Does not need to be installed

//Route to direct use to Registration form
router.get("/register",(req,res)=>
{
    res.render("User/register");
});

//Route to process user's request and data when user submits registration form
router.post("/register",(req,res)=>
{ 
    const newUser = 
    {
        firstName : req.body.firstName
        , lastName: req.body.lastName
        , email: req.body.email
        , password: req.body.password
    }

    const user = userModel(newUser);
    user.save()
    .then((user)=>{
        //.name does not store the extension of the file
        //to prevent issues with getting the extions
        req.files.profilePic.name = `pro_pic_${user._id}${path.parse(req.files.profilePic.name).ext}`;
        
        //uploading the file in a server
        req.files.profilePic.mv(`public/uploads/${req.files.profilePic.name}`)
        .then(()=>
        {
            userModel.updateOne({_id:user._id}, 
                {
                    profilePic: req.files.profilePic.name
                })
                .then()
                {
                    res.redirect(`/user/profile/${user._id}`);
                }
            })
        .catch(err=>console.log(`Error while uploading profile pic ${err}`));
    })
    .catch(err=>console.log(`Error while inserting into the database ${err}`));
});

//Route to direct user to the login form
router.get("/login",(req,res)=>
{
    res.render("User/login");
});

//Route to process user's request and data when user submits login form
router.post("/login",(req,res)=>
{

    res.redirect("/user/profile/")
});

router.get("/profile/:id",(req,res)=>
{
    //query the databse to know what image to show
    userModel.findById(req.params.id)
    .then((user)=>
    {
        //destruct the object the get only the profile pic
        const {profilePic} = user;
        res.render("User/userDashboard", 
        {
            profilePic
        });
    })
    .catch(err=>console.log(`Error :${err}`))
})


module.exports=router;