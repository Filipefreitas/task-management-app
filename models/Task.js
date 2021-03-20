const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//This indicates the shape of the documents that will be entering the database
  const taskSchema = new Schema({
    title:
    {
        type: String
        , required:true        
    }
    , description:
    {
        type: String
        , required: true        
    }
    , description:
    {
        type: String
        , required: true        
    }
    , dueDate:
    {
        type: Date
        , required: true        
    }
    , priority:
    {
        type: String
        , required: true        
    }
    , status:
    {
        type: String
        , default:"Open"        
    }
    , dateCreated:
    {
        type: Date
        , default: Date.now()        
    }
});

/*a
    For every Schema, you must also create a model object
    Model will allow you to perform CRUD operations in a given collection
    Create one schema per collection
*/

const taskModel = mongoose.model('Task', taskSchema);

module.exports = taskModel;