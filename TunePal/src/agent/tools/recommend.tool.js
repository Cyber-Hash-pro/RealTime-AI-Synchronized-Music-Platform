const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const RecommendSong = tool(
  async ({ mood }) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/song/recommend",
        {
          mood,
        }
      );

      return JSON.stringify({
        message: `Recommended songs for mood: ${mood}`,
        mood,
        songs: res.data?.songs || [],
      });
    } catch (err) {
      throw new Error("Error recommending songs: " + err.message);
    }
  },
  {
    name: "RecommendSong",
    description:
      "Recommends songs based on user mood, activity or preference.",
    schema: z.object({
      mood: z
        .string()
        .min(1, "Mood is required")
        .describe("User mood like sad, happy, romantic, gym, chill"),
    }),
  }
);

module.exports = { RecommendSong };
