import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    clientId :{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    },
    generalLinks:{
        type: Array,
        default: []
    },
},{timestamps: true});

const Course = mongoose.model('Course', courseSchema);

export default Course;