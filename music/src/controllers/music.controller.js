const musicModel = require('../model/music.model.js');
const {uploadMusicAndCover} = require('../services/storge.service.js')


const uploadMusic = async(req,res)=>{
const musicFile = req.files['music'][0];
const coverImageFile = req.files['coverImage'][0];

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





module.exports = {uploadMusic};