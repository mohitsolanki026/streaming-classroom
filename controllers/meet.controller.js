import Client from "./../models/client.model.js";
import client from "./../models/client.model.js";
import { sign, verify } from "./../services/jwt.js";
import CreateCall, {
  generateCallToken,
} from "./../services/stream/call.stream.js";
import Users from "./../models/user.model.js";
import Class from "../models/class.model.js";
import { getPreviousMeets, getUpcomingMeets } from "./../services/utils.js";

class MeetController {
  async createMeet(req, res) {
    try {
      const user = req.user;
      if(user.role !== "teacher"){
       return res.status(400).json({message: "You are not authorized to create a meet"});
      }
      // callID,callType,host,users
      const callID = crypto.randomUUID();
      const callType = "default";
      const host = req.user._id;
      const users = await Users.find({ clientId: req.user._id })
        .select("_id")
        .lean()
        .exec();
      const call = await CreateCall(callID, callType, host, users);
      if (call) {
        const c = new Class({
          title: req.body.title,
          schedule: req.body.schedule,
          courseId: req.body.courseId,
          teacherId: req.user._id,
          meetingId: callID,
          duration: req.body.duration,
          students: users,
        });

        await c.save();
      }
      res.status(200).json({ callId: call.id });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }

  async getMeetByCourseId(req, res) {
    try {
      const courseId = req.params.courseId;
      const roll = req.roll;
      const page = req.query.page || 1;
      const limit = req.query.limit || 10;
      const type = req.query.type;
      
      const user = req.user;

      if(!user.courses.includes(courseId)){
        res.status(400).json({message: "You are not enrolled in this course"});
      }

      // i want in reverse order
      const meets = await Class.find({courses:{ $in: [courseId] }}).sort({schedule: -1}).skip((page - 1) * limit).limit(limit).exec(); 

      res.status(200).json({meets, message: "success", });

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async getMeets(req, res) {
    try {
      const user = req.user;
      if(user.role !== "teacher"){
        return  res.status(400).json({message: "You are not authorized to for this operation"});
      }
      const courseId = req.params.courseId;
      const roll = req.roll;
      const type = req.query.type;
      console.log(type);
      const clientId = req.user.clientId;

      switch (type) {
        case "upcoming":
          const upComingMeets = await getUpcomingMeets(clientId);
          res.status(200).json({ upComingMeets, message: "success", });
          break;
        case "past":
          const  pastMeets = await getPreviousMeets(clientId);
          res.status(200).json({ pastMeets, message: "success", });
          break;
        default:
          const meets = await Class.aggregate([
            {
                $lookup: {
                    from: "courses",
                    localField: "courseId",
                    foreignField: "_id",
                    as: "course"
                }
            },
            {
                $unwind: "$course"
            },
            {
                $match: {
                    "course.clientId": clientId
                }
            },
            {
                $project: {
                    "course.clientId": 0
                }
            }
        ]).exec();
            res.status(200).json({ meets, message: "success", });
            break;
      }

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // async getUpcomingMeets(req,res){
  //     try {
  //         const clientId = req.user.clientId;

  //         const roll = req.roll;
  //         //class has courseId and course have clientId so we can get all classes of a client
  //         const meets = await Class.aggregate([
  //             {
  //                 $match: {
  //                     schedule: {$gt: new Date()}
  //                 }
  //             },
  //             {
  //                 $lookup: {
  //                     from: "courses",
  //                     localField: "courseId",
  //                     foreignField: "_id",
  //                     as: "course"
  //                 }
  //             },
  //             {
  //                 $unwind: "$course"
  //             },
  //             {
  //                 $match: {
  //                     "course.clientId": clientId
  //                 }
  //             },
  //             {
  //                 $project: {
  //                     "course.clientId": 0
  //                 }
  //             }
  //         ]).exec();
  //         res.status(200).json({meets});
  //     } catch (error) {
  //         res.status(500).json({message: error.message});
  //     }
  // }

  async updateMeet(req, res) {
    try {
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async token(req, res) {
    try {
      const { callId } = req.body;
      const id = req.user._id;
      const role = req.role;
      const token = await generateCallToken(
        callId,
        id,
        role === "teacher" ? "admin" : "user"
      );
      res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
}

export default new MeetController();
