import { StreamClient } from "@stream-io/node-sdk";

export default async function CreateCall(callID, callType, host, users) {
  try {
    const apiKey = process.env.STREAM_APIKEY;
    const apiSecret = process.env.STREAM_SECRET;
    const client = new StreamClient(apiKey, apiSecret);

    const call = client.video.call(callType, callID);

    await call.create({ data: { created_by_id: host, participants: users, custom:{"backstage":true} } });

    return call;
  } catch (error) {
    console.log(error, "error");
  }
}

export async function generateCallToken(callID, userID) {
  try {
    const apiKey = process.env.STREAM_APIKEY;
    const apiSecret = process.env.STREAM_SECRET;
    const client = new StreamClient(apiKey, apiSecret);

    const validity_in_seconds = 60 * 60;

    const call_cids = [callID];
    const token =  client.createCallToken({
      user_id: userID,
      call_cids,
      validity_in_seconds,
      role: "admin",
    });

    return token;
  } catch (error) {
    console.log(error, "error");
  }
}
