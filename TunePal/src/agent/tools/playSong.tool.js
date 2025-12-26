const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const PlaySong = tool({
  name: "PlaySong",
  description: "Plays a specific song based on user request.",

  schema: z.object({
    nameSong: z
      .string()
      .min(1, "Song name is required")
      .describe("Name of the song to play"),
  }),

  async func({ nameSong }) {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/song/play",
        { nameSong }
      );

      return {
        message: "Song playing",
        song: nameSong,
        data: res.data,
      };
    } catch (err) {
      throw new Error("Error playing song: " + err.message);
    }
  },
});

module.exports = { PlaySong };
