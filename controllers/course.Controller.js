import Course from "../models/course.model.js";

class CourseController {
    async getCourse(req, res) {
        try {
            const course = await Course.findById(req.params.id);
            res.status(200).json(course);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getCourses(req, res) {
        try {
            const user = req.user;
            // same client id
            const courses = await Course.find({clientId: user.clientId});
            res.status(200).json(courses);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getMyCourses(req, res) {
        try {
            const user = req.user;
            console.log("user");
            const courses = await Course.find({_id: {$in: user.courses}});
            res.status(200).json({courses});
        } catch (error) {
            console.log(error,"ERR");
            res.status(500).json({ message: error.message });
        }
    }
}

export default new CourseController;
