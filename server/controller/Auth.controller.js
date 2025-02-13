import { User } from "../models/UserModel.js";
import { uploadFileToCloud } from "../utils/UploadFileToCloud.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userRegister = async (req, res) => {
  try {
    const { name, password, username } = req.body;
    const profilePic = req?.file;

    if (!name || !password || !username) {
      return res.status(500).json({
        success: false,
        message: "please enter all details",
      });
    }

    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exist",
      });
    }

    let uploadProfile;
    if (profilePic) {
      uploadProfile = await uploadFileToCloud(
        profilePic,
        process.env.CLOUDI_FOLDER
      );
    }

    const newUser = await User.create({
      name,
      password,
      username,
      profilePic: uploadProfile?.secure_url,
    });

    return res.status(200).json({
      success: true,
      message: "User registered",
      user: newUser,
    });
  } catch (error) {
    console.log("User register Problem ", error);
    return res.status(500).json({
      success: false,
      message: "User not registered please enter valid detail",
    });
  }
};

export const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill the details",
      });
    }

    const user = await User.findOne({ username }).populate(
      "followers following profile posts"
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Please register first",
      });
    }

    let payload = { id: user._id, username };

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "24h",
      });
      user.token = token;
      user.password = undefined;

      let options = {
        // expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        // sameSite: "none",
        httpOnly: true,
        path: "/",
        // secure: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "Login successfull",
        data: user,
        token,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Incorrect username or password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "something went wrong while logging",
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    const userId = req.user.id;
    await User.findByIdAndUpdate(
      userId,
      { $unset: { token: 1 } },
      { new: true }
    );
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "Logout successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "something went wrong while logging out",
    });
  }
};
