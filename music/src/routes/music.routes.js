const express = require('express');
const router = express.Router();
const authMiddlware = require('../middlewares/auth.middleware.js');
const musicController = require('../controllers/music.controller.js');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
})


router.post('/upload',authMiddlware.authArtistMiddleware,
    upload.fields([{ name: 'music', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]),musicController.uploadMusic);

router.get('/',authMiddlware.authUserMiddleware, musicController.getAllMusic);    
router.get('/get-details/:id',authMiddlware.authUserMiddleware, musicController.getMusicById);
router.get('/artist-music',authMiddlware.authArtistMiddleware, musicController.getArtistMusic);
router.get('/allPlaylist',authMiddlware.authUserMiddleware,musicController.getAllPlaylists);
router.post('/playlist',authMiddlware.authArtistMiddleware,musicController.createPlaylist);
router.get('/playlist',authMiddlware.authUserMiddleware,musicController.getPlaylists);
router.get('/playlist/:id',authMiddlware.authUserMiddleware,musicController.getPlaylistById);
router.post('/createUserPlaylist',authMiddlware.authUserMiddleware,musicController.createUserPlaylist);
router.get('/userPlaylists',authMiddlware.authUserMiddleware,musicController.getUserPlaylists);
module.exports = router;
