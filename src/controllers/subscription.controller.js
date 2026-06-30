import { User } from "../models/user.model.js"
import { Subscription } from "../models/subcription.model.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import mongoose from "mongoose"

const subscribeChannelToggle = asyncHandler( async(req, res) => {

// Getting user Details from Middleware
    const user = req.user
    // const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError(404, "user not found, you can't subscribe!")
    }
  
    
// Getting Channel data from Params 
    const {username} = req.params
    
    const channel = await User.findOne({username})
    if(!channel){
        throw new ApiError(404, "Channel you are trying to subscribe not found!")
    }


// Prevventing user to subscribe to his own channel
    if(user._id.equals(channel._id)){
        throw new ApiError(400, "You cannot subscribe to your own channel!")
    }


// Checking if user already subscribed-->Unsubscribed
    const isAlreadySubscribed = await Subscription.findOne({
        subscriber: user._id,
        channel: channel._id
    })

    if(isAlreadySubscribed){
        const unSubscribe = await Subscription.findOneAndDelete({
            subscriber: user._id,
            channel: channel._id
        })

        if(!unSubscribe){
            throw new ApiError(401, "unable to unsubscribe!")
        }

        return res.status(200).json(
            new ApiResponse(200, "Successfully Unsubscribed!")
        )

    }

// Creating entry in Subscription Model
    const subscribed = await Subscription.create({
        subscriber: user._id,
        channel: channel._id
    }) 


// Returning the final response
    res.status(200).json(
        new ApiResponse(200, "Successfully Subscribed!")
    )
})


const getChannelSubscribers = asyncHandler( async(req, res) => {
    
    const {username} = req.params

    const channel = await User.findOne({username})
    if(!channel){
        throw new ApiError(404, "Channel not found!")
    }

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                channel: new mongoose.Types.ObjectId(channel._id)
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "subscriber",
                foreignField: "_id",
                as: "subscriber",

                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: "$avatar.url"
                        }
                    }
                ]

            }
        },
        {
            $addFields: {
                subscriber:{
                    $first: "$subscriber"
                }
            }
        },
        {
            $project: {
                _id: 0,
                subscriber: 1
            }
        }
    ])
    // console.log(subscribers[0]?.subscriber)


    if(subscribers.length === 0){
        return res.status(200).json(
            new ApiResponse(
                200,
                [],
                "No Subscribers."
            )
        )
    }



    res.status(200).json(
        new ApiResponse(
            200,
            subscribers,
            "subscriber fetch successfull!"
        )
    )
})

const getUserChannelSubscribers = asyncHandler( async(req, res) => {

    const user = req.user

    const subscribedChannels  = await Subscription.aggregate([
        {
            $match: {
                subscriber: new mongoose.Types.ObjectId(user._id)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "channel",
                foreignField: "_id",
                as: "channel",

                pipeline: [
                    {
                        $project:{
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: "$avatar.url"
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                channel:{
                    $first: "$channel"
                }
            }
        },
        {
            $project: {
                _id: 0,
                channel: 1
            }
        }
    ])

    if(subscribedChannels.length === 0){
        return res.status(200).json(
            new ApiResponse(
                200,
                [],
                "No Channels Subscribed."
            )
        )
    }




    res.status(200).json(
        new ApiResponse(
            200,
            subscribedChannels ,
            "channels fetch successfull!"
        )
    )
})

export {subscribeChannelToggle, getChannelSubscribers, getUserChannelSubscribers}