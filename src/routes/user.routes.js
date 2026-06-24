import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage, getUserChannelProfile, getWatchHistory} from "../controllers/user.controller.js"

import {verifyJWT} from '../middlewares/auth.middleware.js'

import { upload } from "../middlewares/multer.middleware.js";

const router = Router()



// router.route("/route").get(middleware, controller)

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

// Secured Routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)

router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)

router.route("/update-account-details").patch(verifyJWT, updateAccountDetails)

router.route("/update-avatar").patch(
    verifyJWT, 
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]), 
    updateUserAvatar)

// router.route("/update-coverimage").patch(
//     verifyJWT,
//     upload.fields([
//         {
//             name: "coverImage",
//             maxCount: 1
//         }
//     ]),
//     updateUserCoverImage) 
 
router.route("/update-coverimage").patch(
    verifyJWT,
    upload.single("coverImage"),
    updateUserCoverImage)  

// All above routes are tested

router.route("/channel/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)


export default router


