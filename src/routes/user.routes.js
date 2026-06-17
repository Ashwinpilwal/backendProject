import { Router } from "express";
import {registerUser, loginUser, logoutUser, refreshAccessToken, changeCurrentPassword, getCurrentUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage} from "../controllers/user.controller.js"

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
router.route("/current-user").post(verifyJWT, getCurrentUser)

router.route("/update-user").post(verifyJWT, updateAccountDetails)

router.route("/update-avatar").post(upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }
]),verifyJWT, updateUserAvatar)

router.route("/update-coverimage").post(upload.fields([
    {
        name: "coverImage",
        maxCount: 1
    }
]),verifyJWT, updateUserCoverImage)



export default router


