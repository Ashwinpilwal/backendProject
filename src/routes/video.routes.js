import { Router } from "express";
const router = Router()

import { upload } from "../middlewares/multer.middleware.js";

// Importing controller
import {uploadVideo} from "../controllers/video.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";


// router.route("/postvideo").post()
router.route("/postvideo").post(
    verifyJWT,
    upload.fields([
        {
            name: "video",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    uploadVideo
)



export default router
