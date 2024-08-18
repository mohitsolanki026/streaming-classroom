import Client from "./../models/client.model.js";
import client from "./../models/client.model.js";
import {sign,verify} from "./../services/jwt.js"
import CreateCall from "./../services/stream/call.stream.js";
import Users from "./../models/user.model.js";
import Class from "../models/class.model.js";

class MeetController {

    async createMeet(req,res){
        try {
            // callID,callType,host,users
            const callID = crypto.randomUUID();
            const callType = "default";
            const host = req.user._id;
            const users = await Users.find({clientId: req.user._id}).select("_id").lean().exec();
            const call = await CreateCall(callID,callType,host,users);
            if(call){
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
            res.status(200).json({call});
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }

    async getMeets(req,res){
     try {
        const courseId = req.params.courseId;
        const roll = req.roll;
        
        const meets = await Class.find({courseId: courseId}).populate("teacherId").lean().exec();
        res.status(200).json({meets});
        
     } catch (error) {
        res.status(500).json({message: error.message});
     }
    }

    async updateMeet(req,res){
        try {
            
        } catch (error) {
            res.status(500).json({message: error.message});
        }
    }
    
}

export default new MeetController();