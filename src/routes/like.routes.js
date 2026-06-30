import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { getLikedVideos, toggleCommentLike, toggleTweetLike, toggleVideoLike } from "../controllers/like.controller.js"

const router = Router()


// declaring router

router.route("/toggle-video-like/:videoId").post(verifyJWT, toggleVideoLike)

router.route("/toggle-comment-like/:commentId").post(verifyJWT, toggleCommentLike)


router.route("/get-likes-videos").get(verifyJWT, getLikedVideos)

router.route("/toggle-tweet-like/:tweetId").patch(verifyJWT, toggleTweetLike)


export default router
