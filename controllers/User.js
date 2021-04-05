/*********************USER ROUTES***************************/
const express = require('express');
const { isValidObjectId } = require('mongoose');
const router = express.Router();
const userModel = require("../models/User");
const path = require("path"); //native. Does not need to be installed
const bcrypt = require('bcryptjs');
const isAuthenticated = require("../middleware/auth");
const dashboardLoader = require("../middleware/authorization");

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
                    /*res.redirect(`/user/profile/${user._id}`);*/
                    res.redirect(`/user/login`);
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
    //search to see it email exists
    //findById only allows you to serach by the object id
    //findOne allows you to search by any key, but you have to pass an object 
    userModel.findOne({email:req.body.email})
    .then(user=>{
        const errors = [];

        //email not found
        if(user==null)
        {
            errors.push("Sorry, your email and/or password is incorrect");
            res.render("User/login", {
                //long syntax
                /*data : errors*/
                errors
            })
        }

        //email found
        else
        {
            //search to check if password matches the encrypter password
            bcrypt.compare(req.body.password, user.password)
            .then(isMatched=>{
                if(isMatched)
                {
                    //create session
                    //userInfo is the name of the session, having the entire user document assigned to it
                    req.session.userInfo = user;
                    res.redirect("/user/profile");

                }
                else
                {   
                    errors.push("Sorry, your email and/or password is incorrect");
                    res.render("User/login", {
                        errors
                    })
                }
            })
            .catch(err=>console.log(`Error ${err}`))
        }
    })
    .catch(err=>console.log(`Error ${err}`));
});

router.get("/profile",isAuthenticated,dashboardLoader);

/*
//since the session has been added, it is no longer needed to add dynamic id route: 
router.get("/profile",isAuthenticated,(req,res)=>
{
    
    res.render("User/userDashboard");
    
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


router.get("/admin-profile",isAuthenticated,(req,res)=>
{
    res.render("User/adminDashboard");
})
*/

//kills the session
router.get("/logout",(req,res)=>
{
    req.session.destroy();
    res.redirect("/user/login");
})

module.exports=router;