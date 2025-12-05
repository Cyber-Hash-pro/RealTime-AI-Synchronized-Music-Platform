const mongoose =require('mongoose');
const { user } = require('../../../Users/src/data/dummyData');

const likeSongSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,required:true},
    songId:{type:mongoose.Schema.Types.ObjectId,ref:'music',required:true}
})
const LikeSong = mongoose.model('LikeSong',likeSongSchema);

module.exports=LikeSong;