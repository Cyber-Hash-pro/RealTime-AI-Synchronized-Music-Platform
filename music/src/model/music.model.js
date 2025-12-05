const mongoose = require('mongoose');


const musicSchema = new mongoose.Schema({
    title: { type   : String, required: true },
    artist: { type: String, required: true }, // name of artist 
    artistId: { type: mongoose.Schema.Types.ObjectId },
    musicUrl: { type: String, required: true },
    coverUrl: { type: String ,required: true }, 
    mood: { type: String ,
    // enum: ['happy', 'sad', 'energetic', 'calm', 'romantic', 'motivational', 'party', 'chill', 'focus', 'sleep','neutral'],  
     }
  

}, { timestamps: true });

musicSchema.index({ title: 'text', artist: 'text' });
const music = mongoose.model('music', musicSchema);

module.exports = music;