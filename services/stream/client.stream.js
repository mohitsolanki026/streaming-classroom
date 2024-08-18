import { StreamClient } from "@stream-io/node-sdk";



const Client = () => {
    const apiKey = process.env.STREAM_APIKEY;
const apiSecret = process.env.STREAM_SECRET;

console.log(apiKey, apiSecret);
    const client = new StreamClient(apiKey, apiSecret);
    return client;
}

export default Client;