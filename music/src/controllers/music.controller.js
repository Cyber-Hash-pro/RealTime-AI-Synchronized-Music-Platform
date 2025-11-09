const musicModel = require('../model/music.model.js');
const playlistModel = require('../model/playlist.model.js');
const {uploadMusicAndCover} = require('../services/storge.service.js')
const UserPlaylist = require('../model/userplaylist.model.js');

const uploadMusic = async(req,res)=>{
// console.log(req)
console.log('Files received:', req);
const coverImageFile = req.files['coverImage'][0];
const musicFile = req.files['music'][0];

try{

    const uploadResult = await uploadMusicAndCover(musicFile, coverImageFile);
    // console.log('Upload Result:', uploadResult);

    const music = await musicModel.create({
        title:req.body.title,
        artist:req.user.fullName.firstName + " " + req.user.fullName.lastName,
        artistId:req.user.id,
         musicUrl:uploadResult.audio.url,
         coverUrl:uploadResult.coverImage.url
        
        
    })
    return res.status(201).json({message:"Music uploaded successfully", music:music})

}catch(error){
    return res.status(500).json({message:"Server error", error})
}




}
const getArtistMusic = async(req,res)=>{
    try{
        // const musics = await musicModel.find({artistId:req.user.id}).lean(); .lean() se obj kese data milta hae defalut wo mongoose object jesa send karta hae but .lean se simple json object milta hae

        const musics = await musicModel.find({artistId:req.user.id});
        return res.status(200).json({message:"Artist music fetched successfully", musics:musics})

    }catch(error){
        return res.status(500).json({message:"Server error", error})
    }  
}

const createPlaylist  = async(req,res)=>{
    const {title,musics} = req.body;
    const user= req.user
    try{
        const playlist = await playlistModel.create({
            title:title,
            artist:user.fullName.firstName+" "+user.fullName.lastName,
            artistId:user.id,
            musics:musics
        })
        return res.status(201).json({
            message:"Playlist created Successfull",
            playlist
        })

    }catch(error){
        console.log("Error in creating playlist", error);
        return res.status(500).json({message:"Internal servver error", error})

    }

}

const getPlaylists = async(req,res)=>{
    try{
        const playlists = await playlistModel.find({artistId:req.user.id});
        return res.status(200).json({message:"Playlists fetched successfully", playlists:playlists})

    }catch(error){
        console.log("Error in fetching playlists", error);
        return res.status(500).json({message:"Internal server error", error})

    }
}

const getAllMusic= async(req,res)=>{
    const {skip=0, limit=10} = req.query; // first page me 10 item dikhana hae next click karne par 10 aur dikhana hae 
    try{
        const musics = await musicModel.find().skip(parseInt(skip)).limit(parseInt(limit)).lean();
        return res.status(200).json({message:"Music fetched successfully", musics:musics})

    }catch(error){
        console.log("Error in fetching all music", error);
        return res.status(500).json({message:"Internal server error", error})

    }
}
const getPlaylistById= async(req,res)=>{
    const playlistId = req.params.id;
    try{
        const playlist = await playlistModel.findById(playlistId).lean();
        if(!playlist){
            return res.status(404).json({message:"Playlist not found"})
        }
        return res.status(200).json({message:"Playlist fetched successfully", playlist:playlist})

    }catch(error){
        console.log("Error in fetching playlist by id", error);
        return res.status(500).json({message:"Internal server error", error})

    }

}

const getMusicById= async(req,res)=>{
    const musicId = req.params.id;
    try{
        const music = await musicModel.findById(musicId).lean();
        if(!music){
            return res.status(404).json({message:"Music not found"})
        }
        return res.status(200).json({message:"Music fetched successfully", music:music})

    }catch(error){
        console.log("Error in fetching music by id", error);
        return res.status(500).json({message:"Internal server error", error})

    }

}   
 const getAllPlaylists = async(req,res)=>{
    try{
        const playlists = await playlistModel.find().lean().select('-artistId').select('_id');
        return res.status(200).json({message:"All Playlists fetched successfully", playlists:playlists})

    }catch(error){
        console.log("Error in fetching all playlists", error);
        return res.status(500).json({message:"Internal server error", error})

    }
}   

const createUserPlaylist = async(req,res)=>{
    const {title,musics} = req.body;
    const user= req.user
    try{
        const playlist = await UserPlaylist.create({
            title:title,
            userId:user.id,
            musics:musics
        })
        return res.status(201).json({
            message:"User Playlist created Successfull",
            playlist
        })

    }catch(error){
        console.log("Error in creating user playlist", error);
        return res.status(500).json({message:"Internal servver error", error})

    }

}           
const getUserPlaylists = async(req,res)=>{
    try{
        const playlists = await UserPlaylist.find({userId:req.user.id});
        return res.status(200).json({message:"User Playlists fetched successfully", playlists:playlists})

    }catch(error){
        console.log("Error in fetching user playlists", error);
        return res.status(500).json({message:"Internal server error", error})

    }
}   


module.exports = {uploadMusic,getArtistMusic,createPlaylist,getPlaylists,getAllMusic,getPlaylistById,getMusicById,getAllPlaylists,createUserPlaylist,getUserPlaylists};