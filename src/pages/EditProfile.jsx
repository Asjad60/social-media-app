import { Calendar, Camera, ImageIcon, Mail, Save, User } from "lucide-react";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Btn from "../components/common/Btn";
import dummyProfile from "../assets/images/blankProfilePic.webp";
import toast from "react-hot-toast";
import { updateProfileDetails } from "../services/operations/profileAPI";

const EditProfile = () => {
  const { user, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formDatas, setFormDatas] = useState({
    name: user.name || "",
    age: user?.profile?.age || "",
    gender: user?.profile?.gender || "",
    bio: user?.profile?.bio || "",
    email: user?.email || "",
    coverPic: user?.profile?.coverPic || "",
    profilePic: user?.profilePic || "",
  });

  const [previewPic, setPreviewPic] = useState({
    coverPic: null,
    profilePic: null,
  });

  async function handleSubmit(e) {
    e.preventDefault();

    const { name, email, age, bio, gender, coverPic, profilePic } = formDatas;

    if (check()) {
      const formData = new FormData();

      if (name !== user?.name) formData.append("name", name);
      if (age !== user?.profile?.age) formData.append("age", Number(age));
      if (gender !== user?.profile?.gender) formData.append("gender", gender);
      if (bio !== user?.profile?.bio) formData.append("bio", bio);
      if (email !== user?.email) formData.append("email", email);
      if (coverPic instanceof File) formData.append("coverPic", coverPic);
      if (profilePic instanceof File) formData.append("profilePic", profilePic);

      //api call
      await updateProfileDetails(formData, token, dispatch);
    } else {
      toast.error("No changes made");
    }
  }

  function check() {
    // Helper to safely compare values
    const isDifferent = (newValue, oldValue) => {
      if (newValue === "" || newValue == null) newValue = null;
      if (oldValue === "" || oldValue == null) oldValue = null;
      return newValue !== oldValue;
    };

    return (
      isDifferent(formDatas.name, user?.name) ||
      isDifferent(formDatas.email, user?.email) ||
      isDifferent(Number(formDatas.age), user?.profile?.age) ||
      isDifferent(formDatas.bio, user?.profile?.bio) ||
      isDifferent(formDatas.gender, user?.profile?.gender) ||
      formDatas.coverPic instanceof File ||
      formDatas.profilePic instanceof File
    );
  }

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormDatas((prev) => ({
      ...prev,
      [name]: files?.length ? files[0] : value,
    }));

    if (files?.length) {
      let url = URL.createObjectURL(files[0]);

      setPreviewPic((prev) => ({
        ...prev,
        [name]: url,
      }));
      console.log(files[0]);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto"
    >
      {/* Cover Photo Section */}
      <div className="relative h-64">
        <img
          src={previewPic.coverPic || user?.profile?.coverPic || dummyProfile}
          alt="Cover"
          className="w-full h-full object-cover aspect-video"
        />

        <label htmlFor="coverPic" className="btn absolute right-4 bottom-4">
          <ImageIcon size={18} />
          Change Cover
        </label>

        <input
          type="file"
          name="coverPic"
          id="coverPic"
          className="hidden"
          onChange={handleInputChange}
        />
      </div>

      <div className="p-8">
        <h1 className="text-3xl font-bold text-gray-50 mb-8">Edit Profile</h1>

        <div>
          {/* Avatar Section */}
          <div className="mb-8 flex items-center">
            <div className="relative">
              <img
                src={previewPic.profilePic || user?.profilePic || dummyProfile}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              />

              <label
                htmlFor="profilePic"
                className="btn absolute right-0 bottom-0"
              >
                <Camera size={16} />
              </label>

              <input
                type="file"
                name="profilePic"
                id="profilePic"
                className="hidden"
                onChange={handleInputChange}
              />
            </div>
            <div className="ml-6">
              <h2 className="text-lg font-medium text-gray-50">
                Profile Photo
              </h2>
              <p className="text-sm text-gray-200">
                Update your profile picture
              </p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-100 mb-2">
                <User size={16} className="mr-2" />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user?.name}
                className="formData"
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-100 mb-2">
                <Mail size={16} className="mr-2" />
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={user?.email}
                className="formData"
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-100 mb-2">
                <Calendar size={16} className="mr-2" />
                Bio
              </label>
              <textarea
                name="bio"
                defaultValue={user?.profile?.bio}
                rows={4}
                className="formData"
                placeholder="Add some bio"
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-100 mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                defaultValue={user?.profile?.age}
                className="formData"
                onChange={handleInputChange}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-100 mb-2">
                Gender
              </label>
              <select
                name="gender"
                className="formData"
                defaultValue={user?.profile?.gender}
                onChange={handleInputChange}
              >
                <option>Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <Btn type="submit" customClass="w-full">
              <Save size={18} className="mr-1" />
              Save Changes
            </Btn>
          </div>
        </div>
      </div>
    </form>
  );
};

export default EditProfile;
