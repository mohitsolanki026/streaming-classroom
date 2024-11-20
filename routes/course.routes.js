import express from "express"
import auth from "../middlewares/user.middleware.js"
import controller from "../controllers/course.Controller.js"
const router = express.Router()

router.get("/all", auth, controller.getCourses)
router.get("/my", auth, controller.getMyCourses)
router.get("/:id", auth, controller.getCourse)
router.post("/", auth, controller.createCourse)

export default router;