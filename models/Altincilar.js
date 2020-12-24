const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const AltinciSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, "Please add a name"],
        maxlength : [50, "Name can not be longer than 50 character"],
        trim : true,
        unique : true
    },
    owner : {
        type: ObjectId,
        ref : 'User',
        required : [true, "Category must have an owner"]
    },
    description : {
        type: String,
        maxlength : [100, "Description cannot be longer than 100 character"],
        trim : true
    },
    photo : {
        type : String,
        default : 'no-photo.jpg'
    },
    altalt : {
        type: String,
        default : "genel"
    }
},{timestamps : true}
);

module.exports = mongoose.model('Altinci', AltinciSchema);