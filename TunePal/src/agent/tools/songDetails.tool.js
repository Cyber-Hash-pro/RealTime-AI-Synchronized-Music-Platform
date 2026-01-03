const { tool } = require("@langchain/core/tools");
const { z } = require("zod");
const axios = require("axios");

const SongDetails = tool(
  async ({ nameSong, token }) => {
    try {
      const res = await axios.get(
        "http://localhost:3002/agent/song/details",
        {
          params: { nameSong },
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 8000,
        }
      );

      return JSON.stringify(res.data);
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || "Error fetching song details: " + err.message
      );
    }
  },
  {
    name: "SongDetails",
    description:
      "Provides detailed information about a specific song, including title, artist, music URL, cover URL, mood, and creation date.",
    schema: z.object({
      nameSong: z
        .string()
        .min(1, "Song name is required")
        .describe("Name or title of the song to get details for"),
    }),
  }
);

module.exports = { SongDetails };
