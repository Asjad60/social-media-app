import { v2 as cloudinary } from "cloudinary";
import fsPromises from "fs/promises";

export const uploadFileToCloud = async (file, folder, height, width) => {
  const options = {
    folder,
    resource_type: "auto",
    transformation: [
      {
        quality: "auto:low",
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
    if (res.secure_url) {
      try {
        await fsPromises.unlink(file);
      } catch (unlinkError) {
        console.error(
          "Failed to delete the file from local storage:",
          unlinkError
        );
      }
    }
    return res;
  } catch (error) {
    try {
      await fsPromises.unlink(file);
    } catch (unlinkError) {
      console.error(
        "Failed to delete the file from local storage in error handler:",
        unlinkError
      );
    }
    console.log("Error File Uploading => ", error);
  }
};

export const removeFileFromCloud = async (publicUrl) => {
  const imgType = ["png", "jpg", "jpeg", "webp"];

  try {
    // Extract public ID from URL
    const publicId = publicUrl.split("/").slice(7).join("/").split(".")[0];
    const type = publicUrl.split(".").at(-1);

    // console.log("content type => ", type);
    // console.log("publicId => ", publicId);

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: imgType.includes(type) ? "image" : "video",
    });
    // console.log("Removed form cloud => ", result);
  } catch (error) {
    console.log("Error File Removing Uploading => ", error);
  }
};
