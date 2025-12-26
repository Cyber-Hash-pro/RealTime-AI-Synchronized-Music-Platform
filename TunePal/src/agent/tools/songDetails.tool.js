const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const SongDetails = tool({
  name: "SongDetails",
  description:
    "Provides detailed information about a specific song, including artist, album, release date, and genre.",

  schema: z.object({
    nameSong: z
      .string()
      .min(1, "Song name is required")
      .describe("Name of the song to get details for"),
  }),

  async func({ nameSong }) {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/song/details",
        {
          params: { nameSong },
        }
      );

      return res.data;   // 💡 AI ko ye hi milega
    } catch (err) {
      throw new Error("Error fetching song details: " + err.message);
    }
  },
});

module.exports = { SongDetails };
