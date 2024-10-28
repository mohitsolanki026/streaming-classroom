import { StreamClient } from "@stream-io/node-sdk";

export default async function CreateCall(callID, callType, host, users) {
  try {
    const apiKey = process.env.STREAM_APIKEY;
    const apiSecret = process.env.STREAM_SECRET;
    const client = new StreamClient(apiKey, apiSecret);

    const call = client.video.call(callType, callID);

    await call.create({
      data: {
        // participants: users,
        created_by: {
          id: host, // Add this line
          user_id: host,
          role: "host",
          name: "host",
        },
        settings_override: {
          audio: {
            access_request_enabled: false,
            mic_default_on: false,
            default_device: "earpiece",
          },
          video: {
            camera_default_on: false,
            target_resolution: {
              width: 240,
              height: 240,
            },
            camera_default_on: false,
          },
          screensharing: {
            enabled: false,
          },
          backstage: {
            enabled: true,
          }
        },
      },
    });

    return call;
  } catch (error) {
    console.log(error, "error");
  }
}

export async function generateCallToken(callID, userID, role) {
  try {
    const apiKey = process.env.STREAM_APIKEY;
    const apiSecret = process.env.STREAM_SECRET;
    const client = new StreamClient(apiKey, apiSecret);

    const validity_in_seconds = 60 * 60;

    const call_cids = [callID];
    const token = client.createCallToken({
      user_id: userID,
      call_cids,
      validity_in_seconds,
      role,
    });

    return token;
  } catch (error) {
    console.log(error, "error");
  }
}
