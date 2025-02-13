import { v2 as cloudinary } from "cloudinary";

export const uploadFileToCloud = async (buffer, folder, height, width) => {
  const options = {
    folder,
    resource_type: "auto",
    transformation: [],
  };

  if (height || width) {
    options.transformation.push({
      height: height || null,
      width: width || null,
      crop: "limit",
    });
  }

  options.transformation.push({
    quality: "auto",
    fetch_format: "auto",
  });

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) {
          console.error("Error uploading to Cloudinary:", error);
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    uploadStream.end(buffer); // Send buffer directly to Cloudinary
  });
};
