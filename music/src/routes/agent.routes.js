const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth.middleware.js');
const agentController = require('../controllers/agent.controller.js');

// Agent Tool Routes - All require user authentication

// Create playlist based on mood
router.post('/playlist/create', authMiddleware.authUserMiddleware, agentController.createPlaylistByMood);

// Play song from playlist
router.post('/playlist/play', authMiddleware.authUserMiddleware, agentController.playPlaylistSong);

// Play a specific song
router.post('/song/play', authMiddleware.authUserMiddleware, agentController.playSong);

// Recommend songs by mood
router.post('/song/recommend', authMiddleware.authUserMiddleware, agentController.recommendSongs);

// Get song details
router.get('/song/details', authMiddleware.authUserMiddleware, agentController.getSongDetails);

module.exports = router;
