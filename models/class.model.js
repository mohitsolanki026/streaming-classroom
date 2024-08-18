import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
    title:{
        type: String,
        require: true,
    },
    schedule:{
        type: Date,
        require: true,
    },
    status: {
        type: String,
        enum: ["upcomming","canceled","ongoing","completed"],
        default: "upcomming"
    },
    courseId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    content:{
        type: String,
    },
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    meetingId:{
        type: String,
        require: true,
    },
    duration:{
        type: Number,
        require: true,
    },
    students:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
}) 

const Class = mongoose.model("Class", classSchema);

export default Class;