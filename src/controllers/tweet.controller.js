import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Like } from "../models/like.model.js";

const createTweet = asyncHandler( async(req, res) => {
    const {content} = req.body

    if(!content || !content.trim()){
        throw new ApiError(400, "tweet is empty!")
    }

    const tweet = await Tweet.create({
        content: content.trim(),
        owner: req.user._id
    })

    return res.status(201).json(
        new ApiResponse(
            201,
            tweet,
            "tweet created."
        )
    )

})

const getAllUserTweets = asyncHandler( async(req, res) => {

// getting username, page and limit from user
    const {username} = req.params 
    
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 5

// getting user information from dB
    const user = await User.findOne({username})
    
    if(!user){
        throw new ApiError(404, "user not found!")
    }

// creating an aggregate
    const aggregate = Tweet.aggregate([
        {
            $match:{
                owner: user._id
            }
        },

        {
            $sort: {
                createdAt: -1
            }
        },

        {
            $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner",

                pipeline: [
                    {
                        $project: {
                            username: 1,
                            avatar: 1,
                            fullName: 1
                        }
                    }
                ]
            }
        },

        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        }
    ])

// fetching only limited tweets from dB
    const selectedTweets = await Tweet.aggregatePaginate(
        aggregate,
        {
            page,
            limit
        }
    )

// sending response to user
    return res.status(200).json(
        new ApiResponse(
            200,
            selectedTweets,
            "all tweets fetched."
        )
    )

})


const updateTweet = asyncHandler( async(req, res) => {

// getting commentId and newContent
    const {tweetId} = req.params
    const {newContent} = req.body 

// validation for tweetId & newContent
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }

    if (!newContent || !newContent.trim()) {
        throw new ApiError(400, "Tweet content cannot be empty.");
    }

    
// getting tweet details from dB
    const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

// Verifying the user
    if(req.user._id.toString() !== tweet.owner.toString()){
        throw new ApiError(403, "sorry you are not the owner of this tweet!")
    }


// Updating the tweet
    // const updatedTweet = await Tweet.findOneAndUpdate(
    const updatedTweet = await Tweet.findByIdAndUpdate(
        
        tweetId,
        // {
        //     _id: tweetId
        // },
        {
            $set: {
                content: newContent.trim()
            }
        },
        {
            new: true
        }
    )


// sending response to user
    return res.status(200).json(
        new ApiResponse(
            200,
            updatedTweet,
            "tweet updated!"
        )
    )

})

const deleteTweet = asyncHandler( async(req, res) => {

// getting tweetId from params
    const {tweetId} = req.params


// validation for tweetId 
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
        throw new ApiError(400, "Invalid tweet id");
    }


//Deleting the user from dB

    const deletedTweet = await Tweet.findOneAndDelete(
        {
            _id: tweetId,
            owner: req.user._id
        }
    )

    if(!deletedTweet){
        throw new ApiError(404, "tweet not found or user is not the owner")
    }

// deleting all the like on this Tweet
    await Like.deleteMany({
        tweet: tweetId
    })

// sending response to user
    return res.status(200).json(
        new ApiResponse(
            200,
            deletedTweet,
            "tweet deleted!"
        )
    )

})



export {createTweet, getAllUserTweets, updateTweet, deleteTweet}