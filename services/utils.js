import Class from "../models/class.model.js";

async function getUpcomingMeets(clientId) {
    try {
        const meets = await Class.aggregate([
            {
                $match: {
                    schedule: {$gt: new Date()}
                }
            },
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
        return meets;
    } catch (error) {
        throw error;
    }
}

async function getPreviousMeets(clientId) {
    try {
        const meets = await Class.aggregate([
            {
                $match: {
                    schedule: {$lt: new Date()}
                }
            },
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
        return meets;
    } catch (error) {
        throw error;
    }
}

export {getUpcomingMeets, getPreviousMeets};