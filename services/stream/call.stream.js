import { StreamClient } from "@stream-io/node-sdk";

export default async function CreateCall(callID, callType, host, users) {
  try {
    const apiKey = process.env.STREAM_APIKEY;
    const apiSecret = process.env.STREAM_SECRET;
    const client = new StreamClient(apiKey, apiSecret);

    const call = client.video.call(callType, callID);

    await call.create({
      data: {
        created_by: {
          id: host, 
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
          },
          access_control: {
            single_session_per_user: true,
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

    const user = await checkUserInCall(callID, userID);
    if (user.members.length > 0) {
      console.log("User already in call",user);
      await removeUserFromCall(callID, userID);
    }

    const call_cids = [callID];
    const token = client.createCallToken({
      user_id: userID,
      call_cids,
      validity_in_seconds,
      role,
    });

    await addUserToCall(callID, userID, role);

    return token;
  } catch (error) {
    console.log(error, "error");
  }
}


async function checkUserInCall(callID, userID) {
  try {
    const apiKey = process.env.STREAM_APIKEY;
    const apiSecret = process.env.STREAM_SECRET;
    const client = new StreamClient(apiKey, apiSecret);

    const call = client.video.call("default", callID);

    const participants = await call.queryMembers({filter_conditions: {user_id: {$eq: userID}}});
    console.log(participants, "participants");

    return participants;
  }
  catch (error) {
    console.log(error, "error");
  }
}

async function removeUserFromCall(callID, userID) {
  try {
    const apiKey = process.env.STREAM_APIKEY;
    const apiSecret = process.env.STREAM_SECRET;
    const client = new StreamClient(apiKey, apiSecret);

    const call = client.video.call("default", callID);

    await call.updateCallMembers({
      remove_members: [userID],
    });

    console.log("User removed from call");

    return true;
  } catch (error) {
    console.log(error, "error");
  }
}

export async function addUserToCall(callID, userID, role) {
  try {
    const apiKey = process.env.STREAM_APIKEY;
    const apiSecret = process.env.STREAM_SECRET;
    const client = new StreamClient(apiKey, apiSecret);
    console.log(callID, userID, role, "addUserToCall");
    const call = client.video.call("default",callID);
    // console.log(call, "call");
    const user = await call.updateCallMembers({
      update_members: [
        {
          user_id: userID,
          role,
          name: "user",
        },
      ],
    });

    return user;
  } catch (error) {
    console.log(error, "error");
  }
}

export async function endCall(callID) {
  try {
    const apiKey = process.env.STREAM_APIKEY;
    const apiSecret = process.env.STREAM_SECRET;
    const client = new StreamClient(apiKey, apiSecret);

    const call = client.video.call(callID);

    await call.end();

    return true;
  } catch (error) {
    console.log(error, "error");
  }
}

