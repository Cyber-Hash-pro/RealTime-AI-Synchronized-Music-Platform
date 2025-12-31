// agent.js
const { StateGraph, MessagesAnnotation } = require("@langchain/langgraph");
const { chatNode, toolsNode } = require("./graph/node.js");

const graph = new StateGraph(MessagesAnnotation)
  // Nodes
  .addNode("chat", chatNode)
  .addNode("tools", toolsNode)

  // Flow
  .addEdge("__start__", "chat")
  .addConditionalEdges("chat", async (state) => {
    const last = state.messages[state.messages.length - 1];
    if (last.tool_calls && last.tool_calls.length > 0) {
      return "tools";
    }
    return "__end__";
  })
  .addEdge("tools", "chat");

const agent = graph.compile();

module.exports = agent;
