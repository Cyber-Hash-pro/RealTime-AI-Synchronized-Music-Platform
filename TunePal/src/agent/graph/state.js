const { Annotation } = require("langgraph");

// Yeh Graph ki Memory (State) hai
// Saare nodes isi state me read/write karenge

const State = Annotation.Root({
  messages: Annotation.Messages(),   // AI chat memory
  mood: Annotation.Scalar(),         // mood detect store
  playlist: Annotation.Any(),        // playlist data
  song: Annotation.Any(),            // playing song info
});

module.exports = { State };
