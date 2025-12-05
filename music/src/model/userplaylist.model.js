const mongoose = require('mongoose');

const userPlaylistSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    musics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'music'
    }]
}, { timestamps: true });

const UserPlaylist = mongoose.model('userPlaylist', userPlaylistSchema);

module.exports = UserPlaylist;