const { tool } = require("@langchain/core/tools"); 
const axios = require("axios");
const { z } = require("zod");

const CreatePlaylist = tool({
  name: "CreatePlaylist",
  description:
    "Creates a music playlist based on user mood, genre or activity.",
  // schema define kar rahe hain inputs ke liye input structure ko validate karne ke liye 
  schema: z.object({
    mood: z.string().min(1).describe("Mood like sad, happy, romantic, gym"),
    maxsize: z
      .number()
      .min(1, "Minimum 1 song required")
      .max(20) // user bol sakta 50 bhi — but hum limit set karenge logic me
      .describe("Requested number of songs"),
  }),

  async func({ mood, maxsize }) {
    try {
     
      if (maxsize < 1) maxsize = 1;
      if (maxsize > 6) maxsize = 6;

      const CreatePlaylistApi = await axios.post(
        "http://localhost:4000/api/playlist/create",
        {
          mood,
          maxsize,
        }
      );

      return {
        message: "Playlist created successfully",
        mood,
        finalSongCount: maxsize,
        playlist: CreatePlaylistApi.data.playlist,
      };
    } catch (err) {
      throw new Error("Error creating playlist: " + err.message);
    }
  },
});

// user sirf apne and artist fetch kar sakta hai saari nahi 
const PlayPlaylistSong = tool({
  name: "PlayPlaylistSong",
  description: "Plays a specific song from a playlist based on user request.",

  schema: z.object({
    namePlaylist: z
      .string()
      .min(1, "Playlist name is required")
      .describe("Playlist name to play"),
  }),

  async func({ namePlaylist }) {
    try {
      const PlayPlaylistSongApi = await axios.post(
        "http://localhost:4000/api/playlist/play",
        {
          namePlaylist,
        }
      );

      return {
        message: "Song playing successfully",
        playlist: namePlaylist,
        song: PlayPlaylistSongApi.data?.song || "Song started",
      };
    } catch (err) {
      throw new Error("Error playing song from playlist: " + err.message);
    }
  },
});


module.exports={CreatePlaylist, PlayPlaylistSong}

