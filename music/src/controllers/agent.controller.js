const musicModel = require('../model/music.model.js');
const playlistModel = require('../model/playlist.model.js');
const UserPlaylist = require('../model/userplaylist.model.js');
const { geminisongmooddetection } = require('../services/ai.serviecs.js');

// Agent Tool: Create Playlist based on mood
const createPlaylistByMood = async (req, res) => {
    const { mood, maxsize } = req.body;
    const userId = req.user.id;
    console.log('api called createPlaylistByMood with mood:', mood, 'and maxsize:', maxsize);
    try {
        // Validate maxsize
        const finalSize = Math.min(Math.max(Number(maxsize), 1), 6);

        // Get songs matching the mood using AI service
        const songs = await musicModel.find({ mood: new RegExp(mood, 'i') })
            .limit(finalSize)
            .lean();

        if (songs.length === 0) {
            return res.status(404).json({
                message: `No songs found for mood: ${mood}`,
                playlist: []
            });
        }

        // Create a temporary playlist name
        const playlistName = `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes - ${new Date().toLocaleDateString()}`;

        // Create user playlist
        const playlist = await UserPlaylist.create({
            name: playlistName,
            userId: userId,
            musics: songs.map(song => song._id)
        });

        // Populate the music details
        const populatedPlaylist = await UserPlaylist.findById(playlist._id)
            .populate('musics')
            .lean();

        return res.status(201).json({
            message: "Playlist created successfully",
            playlist: {
                id: populatedPlaylist._id,
                name: populatedPlaylist.name,
                songs: populatedPlaylist.musics,
                count: populatedPlaylist.musics.length
            }
        });

    } catch (error) {
        console.error("Error in createPlaylistByMood:", error);
        return res.status(500).json({
            message: "Error creating playlist",
            error: error.message
        });
    }
};

// Agent Tool: Play song from playlist
const playPlaylistSong = async (req, res) => {
    const { namePlaylist } = req.body;
    const userId = req.user.id;

    try {
        // Find the playlist by name for the user
        const playlist = await UserPlaylist.findOne({
            name: new RegExp(namePlaylist, 'i'),
            userId: userId
        }).populate('musics').lean();

        if (!playlist) {
            // Try artist playlists as fallback
            const artistPlaylist = await playlistModel.findOne({
                title: new RegExp(namePlaylist, 'i')
            }).populate('musics').lean();

            if (!artistPlaylist) {
                return res.status(404).json({
                    message: `Playlist "${namePlaylist}" not found`
                });
            }

            // Return first song from artist playlist
            const firstSong = artistPlaylist.musics[0];
            return res.status(200).json({
                message: "Playing song from playlist",
                song: {
                    id: firstSong._id,
                    title: firstSong.title,
                    artist: firstSong.artist,
                    musicUrl: firstSong.musicUrl,
                    coverUrl: firstSong.coverUrl
                },
                playlist: artistPlaylist.title
            });
        }

        // Return first song from user playlist
        const firstSong = playlist.musics[0];
        return res.status(200).json({
            message: "Playing song from playlist",
            song: {
                id: firstSong._id,
                title: firstSong.title,
                artist: firstSong.artist,
                musicUrl: firstSong.musicUrl,
                coverUrl: firstSong.coverUrl
            },
            playlist: playlist.name
        });

    } catch (error) {
        console.error("Error in playPlaylistSong:", error);
        return res.status(500).json({
            message: "Error playing song from playlist",
            error: error.message
        });
    }
};

// Agent Tool: Play a specific song by name
const playSong = async (req, res) => {
    const { nameSong } = req.body;

    try {
        // Search for song by title (case-insensitive)
        const song = await musicModel.findOne({
            title: new RegExp(nameSong, 'i')
        }).lean();

        if (!song) {
            return res.status(404).json({
                message: `Song "${nameSong}" not found`
            });
        }

        return res.status(200).json({
            message: "Song found",
            song: {
                id: song._id,
                title: song.title,
                artist: song.artist,
                musicUrl: song.musicUrl,
                coverUrl: song.coverUrl,
                mood: song.mood
            }
        });

    } catch (error) {
        console.error("Error in playSong:", error);
        return res.status(500).json({
            message: "Error playing song",
            error: error.message
        });
    }
};

// Agent Tool: Recommend songs by mood
const recommendSongs = async (req, res) => {
    const { mood } = req.body;

    try {
        // Find songs matching the mood
        const songs = await musicModel.find({
            mood: new RegExp(mood, 'i')
        }).limit(10).lean();

        if (songs.length === 0) {
            return res.status(404).json({
                message: `No songs found for mood: ${mood}`,
                songs: []
            });
        }

        return res.status(200).json({
            message: `Recommended songs for mood: ${mood}`,
            mood: mood,
            songs: songs.map(song => ({
                id: song._id,
                title: song.title,
                artist: song.artist,
                musicUrl: song.musicUrl,
                coverUrl: song.coverUrl,
                mood: song.mood
            }))
        });

    } catch (error) {
        console.error("Error in recommendSongs:", error);
        return res.status(500).json({
            message: "Error recommending songs",
            error: error.message
        });
    }
};

// Agent Tool: Get song details by name
const getSongDetails = async (req, res) => {
    const { nameSong } = req.query;

    try {
        // Search for song by title (case-insensitive)
        const song = await musicModel.findOne({
            title: new RegExp(nameSong, 'i')
        }).lean();

        if (!song) {
            return res.status(404).json({
                message: `Song "${nameSong}" not found`
            });
        }

        return res.status(200).json({
            id: song._id,
            title: song.title,
            artist: song.artist,
            musicUrl: song.musicUrl,
            coverUrl: song.coverUrl,
            mood: song.mood,
            createdAt: song.createdAt
        });

    } catch (error) {
        console.error("Error in getSongDetails:", error);
        return res.status(500).json({
            message: "Error fetching song details",
            error: error.message
        });
    }
};

module.exports = {
    createPlaylistByMood,
    playPlaylistSong,
    playSong,
    recommendSongs,
    getSongDetails
};
