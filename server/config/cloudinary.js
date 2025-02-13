import { v2 as cloudinary } from "cloudinary";

export const ConnectCloudinary = () => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDI_NAME,
      api_key: process.env.CLOUDI_API_KEY,
      api_secret: process.env.CLOUDI_API_SECRET,
    });
  } catch (error) {
    console.log("Error connecting to the cloudinary");
    console.log(error);
  }
};
