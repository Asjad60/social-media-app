import { MessageCircle, Share2, Heart } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import Btn from "../Btn";
import { timeAgo } from "../../../utils/dateFormatter";
import { like, unlike } from "../../../services/operations/likeAPI";
import LikedByModal from "../modals/LikedByModal";
import CommentsModal from "../modals/CommentsModal";

const PostsCard = ({
  userOfPost,
  postDetail,
  setPosts,
  token,
  currentUser,
  isInProfile = true,
}) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);

  function checkUserLikedPost() {
    return postDetail?.likes?.some(
      (obj) => obj.userId?._id === currentUser?._id
    );
  }

  const updatePostDetails = (data) => {
    setPosts((prevPost) => {
      return prevPost?.map((post) =>
        post?._id === data?._id ? { ...data } : post
      );
    });
  };

  const handleLikeAndUnlike = async () => {
    if (!token) {
      return alert("You are not loggged in");
    }
    if (checkUserLikedPost()) {
      const res = await unlike(postDetail._id, token);
      updatePostDetails(res.data);
    } else {
      const res = await like(postDetail._id, token);
      updatePostDetails(res.data);
    }
  };

  const handleAddComment = async () => {};

  return (
    <>
      <div className="text-gray-300 w-full">
        {/* user profile and post time */}
        {isInProfile && (
          <Link to={`/user-profile/${userOfPost._id}`}>
            <div className="flex gap-4 items-center">
              <picture>
                <img
                  src={userOfPost.profilePic}
                  alt="profilePic"
                  className="max-w-16 h-16 object-cover rounded-full"
                />
              </picture>
              <div className="flex flex-col gap-1">
                <span className="capitalize">{userOfPost.name}</span>
                <span className="text-sm">{timeAgo(postDetail.createdAt)}</span>
              </div>
            </div>
          </Link>
        )}

        {/* post slides, content and tags */}
        <div className="mt-5">
          <ImageSlider data={postDetail?.media} />

          {postDetail?.content && (
            <div className="flex items-center gap-2 mt-2">
              {/* <span className="text-bold capitalize text-lg font-bold ">
                {userOfPost?.name}
              </span> */}
              <p className="text-gray-400">{postDetail?.content}</p>
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {postDetail?.tags?.map((tag, i) => (
              <span key={i} className="text-sm text-gray-500">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* like, comment, share */}
        <div className="flex gap-8">
          <Btn bg={"none"} notPadding={true} onClick={handleLikeAndUnlike}>
            <div className="flex gap-1 items-center">
              <Heart
                fill={checkUserLikedPost() ? "red" : "none"}
                stroke={checkUserLikedPost() ? "none" : "currentColor"}
              />
            </div>
            <span
              className="mt-1"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpenModal(true);
              }}
            >
              {postDetail?.likes?.length}
            </span>
          </Btn>
          <Btn
            bg={"none"}
            notPadding={true}
            onClick={() => setCommentModal(true)}
          >
            <div className="flex gap-1 items-center">
              <MessageCircle />
              <span className="mt-1">{postDetail?.comments?.length}</span>
            </div>
          </Btn>
          <Btn bg={"none"} notPadding={true}>
            <div className="flex gap-1 items-center">
              <Share2 />
              <span>Share</span>
            </div>
          </Btn>
        </div>

        {/* comment section */}
        {currentUser && isInProfile && (
          <div className="flex gap-4 mt-6">
            <img
              src={currentUser?.profilePic}
              alt="profilePic"
              className="w-10 object-cover aspect-square rounded-full "
            />
            <input
              type="text"
              placeholder="Write something......"
              name="comment"
              className="formData"
            />
          </div>
        )}
      </div>
      <LikedByModal
        isOpen={isOpenModal}
        onClose={() => setIsOpenModal(false)}
        likes={postDetail?.likes}
        currentUser={currentUser}
      />
      <CommentsModal
        isOpen={commentModal}
        onClose={() => setCommentModal(false)}
        comments={postDetail?.comments}
        onAddComment={handleAddComment}
      />
    </>
  );
};

export default PostsCard;
