const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const SongDetails = tool(
  async ({ nameSong }) => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/song/details",
        {
          params: { nameSong },
        }
      );

      return JSON.stringify(res.data);
    } catch (err) {
      throw new Error("Error fetching song details: " + err.message);
    }
  },
  {
    name: "SongDetails",
    description:
      "Provides detailed information about a specific song, including artist, album, release date, and genre.",
    schema: z.object({
      nameSong: z
        .string()
        .min(1, "Song name is required")
        .describe("Name of the song to get details for"),
    }),
  }
);

module.exports = { SongDetails };
