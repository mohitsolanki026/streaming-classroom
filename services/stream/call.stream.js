import Client from "./client.stream.js";

export default async function CreateCall(callID, callType, host, users) {
    const call = Client.video.call(callType, callID);
    try {
        call.create({
            data: {
                created_by_id: host,
                participants: users,
            }
        });
        return call;
    } catch (error) {
        console.log(error);
    }
}

