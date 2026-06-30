import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js"; 
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler( async(req, res) => {

// getting videoId from frontend
    const {videoId} = req.params

// checking if videoId is valid and it exists in dB
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "invalid video id")
    }
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404,  "video not found in dB")
    }

// finding if like exists in dB --> We will find by (user and video)
    const isLiked = await Like.findOne(
        {
            video: video._id,
            likedBy: req.user?._id
        }
    )

// if like is null -> video is not liked by user
    if(!isLiked){
        const like = await Like.create({
            video: video._id,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                like,
                "video is liked by user."
            )
        )
    }    

    const deleteLike = await Like.findByIdAndDelete(isLiked._id)

    return res.status(200).json(
        new ApiResponse(
            200,
            deleteLike,
            "video is unliked by user."
        )
    )
})


const toggleCommentLike = asyncHandler( async(req, res) => {

// getting commentId from frontend
    const {commentId} = req.params

// checking if commentId is valid and it exists in dB

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "invalid comment id")
    }



    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404,  "comment not found in dB")
    }

// finding if like exists in dB --> We will find by (user and video)
    const isLiked = await Like.findOne(
        {
            comment: commentId,
            likedBy: req.user?._id
        }
    )

// if like is null -> video is not liked by user
    if(!isLiked){
        const like = await Like.create({
            comment: commentId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                like,
                "comment is liked by user."
            )
        )
    }    

    const deleteLike = await Like.findByIdAndDelete(isLiked._id)

    return res.status(200).json(
        new ApiResponse(
            200,
            deleteLike,
            "comment is unliked by user."
        )
    )
})


const toggleTweetLike = asyncHandler( async(req, res) => {
    const {tweetId} = req.params
    
// validating tweetId
    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400, "invalid tweetId id")
    }

// fetching tweet from dB
    const tweet = await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,  "tweet not found in dB")
    }

// find id like already exists
    const isLiked = await Like.findOne(
        {
            tweet: tweetId,
            likedBy: req.user._id
        }
    )

// if like doesn't exists
    if(!isLiked){
        const like = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id
        })

        return res.status(200).json(
            new ApiResponse(
                200,
                like,
                "tweet liked."
            )
        )
    }

// if like exists -> delete like from dB
    const deletedLike = await Like.findOneAndDelete(
        {
            tweet: tweetId,
            likedBy: req.user._id
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            deletedLike,
            "tweet unliked."
        )
    )
    
})



const getLikedVideos = asyncHandler( async(req, res) => {

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    
    const aggregate = Like.aggregate([
        {
            $match:{
                likedBy: req.user?._id,
                video: {$exists: true}
            }
        },

        {
            $sort: {
                createdAt: -1
            }
        },

        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "video",

                pipeline: [
                    {
                        $project: {
                            title: 1,
                            thumbnail: "$thumbnail.url",
                            duration: 1,
                            views: 1,
                            description: 1
                        }
                    }
                ]
            }
        },

        {
            $addFields: {
                video: {
                    $first: "$video"
                }
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "likedBy",
                foreignField: "_id",
                as: "likedBy",

                pipeline: [
                    {
                        $project:{
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },

        {
            $addFields:{
                likedBy: {
                    $first: "$likedBy"
                }
            }
        }
    ])

    const selectedLikedVideos = await Like.aggregatePaginate(
        aggregate,
        {
            page,
            limit
        }
    )

    return res.status(200).json(
        new ApiResponse(
            200,
            selectedLikedVideos,
            "here are your liked videos"
        )
    )
})

export {toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos}