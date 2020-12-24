const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const EntrySchema = mongoose.Schema({
    baslik: {
        type: ObjectId,
        ref : 'Baslik',
        required : [true, "Entrynin bir başlığı olmalı"]
    },
    ownerId: {
        type: ObjectId,
        ref : 'User',
        required : [true, "Entrynin sahibi olmalı"]
    },
    icerik : {
        type : String,
        maxlength : [5000, "Girdi beşbin karakterden uzun olamaz"],
        required : [true, "Boş entry girilemez"]
    },
    likeCount: {
        type: Number,
        default : 0,
    },
    gorunur : {
        type: Boolean,
        default : true
    },
    pinned : {
        type: Boolean,
        default: false
    },
    first: {
        type: Boolean,
        default : false
    },
    photo1: {
        type: String,
        default : "no-photo.jpg"
    },
    photo2: {
        type: String,
        default : "no-photo.jpg"
    },
    photo3: {
        type: String,
        default : "no-photo.jpg"
    },
    photo4: {
        type: String,
        default : "no-photo.jpg"
    }
},
{timestamps: true,
    toJSON: {
        virtuals : true
    },
    toObject: {
        virtuals : true
    }});

EntrySchema.pre('remove', async function(next){
    console.log(`Courses being removed from entry ${this._id}`);
    await this.model('Yorum').deleteMany({entry : this._id});
    next();
});

EntrySchema.virtual('yorumlar', {
    ref : 'Yorum',
    localField : "_id",
    foreignField : 'entry',
    justOne : false
});

module.exports = mongoose.model('Entry', EntrySchema);