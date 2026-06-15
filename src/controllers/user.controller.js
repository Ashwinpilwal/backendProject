import {asyncHandler} from "../utils/asyncHandler.js"

// import {upload} from '../middlewares/multer.middleware.js'
import {ApiError} from '../utils/ApiError.js'
import {ApiResponse} from '../utils/ApiResponse.js'

import {User} from "../models/user.model.js"

import {uploadOnCloudinary} from '../utils/cloudinary.js'

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
    console.log("email", email)


// Validation - not empty
    // if(fullName === ""){ // This s lengthy, we have to write this for all fields...
    //     throw new ApiError(400, "fullname is required!")
    // }

    if(
        [fullName, email, username, password].some(
            (field) => field?.trim() === ""    //"If field exists, call trim(). Otherwise, return undefined instead of throwing an error". What if field is "" or "   ".
        )
    ){
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

    console.log(avatarLocalPath)

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
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    console.log(createdUser)

    if(!createdUser){
        throw new ApiError(500, "User not created")
    }

    return res.status(200).json(
        new ApiResponse(200, "User Registered Successfully...")
    )
})


export {registerUser}

