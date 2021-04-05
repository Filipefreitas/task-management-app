const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

//This indicates the shape of the documents that will be entering the database
  const userSchema = new Schema({
    firstName:
    {
        type: String
        , required: true        
    }
    , lastName:
    {
        type: String
        , required: true        
    }    
    , email:
    {
        type: String
        , required: true        
    }    
    , password:
    {
        type: String
        , required: true        

    }    
    , profilePic:
    {
        type: String
        , required: false //optional. Leaving it empty, it is automatically set to false         
    }
    , dateCreated:
    {
        type: Date
        , default: Date.now()        
    }
    , type:
    {
        type: String
        , default: "User"        
    }
});

/*a
    For every Schema, you must also create a model object
    Model will allow you to perform CRUD operations in a given collection
    Create one schema per collection
*/

//arrow functions can not be used here; there are problems with "this" keyword
//"pre" means that this will be executed before the save method
//it operates like a middleware, so it receives a next parameter
userSchema.pre("save", function(next)
{
    //salt random generates charatcters or strings
    //the higher the value, the more complex is the algorithm  >> the more expensive is in the cpu. 10 is acceptable
    bcrypt.genSalt(10)
    .then((salt)=>
    {
        //it actually hashes the password
        //two parameters: the password, as saved in the model; and the salt that was received
        bcrypt.hash(this.password, salt)

        //returns the file encrypted password
        .then((encryptedPassword)=>
        {
            this.password = encryptedPassword;
            next();
        })
        .catch(err=>console.log(`Error occured when hashing ${err}`));        
    })
    .catch(err=>console.log(`Error occured when salting ${err}`));
})
const userModel = mongoose.model('User', userSchema);

module.exports = userModel;