import { Router } from "express";

const router = Router()

// importing controllers 
import {subscribeChannelToggle, getChannelSubscribers, getUserChannelSubscribers} from "../controllers/subscription.controller.js"

// importing middleware 
import {verifyJWT} from "../middlewares/auth.middleware.js"



//writing routes

router.route('/subscribe-channel/:username').post(verifyJWT, subscribeChannelToggle)

router.route('/channel-subscribers/:username').get(verifyJWT, getChannelSubscribers)
router.route('/subscribing-channels').get(verifyJWT, getUserChannelSubscribers)

export default router