const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const RecommendSong = tool({
  name: "RecommendSong",
  description:
    "Recommends songs based on user mood, activity or preference.",

  schema: z.object({
    mood: z
      .string()
      .min(1, "Mood is required")
      .describe("User mood like sad, happy, romantic, gym, chill"),
  }),

  async func({ mood }) {
    try {
    
      const res = await axios.post(
        "http://localhost:4000/api/song/recommend",
        {
          mood,
          
        }
      );

      return {
        message: `Recommended songs for mood: ${mood}`,
        mood,
        songs: res.data?.songs || [],
      };
    } catch (err) {
      throw new Error("Error recommending songs: " + err.message);
    }
  },
});

module.exports = { RecommendSong };
