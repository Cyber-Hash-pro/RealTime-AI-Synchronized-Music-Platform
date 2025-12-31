const { Annotation } = require("langgraph");

const State = Annotation.Root({
  messages: Annotation.Messages(),   // Chat conversation memory
  mood: Annotation.Scalar(),         // Detected mood (sad, happy, gym, etc)
  playlistRequest: Annotation.Any(), // Playlist create request data
  playlist: Annotation.Any(),        // Created / Recommended playlist result
  songRequest: Annotation.Any(),     // Song to play / details requested
  song: Annotation.Any(),            // Final song data or playing info
});

module.exports = { State };
