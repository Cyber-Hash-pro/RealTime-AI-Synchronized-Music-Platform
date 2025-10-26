const imagekit = require('imagekit')
require('dotenv').config(); 
const mongoose = require('mongoose');

var Imagekit = new imagekit({
    publicKey:process.env.Imagekit_PUBLIC_KEY,
    privateKey:process.env.Imagekit_PRIVATE_KEY,
    urlEndpoint:process.env.Imagekit_URL_ENDPOINT
})


async function uploadToImagekit(fileBuffer, folderName, ext) {
  return new Promise((resolve, reject) => {
    Imagekit.upload(
      {
        file: fileBuffer, // actual data
        fileName: new mongoose.Types.ObjectId().toString() + ext,
        folder: folderName,
        folder: folderName,
      },
      (error, result) => {
        if (error) reject(error.message);
        else resolve(result);
      }
    );return
  });
}

async function uploadMusicAndCover(audioFile, coverImage) {
    try {
        const audioUploadResult = await  uploadToImagekit(audioFile.buffer, 'music-files-music', '.' +'.mp3');
        const coverImageUploadResult = await uploadToImagekit(coverImage.buffer, 'music-files-cover', '.' + 'jpg');
        // console.log('Audio Upload Result:', audioUploadResult);
        return {
            audio: audioUploadResult,
            coverImage: coverImageUploadResult
        };


    } catch (error) {
        throw new Error('File upload failed: ' + error);
    }
}


module.exports= {uploadMusicAndCover};