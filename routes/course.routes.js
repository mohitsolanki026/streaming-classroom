import express from "express"
import teacherAuth from "../middlewares/teacher.middleware.js"
import controller from "../controllers/course.Controller.js"
const router = express.Router()

router.get("/all", teacherAuth, controller.getCourses)
router.get("/:id", teacherAuth, controller.getCourse)

export default router;