import { v2 as cloudinary } from "cloudinary";

export const uploadFileToCloud = async (file, folder, height, width) => {
  const options = {
    folder,
    resource_type: "auto",
    transformation: [
      {
        quality: "auto",
        fetch_format: "auto",
      },
    ],
  };

  if (height || width) {
    options.transformation.push({
      height: height || null,
      width: width || null,
      crop: "limit",
    });
  }

  try {
    const res = await cloudinary.uploader.upload(file, options);
    return res;
  } catch (error) {
    console.log("Error File Uploading => ", error);
  }
};
