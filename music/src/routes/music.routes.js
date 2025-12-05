const express = require('express');
const router = express.Router();
const authMiddlware = require('../middlewares/auth.middleware.js');
const musicController = require('../controllers/music.controller.js');
const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage()
})
// for upload music :- Artist only
router.post('/upload',authMiddlware.authArtistMiddleware,
    upload.fields([{ name: 'music', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]),musicController.uploadMusic);
// for all  song fetch home page user ke liye 
router.get('/',authMiddlware.authUserMiddleware, musicController.getAllMusic);    
// for get music by id
router.get('/get-details/:id',authMiddlware.authUserMiddleware, musicController.getMusicById);
// for get artist music for :- Artist only jo song artist ne upload kiye hae use fetch karne ke liye
router.get('/artist-music',authMiddlware.authArtistMiddleware, musicController.getArtistMusic);
// for get all playlists for jo playlist artist ne banayi hae use user ke liye sho remian image fetch remain
router.get('/allPlaylist',authMiddlware.authUserMiddleware,musicController.getAllPlaylists);
// for create playlist :- Artist only add image upload ka option add karna
router.post('/playlist',authMiddlware.authArtistMiddleware,musicController.createPlaylist);
// 
router.get('/playlist',authMiddlware.authUserMiddleware,musicController.getPlaylists);

// Jo playlist aritst ne create ki hae user uske liye pertific playlist fetch karne ke liye
router.get('/playlist/:id',authMiddlware.authUserMiddleware,musicController.getPlaylistById);
// 
router.post('/createUserPlaylist',authMiddlware.authUserMiddleware,musicController.createUserPlaylist);
router.get('/userPlaylists',authMiddlware.authUserMiddleware,musicController.getUserPlaylists);
router.get('/playlist/user/:id',authMiddlware.authUserMiddleware,musicController.getSpecificUserPlaylists);


router.get('/mood-dectect/:mood',authMiddlware.authUserMiddleware, musicController.getMusicByMood);

router.get('/all/likedSongs',authMiddlware.authUserMiddleware,musicController.getAllLikedSongs);
router.post('/likeSong/:id',authMiddlware.authUserMiddleware,musicController.likeSong);

router.get('/search/:query', authMiddlware.authUserMiddleware, musicController.searchMusic);

module.exports = router;
