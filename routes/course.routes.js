import express from "express"
import auth from "../middlewares/user.middleware.js"
import controller from "../controllers/course.Controller.js"
import multer from "multer"
const router = express.Router()
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/all", auth, controller.getCourses)
router.get("/my", auth, controller.getMyCourses)
router.get("/:id", auth, controller.getCourse)
router.post("/",upload.array('thumbnail'), auth, controller.createCourse)

export default router;