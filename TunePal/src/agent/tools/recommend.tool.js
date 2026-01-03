const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const RecommendSong = tool(
  async ({ mood, token }) => {
    try {
      const res = await axios.post(
        "http://localhost:3002/api/song/recommend",
        { mood },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );

      return JSON.stringify({
        message: res.data.message || `Recommended songs for mood: ${mood}`,
        mood: res.data.mood,
        songs: res.data.songs || [],
      });
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || "Error recommending songs: " + err.message
      );
    }
  },
  {
    name: "RecommendSong",
    description:
      "Recommends up to 10 songs based on user mood, activity or preference. Returns a list of songs with details.",
    schema: z.object({
      mood: z
        .string()
        .min(1, "Mood is required")
        .describe("User mood like sad, happy, romantic, gym, chill, energetic, party, focus"),
    }),
  }
);

module.exports = { RecommendSong };
