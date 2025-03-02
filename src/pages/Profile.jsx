import React, { useEffect, useState } from "react";
import Btn from "../components/common/Btn";
import { useSelector } from "react-redux";
import PostsCard from "../components/common/postcard/PostsCard";
import {
  getUserPosts,
  getUserProfile,
} from "../services/operations/profileAPI";
import dummyProfile from "../assets/images/blankprofilepic.webp";
import { Link, useParams } from "react-router-dom";
import { Pen } from "lucide-react";

const tabs = ["Posts", "About", "Saved"];

const Profile = () => {
  const { token, user } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [posts, setPosts] = useState([]);
  const [profileUser, setProfileUser] = useState(null);
  const { id } = useParams();

  const fetchPosts = async () => {
    const result = await getUserPosts(token);
    setPosts(result.data);
  };

  useEffect(() => {
    if (id) {
      return;
    }
    fetchPosts();
  }, [id]);

  const fetchUserProfile = async () => {
    const result = await getUserProfile(token, id);
    setPosts(result.data.posts);
    setProfileUser(result.data);
  };

  useEffect(() => {
    if (id) {
      fetchUserProfile();
    }
  }, [id]);

  return (
    <div>
      {/* coverPic */}
      <div
        style={{
          backgroundImage:
            id && profileUser?.profile?.coverPic
              ? `url(${profileUser?.profile?.coverPic})`
              : user?.profile?.coverPic
              ? `url(${user?.profile?.coverPic})`
              : "linear-gradient(to right,#1F305E, #0a2351)",
        }}
        className="h-60 flex justify-center items-center bg-center bg-no-repeat bg-cover"
      >
        {!id && !user?.profile?.coverPic && (
          <p className="text-2xl font-bold">Add Cover Photo</p>
        )}
      </div>

      <div className="flex flex-col min-[480px]:flex-row justify-between items-center -mt-10 p-4">
        <div className="flex gap-2">
          {/* profilePic */}
          <div
            style={{
              backgroundImage: `url(${
                (id ? profileUser?.profilePic : user?.profilePic) ||
                dummyProfile
              })`,
            }}
            className={`bg-center bg-cover bg-no-repeat w-24 h-24 rounded-full border-4`}
          />

          <div className="flex flex-col gap-1 mt-5">
            <h2 className="text-xl font-semibold mt-2 capitalize">
              {id ? profileUser?.name : user?.name}
            </h2>
            <p className="text-gray-500">
              @{id ? profileUser?.username : user?.username}
            </p>
            <p className="text-sm text-gray-600">
              {id ? profileUser?.profile?.bio : user?.profile?.bio}
              {!id && !user?.profile?.bio && (
                <span className="text-gray-500">Add Bio</span>
              )}
            </p>
          </div>
        </div>
        {!id && (
          <Link to="/dashboard/edit-profile" className="btn flex gap-2">
            <Pen size={20} />
            Edit Profile
          </Link>
        )}
      </div>
      <div className="flex justify-around mt-20 text-center w-full">
        <div>
          <p className="font-semibold">
            {id ? profileUser?.posts.length : user?.posts?.length}
          </p>
          <p className="text-gray-500 text-sm">Posts</p>
        </div>
        <div>
          <p className="font-semibold">
            {id ? profileUser?.followers?.length : user?.followers?.length}
          </p>
          <p className="text-gray-500 text-sm">Followers</p>
        </div>
        <div>
          <p className="font-semibold">
            {id ? profileUser?.following?.length : user?.following?.length}
          </p>
          <p className="text-gray-500 text-sm">Following</p>
        </div>
      </div>
      <div className="relative mt-6 w-full border-b border-gray-500/45">
        <div className="flex justify-around relative">
          <div
            className={`absolute ${
              id ? "w-[calc(100%/2)]" : "w-[calc(100%/3)]"
            } bottom-0 left-0 h-1 bg-blue-500 transition-all duration-300`}
            style={{
              transform: `translateX(${tabs.indexOf(activeTab) * 100}%)`,
            }}
          />
          {tabs
            ?.filter((tab) => (id ? tab !== "Saved" : Boolean))
            .map((tab) => (
              <Btn
                bg={"none"}
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-2 w-full text-center ${
                  activeTab === tab
                    ? "font-semibold text-blue-500"
                    : "text-gray-500"
                }`}
              >
                {tab}
              </Btn>
            ))}
        </div>
      </div>
      {activeTab === "Posts" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
          {posts?.map((post) => (
            <PostsCard
              key={post._id}
              userOfPost={id ? profileUser : post.user}
              postDetail={post}
              token={token}
              currentUser={user}
              setPosts={setPosts}
              isInProfileView={true}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
