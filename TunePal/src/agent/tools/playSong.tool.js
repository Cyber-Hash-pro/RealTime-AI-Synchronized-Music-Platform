const tool = require('@langchain/core/tools')


const PlaySong= tool({
    name: 'PlaySong',
    description: 'Plays a specific song based on user request.',
    func : async ({})=>{

    }

})

module.exports={PlaySong}

