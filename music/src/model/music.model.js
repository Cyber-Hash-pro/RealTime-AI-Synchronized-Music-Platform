const mongoose = require('mongoose');


const musicSchema = new mongoose.Schema({
    title: { type   : String, required: true },
    artist: { type: String, required: true },
    artistId: { type: mongoose.Schema.Types.ObjectId },
    musicUrl: { type: String, required: true },
    coverUrl: { type: String ,required: true }, 
    imageUrl:{ type: String },

}, { timestamps: true });

const music = mongoose.model('music', musicSchema);

module.exports = music;