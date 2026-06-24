import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import fs from "fs"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Video } from "../models/video.model.js";

const uploadVideo = asyncHandler( async(req, res) => {

// Checking if user exists, btw there is no need because middleware is already doing that.
    if(!req.user){
        throw new ApiError(400, "login required to upload video!")
    }

// Getting data from form- 
    const {title, description} = req.body

// Validating data-(All fields are required)-
    if(
        [title, description].some(
            (field) => !field || field.trim() === "" 
        )
    ){
        if(req.files?.video?.[0]?.path){
            fs.unlinkSync(req.files?.video?.[0]?.path)
        }
        if(req.files?.thumbnail?.[0]?.path){
            fs.unlinkSync(req.files?.thumbnail?.[0]?.path)
        }

        throw new ApiError(400, "All fiels are required")
    } 

// Uploading them on cloudinary
    const videoFile = req.files?.video?.[0]?.path
    const thumbnailFile = req.files?.thumbnail?.[0]?.path 

    if(!videoFile || !thumbnailFile){
        throw new ApiError(400, "video and thumbnail both are required!")
    }

    const uploadedVideo = await uploadOnCloudinary(videoFile)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailFile)

    if(!uploadedVideo || !uploadedThumbnail){
        throw new ApiError(400, "failed to upload image in cloudinary!")
    }
    console.log("uploaded Video: ", uploadedVideo)
    console.log("uploaded Thumbnail: ", uploadedThumbnail)


// Uploading image on MongoDB( creating video model object)

    const video = await Video.create({
        videoFile: uploadedVideo?.url,
        thumbnail: uploadedThumbnail?.url,
        title,
        description,
        duration: uploadedVideo?.duration || 0,
        owner: req.user._id
    })


    // console.log(video)


// Sending the response-
    // res.send("This is your fucking video route!")

    res.status(200).json(
        new ApiResponse(200, video, "Video successfully Uploaded!")
    )

})

export {uploadVideo}
