import {Router} from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { createTweet, deleteTweet, getAllUserTweets, updateTweet } from "../controllers/tweet.controller.js"

const router = Router()

//declaring routes
router.route("/create-tweet").post(verifyJWT, createTweet)

router.route("/all-tweets/:username").get(verifyJWT, getAllUserTweets)

router.route("/update-tweet/:tweetId").patch(verifyJWT, updateTweet)

router.route("/delete-tweet/:tweetId").delete(verifyJWT, deleteTweet)


export default router 