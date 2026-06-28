import mongoose, { Schema } from "mongoose";

const playlistSchema = new mongoose.Schema({
    name:{
        type: String,
        // unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    visibility: {
        type: Boolean,
        default: false
    },
    videos:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps: true})

export const Playlist = mongoose.model("Playlist", playlistSchema)