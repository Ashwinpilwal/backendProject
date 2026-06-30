import {Router} from "express"
import { addComment, deleteComment, editComment, showAllComments } from "../controllers/comment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()


// Assigning routrs
router.route("/add-comment/:videoId").post(verifyJWT, addComment)

router.route("/delete-comment/:commentId").delete(verifyJWT, deleteComment)

router.route("/show-all-comments/:videoId").get(verifyJWT, showAllComments)

router.route("/edit-comment/:commentId").post(verifyJWT, editComment)


export default router
