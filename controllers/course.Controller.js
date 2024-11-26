import Course from "../models/course.model.js";
import { createCourseValidation } from "../validations/course.validations.js";

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

    async createCourse(req, res) {
        try {
            const user = req.user;
            const course = req.body;
    
            const { error } = createCourseValidation.validate(course);
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
            course.clientId = user.clientId;
    
            // Handle file uploads
            course.generalLinks = [];
            for (let i = 0; i < req.files.length; i++) {
                // Convert files to base64 (or save to S3 and use the URL instead)
                course.generalLinks.push(req.files[i].buffer.toString('base64'));
            }
    
            // Save the course
            const newCourse = new Course(course);
            await newCourse.save();
    
            res.status(201).json(newCourse);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
}

export default new CourseController;
