const tool = require('@langchain/core/tools')


const recommendSong= tool({
    name: 'RecommendSong',
    description: 'Recommends a song based on user preferences such as genre, mood, and activities.',
    func : async ({})=>{

    }

})

module.exports={recommendSong}  