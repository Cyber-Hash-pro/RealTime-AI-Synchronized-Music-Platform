const { tool } = require("@langchain/core/tools"); 
const axios = require("axios");
const { z } = require("zod");

const CreatePlaylist = tool(
  async ({ mood, maxsize, title, token }) => {
    try {
      const finalSize = Math.min(Math.max(Number(maxsize) || 5, 1), 6);
      console.log(`Creating playlist with mood: ${mood}, size: ${finalSize}`);

      const res = await axios.post(
        "http://localhost:3002/api/playlist/create",
        { mood, maxsize: finalSize, title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000,
        }
      );
      console.log("Playlist creation response:", res.data);

      return JSON.stringify({
        message: res.data.message || "Playlist created successfully",
        mood,
        finalSongCount: finalSize,
        playlist: res.data.playlist,
      });
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || "Error creating playlist: " + err.message
      );
    }
  },
  {
    name: "CreatePlaylist",
    description: "Creates a music playlist based on user mood, genre or activity. Returns the created playlist with songs.",
    schema: z.object({
      mood: z.string().min(1).describe("User mood like happy, sad, romantic, energetic, chill"),
      maxsize: z.coerce.number().min(1).max(20).default(5).describe("Maximum number of songs in playlist (1-20)"),
      title: z.string().optional().describe("Optional custom title for the playlist"),
    }),
  }
);


const PlayPlaylistSong = tool(
  async ({ namePlaylist, token }) => {
    try {
      const res = await axios.post(
        "http://localhost:3002/api/playlist/play",
        { namePlaylist },
        { 
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 10000 
        }
      );

      return JSON.stringify({
        message: res.data.message || "Playlist fetched successfully",
        playlist: namePlaylist,
        userPlaylist: res.data.userPlaylist,
        artistPlaylist: res.data.artistPlaylist,
      });
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || "Error fetching playlist: " + err.message
      );
    }
  },
  {
    name: "PlayPlaylistSong",
    description: "Fetches and plays songs from a user or artist playlist by name.",
    schema: z.object({
      namePlaylist: z.string().min(1).describe("Name or title of the playlist to play"),
    }),
  }
);

module.exports = { CreatePlaylist, PlayPlaylistSong };
