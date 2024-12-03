import cloudinary from "../config/cloudinary.js";
import Course from "../models/course.model.js";
import { createCourseValidation } from "../validations/course.validations.js";
import { Readable } from "stream";

const streamUpload = (buffer, folder) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder },
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
        );

        const readableStream = new Readable();
        readableStream.push(buffer);
        readableStream.push(null);
        readableStream.pipe(uploadStream);
    });
};

class CourseController {
  async getCourse(req, res) {
    try {
      var course = await Course.findById(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      const isPurchased = req.user.courses.includes(course._id);

      course = course.toObject();
      course.isPurchased = isPurchased;

      res.status(200).json(course);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getCourses(req, res) {
    try {
      const user = req.user;
      // same client id
      const courses = await Course.find({ clientId: user.clientId });
      res.status(200).json(courses);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMyCourses(req, res) {
    try {
      const user = req.user;
      console.log("user");
      const courses = await Course.find({ _id: { $in: user.courses } });
      res.status(200).json({ courses });
    } catch (error) {
      console.log(error, "ERR");
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
      course.generalLinks = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const result = await streamUpload(file.buffer, "courses/thumbnails");
            course.generalLinks.push(result.secure_url);
        }
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

export default new CourseController();
