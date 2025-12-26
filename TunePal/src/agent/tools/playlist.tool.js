const tool = require('@langchain/core/tools')
const { name } = require('mustache')


const CreatePlaylist= tool({
    name: 'CreatePlaylist',
    description: 'Creates a music playlist based on user preferences such as genre, mood, and activities.',
    func : async ({})=>{


    }
   
})

const PlayPlaylistSong = tool({
    name: 'PlayPlaylistSong',
    description: 'Plays a specific song from a playlist based on user request.',
    func : async ({})=>{

    }

})

module.exports={CreatePlaylist, PlayPlaylistSong}

