import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: "dh7p7ihil",
    // api_key: process.env.CLOUDINARY_API_KEY,
    api_key: 639378651438457,
    // api_secret: process.env.CLOUDINARY_API_SECRET,
    api_secret:'leD4fqfUP-Qk1UMA-ju8yLcItG4'
});

export default cloudinary;
