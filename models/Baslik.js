const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const BaslikSchema = new mongoose.Schema({
    yonlendirme: {
        type: ObjectId,
        ref : 'Baslik',
    },

    name : {
        type: String,
        required : [true, "Please add a name"],
        trim: true,
        maxlength : 85,

    },
    altinci :{
        type: ObjectId,
        ref : 'Altinci',
        required : [true, "Başlığın bir kategorisi olmalıdır"]
    },
    tag : {
        type: String,
        maxlength : 40
    },
    photo : {
        type: String,
        default : "no-photo.jpg"
    },
    entryCount : {
        type: Number,
        default : 0
    },
    modSecimi : {
        type: Boolean,
        default : false
    },
    gorunur : {
        type: Boolean,
        default : true
    },
    trendingPoint:{
        type: Number,
        required : true
    }
},
{timestamps : true}
);


module.exports = mongoose.model('Baslik', BaslikSchema);