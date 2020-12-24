const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;
const YorumSchema = new mongoose.Schema({
    owner: {
        type: ObjectId,
        ref : 'User',
    },
    neyeCevap : {
        type: String,
        enum : ["entrye", "yoruma"]
    },
    yorumaCevap:{
        type: ObjectId,
        ref : 'Yorum',
        required: false
    },
    icerik : {
        type: String,
        maxlength : 2000,
        trim: true,
        required: [true, "Yorumun içeriği olmalıdır"]
    },
    hangiEntryeCevap : {
        type : ObjectId,
        ref: 'Entry',
        required: false
    },
    gorunur: {
        type: Boolean,
        default : true
    }
}
,{timestamps : true});

module.exports = mongoose.model('Yorum', YorumSchema);