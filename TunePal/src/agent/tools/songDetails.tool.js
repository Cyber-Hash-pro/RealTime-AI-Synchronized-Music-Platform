const tool = require('@langchain/core/tools')

const SongDetails= tool({
    name: 'SongDetails',
    description: 'Provides detailed information about a specific song, including artist, album, release date, and genre.',
    func : async ({})=>{

    }

})

module.exports={SongDetails}