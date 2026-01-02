require("dotenv").config();

const { ChatGoogleGenerativeAI } = require("@langchain/google-genai");
const { ToolMessage, AIMessage } = require("@langchain/core/messages");
const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");

const {
  CreatePlaylist,
  PlayPlaylistSong,
} = require("./tools/playlist.tool.js");
const { SongDetails } = require("./tools/songDetails.tool.js");
const { RecommendSong } = require("./tools/recommend.tool.js");
const tools = {
  CreatePlaylist,
  PlayPlaylistSong,
  SongDetails,
  RecommendSong,
};

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  apiKey: "AIzaSyCwP_clqSmyxEm0jbiVeIqNqb-Hi43fpPM",
}).bindTools(Object.values(tools));


const graph = new StateGraph(MessagesAnnotation)
  .addNode("tools", async (state, config) => {
    const last = state.messages[state.messages.length - 1];

    if (!last.tool_calls) return state;

    const results = await Promise.all(
      last.tool_calls.map(async (call) => {
        const tool = tools[call.name];
        if (!tool) throw new Error(`Tool ${call.name} not found`);
        console.log("Invoking tool:", call.name, "with args:", call.args);

        const result = await tool.invoke({
          ...call.args,
          token: config?.metadata?.token,
        });

        return new ToolMessage({
          name: call.name,
          content: result,
          tool_call_id: call.id,
        });
      })
    );

    state.messages.push(...results);
    return state;
  })

  .addNode("chat", async (state) => {
    const res = await model.invoke(state.messages, {
      tools: Object.values(tools),
    });

    state.messages.push(
     new AIMessage(res.content, { tool_calls: res.tool_calls })

    );

    return state;
  })

  .addEdge("__start__", "chat")
  .addConditionalEdges("chat", (state) => {
    const last = state.messages[state.messages.length - 1];
    return last.tool_calls?.length ? "tools" : "__end__";
  })
  .addEdge("tools", "chat");

const agent = graph.compile();

module.exports = { agent };
