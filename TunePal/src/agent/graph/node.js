// nodes.js
const { ToolMessage, AIMessage } = require("@langchain/core/messages");
const model = require("../model.js");


const {
  CreatePlaylist,
  PlayPlaylistSong,
} = require("../tools/playlist.tool");
const { PlaySong } = require("../tools/playSong.tool");
const { RecommendSong } = require("../tools/recommend.tool");
const { SongDetails } = require("../tools/songDetails.tool");

// TOOL MAP 
const tools = {
  CreatePlaylist,
  PlayPlaylistSong,
  PlaySong,
  RecommendSong,
  SongDetails,
};

// TOOLS NODE 
const toolsNode = async (state) => {
  const lastMessage = state.messages[state.messages.length - 1];
  const toolCalls = lastMessage.tool_calls || [];

  const results = await Promise.all(
    toolCalls.map(async (call) => {
      const tool = tools[call.name];
      if (!tool) throw new Error(`Tool ${call.name} not found`);

      console.log("Running Tool:", call.name, "Args:", call.args);

      const toolResult = await tool.func(call.args);

      return new ToolMessage({
        content: JSON.stringify(toolResult),
        name: call.name,
      });
    })
  );

  state.messages.push(...results);
  return state;
};

// CHAT NODE 
const chatNode = async (state) => {
  console.log("Chat Node Invoked. Current Messages:", state.messages);
  const response = await model.invoke(state.messages, {
    tools: Object.values(tools),
  });
  console.log("Model Response:", response);

  state.messages.push(
    new AIMessage({
      content: response.text,
      tool_calls: response.tool_calls,
    })
  );

  return state;
};

module.exports = {
  chatNode,
  toolsNode,
  tools,
};
