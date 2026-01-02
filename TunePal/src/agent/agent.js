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
  model: "gemini-2.5-pro",
  apiKey: process.env.GEMINI_API_KEY,
}).bindTools(Object.values(tools));


const graph = new StateGraph(MessagesAnnotation)
  .addNode("tools", async (state, config) => {
    const last = state.messages[state.messages.length - 1];
const functionCalls =
      last.content?.filter(c => c.type === "functionCall") || [];

    if (!functionCalls.length) return state;


  const results = await Promise.all(
      functionCalls.map(async (c) => {
        const { name, args } = c.functionCall;

        const tool = tools[name];
        if (!tool) throw new Error(`Tool ${name} not found`);

        console.log("----------------------------------------");
        console.log("Invoking tool:", name);
        console.log("Args:", args);

        const result = await tool.invoke({
          ...args,
          token: config?.metadata?.token,
        });

        return new ToolMessage({
          name,
          content: result,
        });
      })
    );

    state.messages.push(...results);
    return state;
  })

  .addNode("chat", async (state) => {
    console.log("Current conversation messages:", state.messages);
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
// last messsage me message jo ai hae usme function call hae ya nae
    const last = state.messages[state.messages.length - 1];


const fnCall = last.content.find(c => c.type === "functionCall");

const toolName = fnCall.functionCall.name;
const toolArgs = fnCall.functionCall.args;

console.log("Tool Name:", toolName);
console.log("Tool Args:", toolArgs);

    return fnCall ? "tools" : "__end__";
  })
  .addEdge("tools", "chat");

const agent = graph.compile();

module.exports = { agent };
// [
//   {
//     "type": "functionCall",
//     "functionCall": {
//       "name": "CreatePlaylist",
//       "args": {
//         "maxsize": 5,
//         "mood": "happy"
//       }
//     }
//   }
// ]