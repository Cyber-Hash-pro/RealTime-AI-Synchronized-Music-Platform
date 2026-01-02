const { tool } = require("@langchain/core/tools"); 
const axios = require("axios");
const { z } = require("zod");

const CreatePlaylist = tool(
  async ({ mood, maxsize, token }) => {
    try {
      const finalSize = Math.min(Math.max(Number(maxsize), 1), 6);
      console.log(`Creating playlist with mood: ${mood}, size: ${finalSize}`);

      const res = await axios.post(
        "http://localhost:3001/api/playlist/create",
        { mood, maxsize: finalSize },
        {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 8000,
  }
      );
      console.log("Playlist creation response:", res.data);

      return {
        message: "Playlist created successfully",
        mood,
        finalSongCount: finalSize,
        playlist: res.data.playlist,
      };
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || "Error creating playlist: " + err.message
      );
    }
  },
  {
    name: "CreatePlaylist",
    description: "Creates a music playlist based on user mood, genre or activity.",
    schema: z.object({
      mood: z.string().min(1),
      maxsize: z.coerce.number().min(1).max(20),
    }),
  }
);


const PlayPlaylistSong = tool(
  async ({ namePlaylist }) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/api/playlist/play",
        { namePlaylist },
        { timeout: 8000 }
      );

      return {
        message: "Song playing successfully",
        playlist: namePlaylist,
        song: res.data?.song || "Song started",
      };
    } catch (err) {
      throw new Error(
        err?.response?.data?.message || "Error playing song: " + err.message
      );
    }
  },
  {
    name: "PlayPlaylistSong",
    description: "Plays a song from a playlist.",
    schema: z.object({
      namePlaylist: z.string().min(1),
    }),
  }
);

module.exports = { CreatePlaylist, PlayPlaylistSong };
