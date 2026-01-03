const musicModel = require('../model/music.model.js');
const playlistModel = require('../model/playlist.model.js');
const UserPlaylist = require('../model/userplaylist.model.js');
const { geminisongmooddetection } = require('../services/ai.serviecs.js');
// Agent Tool: Create Playlist based on mood
const createPlaylistByMood = async (req, res) => {
    const { mood, maxsize,title } = req.body;
    const userId = req.user.id;
    console.log('api called createPlaylistByMood with mood:', mood, 'and maxsize:', maxsize);
    try {
        // Validate maxsize
        const finalSize = Math.min(Math.max(Number(maxsize), 1), 6);

        // Get songs matching the mood using AI service radmon song
     const songs = await musicModel.aggregate([
  { $match: { mood: new RegExp(mood, 'i') } },
  { $sample: { size: finalSize } }
]);

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
            title:title,
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
// kya baki hae title second madhe artistplaylist ani userplaylist madhe song fetch slvoe 

// Agent Tool: Play song from playlist

const playPlaylistSong = async (req, res) => {
  const { namePlaylist } = req.body;
  const userId = req.user?.id;   // if login required, else optional

  try {
    let userPlaylist = null;
    let artistPlaylist = null;

    // Fetch User Playlist if user logged in
    if (userId) {
      userPlaylist = await UserPlaylist.findOne({
        title: new RegExp(namePlaylist, "i"),
        userId
      })
        .populate("musics")
        .lean();
    }

    // Fetch Artist Playlist
    artistPlaylist = await playlistModel
      .findOne({
        title: new RegExp(namePlaylist, "i"),
      })
      .populate("musics")
      .lean();

    // Agar dono nahi mile
    if (!userPlaylist && !artistPlaylist) {
      return res.status(404).json({
        message: `Playlist "${namePlaylist}" not found`
      });
    }

    let response = {};

    // If User Playlist Found
    if (userPlaylist) {
      if (userPlaylist.musics?.length > 0) {
        response.userPlaylist = {
          title: userPlaylist.title,
          songs: userPlaylist.musics.map(song => ({
            id: song._id,
            title: song.title,
            artist: song.artist,
            musicUrl: song.musicUrl,
            coverUrl: song.coverUrl
          }))
        };
      } else {
        response.userPlaylist = "User playlist empty";
      }
    }

    // If Artist Playlist Found
    if (artistPlaylist) {
      if (artistPlaylist.musics?.length > 0) {
        response.artistPlaylist = {
          title: artistPlaylist.title,
          songs: artistPlaylist.musics.map(song => ({
            id: song._id,
            title: song.title,
            artist: song.artist,
            musicUrl: song.musicUrl,
            coverUrl: song.coverUrl
          }))
        };
      } else {
        response.artistPlaylist = "Artist playlist empty";
      }
    }

    return res.status(200).json({
      message: "Playlist(s) fetched successfully",
      ...response
    });

  } catch (error) {
    console.error("Error in playPlaylistSong:", error);
    return res.status(500).json({
      message: "Error fetching playlist",
      error: error.message
    });
  }
};


// Agent Tool: Play a specific song by name
const FindSong = async (req, res) => {
  const { nameSong } = req.body;

  try {
    if (!nameSong || !nameSong.trim()) {
      return res.status(400).json({
        success: false,
        message: "Song name is required"
      });
    }

    const song = await musicModel.findOne({
      title: { $regex: new RegExp(nameSong, "i") }   // case-insensitive
    }).lean();

    if (!song) {
      return res.status(404).json({
        success: false,
        message: `No song found with name "${nameSong}"`,
        hint: "Try another song name or check spelling"
      });
    }

    return res.status(200).json({
      success: true,
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
    console.error("Error in FindSong:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while searching song",
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
    FindSong,
    recommendSongs,
    getSongDetails
};
