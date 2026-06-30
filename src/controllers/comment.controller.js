import mongoose from "mongoose";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";

const addComment = asyncHandler( async(req, res) => {
// Taking input from user
    const {videoId} = req.params
    const {content} = req.body 

// Validing inputs sent by user
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "video id is invalid")
    }
     
    if(!content?.trim()){
        throw new ApiError(400, "comment is empty!")
    } 
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "Video not found")
    } 

// Adding comment to DB
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    if(!comment){
        throw new ApiError(400, "cannot store comment to DB!")
    }

// Sending response to frontend
    res.status(201).json(
        new ApiResponse(
            201,
            comment,
            "comment added to video/DB"
        )
    )

})


const deleteComment = asyncHandler( async(req, res) => {
// Taking input from user
    const {commentId} = req.params 

// Validing inputs sent by user
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "comment id is invalid")
    }
    
    // const comment = await Comment.findById(commentId)
    // if(!comment){
    //     throw new ApiError(404, "comment not found")
    // } 

// Validating if comment is done by loggedin user or not
    // if(req.user?._id.toString() !== comment.owner.toString()){
    //     throw new ApiError(403, "you are not the owner of this comment")
    // }

// Deleting comment to DB
    const deletedComment = await Comment.findOneAndDelete({
        _id: commentId,
        owner: req.user._id
    })

    if(!deletedComment){
        throw new ApiError(400, "unauthorized, comment cannot be deleted to DB!")
    }

// Deleting all the likes on the comment
    await Like.deleteMany({
        comment: commentId
    })

// Sending response to frontend
    res.status(201).json(
        new ApiResponse(
            201,
            deletedComment,
            "comment deleted from video/DB"
        )
    )

})


const showAllComments = asyncHandler( async(req, res) => {

// Taking input from user
    const {videoId} = req.params 

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10

    
// Validing inputs sent by user
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "video id is invalid")
    }
    
    const video = await Video.findById(videoId)
    if(!video){
        throw new ApiError(404, "video not found")
    } 


// Getting all the comments from the video
    // const comments = await Comment.find(
    //     {
    //         video: videoId
    //     }
    // )

    const aggregate = Comment.aggregate([
        {
            $match:{
                video: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",

                pipeline:[
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
                owner:{
                    $first: "$owner"
                }
            }
        }

    ])

    const selectedComments = await Comment.aggregatePaginate( //applying aggregation
        aggregate,
        {
            page,
            limit
        }
    )


    if(selectedComments.length === 0){
        res.status(201).json(
            new ApiResponse(
                201,
                selectedComments,
                "no commments found in DB"
            )
        )
    }

// Sending response to frontend
    res.status(201).json(
        new ApiResponse(
            201,
            selectedComments,
            "comment fetched from video"
        )
    )

})


const editComment = asyncHandler( async(req, res) => {
// Taking input from user
    const {content} = req.body 
    const {commentId} = req.params 

// Validing inputs sent by user
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400, "comment id is invalid")
    }

    
    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(404, "comment not found")
    } 

    if(!content?.trim()){
        throw new ApiError(400, "comment is empty!")
    } 

// Validating if comment is done by loggedin user or not
    // if(req.user?._id.toString() !== comment.owner.toString()){
    //     throw new ApiError(403, "you are not the owner of this comment")
    // }

// Adding comment to DB
    const editedComment = await Comment.findOneAndUpdate(
        {
            _id: commentId,
            owner: req.user._id
        },
        {
            $set:{
                content
            }
        },
        {
            new: true
        }
    )

    if(!editedComment){
        throw new ApiError(400, "Failed to update comment!")
    }

// Sending response to frontend
    res.status(200).json(
        new ApiResponse(
            200,
            editedComment,
            "Comment updated successfully."
        )
    )

})

export {addComment, deleteComment, showAllComments, editComment}