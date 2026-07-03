import {asyncHandler} from "../utils/asyncHandler.js"
import fs from 'fs'

// import {upload} from '../middlewares/multer.middleware.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

import {User} from "../models/user.model.js"
import {uploadOnCloudinary, deleteFromCloudinary} from '../utils/cloudinary.js'

import jwt from "jsonwebtoken"
import mongoose from "mongoose"



const generateAccessAndRefreshToken = async(userId) => {    //We are not making it {asyncHandler}, because the below following methods are going to use it internally
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validatBeforeSave: false})

        return {accessToken, refreshToken}

    }catch(error){
        throw new ApiError(500, "Something went wrong while generating Access and Refreshing token!!") 
    }

}


const registerUser = asyncHandler ( async(req, res) => {
    // {
    //     get user details from frontend
    //     validation - not empty
    //     check if user already exsts: username, email
    //     check for images and avatar
    //     upload them to cloudinary
    //     create user object - create entry in db
    //     remove password and refrech token field from response
    //     check for user creation
    //     return res   
    // }
        


// Getting user details from frontend!
    const {fullName, email, username, password} = req.body
    // console.log("email", email)


// Validation - not empty
    // if(fullName === ""){ // This s lengthy, we have to write this for all fields...
    //     throw new ApiError(400, "fullname is required!")
    // }

    if(
        [fullName, email, username, password].some(
            (field) => !field || field?.trim() === ""    //"If field exists, call trim(). Otherwise, return undefined instead of throwing an error". What if field is "" or "   ".
        )
    ){
        if(req.files?.avatar?.[0]?.path){ //Deleting the locally saved temporary avatar, as the operation gets failed
            fs.unlinkSync(req.files.avatar[0].path)
        }
        if(req.files?.coverImage?.[0]?.path){ //Deleting the locally saved temporary coverImage, as the operation gets failed
            fs.unlinkSync(req.files.coverImage[0].path)
        }
        throw new ApiError(400, "All field are required!")
    }


// Checking if user already exists
    const existedUser = await User.findOne({  // return the document matching first username/email
        $or: [{username}, {email}]
    })

    if(existedUser){
        throw new ApiError(409, "username or email already existssss!")
    }

    
// check for files and images...
    const avatarLocalPath = req.files?.avatar?.[0]?.path  //multer gives res.files. Request went through middleware(multer) 
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path  // cover Image is optional

    // console.log("Avatar: ", avatarLocalPath)
    // console.log("CoverImage: ", coverImageLocalPath)

    console.log("Req.files: ", req.files)

    if(!avatarLocalPath){
        throw new ApiError(400, "avatar is required!")
    }

    
// Upload them to cloudynary
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    let coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "avatar upload failed!")
    }


// create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: {
            url: avatar.url,
            public_id: avatar.public_id
        },
        coverImage: {
            url: coverImage.url || "",
            public_id: coverImage.public_id || ""
        },
        email,
        password,
        username: username.toLowerCase()
    })

// remove password and refrech token field from response
const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
)


// check for user creation
if(!createdUser){
    throw new ApiError(500, "User not created")
}
// console.log(createdUser)


// return res  
    return res.status(200).json(
        new ApiResponse(200, createdUser, "User Registered Successfully...")
    )
})

const loginUser = asyncHandler( async(req, res, next) => {
    // get email, password from frontend
    // check if both of them are present
    // find the user
    // check password
    // Generate access and refresh token
    // Send Cookie
    
    
    console.log("Req.body: ", req.body)

// get email, password from frontend
    const {email, username, password} = req.body 
    
// check if both of them are present
    if(!email && !username){
        throw new ApiError(400, "username or email is required!")
    }
    
// find the user
    // User.findOne(email? email: password) //is not the correct way because findOne() expects an object (query), not just a string.
    const user = await User.findOne({
        $or: [{username}, {email}]
    })
    if(!user){
        throw new ApiError(404, "User does not found")
    }

// check password
    const comparePassword  = await user.isPasswordCorrect(password)
    console.log(comparePassword)

    if(!comparePassword){
        throw new ApiError(401, "Password is Incorrent!!")
    }

// Generate access and refresh token    
    const {refreshToken, accessToken } = await generateAccessAndRefreshToken(user._id)
    // console.log(accessToken)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")


//Sending Cookies

    const options = {  //cookies can be modified by user too, but by doing this only server can modify.
        httpOnly: true,
        secure: true,
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser,
                accessToken,
                refreshToken
            },
            "User LoggedIn Successfully!!"
             
        )
    )

})

const logoutUser = asyncHandler( async(req, res, next) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            // $set: {
            //     refreshToken: undefined
            // }
            $unset: {
                refreshToken: 1 //this removes the field from document
            }
        },
        {
            new: true // return the new updated value. BTW useless here cause we are not storing values here.
        }
    )

    const options = {  //cookies can be modified by user too, but by doing this only server can modify.
        httpOnly: true,
        secure: true,
    }

    res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(
        new ApiResponse(200, {}, "User Logged Out Successfully!")
    )

})

const refreshAccessToken = asyncHandler( async(req, res, next) => {

// Getting refresh Token cookie req
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken  //Why both: Web browser → usually sends refresh token in cookies. Mobile apps/Postman → often send refresh token in the request body.

    if(!incomingRefreshToken){
        throw new ApiError(401, "Unauthorized Request!")
    }

// decoding refresh Token 
    let decodedToken
    try {
        decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    } catch (error) {
        //if it is expired it will return error(catch will run)
        throw new ApiError(401, "Invalid refresh token/or might be expired!")
    }

// Getting user data 
    const user = await User.findById(decodedToken?._id)

    if(!user){
        throw new ApiError(401, "User not found!")
    }

// Comparing User's refresh token with cookie(browser)'s refresh token.

    if(user.refreshToken !== incomingRefreshToken){
        throw new ApiError(401, "Refresh Token is Expired")
    }

// Refresh Token validation was successfull, now generate new access token
    const options = {
        httpOnly: true,
        secure: true
    }

    const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
    } = await generateAccessAndRefreshToken(user._id);

// adding new tokens to cookies and giving response
    res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                "accessToken": newAccessToken,
                "refreshToken": newRefreshToken
            },
            "Token Updated"
        )
    )

})

const changeCurrentPassword = asyncHandler( async(req, res, next) => {

// Getting old and new password from user/frontend
    const {oldPassword, newPassword} = req.body

// Getting userData, to compare database stored password with frontend's oldPassword
    const user = await User.findById(req.user?._id)
    if(!user){
        throw new ApiError("401", "User not found!")
    }

// Comparing the password
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400, "Password is incorrect!")
    }

// Making changes in the password

    user.password = newPassword; //just before save pre hook will run from user.model

    await user.save({validationBeforeSave: false})


    //no need for return below tbh!
    return res.status(200).json(
        new ApiResponse(200, "Password Changed Successfully!")
    )
})

const getCurrentUser = asyncHandler( async(req, res, next) => {

    // if(!req.user){ //No need for this because if no user then auth.middleware will never do next()
    //     throw new ApiError(400, "No Current User!")
    // }

// returning as it as, because middleware is already giving data...    
    res.status(200).json(
        new ApiResponse(
            200,
            {
                "user": req.user
            },
            "User found Successfully!" 
        )
    )
})

const updateAccountDetails = asyncHandler(async(req, res, next) => {
// Getting fullname and email from user/frontned
    const {fullName, email} = req.body

// Validating if atleast one of them is present
    if(!fullName && !email){
        throw new ApiError(400, "No input is present to be updated!")
    }

// Updating the user details
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                fullName: fullName,
                email: email
            }
        },
        {new: true} //return the updated information
    ).select("-password")

// returning the updated useData
    res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "user data is successfully updated!"
        )
    )
})


const updateUserAvatar = asyncHandler( async(req, res, next) => {

// TODO: DELETE OLD COVER IMAGE IN CLOUDINARY
    const userAvatarPublicId = req.user?.avatar?.public_id


// Getting avatar from frontend
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    // console.log(req.files.avatar[0])

    if(!avatarLocalPath){
        // fs.unlinkSync(req.file.avatarLocalPath[0].path)
        // fs.unlinkSync(req.files.avatar[0].path)
        throw new ApiError(400, "avatar not found in localStorage!")
    }

// Uploading it on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath)

    if(!avatar.url){
        throw new ApiError(400, "Cannot upload avatar on cloudinary!")
    }

// Updating avatar in database
    const userData = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar:{
                    url: avatar.url,
                    public_id: avatar.public_id
                }

            }
        },
        {new: true} // return the updated object/document
    ).select("-password -refreshToken")

// Deleting the old avatar from cloudinary
    if(userAvatarPublicId){
        await deleteFromCloudinary(userAvatarPublicId, "image")
    }

// Returning the response 
    return res.status(200).json(
        new ApiResponse(
            200,
            userData,
            "avatar successfully updated!"
        )
    )

})


const updateUserCoverImage = asyncHandler( async(req, res, next) => {

// TODO: DELETE OLD COVER IMAGE IN CLOUDINARY
    const userCoverImagePublicId = req.user?.coverImage?.public_id

// Getting avatar from frontend
    const coverImageLocalPath = req.file?.path

    if(!coverImageLocalPath){
        fs.unlinkSync(req.file.path)
        throw new ApiError(400, "coverImage not found in localStorage!")
    }

// Uploading it on cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!coverImage.url){
        throw new ApiError(400, "Cannot upload coverImage on cloudinary!")
    }

// Updating avatar in database
    const userData = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: {   
                    url: coverImage.url,
                    public_id: coverImage.public_id
                }
            }
        },
        {new: true} // return the updated object/document
    ).select("-password -refreshToken")

// Deleting the old avatar from cloudinary
    if(userCoverImagePublicId){
        await deleteFromCloudinary(userCoverImagePublicId, "image")
    }

// Returning the response 
    return res.status(200).json(
        new ApiResponse(
            200,
            userData,
            "cover image successfully updated!"
        )
    )

})

const getUserChannelProfile = asyncHandler(async(req, res, next) => {
    const {username} = req.params //This is the channel we only, this is not us(user). That's why we used params.
    
    if(username?.trim() === ""){
        throw new ApiError(400, "Username is missing!")
    }

    const channel = await User.aggregate([
        {
            $match:{
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed:{
                    $cond:{
                        if:{
                            $in: [req.user?._id, "$subscribers.subscriber"]
                        },
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project:{
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount:1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(401, "Channel not found!")
    }


    return res.status(200).json(
        new ApiResponse(
            200,
            channel[0],
            "User channel fetched Successfully!"
        )
    )
})

const getWatchHistory = asyncHandler(async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user._id )
            }
        },
        {
            $lookup: {
                from: "Video",
                localField: "watchHistory", //user's field
                foreignField: "_id",        //subscription's field
                as: "watchHistory", 

                pipeline:[
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1
                                    }
                                }
                            ]
                        },
                    },

                    {
                        $addFields: {
                            owner:{
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user[0].watchHistory,
            "Watch History Fetched Succesfully"
        )
    )
})


export {registerUser, loginUser, logoutUser, refreshAccessToken, 
        changeCurrentPassword, getCurrentUser, updateAccountDetails,
        updateUserAvatar, updateUserCoverImage, getUserChannelProfile,
        getWatchHistory
    }


 