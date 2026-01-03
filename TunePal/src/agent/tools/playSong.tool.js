const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const FindSong = tool(
  async ({ nameSong, token }) => {
    try {
      const res = await axios.post(
        "http://localhost:3002/agent/song/find",
        { nameSong },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 8000,
        }
      );

      return JSON.stringify({
        success: res.data.success,
        message: res.data.message,
        song: res.data.song,
      });
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || "Error finding song: " + err.message
      );
    }
  },
  {
    name: "FindSong",
    description: "Finds and plays a specific song by name. Returns song details including title, artist, music URL, cover URL, and mood.",
    schema: z.object({
      nameSong: z
        .string()
        .min(1, "Song name is required")
        .describe("Name or title of the song to find and play"),
    }),
  }
);

module.exports = { FindSong };